import { useState, useMemo } from 'react';
import {
  LifeBuoy, Filter, Send, Paperclip, Lock, CheckCircle2, AlertCircle,
  User, Store, ArrowLeft, Clock, UserCircle,
} from 'lucide-react';
import { useData } from '../store';
import { TicketStatusChip, PriorityChip } from '../components/chips';
import { PageHeader, SearchInput, EmptyState } from '../components/ui';
import { ADMINS } from '../data';
import type { Ticket, TicketStatus, TicketPriority, TicketCategory, UserType } from '../types';

const STATUS_FILTERS: { key: TicketStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'open', label: 'Open' },
  { key: 'pending', label: 'Pending' },
  { key: 'escalated', label: 'Escalated' },
  { key: 'resolved', label: 'Resolved' },
];

const CATEGORIES: { key: TicketCategory | 'all'; label: string }[] = [
  { key: 'all', label: 'All categories' },
  { key: 'verification', label: 'Verification' },
  { key: 'payment', label: 'Payment' },
  { key: 'account', label: 'Account' },
  { key: 'listing', label: 'Listing' },
  { key: 'dispute', label: 'Dispute' },
  { key: 'other', label: 'Other' },
];

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return `${Math.max(1, Math.floor(diff / 60000))}m`;
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}

export function SupportPage() {
  const { tickets } = useData();
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'all'>('all');
  const [catFilter, setCatFilter] = useState<TicketCategory | 'all'>('all');
  const [userTypeFilter, setUserTypeFilter] = useState<UserType | 'all'>('all');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(tickets[0]?.id ?? null);

  const filtered = useMemo(() => {
    return tickets.filter((t) => {
      if (statusFilter !== 'all' && t.status !== statusFilter) return false;
      if (catFilter !== 'all' && t.category !== catFilter) return false;
      if (userTypeFilter !== 'all' && t.userType !== userTypeFilter) return false;
      if (query) {
        const q = query.toLowerCase();
        return t.subject.toLowerCase().includes(q) || t.user.toLowerCase().includes(q) || t.ref.toLowerCase().includes(q);
      }
      return true;
    });
  }, [tickets, statusFilter, catFilter, userTypeFilter, query]);

  const selected = tickets.find((t) => t.id === selectedId) || filtered[0] || null;

  return (
    <div>
      <PageHeader title="Support" subtitle="Reply to farmer and buyer support requests." />

      <div className="card p-4 mb-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setStatusFilter(f.key)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${statusFilter === f.key ? 'bg-brand-600 text-white shadow-sm' : 'text-ink-600 hover:bg-ink-100'}`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="lg:ml-auto flex items-center gap-2 flex-wrap">
            <select value={catFilter} onChange={(e) => setCatFilter(e.target.value as any)} className="input !w-auto !py-1.5 text-sm">
              {CATEGORIES.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
            </select>
            <select value={userTypeFilter} onChange={(e) => setUserTypeFilter(e.target.value as any)} className="input !w-auto !py-1.5 text-sm">
              <option value="all">All users</option>
              <option value="farmer">Farmers</option>
              <option value="buyer">Buyers</option>
            </select>
            <div className="w-44"><SearchInput value={query} onChange={setQuery} placeholder="Search tickets…" /></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ticket list */}
        <div className="lg:col-span-1 card overflow-hidden">
          {filtered.length === 0 ? (
            <EmptyState icon={LifeBuoy} title="No tickets" description="No tickets match these filters." />
          ) : (
            <div className="divide-y divide-ink-100 max-h-[70vh] overflow-y-auto">
              {filtered.map((t) => {
                const active = selected?.id === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setSelectedId(t.id)}
                    className={`w-full text-left p-4 transition ${active ? 'bg-brand-50 border-l-2 border-brand-600' : 'hover:bg-ink-50 border-l-2 border-transparent'}`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-xs font-mono text-ink-400">{t.ref}</span>
                      <PriorityChip priority={t.priority} />
                    </div>
                    <div className="text-sm font-semibold text-ink-900 leading-snug mb-1">{t.subject}</div>
                    <div className="flex items-center gap-2 text-xs text-ink-500">
                      <span className="flex items-center gap-1">
                        {t.userType === 'farmer' ? <Store size={11} /> : <User size={11} />}
                        {t.user}
                      </span>
                      <span>· {timeAgo(t.updatedAt)} ago</span>
                    </div>
                    <div className="mt-2"><TicketStatusChip status={t.status} /></div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Conversation */}
        <div className="lg:col-span-2">
          {selected ? <Conversation ticket={selected} /> : (
            <div className="card"><EmptyState icon={LifeBuoy} title="Select a ticket" description="Choose a ticket from the list to view the conversation." /></div>
          )}
        </div>
      </div>
    </div>
  );
}

function Conversation({ ticket }: { ticket: Ticket }) {
  const { replyToTicket, addInternalNote, setTicketStatus, setTicketPriority, assignTicket } = useData();
  const [reply, setReply] = useState('');
  const [note, setNote] = useState('');
  const [showNote, setShowNote] = useState(false);

  const send = () => {
    if (!reply.trim()) return;
    replyToTicket(ticket.id, reply.trim());
    setReply('');
  };

  const addNote = () => {
    if (!note.trim()) return;
    addInternalNote(ticket.id, note.trim());
    setNote('');
    setShowNote(false);
  };

  return (
    <div className="card flex flex-col max-h-[80vh]">
      {/* Header */}
      <div className="p-5 border-b border-ink-200">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0">
            <div className="text-xs font-mono text-ink-400 mb-1">{ticket.ref}</div>
            <h2 className="font-display font-bold text-ink-900 leading-snug">{ticket.subject}</h2>
            <div className="flex items-center gap-2 mt-1.5 text-sm text-ink-500">
              <span className="flex items-center gap-1.5">
                {ticket.userType === 'farmer' ? <Store size={13} /> : <User size={13} />}
                {ticket.user}
              </span>
              <span>·</span>
              <span className="capitalize">{ticket.category}</span>
              <span>·</span>
              <span className="flex items-center gap-1"><Clock size={12} /> {timeAgo(ticket.createdAt)} ago</span>
            </div>
          </div>
          <TicketStatusChip status={ticket.status} />
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <select value={ticket.priority} onChange={(e) => setTicketPriority(ticket.id, e.target.value as TicketPriority)} className="input !w-auto !py-1.5 text-xs">
            <option value="low">Low priority</option>
            <option value="medium">Medium priority</option>
            <option value="high">High priority</option>
            <option value="urgent">Urgent priority</option>
          </select>
          <select value={ticket.assignedTo ?? ''} onChange={(e) => assignTicket(ticket.id, e.target.value || null)} className="input !w-auto !py-1.5 text-xs">
            <option value="">Unassigned</option>
            {ADMINS.map((a) => <option key={a.id} value={a.name}>{a.name}</option>)}
          </select>
          <div className="ml-auto flex items-center gap-1.5">
            {ticket.status !== 'resolved' && (
              <button onClick={() => setTicketStatus(ticket.id, 'resolved')} className="btn-success !py-1.5 !px-3 text-xs">
                <CheckCircle2 size={14} /> Close
              </button>
            )}
            {ticket.status !== 'escalated' && (
              <button onClick={() => setTicketStatus(ticket.id, 'escalated')} className="btn-secondary !py-1.5 !px-3 text-xs">
                <AlertCircle size={14} /> Escalate
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-ink-50/50">
        {ticket.messages.map((m) => {
          const isAdmin = m.authorType === 'admin';
          return (
            <div key={m.id} className={`flex gap-3 ${isAdmin ? 'flex-row-reverse' : ''}`}>
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${isAdmin ? 'bg-brand-600 text-white' : 'bg-ink-300 text-white'}`}>
                {m.author.split(' ').map((n) => n[0]).join('').slice(0, 2)}
              </div>
              <div className={`max-w-[75%] ${isAdmin ? 'items-end' : ''} flex flex-col`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-ink-700">{m.author}</span>
                  {isAdmin && <span className="chip bg-brand-100 text-brand-700 text-[10px] !py-0.5">Admin</span>}
                  <span className="text-xs text-ink-400">{new Date(m.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                </div>
                <div className={`rounded-2xl px-4 py-2.5 text-sm ${isAdmin ? 'bg-brand-600 text-white rounded-tr-sm' : 'bg-white border border-ink-200 text-ink-800 rounded-tl-sm'}`}>
                  {m.text}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Internal notes */}
      {ticket.internalNotes.length > 0 && (
        <div className="px-5 py-3 bg-amber-50/60 border-t border-amber-200">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 mb-1.5"><Lock size={12} /> Internal notes</div>
          <ul className="space-y-1">
            {ticket.internalNotes.map((n, i) => <li key={i} className="text-xs text-ink-700 flex gap-1.5"><span className="text-amber-600">•</span> {n}</li>)}
          </ul>
        </div>
      )}

      {/* Composer */}
      <div className="p-4 border-t border-ink-200 bg-white">
        {showNote ? (
          <div className="space-y-2">
            <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Internal note (only visible to admins)…" className="input min-h-[60px]" autoFocus />
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowNote(false)} className="btn-secondary !py-1.5 text-xs">Cancel</button>
              <button onClick={addNote} className="btn-primary !py-1.5 text-xs"><Lock size={13} /> Save note</button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-end gap-2">
              <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
                placeholder="Type your reply…"
                className="input flex-1 min-h-[44px] resize-none"
                rows={2}
              />
              <button onClick={send} className="btn-primary !py-2.5"><Send size={16} /></button>
            </div>
            <div className="flex items-center justify-between mt-2">
              <button onClick={() => setShowNote(true)} className="text-xs font-medium text-ink-500 hover:text-ink-700 flex items-center gap-1"><Lock size={12} /> Add internal note</button>
              <button className="text-xs font-medium text-ink-500 hover:text-ink-700 flex items-center gap-1"><Paperclip size={12} /> Attach</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
