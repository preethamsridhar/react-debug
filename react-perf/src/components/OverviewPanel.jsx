import { useEffect, useState } from 'react';
import { simulateFetch, TENANTS, METRICS_BY_TENANT } from '../data/mockData';
import { fetchAllTenantSummaries, formatNumber, formatPercent } from '../utils/perf';
import { usePolling } from '../hooks/usePolling';

// BUG: fetchAllTenantSummaries fetches each tenant serially (N+1 waterfall).
//   With 8 tenants × ~300ms each = ~2400ms instead of a single parallel fetch.
// BUG: usePolling gets an inline arrow — stacking intervals on re-render.
// BUG: No cleanup / no abort — if the component unmounts mid-fetch the
//   setState calls happen on an unmounted component.
export default function OverviewPanel() {
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [lastRefresh, setLastRefresh] = useState(Date.now());

  const loadData = () => {
    setLoading(true);
    fetchAllTenantSummaries(
      TENANTS.map((t) => t.id),
      (id) => simulateFetch(TENANTS.find((t) => t.id === id), 300),
    ).then((tenants) => {
      const enriched = tenants.map((t) => ({
        ...t,
        metrics: METRICS_BY_TENANT[t.id] ?? {},
      }));
      setSummaries(enriched);
      setLoading(false);
      setLastRefresh(Date.now());
    });
  };

  useEffect(() => { loadData(); }, []);

  usePolling(() => loadData(), 30_000);

  if (loading && summaries.length === 0) {
    return <div className="detail-loading"><span className="spinner" />Loading all tenants…</div>;
  }

  return (
    <div className="overview-panel">
      <div className="overview-header">
        <h2 className="section-title">All Tenants — Overview</h2>
        <span className="refresh-hint">
          Last refresh: {new Date(lastRefresh).toLocaleTimeString()}
          {loading && ' (refreshing…)'}
        </span>
      </div>

      <div className="overview-grid">
        {summaries.map((tenant) => {
          const m = tenant.metrics;
          return (
            <div key={tenant.id} className="overview-card">
              {/* BUG: img no width/height, no loading=lazy */}
              <img src={tenant.logo} alt={tenant.name} className="overview-logo" />
              <div className="overview-card-body">
                <div className="overview-name">{tenant.name}</div>
                <span className={`plan-badge plan-badge--${tenant.plan}`}>{tenant.plan}</span>
                <div className="overview-stats">
                  <div className="stat"><span>MAU</span><strong>{formatNumber(m.mau ?? 0)}</strong></div>
                  <div className="stat"><span>API</span><strong>{formatNumber(m.apiCalls ?? 0)}</strong></div>
                  <div className="stat"><span>Err</span><strong className={m.errorRate > 0.02 ? 'stat--alert' : ''}>{formatPercent(m.errorRate ?? 0)}</strong></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
