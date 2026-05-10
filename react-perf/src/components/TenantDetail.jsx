import { useEffect, useState } from "react";
import {
  simulateFetch,
  USERS_BY_TENANT,
  METRICS_BY_TENANT,
  AUDIT_LOGS_BY_TENANT,
  TENANTS,
} from "../data/mockData";
import {
  fetchTenantDashboardData,
  computeUsageScore,
  formatNumber,
  formatPercent,
} from "../utils/perf";
import UserTable from "./UserTable";
import AssetGallery from "./AssetGallery";
import MetricsPanel from "./MetricsPanel";

const fetchers = {
  fetchTenant: (id) =>
    simulateFetch(TENANTS.find((t) => t.id === id) ?? null, 300),
  fetchUsers: (id) => simulateFetch(USERS_BY_TENANT[id] ?? [], 500),
  fetchMetrics: (id) => simulateFetch(METRICS_BY_TENANT[id] ?? {}, 400),
  fetchLogs: (id) => simulateFetch(AUDIT_LOGS_BY_TENANT[id] ?? [], 600),
};

// BUG: fetchTenantDashboardData uses sequential awaits internally —
// total load time ≈ 300+500+400+600 = 1800ms instead of max(600) = 600ms.
// BUG: No AbortController — switching tenants quickly stacks in-flight fetches.
export default function TenantDetail({ tenantId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("overview");

  useEffect(() => {
    setLoading(true);
    setData(null);
    fetchTenantDashboardData(tenantId, fetchers).then((d) => {
      setData(d);
      setLoading(false);
    });
  }, [tenantId]);

  if (loading)
    return (
      <div className="detail-loading">
        <span className="spinner" />
        Loading tenant…
      </div>
    );
  if (!data) return <div className="detail-empty">No data</div>;

  const { tenant, users, metrics, logs } = data;

  // BUG: computeUsageScore blocks main thread — called synchronously in render
  const score = computeUsageScore(metrics);

  return (
    <div className="tenant-detail">
      <div className="detail-header">
        {/* BUG: No width/height on img → layout shift */}
        <img src={tenant.logo} alt={tenant.name} className="detail-logo" />
        <div className="detail-title-block">
          <h1 className="detail-name">{tenant.name}</h1>
          <div className="detail-meta">
            <span className={`plan-badge plan-badge--${tenant.plan}`}>
              {tenant.plan}
            </span>
            <span className="detail-region">{tenant.region}</span>
            <span className="detail-seats">{tenant.seats} seats</span>
          </div>
        </div>
        <div className="usage-score">
          <span className="usage-score__label">Usage Score</span>
          <span className="usage-score__value">{formatNumber(score)}</span>
        </div>
      </div>

      <div className="detail-tabs">
        {["overview", "users", "assets", "audit"].map((t) => (
          <button
            key={t}
            className={`detail-tab ${tab === t ? "detail-tab--active" : ""}`}
            onClick={() => setTab(t)}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {tab === "overview" && <MetricsPanel metrics={metrics} logs={logs} />}
      {tab === "users" && <UserTable users={users} />}
      {tab === "assets" && <AssetGallery tenantId={tenantId} />}
      {tab === "audit" && (
        <div className="audit-log">
          <table className="data-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Action</th>
                <th>User</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td>{new Date(log.ts).toLocaleString()}</td>
                  <td>
                    <span className="action-badge">{log.action}</span>
                  </td>
                  <td>{log.userId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
