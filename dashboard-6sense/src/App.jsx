import { useState } from 'react';
import { AppProvider } from './context/AppContext';
import Dashboard from './components/Dashboard';
import UserList from './components/UserList';
import Analytics from './components/Analytics';
import ProductGrid from './components/ProductGrid';
import ShoppingCart from './components/ShoppingCart';
import DataTable from './components/DataTable';
import UserForm from './components/UserForm';
import Notifications from './components/Notifications';
import './index.css';

const TABS = ['Dashboard', 'Accounts', 'Analytics', 'Products', 'Quote', 'Live Feed', 'Add Lead'];

export default function App() {
  const [activeTab, setActiveTab] = useState('Dashboard');

  const handleLeadSubmit = (lead) => {
    console.log('New lead submitted:', lead);
    setActiveTab('Accounts');
  };

  return (
    <AppProvider>
      <div className="app">
        <header className="header">
          <div className="header-left">
            <span className="logo">⬡ 6sense CRM</span>
            <span className="tagline">Customer Intelligence Dashboard</span>
          </div>
          <Notifications />
        </header>

        <nav className="nav">
          {TABS.map((tab) => (
            <button
              key={tab}
              className={`nav-btn ${activeTab === tab ? 'nav-active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </nav>

        <main className="main">
          {activeTab === 'Dashboard'  && <Dashboard />}
          {activeTab === 'Accounts'   && <UserList />}
          {activeTab === 'Analytics'  && <Analytics />}
          {activeTab === 'Products'   && <ProductGrid />}
          {activeTab === 'Quote'      && <ShoppingCart />}
          {activeTab === 'Live Feed'  && <DataTable />}
          {activeTab === 'Add Lead'   && (
            <UserForm
              onSubmit={handleLeadSubmit}
              onCancel={() => setActiveTab('Dashboard')}
            />
          )}
        </main>
      </div>
    </AppProvider>
  );
}
