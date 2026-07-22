import { useState } from 'react';
import { Award, Plus, Pencil, Trash2, Check, X, Calendar, Users as UsersIcon } from 'lucide-react';
import { useData } from '../store';
import { BADGES } from '../data';
import { BadgeChip, BadgeIcon } from '../components/chips';
import { PageHeader, Modal } from '../components/ui';
import type { Badge } from '../types';

export function BadgesPage() {
  const { farmers, toggleBadge } = useData();
  const [editing, setEditing] = useState<Badge | null>(null);
  const [assignOpen, setAssignOpen] = useState<Badge | null>(null);
  const [newOpen, setNewOpen] = useState(false);

  return (
    <div>
      <PageHeader
        title="Badge Management"
        subtitle="Define, assign, and manage trust badges for farmers."
        actions={<button onClick={() => setNewOpen(true)} className="btn-primary"><Plus size={16} /> New badge</button>}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
        {BADGES.map((badge) => {
          const holders = farmers.filter((f) => f.badges.includes(badge.id));
          return (
            <div key={badge.id} className="card card-hover p-5">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${badge.color}`}>
                  <BadgeIcon badge={badge} size={22} />
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => setEditing(badge)} className="p-1.5 rounded-lg text-ink-400 hover:bg-ink-100 hover:text-ink-700 transition"><Pencil size={15} /></button>
                  <button className="p-1.5 rounded-lg text-ink-400 hover:bg-red-50 hover:text-red-600 transition"><Trash2 size={15} /></button>
                </div>
              </div>
              <h3 className="font-display font-bold text-ink-900">{badge.name}</h3>
              <p className="text-sm text-ink-500 mt-1 leading-relaxed">{badge.description}</p>

              <div className="mt-4 pt-4 border-t border-ink-100 space-y-2.5">
                <div className="flex items-start gap-2 text-xs">
                  <span className="text-ink-400 font-semibold uppercase tracking-wide w-16 shrink-0">Criteria</span>
                  <span className="text-ink-600">{badge.criteria}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-ink-400 font-semibold uppercase tracking-wide w-16 shrink-0">Holders</span>
                  <span className="text-ink-600 flex items-center gap-1"><UsersIcon size={12} /> {badge.farmersCount} farmers</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-ink-400 font-semibold uppercase tracking-wide w-16 shrink-0">Expires</span>
                  <span className="text-ink-600 flex items-center gap-1">
                    <Calendar size={12} /> {badge.expiresAfterDays ? `${badge.expiresAfterDays} days` : 'Never'}
                  </span>
                </div>
              </div>

              <button onClick={() => setAssignOpen(badge)} className="btn-secondary w-full mt-4 !py-2">
                Manage assignments
              </button>
            </div>
          );
        })}
      </div>

      {/* Badge holders table */}
      <div className="card p-5">
        <h2 className="font-display font-bold text-ink-900 mb-4">Badge Holders Overview</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-ink-50 text-ink-500 text-xs uppercase tracking-wide">
                <th className="text-left font-semibold px-4 py-3">Farmer</th>
                <th className="text-left font-semibold px-4 py-3">Status</th>
                <th className="text-left font-semibold px-4 py-3">Badges</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {farmers.filter((f) => f.badges.length > 0).map((f) => (
                <tr key={f.id} className="table-row-hover">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-semibold">
                        {f.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                      </div>
                      <div className="font-semibold text-ink-900">{f.name}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-ink-500 capitalize">{f.status}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1.5">
                      {f.badges.map((b) => <BadgeChip key={b} badgeId={b} size="sm" />)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit badge modal */}
      <Modal
        open={editing !== null}
        onClose={() => setEditing(null)}
        title="Edit badge"
        subtitle={editing?.name}
        footer={<><button onClick={() => setEditing(null)} className="btn-secondary">Cancel</button><button onClick={() => setEditing(null)} className="btn-primary">Save changes</button></>}
      >
        {editing && (
          <div className="space-y-4">
            <div>
              <label className="label">Badge name</label>
              <input className="input" defaultValue={editing.name} />
            </div>
            <div>
              <label className="label">Description</label>
              <textarea className="input min-h-[80px]" defaultValue={editing.description} />
            </div>
            <div>
              <label className="label">Criteria</label>
              <textarea className="input min-h-[60px]" defaultValue={editing.criteria} />
            </div>
            <div>
              <label className="label">Expires after (days, blank = never)</label>
              <input type="number" className="input" defaultValue={editing.expiresAfterDays ?? ''} />
            </div>
          </div>
        )}
      </Modal>

      {/* New badge modal */}
      <Modal
        open={newOpen}
        onClose={() => setNewOpen(false)}
        title="Create new badge"
        subtitle="Define a new trust badge for farmers."
        footer={<><button onClick={() => setNewOpen(false)} className="btn-secondary">Cancel</button><button onClick={() => setNewOpen(false)} className="btn-primary">Create badge</button></>}
      >
        <div className="space-y-4">
          <div><label className="label">Badge name</label><input className="input" placeholder="e.g. Sustainable Grower" /></div>
          <div><label className="label">Description</label><textarea className="input min-h-[80px]" placeholder="What this badge represents…" /></div>
          <div><label className="label">Criteria</label><textarea className="input min-h-[60px]" placeholder="Requirements to earn this badge…" /></div>
          <div><label className="label">Expires after (days)</label><input type="number" className="input" placeholder="365" /></div>
        </div>
      </Modal>

      {/* Assign modal */}
      <Modal
        open={assignOpen !== null}
        onClose={() => setAssignOpen(null)}
        title="Manage assignments"
        subtitle={assignOpen ? `${assignOpen.name} — toggle which farmers hold this badge` : ''}
        size="lg"
      >
        {assignOpen && (
          <div className="space-y-2">
            {farmers.map((f) => {
              const has = f.badges.includes(assignOpen.id);
              return (
                <div key={f.id} className="flex items-center justify-between p-3 rounded-lg border border-ink-200">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-semibold">
                      {f.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-ink-900">{f.name}</div>
                      <div className="text-xs text-ink-500">{f.location}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleBadge(f.id, assignOpen.id)}
                    className={has ? 'btn-success !py-1.5 !px-3 text-xs' : 'btn-secondary !py-1.5 !px-3 text-xs'}
                  >
                    {has ? <><Check size={14} /> Assigned</> : <><Plus size={14} /> Assign</>}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </Modal>
    </div>
  );
}
