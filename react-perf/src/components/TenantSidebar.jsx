import { useState } from 'react';
import { TENANTS } from '../data/mockData';

// BUG: Inline style object `{ boxShadow, ... }` is recreated on every render,
// preventing React from bailing out on child reconciliation even with React.memo.
export default function TenantSidebar({ selectedId, onSelect }) {
  const [filter, setFilter] = useState('all');

  const plans = ['all', 'enterprise', 'growth', 'starter'];

  const filtered = filter === 'all'
    ? TENANTS
    : TENANTS.filter((t) => t.plan === filter);

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <span className="sidebar-title">Tenants</span>
        <span className="sidebar-count">{filtered.length}</span>
      </div>

      <div className="filter-tabs">
        {plans.map((p) => (
          <button
            key={p}
            className={`filter-tab ${filter === p ? 'filter-tab--active' : ''}`}
            onClick={() => setFilter(p)}
          >
            {p}
          </button>
        ))}
      </div>

      <ul className="tenant-list">
        {filtered.map((tenant) => {
          const isSelected = tenant.id === selectedId;
          // BUG: style object with dynamic values — new object reference every render
          const itemStyle = {
            background:  isSelected ? '#1d3557' : 'transparent',
            borderLeft:  isSelected ? '3px solid #3b82f6' : '3px solid transparent',
            cursor:      'pointer',
            padding:     '10px 14px',
            display:     'flex',
            alignItems:  'center',
            gap:         '10px',
            transition:  'background 0.15s',
          };

          return (
            <li key={tenant.id} style={itemStyle} onClick={() => onSelect(tenant.id)}>
              {/* BUG: img has no width/height — causes layout shift (CLS) */}
              {/* BUG: no loading="lazy" — all 8 images eagerly fetched on mount */}
              <img src={tenant.logo} alt={tenant.name} className="tenant-logo" />
              <div className="tenant-info">
                <span className="tenant-name">{tenant.name}</span>
                <span className={`plan-badge plan-badge--${tenant.plan}`}>{tenant.plan}</span>
              </div>
              <span className="tenant-seats">{tenant.seats} seats</span>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
