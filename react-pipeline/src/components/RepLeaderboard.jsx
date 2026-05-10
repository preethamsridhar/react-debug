import { usePipeline } from '../context/PipelineContext';
import { calcRepStats, formatCurrency, formatPercent } from '../utils/pipeline';

export default function RepLeaderboard() {
  const { reps, deals } = usePipeline();

  const ranked = reps
    .map((rep) => ({ rep, ...calcRepStats(rep, deals) }))
    .sort((a, b) => b.revenue - a.revenue);

  const sorted = deals.sort((a, b) => b.value - a.value);
  const topDeals = sorted.slice(0, 5);

  return (
    <div className="leaderboard">
      <h2 className="section-title">Rep Leaderboard</h2>

      <table className="lb-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Region</th>
            <th>Revenue</th>
            <th>Win Rate</th>
            <th>Quota Att.</th>
            <th>Open Deals</th>
          </tr>
        </thead>
        <tbody>
          {ranked.map(({ rep, revenue, winRate, attainment, repDeals }, idx) => {
            const repDealsLocal = deals.filter((d) => d.repId === rep.id);
            const openDeals = repDealsLocal.filter(
              (d) => !['Closed Won', 'Closed Lost'].includes(d.stage)
            ).length;
            return (
              <tr key={rep.id}>
                <td>#{idx + 1}</td>
                <td>{rep.name}</td>
                <td>{rep.region}</td>
                <td>{formatCurrency(revenue)}</td>
                <td>{formatPercent(winRate)}</td>
                <td>
                  <span className={attainment >= 1 ? 'badge badge--green' : 'badge badge--orange'}>
                    {formatPercent(attainment)}
                  </span>
                </td>
                <td>{openDeals}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <h3 className="section-subtitle">Top Deals</h3>
      <div className="top-deals">
        {topDeals.map((deal) => (
          <div key={deal.id} className="top-deal-chip">
            <span className="top-deal-company">{deal.company}</span>
            <span className="top-deal-value">{formatCurrency(deal.value)}</span>
            <span className="top-deal-stage">{deal.stage}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
