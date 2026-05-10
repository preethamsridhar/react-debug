import { useState } from 'react';
import TenantSidebar from './components/TenantSidebar';
import TenantDetail from './components/TenantDetail';
import OverviewPanel from './components/OverviewPanel';
import './index.css';

export default function App() {
  const [selectedTenantId, setSelectedTenantId] = useState(null);

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-brand">
          <span className="app-logo">◈</span>
          <span className="app-name">WorkspaceIQ</span>
        </div>
        <nav className="app-nav">
          <span className="nav-item nav-item--active">Admin Portal</span>
          <span className="nav-item">Billing</span>
          <span className="nav-item">Settings</span>
        </nav>
        <div className="app-user">
          <span className="user-avatar">OP</span>
          <span className="user-label">Ops Team</span>
        </div>
      </header>

      <div className="app-body">
        <TenantSidebar
          selectedId={selectedTenantId}
          onSelect={setSelectedTenantId}
        />

        <main className="main-content">
          {selectedTenantId
            ? <TenantDetail tenantId={selectedTenantId} />
            : <OverviewPanel />
          }
        </main>
      </div>
    </div>
  );
}
