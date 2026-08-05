import { useState } from 'react';
import { Sprout, Mail, Lock, ArrowRight, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // App.tsx onAuthStateChanged will handle the redirect
    } catch (err: any) {
      setError(err.message || 'Invalid email or password.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left brand panel */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-brand-700 via-brand-800 to-brand-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, white 1px, transparent 1px), radial-gradient(circle at 70% 60%, white 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
        <div className="relative">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center"><Sprout size={28} className="text-white" /></div>
            <div>
              <div className="font-display font-bold text-lg leading-none">AgriMarket</div>
              <div className="text-xs text-brand-200 tracking-wide uppercase mt-1">Admin Console</div>
            </div>
          </div>
        </div>
        <div className="relative">
          <h1 className="font-display text-4xl font-bold leading-tight text-balance">Trusted verification for a thriving agricultural marketplace.</h1>
          <p className="text-brand-100 mt-4 max-w-md leading-relaxed">Review farmer applications, assign trust badges, and resolve support tickets — all from one secure console built for daily operations.</p>
          <div className="flex items-center gap-6 mt-8">
            <div><div className="font-display text-2xl font-bold">2,400+</div><div className="text-xs text-brand-200">Farmers verified</div></div>
            <div className="w-px h-10 bg-white/20" />
            <div><div className="font-display text-2xl font-bold">98.6%</div><div className="text-xs text-brand-200">Approval accuracy</div></div>
            <div className="w-px h-10 bg-white/20" />
            <div><div className="font-display text-2xl font-bold">3.2h</div><div className="text-xs text-brand-200">Avg. response</div></div>
          </div>
        </div>
        <div className="relative flex items-center gap-2 text-sm text-brand-100">
          <ShieldCheck size={16} /> SOC 2 compliant · End-to-end encrypted admin access
        </div>
      </div>

      {/* Right form */}
      <div className="flex items-center justify-center p-6 sm:p-12 bg-ink-50">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="flex items-center justify-center"><Sprout size={24} className="text-brand-600" /></div>
            <div><div className="font-display font-bold text-ink-900">AgriMarket</div><div className="text-[11px] text-ink-500 uppercase tracking-wide">Admin Console</div></div>
          </div>

          <h2 className="font-display text-2xl font-bold text-ink-900">Sign in to your console</h2>
          <p className="text-sm text-ink-500 mt-1">Enter your admin credentials to continue.</p>

          <form onSubmit={submit} className="mt-8 space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
                {error}
              </div>
            )}
            <div>
              <label className="label">Email address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input pl-9" required />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="label !mb-0">Password</label>
                <button type="button" className="text-xs font-medium text-brand-600 hover:text-brand-700">Forgot?</button>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
                <input type={show ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="input pl-9 pr-9" required />
                <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600">
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm text-ink-600">
              <input type="checkbox" defaultChecked className="rounded border-ink-300 text-brand-600 focus:ring-brand-200" />
              Keep me signed in for 30 days
            </label>
            <button type="submit" disabled={loading} className="btn-primary w-full !py-2.5">
              {loading ? 'Signing in…' : <>Sign in <ArrowRight size={16} /></>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
