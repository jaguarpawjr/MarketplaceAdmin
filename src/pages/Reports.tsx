import { BarChart3, TrendingUp, Users, ClipboardCheck, LifeBuoy, Award, Download, Activity } from 'lucide-react';
import { useData } from '../store';
import { PageHeader } from '../components/ui';

export function ReportsPage() {
  const { farmers, tickets, auditLog } = useData();

  const byStatus = {
    pending: farmers.filter((f) => f.status === 'pending').length,
    approved: farmers.filter((f) => f.status === 'approved').length,
    rejected: farmers.filter((f) => f.status === 'rejected').length,
    suspended: farmers.filter((f) => f.status === 'suspended').length,
    incomplete: farmers.filter((f) => f.status === 'incomplete').length,
  };
  const total = farmers.length;
  const maxStatus = Math.max(...Object.values(byStatus));

  const ticketsByStatus = {
    open: tickets.filter((t) => t.status === 'open').length,
    pending: tickets.filter((t) => t.status === 'pending').length,
    resolved: tickets.filter((t) => t.status === 'resolved').length,
    escalated: tickets.filter((t) => t.status === 'escalated').length,
  };

  const topFarmers = farmers.filter((f) => f.totalSales > 0).sort((a, b) => b.totalSales - a.totalSales).slice(0, 5);
  const maxSales = Math.max(...topFarmers.map((f) => f.totalSales), 1);

  const actionsByType = auditLog.reduce((acc, e) => {
    acc[e.action] = (acc[e.action] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div>
      <PageHeader
        title="Reports"
        subtitle="Marketplace analytics and operational insights."
        actions={<button className="btn-secondary"><Download size={16} /> Export CSV</button>}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Farmer status breakdown */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-9 h-9 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center"><Users size={18} /></div>
            <h2 className="font-display font-bold text-ink-900">Farmer Status Breakdown</h2>
          </div>
          <div className="space-y-3">
            {Object.entries(byStatus).map(([key, val]) => (
              <div key={key}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-ink-600 capitalize">{key}</span>
                  <span className="font-semibold text-ink-900">{val} <span className="text-ink-400 font-normal">/ {total}</span></span>
                </div>
                <div className="h-2.5 bg-ink-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-brand-500 transition-all duration-500" style={{ width: `${(val / maxStatus) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ticket breakdown */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center"><LifeBuoy size={18} /></div>
            <h2 className="font-display font-bold text-ink-900">Support Ticket Status</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(ticketsByStatus).map(([key, val]) => (
              <div key={key} className="p-4 rounded-xl border border-ink-200">
                <div className="text-3xl font-display font-bold text-ink-900">{val}</div>
                <div className="text-xs text-ink-500 capitalize mt-0.5">{key}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top farmers by sales */}
      <div className="card p-5 mb-6">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-9 h-9 rounded-lg bg-sand-100 text-sand-500 flex items-center justify-center"><TrendingUp size={18} /></div>
          <h2 className="font-display font-bold text-ink-900">Top Farmers by Sales Volume</h2>
        </div>
        <div className="space-y-3">
          {topFarmers.map((f, i) => (
            <div key={f.id} className="flex items-center gap-3">
              <span className="text-sm font-bold text-ink-400 w-5">{i + 1}</span>
              <div className="w-9 h-9 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-semibold shrink-0">
                {f.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-ink-900 truncate">{f.name}</span>
                  <span className="text-sm font-semibold text-ink-700">{f.totalSales} sales</span>
                </div>
                <div className="h-2 bg-ink-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-600" style={{ width: `${(f.totalSales / maxSales) * 100}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Admin action summary */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-9 h-9 rounded-lg bg-ink-100 text-ink-600 flex items-center justify-center"><Activity size={18} /></div>
          <h2 className="font-display font-bold text-ink-900">Admin Actions Summary</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {Object.entries(actionsByType).map(([action, count]) => (
            <div key={action} className="p-3.5 rounded-xl border border-ink-200">
              <div className="text-2xl font-display font-bold text-ink-900">{count}</div>
              <div className="text-xs text-ink-500 mt-0.5">{action}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
