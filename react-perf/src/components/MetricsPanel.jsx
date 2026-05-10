import { useRef, useState } from 'react';
import { usePolling } from '../hooks/usePolling';
import { useScrollShadow } from '../hooks/useScrollShadow';
import { formatNumber, formatPercent, formatTimestamps } from '../utils/perf';

// BUG: usePolling receives an inline arrow function — new reference every render —
//   so the interval is cleared and re-created on every render, stacking intervals.
// BUG: formatTimestamps creates a new Intl.DateTimeFormat inside every map iteration.
// BUG: useScrollShadow adds a scroll listener but cleanup removes a different fn ref.
export default function MetricsPanel({ metrics, logs }) {
  const [tick, setTick] = useState(0);
  const panelRef = useRef(null);
  const shadowed = useScrollShadow(panelRef);

  usePolling(() => setTick((n) => n + 1), 5000);

  const formattedLogs = formatTimestamps(logs);

  const kpis = [
    { label: 'MAU',          value: formatNumber(metrics.mau),      accent: false },
    { label: 'API Calls',    value: formatNumber(metrics.apiCalls), accent: false },
    { label: 'Storage',      value: `${metrics.storageGB} GB`,      accent: false },
    { label: 'Error Rate',   value: formatPercent(metrics.errorRate), accent: metrics.errorRate > 0.02 },
    { label: 'p99 Latency',  value: `${metrics.p99LatencyMs} ms`,   accent: metrics.p99LatencyMs > 400 },
  ];

  return (
    <div className={`metrics-panel ${shadowed ? 'metrics-panel--shadowed' : ''}`} ref={panelRef}>
      <div className="kpi-grid">
        {kpis.map((kpi) => (
          <div key={kpi.label} className={`kpi-card ${kpi.accent ? 'kpi-card--alert' : ''}`}>
            <span className="kpi-label">{kpi.label}</span>
            <span className="kpi-value">{kpi.value}</span>
          </div>
        ))}
      </div>

      <h3 className="panel-subtitle">Recent Activity</h3>
      <div className="log-list">
        {formattedLogs.slice(0, 10).map((log) => (
          <div key={log.id} className="log-item">
            <span className="log-time">{log.formatted}</span>
            <span className="action-badge">{log.action}</span>
            <span className="log-user">{log.userId}</span>
          </div>
        ))}
        {formattedLogs.length === 0 && <p className="empty-state">No recent activity.</p>}
      </div>

      <p className="refresh-hint">Auto-refreshes every 5s (tick: {tick})</p>
    </div>
  );
}

