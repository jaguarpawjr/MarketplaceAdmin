import { useEffect, useState } from 'react';
import { Sprout, Mail, Lock, ArrowRight, ShieldCheck, Eye, EyeOff, Chrome } from 'lucide-react';
import {
  GoogleAuthProvider,
  isSignInWithEmailLink,
  sendPasswordResetEmail,
  sendSignInLinkToEmail,
  signInWithEmailAndPassword,
  signInWithEmailLink,
  signInWithPopup,
} from 'firebase/auth';
import { auth } from '../firebase';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [method, setMethod] = useState<'password' | 'link'>('password');

  useEffect(() => {
    if (!isSignInWithEmailLink(auth, window.location.href)) return;

    const storedEmail = window.localStorage.getItem('emailForSignIn');
    const confirmedEmail = storedEmail || window.prompt('Confirm your email address');
    if (!confirmedEmail) {
      setError('An email address is required to complete sign-in.');
      return;
    }

    setLoading(true);
    signInWithEmailLink(auth, confirmedEmail, window.location.href)
      .then(() => {
        window.localStorage.removeItem('emailForSignIn');
        window.history.replaceState({}, document.title, window.location.pathname);
      })
      .catch(() => setError('This sign-in link is invalid or has expired. Request a new link.'))
      .finally(() => setLoading(false));
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // App.tsx onAuthStateChanged will handle the redirect
    } catch (err: any) {
      const errors: Record<string, string> = {
        'auth/invalid-credential': 'Invalid email or password.',
        'auth/user-not-found': 'Invalid email or password.',
        'auth/wrong-password': 'Invalid email or password.',
        'auth/operation-not-allowed': 'Email/password sign-in is not enabled in Firebase Authentication.',
        'auth/invalid-api-key': 'Firebase is not configured correctly. Check the VITE_FIREBASE_API_KEY value.',
        'auth/internal-error': 'Firebase returned a server error. Verify the Firebase project configuration and enable Email/Password sign-in.',
        'auth/network-request-failed': 'Unable to reach Firebase. Check your connection and Firebase configuration.',
      };
      setError(errors[err.code] || 'Unable to sign in. Check the Firebase configuration and try again.');
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setError('');
    setMessage('');
    setLoading(true);
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (err: any) {
      const errors: Record<string, string> = {
        'auth/popup-closed-by-user': 'The Google sign-in window was closed.',
        'auth/operation-not-allowed': 'Google sign-in is not enabled in Firebase Authentication.',
        'auth/popup-blocked': 'Your browser blocked the Google sign-in window. Allow popups and try again.',
      };
      setError(errors[err.code] || 'Unable to sign in with Google. Check the Firebase configuration and try again.');
      setLoading(false);
    }
  };

  const sendEmailLink = async () => {
    setError('');
    setMessage('');
    if (!email) {
      setError('Enter your admin email address first.');
      return;
    }

    setLoading(true);
    try {
      await sendSignInLinkToEmail(auth, email, {
        url: window.location.origin,
        handleCodeInApp: true,
      });
      window.localStorage.setItem('emailForSignIn', email);
      setMessage('Check your inbox for a secure sign-in link.');
    } catch (err: any) {
      setError(err.code === 'auth/operation-not-allowed'
        ? 'Email-link sign-in is not enabled in Firebase Authentication.'
        : 'Unable to send a sign-in link. Check the address and try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    setError('');
    setMessage('');
    if (!email) {
      setError('Enter your admin email address first.');
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('If an account exists for this email, a password reset link has been sent.');
    } catch (err: any) {
      if (err.code === 'auth/invalid-email') {
        setError('Enter a valid admin email address.');
      } else {
        setError('Unable to send a reset email. Check the address and try again.');
      }
    } finally {
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

          <h2 className="font-display text-2xl font-bold text-ink-900">Welcome back</h2>
          <p className="text-sm text-ink-500 mt-1">Choose a secure way to access your admin console.</p>

          <form onSubmit={submit} className="mt-8 space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
                {error}
              </div>
            )}
            {message && (
              <div className="p-3 text-sm text-brand-700 bg-brand-50 border border-brand-200 rounded-lg">
                {message}
              </div>
            )}
            <button type="button" onClick={signInWithGoogle} disabled={loading} className="btn-secondary w-full !py-2.5">
              <Chrome size={17} /> Continue with Google
            </button>
            <div className="flex items-center gap-3 text-xs text-ink-400">
              <div className="h-px bg-ink-200 flex-1" /> OR <div className="h-px bg-ink-200 flex-1" />
            </div>
            <div className="flex rounded-lg bg-ink-100 p-1 text-sm">
              <button type="button" onClick={() => setMethod('password')} className={`flex-1 rounded-md px-3 py-2 font-medium ${method === 'password' ? 'bg-white text-ink-900 shadow-sm' : 'text-ink-500'}`}>Password</button>
              <button type="button" onClick={() => setMethod('link')} className={`flex-1 rounded-md px-3 py-2 font-medium ${method === 'link' ? 'bg-white text-ink-900 shadow-sm' : 'text-ink-500'}`}>Email link</button>
            </div>
            <div>
              <label className="label">Admin email address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input pl-9" required />
              </div>
            </div>
            {method === 'password' ? <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="label !mb-0">Password</label>
                <button type="button" onClick={resetPassword} disabled={loading} className="text-xs font-medium text-brand-600 hover:text-brand-700 disabled:opacity-50">Forgot?</button>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
                <input type={show ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="input pl-9 pr-9" required />
                <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600">
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div> : null}
            {method === 'password' ? <label className="flex items-center gap-2 text-sm text-ink-600">
              <input type="checkbox" defaultChecked className="rounded border-ink-300 text-brand-600 focus:ring-brand-200" />
              Keep me signed in for 30 days
            </label> : null}
            {method === 'password' ? <button type="submit" disabled={loading} className="btn-primary w-full !py-2.5">
              {loading ? 'Signing in…' : <>Sign in with password <ArrowRight size={16} /></>}
            </button> : <button type="button" onClick={sendEmailLink} disabled={loading} className="btn-primary w-full !py-2.5">
              {loading ? 'Sending link…' : <>Email me a sign-in link <ArrowRight size={16} /></>}
            </button>}
          </form>
        </div>
      </div>
    </div>
  );
}
