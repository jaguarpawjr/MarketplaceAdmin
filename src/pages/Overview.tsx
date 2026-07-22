import {
  Users, ClipboardCheck, CheckCircle2, XCircle, Store, LifeBuoy, CheckCheck,
  TrendingUp, TrendingDown, ArrowRight, AlertTriangle, Clock, CalendarDays,
} from 'lucide-react';
import { useData } from '../store';
import { StatusChip, TicketStatusChip, PriorityChip, BadgeChip } from '../components/chips';
import type { PageKey } from '../components/Shell';

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return `${Math.max(1, Math.floor(diff / 60000))}m ago`;
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export function OverviewPage({ onNavigate }: { onNavigate: (p: PageKey) => void }) {
  const { farmers, tickets, auditLog } = useData();

  const pending = farmers.filter((f) => f.status === 'pending');
  const approved = farmers.filter((f) => f.status === 'approved');
  const rejected = farmers.filter((f) => f.status === 'rejected');
  const activeSellers = farmers.filter((f) => f.activeSeller);
  const openTickets = tickets.filter((t) => t.status === 'open' || t.status === 'escalated');
  const resolvedTickets = tickets.filter((t) => t.status === 'resolved');

  const metrics = [
    { label: 'Total Farmers', value: farmers.length, icon: Users, trend: '+12%', up: true, color: 'bg-brand-50 text-brand-600' },
    { label: 'Pending Verifications', value: pending.length, icon: ClipboardCheck, trend: '+3', up: true, color: 'bg-amber-50 text-amber-600' },
    { label: 'Approved Farmers', value: approved.length, icon: CheckCircle2, trend: '+2', up: true, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Rejected', value: rejected.length, icon: XCircle, trend: '0', up: false, color: 'bg-red-50 text-red-600' },
    { label: 'Active Sellers', value: activeSellers.length, icon: Store, trend: '+1', up: true, color: 'bg-blue-50 text-blue-600' },
    { label: 'Open Tickets', value: openTickets.length, icon: LifeBuoy, trend: '+2', up: false, color: 'bg-rose-50 text-rose-600' },
    { label: 'Resolved Tickets', value: resolvedTickets.length, icon: CheckCheck, trend: '+1', up: true, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Avg. Response', value: '3.2h', icon: Clock, trend: '-0.4h', up: true, color: 'bg-sand-100 text-sand-500' },
  ];

  const urgent = [
    ...pending.slice(0, 3).map((f) => ({ type: 'verification', title: `${f.name} awaiting review`, sub: `${f.location} · ${f.farmType}`, action: 'verification' as PageKey, id: f.id })),
    ...tickets.filter((t) => t.priority === 'urgent' || t.status === 'escalated').slice(0, 2).map((t) => ({ type: 'ticket', title: t.subject, sub: `${t.ref} · ${t.user}`, action: 'support' as PageKey, id: t.id })),
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-900 tracking-tight">Overview</h1>
          <p className="text-sm text-ink-500 mt-1">Marketplace health and items needing your attention.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-ink-500 bg-white border border-ink-200 rounded-lg px-3 py-2">
          <CalendarDays size={15} className="text-brand-600" />
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="card card-hover p-5">
              <div className="flex items-start justify-between">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${m.color}`}>
                  <Icon size={20} />
                </div>
                <span className={`chip text-[11px] ${m.up ? 'stat-trend-up' : 'stat-trend-down'}`}>
                  {m.up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                  {m.trend}
                </span>
              </div>
              <div className="mt-3">
                <div className="font-display text-2xl font-bold text-ink-900">{m.value}</div>
                <div className="text-xs text-ink-500 mt-0.5 font-medium">{m.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Urgent items */}
        <div className="lg:col-span-2 card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                <AlertTriangle size={17} className="text-red-600" />
              </div>
              <h2 className="font-display font-bold text-ink-900">Needs Attention</h2>
            </div>
            <span className="chip bg-red-50 text-red-700 border border-red-200">{urgent.length} items</span>
          </div>
          <div className="space-y-2.5">
            {urgent.map((u, i) => (
              <button
                key={i}
                onClick={() => onNavigate(u.action)}
                className="w-full flex items-center justify-between gap-3 p-3.5 rounded-xl border border-ink-200 hover:border-brand-300 hover:bg-brand-50/40 transition group text-left"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`w-2 h-2 rounded-full ${u.type === 'verification' ? 'bg-amber-500' : 'bg-red-500'} shrink-0`} />
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-ink-900 truncate">{u.title}</div>
                    <div className="text-xs text-ink-500 truncate">{u.sub}</div>
                  </div>
                </div>
                <ArrowRight size={16} className="text-ink-300 group-hover:text-brand-600 group-hover:translate-x-0.5 transition shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* Recent admin activity */}
        <div className="card p-5">
          <h2 className="font-display font-bold text-ink-900 mb-4">Recent Admin Activity</h2>
          <div className="space-y-4">
            {auditLog.slice(0, 6).map((entry) => (
              <div key={entry.id} className="flex gap-3">
                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                  entry.severity === 'critical' ? 'bg-red-500' : entry.severity === 'warning' ? 'bg-amber-500' : 'bg-brand-500'
                }`} />
                <div className="min-w-0">
                  <p className="text-sm text-ink-800 leading-snug">
                    <span className="font-semibold">{entry.admin}</span> {entry.action.toLowerCase()}{' '}
                    <span className="font-semibold">{entry.target}</span>
                  </p>
                  <p className="text-xs text-ink-400 mt-0.5">{timeAgo(entry.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Two-column lower */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Pending verifications */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-ink-900">Pending Verifications</h2>
            <button onClick={() => onNavigate('verification')} className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1">
              View all <ArrowRight size={13} />
            </button>
          </div>
          <div className="space-y-3">
            {pending.map((f) => (
              <div key={f.id} className="flex items-center justify-between gap-3 p-3 rounded-lg border border-ink-200 hover:border-ink-300 transition">
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-ink-900 truncate">{f.name}</div>
                  <div className="text-xs text-ink-500 truncate">{f.location} · {f.crops.slice(0, 2).join(', ')}</div>
                </div>
                <StatusChip status={f.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Open tickets */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-ink-900">Open Support Tickets</h2>
            <button onClick={() => onNavigate('support')} className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1">
              View all <ArrowRight size={13} />
            </button>
          </div>
          <div className="space-y-3">
            {openTickets.map((t) => (
              <div key={t.id} className="flex items-center justify-between gap-3 p-3 rounded-lg border border-ink-200 hover:border-ink-300 transition">
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-ink-900 truncate">{t.subject}</div>
                  <div className="text-xs text-ink-500 truncate">{t.ref} · {t.user}</div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <PriorityChip priority={t.priority} />
                  <TicketStatusChip status={t.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top rated farmers */}
      <div className="card p-5 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-ink-900">Top Rated Farmers</h2>
          <button onClick={() => onNavigate('farmers')} className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1">
            All farmers <ArrowRight size={13} />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {approved.filter((f) => f.rating > 0).sort((a, b) => b.rating - a.rating).slice(0, 3).map((f) => (
            <div key={f.id} className="p-4 rounded-xl border border-ink-200 hover:border-brand-300 hover:bg-brand-50/30 transition">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-semibold text-ink-900">{f.name}</div>
                <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                  <span className="text-amber-500">★</span> {f.rating}
                </div>
              </div>
              <div className="text-xs text-ink-500 mb-2.5">{f.location} · {f.farmType}</div>
              <div className="flex flex-wrap gap-1.5">
                {f.badges.slice(0, 3).map((b) => <BadgeChip key={b} badgeId={b} size="sm" />)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
