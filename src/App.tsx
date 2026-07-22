import { useState } from 'react';
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
  const [page, setPage] = useState<PageKey>('overview');

  if (!authed) return <LoginPage onLogin={() => setAuthed(true)} />;

  return (
    <DataProvider>
      <Shell page={page} onNavigate={setPage}>
        {page === 'overview' && <OverviewPage onNavigate={setPage} />}
        {page === 'verification' && <VerificationPage />}
        {page === 'farmers' && <FarmersPage onOpenFarmer={() => setPage('verification')} />}
        {page === 'badges' && <BadgesPage />}
        {page === 'support' && <SupportPage />}
        {page === 'reports' && <ReportsPage />}
        {page === 'settings' && <SettingsPage />}
      </Shell>
    </DataProvider>
  );
}

export default App;
