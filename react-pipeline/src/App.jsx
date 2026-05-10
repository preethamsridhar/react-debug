import { useState } from "react";
import { PipelineProvider, usePipeline } from "./context/PipelineContext";
import PipelineBoard from "./components/PipelineBoard";
import RepLeaderboard from "./components/RepLeaderboard";
import ActivityFeed from "./components/ActivityFeed";
import ForecastChart from "./components/ForecastChart";
import DealForm from "./components/DealForm";
import { STAGES } from "./data/mockData";
import {
  calcWinRate,
  forecastRevenue,
  formatCurrency,
  formatPercent,
} from "./utils/pipeline";
import "./index.css";

const NAV_TABS = ["Pipeline", "Leaderboard", "Forecast", "Activity"];

function AppShell() {
  const [tab, setTab] = useState("Pipeline");
  const [showForm, setShowForm] = useState(false);
  const { deals, setDeals, stageFilter, setStageFilter } = usePipeline();

  const winRate = calcWinRate(deals);
  const forecast = forecastRevenue(deals);
  const totalValue = deals
    .filter((d) => !["Closed Won", "Closed Lost"].includes(d.stage))
    .reduce((s, d) => s + d.value, 0);

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-brand">
          <span className="app-logo">⬡</span>
          <span className="app-name">PipelineIQ</span>
        </div>
        <nav className="app-nav">
          {NAV_TABS.map((t) => (
            <button
              key={t}
              className={`nav-tab ${tab === t ? "nav-tab--active" : ""}`}
              onClick={() => setTab(t)}
            >
              {t}
            </button>
          ))}
        </nav>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          + New Deal
        </button>
      </header>

      <div className="kpi-bar">
        <div className="kpi-item">
          <span className="kpi-label">Open Pipeline</span>
          <span className="kpi-value">{formatCurrency(totalValue)}</span>
        </div>
        <div className="kpi-item">
          <span className="kpi-label">Win Rate</span>
          <span className="kpi-value">{formatPercent(winRate)}</span>
        </div>
        <div className="kpi-item">
          <span className="kpi-label">Weighted Forecast</span>
          <span className="kpi-value">{formatCurrency(forecast)}</span>
        </div>
        <div className="kpi-item">
          <span className="kpi-label">Total Deals</span>
          <span className="kpi-value">{deals.length}</span>
        </div>
      </div>

      {tab === "Pipeline" && (
        <div className="page-content">
          <div className="stage-filter-bar">
            {["All", ...STAGES].map((s) => (
              <button
                key={s}
                className={`filter-chip ${stageFilter === s ? "filter-chip--active" : ""}`}
                onClick={() => setStageFilter(s)}
              >
                {s}
              </button>
            ))}
          </div>
          <PipelineBoard />
        </div>
      )}

      {tab === "Leaderboard" && (
        <div className="page-content">
          <RepLeaderboard />
        </div>
      )}

      {tab === "Forecast" && (
        <div className="page-content">
          <ForecastChart />
        </div>
      )}

      {tab === "Activity" && (
        <div className="page-content">
          <ActivityFeed />
        </div>
      )}

      {showForm && <DealForm onClose={() => setShowForm(false)} />}
    </div>
  );
}

export default function App() {
  return (
    <PipelineProvider>
      <AppShell />
    </PipelineProvider>
  );
}
