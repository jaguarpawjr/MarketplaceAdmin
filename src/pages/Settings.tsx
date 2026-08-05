import { useState } from 'react';
import { Settings, Shield, Bell, Users, Lock, Save, UserCog, Webhook, Database } from 'lucide-react';
import { ADMINS } from '../constants';
import { PageHeader } from '../components/ui';
import type { AdminRole } from '../types';

const TABS = [
  { key: 'profile', label: 'Profile', icon: UserCog },
  { key: 'team', label: 'Team & Roles', icon: Users },
  { key: 'security', label: 'Security', icon: Shield },
  { key: 'notifications', label: 'Notifications', icon: Bell },
  { key: 'integrations', label: 'Integrations', icon: Webhook },
] as const;

const roleColor: Record<AdminRole, string> = {
  'Super Admin': 'bg-brand-100 text-brand-700 border-brand-200',
  'Verification Officer': 'bg-blue-100 text-blue-700 border-blue-200',
  'Support Agent': 'bg-amber-100 text-amber-700 border-amber-200',
};

export function SettingsPage() {
  const [tab, setTab] = useState<typeof TABS[number]['key']>('profile');
  const [notif, setNotif] = useState({ newApplications: true, escalations: true, dailyDigest: false, weeklyReport: true });

  return (
    <div>
      <PageHeader title="Settings" subtitle="Manage your account, team, and platform configuration." />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Tabs */}
        <div className="lg:col-span-1">
          <div className="card p-2">
            {TABS.map((t) => {
              const Icon = t.icon;
              const active = tab === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`nav-item w-full ${active ? 'nav-item-active' : ''}`}
                >
                  <Icon size={17} /> {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {tab === 'profile' && (
            <div className="card p-6">
              <h2 className="font-display font-bold text-ink-900 mb-4">Your Profile</h2>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-brand-600 text-white flex items-center justify-center text-xl font-bold">AO</div>
                <div>
                  <div className="font-display font-bold text-ink-900">Amara Okafor</div>
                  <div className="text-sm text-ink-500">amara@agrimarket.io</div>
                  <span className={`chip border mt-1 ${roleColor['Super Admin']}`}>Super Admin</span>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className="label">Full name</label><input className="input" defaultValue="Amara Okafor" /></div>
                <div><label className="label">Email</label><input className="input" defaultValue="amara@agrimarket.io" /></div>
                <div><label className="label">Phone</label><input className="input" defaultValue="+234 803 000 0000" /></div>
                <div><label className="label">Timezone</label><select className="input"><option>WAT (UTC+1)</option><option>EAT (UTC+3)</option><option>SAST (UTC+2)</option></select></div>
              </div>
              <div className="flex justify-end mt-6"><button className="btn-primary"><Save size={16} /> Save changes</button></div>
            </div>
          )}

          {tab === 'team' && (
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-bold text-ink-900">Team & Roles</h2>
                <button className="btn-primary"><Users size={16} /> Invite member</button>
              </div>
              <div className="space-y-3">
                {ADMINS.map((a) => (
                  <div key={a.id} className="flex items-center justify-between p-4 rounded-xl border border-ink-200">
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-full ${a.avatarColor} text-white flex items-center justify-center text-sm font-semibold`}>{a.initials}</div>
                      <div>
                        <div className="font-semibold text-ink-900">{a.name}</div>
                        <div className="text-xs text-ink-500">{a.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`chip border ${roleColor[a.role]}`}>{a.role}</span>
                      <button className="btn-ghost !p-1.5"><Settings size={15} /></button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 rounded-xl bg-ink-50 border border-ink-100">
                <div className="text-sm font-semibold text-ink-800 mb-2">Role permissions</div>
                <ul className="text-xs text-ink-600 space-y-1.5">
                  <li><strong className="text-ink-800">Super Admin</strong> — full access: verify, suspend, manage badges, settings, audit log.</li>
                  <li><strong className="text-ink-800">Verification Officer</strong> — review and approve/reject farmer applications, add notes.</li>
                  <li><strong className="text-ink-800">Support Agent</strong> — handle support tickets, add internal notes, escalate.</li>
                </ul>
              </div>
            </div>
          )}

          {tab === 'security' && (
            <div className="card p-6">
              <h2 className="font-display font-bold text-ink-900 mb-4 flex items-center gap-2"><Lock size={18} /> Security</h2>
              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-ink-200">
                  <div className="font-semibold text-ink-900 text-sm">Password</div>
                  <p className="text-xs text-ink-500 mt-1 mb-3">Last changed 42 days ago. We recommend rotating every 90 days.</p>
                  <button className="btn-secondary !py-1.5 text-xs">Change password</button>
                </div>
                <div className="p-4 rounded-xl border border-ink-200 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-ink-900 text-sm">Two-factor authentication</div>
                    <p className="text-xs text-ink-500 mt-1">Add an extra layer of security to your account.</p>
                  </div>
                  <span className="chip bg-emerald-50 text-emerald-700 border border-emerald-200">Enabled</span>
                </div>
                <div className="p-4 rounded-xl border border-ink-200">
                  <div className="font-semibold text-ink-900 text-sm mb-2">Active sessions</div>
                  <div className="text-xs text-ink-600 space-y-1.5">
                    <div className="flex items-center justify-between"><span>Chrome · Lagos, NG</span><span className="text-emerald-600 font-medium">Current</span></div>
                    <div className="flex items-center justify-between"><span>Safari · Nairobi, KE</span><button className="text-red-600 font-medium">Revoke</button></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === 'notifications' && (
            <div className="card p-6">
              <h2 className="font-display font-bold text-ink-900 mb-4">Notifications</h2>
              <div className="space-y-3">
                {([
                  ['newApplications', 'New farmer applications', 'Get notified when a farmer submits verification.'],
                  ['escalations', 'Escalated tickets', 'Alerts when a support ticket is escalated.'],
                  ['dailyDigest', 'Daily digest', 'A summary of platform activity each morning.'],
                  ['weeklyReport', 'Weekly report', 'Performance report delivered every Monday.'],
                ] as const).map(([key, title, desc]) => (
                  <div key={key} className="flex items-center justify-between p-4 rounded-xl border border-ink-200">
                    <div>
                      <div className="font-semibold text-ink-900 text-sm">{title}</div>
                      <p className="text-xs text-ink-500 mt-0.5">{desc}</p>
                    </div>
                    <button
                      onClick={() => setNotif((n) => ({ ...n, [key]: !n[key] }))}
                      className={`relative w-11 h-6 rounded-full transition ${notif[key] ? 'bg-brand-600' : 'bg-ink-200'}`}
                    >
                      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition ${notif[key] ? 'translate-x-5' : ''}`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'integrations' && (
            <div className="card p-6">
              <h2 className="font-display font-bold text-ink-900 mb-4">Integrations</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {([
                  { name: 'Supabase', desc: 'Database & auth backend', connected: true },
                  { name: 'Stripe', desc: 'Payments & payouts', connected: false },
                  { name: 'Twilio SMS', desc: 'Farmer SMS notifications', connected: false },
                  { name: 'S3 Storage', desc: 'Document & photo storage', connected: true },
                ] as const).map(({ name, desc, connected }) => {
                  return (
                    <div key={name} className="p-4 rounded-xl border border-ink-200 flex items-center gap-3">
                      <div className="flex items-center justify-center text-ink-600"><Database size={20} /></div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-ink-900">{name}</div>
                        <div className="text-xs text-ink-500">{desc}</div>
                      </div>
                      {connected ? (
                        <span className="chip bg-emerald-50 text-emerald-700 border border-emerald-200">Connected</span>
                      ) : (
                        <button className="btn-secondary !py-1.5 !px-3 text-xs">Connect</button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
