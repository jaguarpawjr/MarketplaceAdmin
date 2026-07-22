import { useState, useMemo } from 'react';
import { Users, MapPin, Star, ShoppingBag, Filter, ChevronRight } from 'lucide-react';
import { useData } from '../store';
import { StatusChip, BadgeChip } from '../components/chips';
import { PageHeader, SearchInput, EmptyState } from '../components/ui';
import type { VerificationStatus, Farmer } from '../types';

const FILTERS: { key: VerificationStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'approved', label: 'Approved' },
  { key: 'pending', label: 'Pending' },
  { key: 'suspended', label: 'Suspended' },
  { key: 'rejected', label: 'Rejected' },
  { key: 'incomplete', label: 'Incomplete' },
];

export function FarmersPage({ onOpenFarmer }: { onOpenFarmer: (id: string) => void }) {
  const { farmers } = useData();
  const [filter, setFilter] = useState<VerificationStatus | 'all'>('all');
  const [query, setQuery] = useState('');

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

  return (
    <div>
      <PageHeader title="Farmers" subtitle="All farmers on the marketplace, searchable and filterable." />

      <div className="card p-4 mb-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${filter === f.key ? 'bg-brand-600 text-white shadow-sm' : 'text-ink-600 hover:bg-ink-100'}`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="lg:ml-auto lg:w-72">
            <SearchInput value={query} onChange={setQuery} placeholder="Search farmers…" />
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card"><EmptyState icon={Users} title="No farmers found" description="Adjust your filters or search." /></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((f) => (
            <FarmerCard key={f.id} farmer={f} onOpen={() => onOpenFarmer(f.id)} />
          ))}
        </div>
      )}
    </div>
  );
}

function FarmerCard({ farmer, onOpen }: { farmer: Farmer; onOpen: () => void }) {
  return (
    <button onClick={onOpen} className="card card-hover p-5 text-left">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-11 h-11 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center text-sm font-semibold shrink-0">
            {farmer.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
          </div>
          <div className="min-w-0">
            <div className="font-display font-bold text-ink-900 truncate">{farmer.name}</div>
            <div className="text-xs text-ink-500 flex items-center gap-1 truncate"><MapPin size={11} /> {farmer.location}</div>
          </div>
        </div>
        <ChevronRight size={18} className="text-ink-300 shrink-0" />
      </div>

      <div className="flex items-center justify-between mb-3">
        <StatusChip status={farmer.status} />
        {farmer.rating > 0 && (
          <div className="flex items-center gap-1 text-xs font-bold text-amber-600">
            <Star size={13} className="fill-amber-400 text-amber-400" /> {farmer.rating}
          </div>
        )}
      </div>

      <div className="text-xs text-ink-500 mb-2">{farmer.farmType} · {farmer.farmSizeAcres} acres</div>
      <div className="flex flex-wrap gap-1.5 mb-3">
        {farmer.crops.slice(0, 3).map((c) => <span key={c} className="chip bg-ink-100 text-ink-700 text-[11px]">{c}</span>)}
        {farmer.crops.length > 3 && <span className="chip bg-ink-100 text-ink-500 text-[11px]">+{farmer.crops.length - 3}</span>}
      </div>

      {farmer.badges.length > 0 ? (
        <div className="flex flex-wrap gap-1.5 pt-3 border-t border-ink-100">
          {farmer.badges.slice(0, 4).map((b) => <BadgeChip key={b} badgeId={b} size="sm" />)}
        </div>
      ) : (
        <div className="pt-3 border-t border-ink-100 text-xs text-ink-400 flex items-center gap-1.5">
          <ShoppingBag size={12} /> {farmer.totalSales} sales
        </div>
      )}
    </button>
  );
}
