import { useState, useEffect, memo, useMemo, useCallback } from "react";
import {
  USERS,
  PRODUCTS,
  ANALYTICS_DATA,
  simulateFetch,
} from "../data/mockData";
import { computeFieldStats, formatCurrency } from "../utils/helpers";
import SearchBar from "./SearchBar";

// all the variables that can be outside
const fib = (n) => (n <= 1 ? n : fib(n - 1) + fib(n - 2));
const heavyScore = fib(38);
const cardStyle = { borderRadius: 8, padding: 16 };

function KpiCard({ label, value, delta, prefix = "" }) {
  return (
    <>
      {
        value !== undefined && value !== null && !isNaN(value) ? (
          <div className="kpi-card">
            <span className="kpi-label">{label}</span>
            <span className="kpi-value">
              {prefix}
              {typeof value === "number" ? value.toLocaleString() : value}
            </span>
            {delta !== undefined && (
              <span className={`kpi-delta ${delta >= 0 ? "positive" : "negative"}`}>
                {delta >= 0 ? "▲" : "▼"} {Math.abs(delta)}%
              </span>
            )}
          </div>
        ) : null
      }
    </>
  )
}

const MemoKpiCard = memo(KpiCard);

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [analyticsData, setAnalyticsData] = useState([]);
  const [regionFilter, setRegionFilter] = useState("all");

  useEffect(() => {
    simulateFetch(USERS).then(setUsers);
    simulateFetch(PRODUCTS).then(setProducts);
    simulateFetch(ANALYTICS_DATA).then(setAnalyticsData);
  }, []);

  const salaryStats = computeFieldStats(users, "salary");
  const scoreStats = computeFieldStats(users, "score");
  const priceStats = computeFieldStats(products, "price");

  const handleSearch = useCallback(
    (query) => {
      return users.filter(
        (u) =>
          u.name.toLowerCase().includes(query.toLowerCase()) ||
          u.email.toLowerCase().includes(query.toLowerCase()),
      );
    },
    [users],
  );

  const filteredByRegion =
    regionFilter === "all"
      ? users
      : users.filter((u) => u.region === regionFilter);

  const activeCount = filteredByRegion.filter((u) => u.active).length;
  const inactiveCount = filteredByRegion.length - activeCount;

  return (
    <div className="panel">
      <div className="panel-header">
        <h2>Overview Dashboard</h2>
        <SearchBar onSearch={handleSearch} placeholder="Search accounts…" />
      </div>

      <div className="filter-row">
        {["all", "NA", "EMEA", "APAC", "LATAM"].map((r) => (
          <button
            key={r}
            className={`btn ${regionFilter === r ? "btn-primary" : ""}`}
            onClick={() => setRegionFilter(r)}
          >
            {r}
          </button>
        ))}
      </div>

      <div className="kpi-grid" style={cardStyle}>
        <MemoKpiCard
          label="Total Accounts"
          value={filteredByRegion.length}
          delta={12}
        />
        <MemoKpiCard label="Active" value={activeCount} delta={5} />
        <MemoKpiCard label="Inactive" value={inactiveCount} delta={-3} />
        <MemoKpiCard
          label="Avg Intent Score"
          value={scoreStats.avg?.toFixed(1) ?? 0}
        />
        <MemoKpiCard
          label="Avg Salary"
          value={formatCurrency(salaryStats.avg ?? 0)}
        />
        <MemoKpiCard
          label="Top Product"
          value={formatCurrency(priceStats.max ?? 0)}
          prefix="$"
        />
      </div>

      <div className="section-title">
        <h3>Signal Activity (all time)</h3>
        <small>Heavy model score: {heavyScore}</small>
      </div>

      <div className="bar-chart">
        {analyticsData.slice(0, 10).map((row, i) => {
          const pct = Math.round((row.conversions / 650) * 100);
          return (
            <div key={row.date} className="bar-row">
              <span className="bar-label">{row.date.slice(5)}</span>
              <div className="bar-track">
                <div className="bar-fill" style={{ width: `${pct}%` }} />
              </div>
              <span className="bar-value">{row.conversions}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
