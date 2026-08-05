import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { collection, onSnapshot, doc, updateDoc, addDoc, query, where } from 'firebase/firestore';
import { db, auth } from './firebase';
import type { Farmer, Ticket, AuditEntry, VerificationStatus, AdminRole, AdminUser } from './types';

function normalizeDocumentList(raw: any) {
  const documents = raw.documents ?? raw.farmDocuments ?? raw.verificationDocuments ?? raw.submittedDocuments ?? raw.farmDocument ?? [];
  return Array.isArray(documents) ? documents : documents ? [documents] : [];
}

interface DataContextValue {
  farmers: Farmer[];
  tickets: Ticket[];
  auditLog: AuditEntry[];
  currentAdminName: string;
  currentAdminRole: AdminRole;
  setFarmerStatus: (id: string, status: VerificationStatus, note?: string) => void;
  addFarmerNote: (id: string, text: string) => void;
  toggleBadge: (farmerId: string, badgeId: string) => void;
  replyToTicket: (ticketId: string, text: string) => void;
  addInternalNote: (ticketId: string, text: string) => void;
  setTicketStatus: (ticketId: string, status: Ticket['status']) => void;
  setTicketPriority: (ticketId: string, priority: Ticket['priority']) => void;
  assignTicket: (ticketId: string, assignee: string | null) => void;
  logAction: (action: string, target: string, detail: string, severity?: AuditEntry['severity']) => void;
}

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [auditLog, setAuditLog] = useState<AuditEntry[]>([]);
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(null);

  useEffect(() => {
    if (!auth.currentUser) return;
    
    // Fetch the admin profile for the logged in user
    const unsubAdmin = onSnapshot(doc(db, 'admins', auth.currentUser.uid), (snap) => {
      if (snap.exists()) {
        setCurrentAdmin({ id: snap.id, ...snap.data() } as AdminUser);
      } else {
        // Fallback or error if admin not found
        console.error("No admin record found for this user in the admins collection");
        setCurrentAdmin({
          id: auth.currentUser!.uid,
          name: auth.currentUser!.email || 'Unknown Admin',
          email: auth.currentUser!.email || '',
          role: 'Support Agent',
          avatarColor: 'bg-ink-700',
          initials: 'AD'
        });
      }
    });

    const qFarmers = query(collection(db, 'users'), where('role', '==', 'farmer'));
    const unsubFarmers = onSnapshot(qFarmers, (snap) => {
      const data = snap.docs.map(d => {
        const raw = d.data();
        return {
          id: d.id,
          ...raw,
          name: raw.name || 'Unknown Farmer',
          location: raw.location || 'Unknown',
          phone: raw.phone || '',
          email: raw.email || '',
          crops: raw.crops || [],
          badges: raw.badges || [],
          documents: normalizeDocumentList(raw),
          photos: raw.photos || [],
          notes: raw.notes || [],
          status: raw.status || 'pending',
          farmType: raw.farmType || 'Unknown',
        } as Farmer;
      });
      setFarmers(data);
    });

    const unsubTickets = onSnapshot(collection(db, 'tickets'), (snap) => {
      const data = snap.docs.map(d => {
        const raw = d.data();
        return {
          id: d.id,
          ...raw,
          subject: raw.subject || 'No Subject',
          userId: raw.userId || 'Unknown',
          userEmail: raw.userEmail || '',
          messages: raw.messages || [],
          internalNotes: raw.internalNotes || [],
          priority: raw.priority || 'low',
          status: raw.status || 'open'
        } as Ticket;
      });
      setTickets(data);
    });

    const unsubAudit = onSnapshot(collection(db, 'auditLog'), (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as AuditEntry));
      setAuditLog(data.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()));
    });

    return () => {
      unsubAdmin();
      unsubFarmers();
      unsubTickets();
      unsubAudit();
    };
  }, []);

  const logAction = useCallback(async (action: string, target: string, detail: string, severity: AuditEntry['severity'] = 'info') => {
    if (!currentAdmin) return;
    try {
      await addDoc(collection(db, 'auditLog'), {
        admin: currentAdmin.name,
        adminRole: currentAdmin.role,
        action,
        target,
        detail,
        createdAt: new Date().toISOString(),
        severity,
      });
    } catch (error) {
      console.error("Error adding audit log: ", error);
    }
  }, [currentAdmin]);

  const setFarmerStatus = useCallback(async (id: string, status: VerificationStatus, note?: string) => {
    if (!currentAdmin) return;
    try {
      const farmerRef = doc(db, 'users', id);
      const farmer = farmers.find(f => f.id === id);
      
      const updateData: any = { 
        status, 
        activeSeller: status === 'approved' ? true : (farmer?.activeSeller || false) 
      };

      if (note && farmer) {
        const newNote = { id: `n${Date.now()}`, author: currentAdmin.name, authorRole: currentAdmin.role, text: note, createdAt: new Date().toISOString() };
        updateData.notes = [...(farmer.notes || []), newNote];
      }

      await updateDoc(farmerRef, updateData);

      if (farmer) {
        const action = status === 'approved' ? 'Approved farmer' : status === 'rejected' ? 'Rejected farmer' : status === 'suspended' ? 'Suspended farmer' : 'Updated farmer status';
        logAction(action, farmer.name || 'Unknown', note || `Status set to ${status}`, status === 'suspended' ? 'critical' : status === 'rejected' ? 'warning' : 'info');
      }
    } catch (error) {
      console.error("Error setting farmer status: ", error);
    }
  }, [farmers, currentAdmin, logAction]);

  const addFarmerNote = useCallback(async (id: string, text: string) => {
    if (!currentAdmin) return;
    try {
      const farmer = farmers.find((f) => f.id === id);
      if (!farmer) return;
      const farmerRef = doc(db, 'users', id);
      const newNote = { id: `n${Date.now()}`, author: currentAdmin.name, authorRole: currentAdmin.role, text, createdAt: new Date().toISOString() };
      await updateDoc(farmerRef, { notes: [...(farmer.notes || []), newNote] });
      logAction('Added verification note', farmer.name || 'Unknown', text, 'info');
    } catch (error) {
      console.error("Error adding farmer note: ", error);
    }
  }, [farmers, currentAdmin, logAction]);

  const toggleBadge = useCallback(async (farmerId: string, badgeId: string) => {
    if (!currentAdmin) return;
    try {
      const farmer = farmers.find((f) => f.id === farmerId);
      if (!farmer) return;
      const farmerRef = doc(db, 'users', farmerId);
      const has = (farmer.badges || []).includes(badgeId);
      const newBadges = has ? farmer.badges.filter((b) => b !== badgeId) : [...(farmer.badges || []), badgeId];
      await updateDoc(farmerRef, { badges: newBadges });
      logAction(has ? 'Removed badge' : 'Assigned badge', farmer.name || 'Unknown', badgeId, 'info');
    } catch (error) {
      console.error("Error toggling badge: ", error);
    }
  }, [farmers, currentAdmin, logAction]);

  const replyToTicket = useCallback(async (ticketId: string, text: string) => {
    if (!currentAdmin) return;
    try {
      const ticket = tickets.find((t) => t.id === ticketId);
      if (!ticket) return;
      const ticketRef = doc(db, 'tickets', ticketId);
      const newMessage = { id: `m${Date.now()}`, sender: 'admin', text, createdAt: new Date().toISOString() };
      await updateDoc(ticketRef, {
        status: ticket.status === 'open' ? 'pending' : ticket.status,
        updatedAt: new Date().toISOString(),
        messages: [...(ticket.messages || []), newMessage]
      });
      logAction('Replied to ticket', ticket.ref || ticketId, text.slice(0, 80), 'info');
    } catch (error) {
      console.error("Error replying to ticket: ", error);
    }
  }, [tickets, currentAdmin, logAction]);

  const addInternalNote = useCallback(async (ticketId: string, text: string) => {
    if (!currentAdmin) return;
    try {
      const ticket = tickets.find((t) => t.id === ticketId);
      if (!ticket) return;
      const ticketRef = doc(db, 'tickets', ticketId);
      await updateDoc(ticketRef, { internalNotes: [...(ticket.internalNotes || []), text] });
    } catch (error) {
      console.error("Error adding internal note: ", error);
    }
  }, [tickets, currentAdmin]);

  const setTicketStatus = useCallback(async (ticketId: string, status: Ticket['status']) => {
    if (!currentAdmin) return;
    try {
      const ticketRef = doc(db, 'tickets', ticketId);
      await updateDoc(ticketRef, { status, updatedAt: new Date().toISOString() });
      const ticket = tickets.find((t) => t.id === ticketId);
      if (ticket) logAction(status === 'resolved' ? 'Closed ticket' : status === 'escalated' ? 'Escalated ticket' : 'Updated ticket status', ticket.ref || ticketId, `Status → ${status}`, status === 'escalated' ? 'warning' : 'info');
    } catch (error) {
      console.error("Error setting ticket status: ", error);
    }
  }, [tickets, currentAdmin, logAction]);

  const setTicketPriority = useCallback(async (ticketId: string, priority: Ticket['priority']) => {
    if (!currentAdmin) return;
    try {
      const ticketRef = doc(db, 'tickets', ticketId);
      await updateDoc(ticketRef, { priority });
    } catch (error) {
      console.error("Error setting ticket priority: ", error);
    }
  }, [currentAdmin]);

  const assignTicket = useCallback(async (ticketId: string, assignee: string | null) => {
    if (!currentAdmin) return;
    try {
      const ticketRef = doc(db, 'tickets', ticketId);
      await updateDoc(ticketRef, { assignedTo: assignee, updatedAt: new Date().toISOString() });
      const ticket = tickets.find((t) => t.id === ticketId);
      if (ticket) logAction('Assigned ticket', ticket.ref || ticketId, assignee ? `Assigned to ${assignee}` : 'Unassigned', 'info');
    } catch (error) {
      console.error("Error assigning ticket: ", error);
    }
  }, [tickets, currentAdmin, logAction]);

  if (!currentAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ink-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  return (
    <DataContext.Provider value={{ farmers, tickets, auditLog, currentAdminName: currentAdmin.name, currentAdminRole: currentAdmin.role, setFarmerStatus, addFarmerNote, toggleBadge, replyToTicket, addInternalNote, setTicketStatus, setTicketPriority, assignTicket, logAction }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
