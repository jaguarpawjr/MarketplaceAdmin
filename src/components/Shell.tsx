import { useState } from 'react';
import {
  LayoutDashboard, ClipboardCheck, Users, Award, LifeBuoy, BarChart3, Settings,
  Sprout, Search, Bell, ChevronDown, Menu, X, LogOut, ShieldCheck,
} from 'lucide-react';
import { CURRENT_ADMIN } from '../constants';

export type PageKey = 'overview' | 'verification' | 'farmers' | 'badges' | 'support' | 'reports' | 'settings';

const NAV: { key: PageKey; label: string; icon: any; badge?: number }[] = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard },
  { key: 'verification', label: 'Farmer Verification', icon: ClipboardCheck, badge: 3 },
  { key: 'farmers', label: 'Farmers', icon: Users },
  { key: 'badges', label: 'Badges', icon: Award },
  { key: 'support', label: 'Support', icon: LifeBuoy, badge: 4 },
  { key: 'reports', label: 'Reports', icon: BarChart3 },
  { key: 'settings', label: 'Settings', icon: Settings },
];

interface ShellProps {
  page: PageKey;
  onNavigate: (p: PageKey) => void;
  children: React.ReactNode;
}

export function Shell({ page, onNavigate, children }: ShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const SidebarContent = (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2.5 px-5 h-16 border-b border-ink-200">
        <div className="flex items-center justify-center">
          <Sprout size={24} className="text-brand-600" />
        </div>
        <div>
          <div className="font-display font-bold text-ink-900 leading-none">AgriMarket</div>
          <div className="text-[11px] text-ink-500 font-medium tracking-wide uppercase">Admin Console</div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold text-ink-400 uppercase tracking-wider">Workspace</div>
        {NAV.map((item) => {
          const active = page === item.key;
          const Icon = item.icon;
          return (
            <button
              key={item.key}
              onClick={() => { onNavigate(item.key); setMobileOpen(false); }}
              className={`nav-item w-full ${active ? 'nav-item-active' : ''}`}
            >
              <Icon size={18} />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge ? (
                <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full ${active ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-700'}`}>
                  {item.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </nav>

      <div className="p-3 border-t border-ink-200">
        <div className="rounded-xl bg-gradient-to-br from-brand-50 to-sand-50 border border-brand-100 p-3.5">
          <div className="flex items-center gap-2 mb-1.5">
            <ShieldCheck size={15} className="text-brand-600" />
            <span className="text-xs font-bold text-brand-800">Trust & Safety</span>
          </div>
          <p className="text-[11px] text-ink-600 leading-relaxed">Review every farmer before they can list produce. Verify documents carefully.</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-ink-50 flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-ink-200 shrink-0 flex-col">
        {SidebarContent}
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-ink-950/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-72 bg-white border-r border-ink-200 flex flex-col animate-slide-in">
            <button className="absolute top-4 right-4 p-1.5 rounded-lg text-ink-400 hover:bg-ink-100" onClick={() => setMobileOpen(false)}>
              <X size={20} />
            </button>
            {SidebarContent}
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-ink-200 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30">
          <div className="flex items-center gap-3 flex-1">
            <button className="lg:hidden p-2 rounded-lg text-ink-500 hover:bg-ink-100" onClick={() => setMobileOpen(true)}>
              <Menu size={20} />
            </button>
            <div className="relative max-w-md w-full hidden sm:block">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
              <input
                type="text"
                placeholder="Search farmers, tickets, badges…"
                className="w-full pl-9 pr-3 py-2 text-sm bg-ink-50 border border-ink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-200 focus:bg-white focus:border-brand-400 transition"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button className="relative p-2 rounded-lg text-ink-500 hover:bg-ink-100 transition">
              <Bell size={19} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
            </button>
            <div className="relative">
              <button
                onClick={() => setProfileOpen((o) => !o)}
                className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl hover:bg-ink-100 transition"
              >
                <div className={`${CURRENT_ADMIN.avatarColor} w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold text-white`}>
                  {CURRENT_ADMIN.initials}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-sm font-semibold text-ink-900 leading-none">{CURRENT_ADMIN.name}</div>
                  <div className="text-[11px] text-ink-500 mt-0.5">{CURRENT_ADMIN.role}</div>
                </div>
                <ChevronDown size={16} className="text-ink-400 hidden sm:block" />
              </button>
              {profileOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-pop border border-ink-200 py-1.5 z-20 animate-scale-in">
                    <div className="px-3 py-2 border-b border-ink-100">
                      <div className="text-sm font-semibold text-ink-900">{CURRENT_ADMIN.name}</div>
                      <div className="text-xs text-ink-500">{CURRENT_ADMIN.email}</div>
                    </div>
                    <button className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-ink-600 hover:bg-ink-50 transition">
                      <Settings size={16} /> Account settings
                    </button>
                    <button className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition">
                      <LogOut size={16} /> Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1400px] w-full mx-auto animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}
