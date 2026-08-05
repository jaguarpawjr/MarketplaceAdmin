import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { DataProvider } from './store';
import { Shell, type PageKey } from './components/Shell';
import { OverviewPage } from './pages/Overview';
import { VerificationPage } from './pages/Verification';
import { FarmersPage } from './pages/Farmers';
import { BadgesPage } from './pages/Badges';
import { SupportPage } from './pages/Support';
import { ReportsPage } from './pages/Reports';
import { SettingsPage } from './pages/Settings';
import { LoginPage } from './pages/Login';

function App() {
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState<PageKey>('overview');
  const [selectedFarmerId, setSelectedFarmerId] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setAuthed(!!user);
      setLoading(false);
    });
    return unsub;
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ink-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  if (!authed) return <LoginPage />;

  return (
    <DataProvider>
      <Shell page={page} onNavigate={setPage}>
        {page === 'overview' && <OverviewPage onNavigate={setPage} />}
        {page === 'verification' && <VerificationPage initialSelectedId={selectedFarmerId} onClearSelectedFarmer={() => setSelectedFarmerId(null)} />}
        {page === 'farmers' && <FarmersPage onOpenFarmer={(id) => { setSelectedFarmerId(id); setPage('verification'); }} />}
        {page === 'badges' && <BadgesPage />}
        {page === 'support' && <SupportPage />}
        {page === 'reports' && <ReportsPage />}
        {page === 'settings' && <SettingsPage />}
      </Shell>
    </DataProvider>
  );
}

export default App;
