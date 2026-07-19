import { createContext, useContext, useState, useCallback } from 'react';
import type { Farmer, Ticket, AuditEntry, VerificationStatus, AdminRole } from './types';
import { FARMERS, TICKETS, AUDIT_LOG, CURRENT_ADMIN } from './data';

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
  const [farmers, setFarmers] = useState<Farmer[]>(FARMERS);
  const [tickets, setTickets] = useState<Ticket[]>(TICKETS);
  const [auditLog, setAuditLog] = useState<AuditEntry[]>(AUDIT_LOG);

  const logAction = useCallback((action: string, target: string, detail: string, severity: AuditEntry['severity'] = 'info') => {
    setAuditLog((prev) => [
      {
        id: `au${Date.now()}`,
        admin: CURRENT_ADMIN.name,
        adminRole: CURRENT_ADMIN.role,
        action,
        target,
        detail,
        createdAt: new Date().toISOString(),
        severity,
      },
      ...prev,
    ]);
  }, []);

  const setFarmerStatus = useCallback((id: string, status: VerificationStatus, note?: string) => {
    setFarmers((prev) =>
      prev.map((f) => {
        if (f.id !== id) return f;
        const notes = note
          ? [...f.notes, { id: `n${Date.now()}`, author: CURRENT_ADMIN.name, authorRole: CURRENT_ADMIN.role, text: note, createdAt: new Date().toISOString() }]
          : f.notes;
        return { ...f, status, activeSeller: status === 'approved' ? true : f.activeSeller, notes };
      })
    );
    const farmer = farmers.find((f) => f.id === id);
    if (farmer) {
      const action = status === 'approved' ? 'Approved farmer' : status === 'rejected' ? 'Rejected farmer' : status === 'suspended' ? 'Suspended farmer' : 'Updated farmer status';
      logAction(action, farmer.name, note || `Status set to ${status}`, status === 'suspended' ? 'critical' : status === 'rejected' ? 'warning' : 'info');
    }
  }, [farmers, logAction]);

  const addFarmerNote = useCallback((id: string, text: string) => {
    setFarmers((prev) =>
      prev.map((f) =>
        f.id === id
          ? { ...f, notes: [...f.notes, { id: `n${Date.now()}`, author: CURRENT_ADMIN.name, authorRole: CURRENT_ADMIN.role, text, createdAt: new Date().toISOString() }] }
          : f
      )
    );
    const farmer = farmers.find((f) => f.id === id);
    if (farmer) logAction('Added verification note', farmer.name, text, 'info');
  }, [farmers, logAction]);

  const toggleBadge = useCallback((farmerId: string, badgeId: string) => {
    setFarmers((prev) =>
      prev.map((f) => {
        if (f.id !== farmerId) return f;
        const has = f.badges.includes(badgeId);
        return { ...f, badges: has ? f.badges.filter((b) => b !== badgeId) : [...f.badges, badgeId] };
      })
    );
    const farmer = farmers.find((f) => f.id === farmerId);
    if (farmer) {
      const has = farmer.badges.includes(badgeId);
      logAction(has ? 'Removed badge' : 'Assigned badge', farmer.name, badgeId, 'info');
    }
  }, [farmers, logAction]);

  const replyToTicket = useCallback((ticketId: string, text: string) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? { ...t, status: t.status === 'open' ? 'pending' : t.status, updatedAt: new Date().toISOString(), messages: [...t.messages, { id: `m${Date.now()}`, author: CURRENT_ADMIN.name, authorType: 'admin', text, createdAt: new Date().toISOString() }] }
          : t
      )
    );
    const ticket = tickets.find((t) => t.id === ticketId);
    if (ticket) logAction('Replied to ticket', ticket.ref, text.slice(0, 80), 'info');
  }, [tickets, logAction]);

  const addInternalNote = useCallback((ticketId: string, text: string) => {
    setTickets((prev) => prev.map((t) => (t.id === ticketId ? { ...t, internalNotes: [...t.internalNotes, text] } : t)));
  }, []);

  const setTicketStatus = useCallback((ticketId: string, status: Ticket['status']) => {
    setTickets((prev) => prev.map((t) => (t.id === ticketId ? { ...t, status, updatedAt: new Date().toISOString() } : t)));
    const ticket = tickets.find((t) => t.id === ticketId);
    if (ticket) logAction(status === 'resolved' ? 'Closed ticket' : status === 'escalated' ? 'Escalated ticket' : 'Updated ticket status', ticket.ref, `Status → ${status}`, status === 'escalated' ? 'warning' : 'info');
  }, [tickets, logAction]);

  const setTicketPriority = useCallback((ticketId: string, priority: Ticket['priority']) => {
    setTickets((prev) => prev.map((t) => (t.id === ticketId ? { ...t, priority } : t)));
  }, []);

  const assignTicket = useCallback((ticketId: string, assignee: string | null) => {
    setTickets((prev) => prev.map((t) => (t.id === ticketId ? { ...t, assignedTo: assignee, updatedAt: new Date().toISOString() } : t)));
    const ticket = tickets.find((t) => t.id === ticketId);
    if (ticket) logAction('Assigned ticket', ticket.ref, assignee ? `Assigned to ${assignee}` : 'Unassigned', 'info');
  }, [tickets, logAction]);

  return (
    <DataContext.Provider value={{ farmers, tickets, auditLog, currentAdminName: CURRENT_ADMIN.name, currentAdminRole: CURRENT_ADMIN.role, setFarmerStatus, addFarmerNote, toggleBadge, replyToTicket, addInternalNote, setTicketStatus, setTicketPriority, assignTicket, logAction }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
