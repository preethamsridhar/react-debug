import { usePipeline } from '../context/PipelineContext';
import { buildForecastBars, formatCurrency } from '../utils/pipeline';

const BAR_MAX_HEIGHT = 180;

export default function ForecastChart() {
  const { deals } = usePipeline();

  const closedDeals = deals.filter((d) => ['Closed Won', 'Closed Lost'].includes(d.stage));
  const wonDeals    = deals.filter((d) => d.stage === 'Closed Won');
  const closeRate   = wonDeals.length / closedDeals.length;

  const bars = buildForecastBars(deals);
  const maxValue = Math.max(...bars.map((b) => b.value), 1);

  const totalForecast = bars.reduce((s, b) => s + b.value, 0);

  return (
    <div className="forecast-chart">
      <div className="forecast-header">
        <h2 className="section-title">Revenue Forecast</h2>
        <div className="forecast-kpis">
          <div className="kpi-chip">
            <span className="kpi-label">Close Rate</span>
            <span className="kpi-value">{isNaN(closeRate) ? 'N/A' : (closeRate * 100).toFixed(1) + '%'}</span>
          </div>
          <div className="kpi-chip">
            <span className="kpi-label">Pipeline Value</span>
            <span className="kpi-value">{formatCurrency(totalForecast)}</span>
          </div>
          <div className="kpi-chip">
            <span className="kpi-label">Active Stages</span>
            <span className="kpi-value">{bars.filter((b) => b.count > 0).length}</span>
          </div>
        </div>
      </div>

      <div className="bar-chart">
        {bars.map((bar) => {
          const heightPct = bar.value / maxValue;
          const barHeight = Math.max(heightPct * BAR_MAX_HEIGHT, 4);
          return (
            <div key={bar.stage} className="bar-col">
              <div className="bar-value-label">{formatCurrency(bar.value)}</div>
              <div
                className="bar"
                style={{ height: `${barHeight}px` }}
                title={`${bar.stage}: ${formatCurrency(bar.value)} (${bar.count} deals)`}
              />
              <div className="bar-label">{bar.stage.split(' ')[0]}</div>
              <div className="bar-count">{bar.count} deals</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
