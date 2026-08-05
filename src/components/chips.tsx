import * as Icons from 'lucide-react';
import type { VerificationStatus, TicketStatus, TicketPriority, Badge } from '../types';
import { BADGES } from '../constants';

export function StatusChip({ status }: { status: VerificationStatus }) {
  const map: Record<VerificationStatus, { label: string; cls: string; dot: string }> = {
    pending: { label: 'Pending', cls: 'bg-amber-50 text-amber-700 border border-amber-200', dot: 'bg-amber-500' },
    approved: { label: 'Approved', cls: 'bg-emerald-50 text-emerald-700 border border-emerald-200', dot: 'bg-emerald-500' },
    rejected: { label: 'Rejected', cls: 'bg-red-50 text-red-700 border border-red-200', dot: 'bg-red-500' },
    suspended: { label: 'Suspended', cls: 'bg-ink-100 text-ink-700 border border-ink-200', dot: 'bg-ink-500' },
    incomplete: { label: 'Incomplete', cls: 'bg-blue-50 text-blue-700 border border-blue-200', dot: 'bg-blue-500' },
  };
  const s = map[status];
  return (
    <span className={`chip ${s.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

export function TicketStatusChip({ status }: { status: TicketStatus }) {
  const map: Record<TicketStatus, { label: string; cls: string; dot: string }> = {
    open: { label: 'Open', cls: 'bg-blue-50 text-blue-700 border border-blue-200', dot: 'bg-blue-500' },
    pending: { label: 'Pending', cls: 'bg-amber-50 text-amber-700 border border-amber-200', dot: 'bg-amber-500' },
    resolved: { label: 'Resolved', cls: 'bg-emerald-50 text-emerald-700 border border-emerald-200', dot: 'bg-emerald-500' },
    escalated: { label: 'Escalated', cls: 'bg-red-50 text-red-700 border border-red-200', dot: 'bg-red-500' },
  };
  const s = map[status];
  return (
    <span className={`chip ${s.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

export function PriorityChip({ priority }: { priority: TicketPriority }) {
  const map: Record<TicketPriority, string> = {
    low: 'bg-ink-100 text-ink-600 border-ink-200',
    medium: 'bg-blue-50 text-blue-700 border-blue-200',
    high: 'bg-amber-50 text-amber-700 border-amber-200',
    urgent: 'bg-red-50 text-red-700 border-red-200',
  };
  return <span className={`chip border ${map[priority]} capitalize`}>{priority}</span>;
}

export function BadgeChip({ badgeId, size = 'md' }: { badgeId: string; size?: 'sm' | 'md' }) {
  const badge = BADGES.find((b) => b.id === badgeId);
  if (!badge) return null;
  const Icon = (Icons as any)[badge.icon] ?? Icons.Award;
  const sz = size === 'sm' ? 'text-[11px] px-2 py-0.5 gap-1' : 'text-xs px-2.5 py-1 gap-1.5';
  return (
    <span className={`chip border ${badge.color} ${sz}`}>
      <Icon size={size === 'sm' ? 11 : 13} />
      {badge.name}
    </span>
  );
}

export function BadgeIcon({ badge, size = 16 }: { badge: Badge; size?: number }) {
  const Icon = (Icons as any)[badge.icon] ?? Icons.Award;
  return <Icon size={size} />;
}

export function getBadge(id: string): Badge | undefined {
  return BADGES.find((b) => b.id === id);
}

export function DocStatusChip({ status }: { status: 'verified' | 'pending' | 'rejected' | 'missing' }) {
  const map = {
    verified: { label: 'Verified', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    pending: { label: 'Pending', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
    rejected: { label: 'Rejected', cls: 'bg-red-50 text-red-700 border-red-200' },
    missing: { label: 'Missing', cls: 'bg-ink-100 text-ink-500 border-ink-200' },
  } as const;
  const s = map[status];
  return <span className={`chip border ${s.cls}`}>{s.label}</span>;
}
