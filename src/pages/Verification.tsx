import { useState, useMemo, useEffect } from 'react';
import {
  ClipboardCheck, Filter, MapPin, Phone, Mail, CalendarDays, ArrowLeft,
  CheckCircle2, XCircle, MessageSquarePlus, Ban, FileText, Image as ImageIcon,
  Star, ShoppingBag, ShieldCheck, Clock, User, ChevronRight,
} from 'lucide-react';
import { useData } from '../store';
import { StatusChip, BadgeChip, DocStatusChip } from '../components/chips';
import { PageHeader, SearchInput, EmptyState, Modal } from '../components/ui';
import type { VerificationStatus, Farmer } from '../types';

const FILTERS: { key: VerificationStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'approved', label: 'Approved' },
  { key: 'rejected', label: 'Rejected' },
  { key: 'suspended', label: 'Suspended' },
  { key: 'incomplete', label: 'Incomplete' },
];

export function VerificationPage({
  initialSelectedId,
  onClearSelectedFarmer,
}: {
  initialSelectedId?: string | null;
  onClearSelectedFarmer?: () => void;
}) {
  const { farmers } = useData();
  const [filter, setFilter] = useState<VerificationStatus | 'all'>('pending');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    setSelectedId(initialSelectedId ?? null);
  }, [initialSelectedId]);

  const filtered = useMemo(() => {
    return farmers.filter((f) => {
      if (filter !== 'all' && f.status !== filter) return false;
      if (query) {
        const q = query.toLowerCase();
        return f.name.toLowerCase().includes(q) || f.location.toLowerCase().includes(q) || f.crops.some((c) => c.toLowerCase().includes(q));
      }
      return true;
    });
  }, [farmers, filter, query]);

  const selected = farmers.find((f) => f.id === selectedId) || null;

  if (selected) {
    return <FarmerReview farmer={selected} onBack={() => { setSelectedId(null); onClearSelectedFarmer?.(); }} />;
  }

  const counts = (s: VerificationStatus | 'all') => (s === 'all' ? farmers.length : farmers.filter((f) => f.status === s).length);

  return (
    <div>
      <PageHeader
        title="Farmer Verification"
        subtitle="Review applications and approve farmers to sell on the marketplace."
      />

      <div className="card p-4 mb-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                  filter === f.key ? 'bg-brand-600 text-white shadow-sm' : 'text-ink-600 hover:bg-ink-100'
                }`}
              >
                {f.label}
                <span className={`ml-1.5 text-xs ${filter === f.key ? 'text-white/80' : 'text-ink-400'}`}>{counts(f.key)}</span>
              </button>
            ))}
          </div>
          <div className="lg:ml-auto lg:w-72">
            <SearchInput value={query} onChange={setQuery} placeholder="Search name, location, crop…" />
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card">
          <EmptyState icon={ClipboardCheck} title="No applications match" description="Try a different filter or search term." />
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-ink-50 text-ink-500 text-xs uppercase tracking-wide">
                  <th className="text-left font-semibold px-5 py-3">Farmer</th>
                  <th className="text-left font-semibold px-5 py-3 hidden md:table-cell">Location</th>
                  <th className="text-left font-semibold px-5 py-3 hidden lg:table-cell">Farm Type</th>
                  <th className="text-left font-semibold px-5 py-3 hidden xl:table-cell">Registered</th>
                  <th className="text-left font-semibold px-5 py-3">Status</th>
                  <th className="text-left font-semibold px-5 py-3 hidden md:table-cell">ID</th>
                  <th className="text-right font-semibold px-5 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {filtered.map((f) => (
                  <tr key={f.id} className="table-row-hover">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-semibold shrink-0">
                          {f.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-ink-900 truncate">{f.name}</div>
                          <div className="text-xs text-ink-500 truncate md:hidden">{f.location}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 hidden md:table-cell text-ink-600">{f.location}</td>
                    <td className="px-5 py-3.5 hidden lg:table-cell text-ink-600">{f.farmType}</td>
                    <td className="px-5 py-3.5 hidden xl:table-cell text-ink-500">{f.registeredAt}</td>
                    <td className="px-5 py-3.5"><StatusChip status={f.status} /></td>
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      {f.idVerified ? (
                        <span className="chip bg-emerald-50 text-emerald-700 border border-emerald-200"><ShieldCheck size={12} /> Verified</span>
                      ) : (
                        <span className="chip bg-amber-50 text-amber-700 border border-amber-200"><Clock size={12} /> Pending</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button onClick={() => setSelectedId(f.id)} className="btn-secondary !py-1.5 !px-3 text-xs">
                        Review <ChevronRight size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function FarmerReview({ farmer, onBack }: { farmer: Farmer; onBack: () => void }) {
  const { setFarmerStatus, addFarmerNote } = useData();
  const [note, setNote] = useState('');
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<null | 'approve' | 'reject' | 'suspend' | 'request'>(null);

  const addNote = () => {
    if (!note.trim()) return;
    addFarmerNote(farmer.id, note.trim());
    setNote('');
  };

  const doAction = (action: 'approve' | 'reject' | 'suspend' | 'request') => {
    const noteMap = {
      approve: 'Approved — all documents verified. Welcome to AgriMarket.',
      reject: 'Application rejected. Please see notes for details.',
      suspend: 'Account suspended pending review.',
      request: 'Requested additional information from farmer.',
    };
    const statusMap = { approve: 'approved', reject: 'rejected', suspend: 'suspended', request: 'incomplete' } as const;
    setFarmerStatus(farmer.id, statusMap[action], noteMap[action]);
    setConfirm(null);
  };

  return (
    <div>
      <button onClick={onBack} className="btn-ghost !px-2 mb-4 -ml-2">
        <ArrowLeft size={18} /> Back to queue
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: profile + actions */}
        <div className="lg:col-span-1 space-y-6">
          <div className="card p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-brand-100 text-brand-700 flex items-center justify-center text-lg font-bold">
                {farmer.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
              </div>
              <div className="min-w-0">
                <h2 className="font-display font-bold text-ink-900 truncate">{farmer.name}</h2>
                <StatusChip status={farmer.status} />
              </div>
            </div>

            <div className="space-y-2.5 text-sm">
              <div className="flex items-center gap-2.5 text-ink-600"><MapPin size={15} className="text-ink-400" /> {farmer.location}</div>
              <div className="flex items-center gap-2.5 text-ink-600"><Phone size={15} className="text-ink-400" /> {farmer.phone}</div>
              <div className="flex items-center gap-2.5 text-ink-600"><Mail size={15} className="text-ink-400" /> {farmer.email}</div>
              <div className="flex items-center gap-2.5 text-ink-600"><CalendarDays size={15} className="text-ink-400" /> Registered {farmer.registeredAt}</div>
            </div>

            <div className="mt-4 pt-4 border-t border-ink-100 grid grid-cols-2 gap-3 text-sm">
              <div><div className="text-xs text-ink-400">Farm Type</div><div className="font-semibold text-ink-800">{farmer.farmType}</div></div>
              <div><div className="text-xs text-ink-400">Size</div><div className="font-semibold text-ink-800">{farmer.farmSizeAcres} acres</div></div>
              <div><div className="text-xs text-ink-400">ID Status</div><div className="font-semibold text-ink-800">{farmer.idVerified ? 'Verified' : 'Pending'}</div></div>
              <div><div className="text-xs text-ink-400">Rating</div><div className="font-semibold text-ink-800">{farmer.rating > 0 ? `★ ${farmer.rating}` : '—'}</div></div>
            </div>

            <div className="mt-4 pt-4 border-t border-ink-100">
              <div className="text-xs text-ink-400 mb-1.5">Crops / Products</div>
              <div className="flex flex-wrap gap-1.5">
                {farmer.crops.map((c) => <span key={c} className="chip bg-ink-100 text-ink-700">{c}</span>)}
              </div>
            </div>

            {farmer.badges.length > 0 && (
              <div className="mt-4 pt-4 border-t border-ink-100">
                <div className="text-xs text-ink-400 mb-1.5">Current Badges</div>
                <div className="flex flex-wrap gap-1.5">
                  {farmer.badges.map((b) => <BadgeChip key={b} badgeId={b} size="sm" />)}
                </div>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="card p-5">
            <h3 className="font-display font-bold text-ink-900 mb-3">Verification Actions</h3>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => setConfirm('approve')} className="btn-success !py-2.5"><CheckCircle2 size={16} /> Approve</button>
              <button onClick={() => setConfirm('reject')} className="btn-danger !py-2.5"><XCircle size={16} /> Reject</button>
              <button onClick={() => setConfirm('request')} className="btn-secondary !py-2.5"><MessageSquarePlus size={16} /> Request info</button>
              <button onClick={() => setConfirm('suspend')} className="btn-secondary !py-2.5"><Ban size={16} /> Suspend</button>
            </div>
          </div>
        </div>

        {/* Right: documents, photos, notes */}
        <div className="lg:col-span-2 space-y-6">
          {/* Documents */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <FileText size={18} className="text-brand-600" />
              <h3 className="font-display font-bold text-ink-900">Submitted Documents</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {farmer.documents.map((doc) => (
                <div key={doc.id} className="rounded-xl border border-ink-200 overflow-hidden hover:border-ink-300 transition">
                  {doc.preview ? (
                    <div className="h-32 bg-ink-100 relative overflow-hidden">
                      <img src={doc.preview} alt={doc.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink-950/40 to-transparent" />
                      <div className="absolute bottom-2 left-2 text-white text-xs font-medium flex items-center gap-1">
                        <FileText size={12} /> {doc.type.toUpperCase()}
                      </div>
                    </div>
                  ) : (
                    <div className="h-32 bg-ink-50 flex items-center justify-center text-ink-300"><FileText size={28} /></div>
                  )}
                  <div className="p-3">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="text-sm font-semibold text-ink-800 truncate">{doc.name}</div>
                      <DocStatusChip status={doc.status} />
                    </div>
                    <div className="text-xs text-ink-400">{doc.uploadedAt ? `Uploaded ${doc.uploadedAt}` : 'Not uploaded'}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Farm photos */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <ImageIcon size={18} className="text-brand-600" />
              <h3 className="font-display font-bold text-ink-900">Farm Photos</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {farmer.photos.map((p) => (
                <button key={p.id} onClick={() => setLightbox(p.url)} className="group rounded-xl overflow-hidden border border-ink-200 hover:border-brand-300 transition relative aspect-[4/3]">
                  <img src={p.url} alt={p.caption} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-2">
                    <span className="text-white text-xs font-medium">{p.caption}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Verification notes */}
          <div className="card p-5">
            <h3 className="font-display font-bold text-ink-900 mb-4">Verification Notes</h3>
            <div className="space-y-3 mb-4">
              {farmer.notes.length === 0 && <p className="text-sm text-ink-400 italic">No notes yet.</p>}
              {farmer.notes.map((n) => (
                <div key={n.id} className="flex gap-3 p-3 rounded-lg bg-ink-50 border border-ink-100">
                  <div className="w-8 h-8 rounded-full bg-ink-200 text-ink-700 flex items-center justify-center text-xs font-semibold shrink-0">
                    {n.author.split(' ').map((x) => x[0]).join('').slice(0, 2)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-semibold text-ink-900">{n.author}</span>
                      <span className="text-xs text-ink-400">· {n.authorRole}</span>
                      <span className="text-xs text-ink-400 ml-auto">{new Date(n.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-ink-700">{n.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addNote()}
                placeholder="Add a verification note…"
                className="input flex-1"
              />
              <button onClick={addNote} className="btn-primary">Add note</button>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-50 bg-ink-950/80 backdrop-blur-sm flex items-center justify-center p-6" onClick={() => setLightbox(null)}>
          <img src={lightbox} alt="Farm photo" className="max-w-full max-h-full rounded-xl shadow-pop" />
        </div>
      )}

      {/* Confirm action modal */}
      <Modal
        open={confirm !== null}
        onClose={() => setConfirm(null)}
        title={confirm === 'approve' ? 'Approve farmer' : confirm === 'reject' ? 'Reject application' : confirm === 'suspend' ? 'Suspend farmer' : 'Request more info'}
        subtitle={farmer.name}
        size="sm"
        footer={
          <>
            <button onClick={() => setConfirm(null)} className="btn-secondary">Cancel</button>
            <button
              onClick={() => confirm && doAction(confirm)}
              className={confirm === 'approve' ? 'btn-success' : confirm === 'reject' ? 'btn-danger' : 'btn-primary'}
            >
              Confirm
            </button>
          </>
        }
      >
        <p className="text-sm text-ink-600">
          {confirm === 'approve' && 'This will approve the farmer to sell on AgriMarket. A confirmation note will be added to their record.'}
          {confirm === 'reject' && 'This will reject the application. The farmer will be notified and can reapply after addressing the issues.'}
          {confirm === 'suspend' && 'This will suspend the farmer account. They will not be able to list or sell until reinstated.'}
          {confirm === 'request' && 'This will mark the application as incomplete and notify the farmer to provide additional information.'}
        </p>
      </Modal>
    </div>
  );
}
