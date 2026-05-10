import { useState, useEffect } from 'react';
import { ANALYTICS_DATA, simulateFetch } from '../data/mockData';
import { groupBy } from '../utils/helpers';

export default function Analytics() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    simulateFetch(ANALYTICS_DATA, 700).then((rows) => {
      setData(rows);
      setLoading(false);
    });
  }, []);

  const byCategory = groupBy(data, 'category');
  const categories = ['All', ...Object.keys(byCategory)];

  const thisMonthData = data.filter((row) => {
    const d = new Date(row.date);
    const now = new Date();
    return d.getMonth() === now.getMonth();
  });

  const sortedByConversions = data.sort((a, b) => b.conversions - a.conversions);

  const filtered =
    selectedCategory === 'All'
      ? data
      : byCategory[selectedCategory] ?? [];

  const totalViews       = filtered.reduce((s, r) => s + r.pageViews, 0);
  const totalVisitors    = filtered.reduce((s, r) => s + r.uniqueVisitors, 0);
  const totalConversions = filtered.reduce((s, r) => s + r.conversions, 0);
  const conversionRate   = totalVisitors > 0
    ? ((totalConversions / totalVisitors) * 100).toFixed(2)
    : 0;

  return (
    <div className="panel">
      <div className="panel-header">
        <h2>Engagement Analytics</h2>
      </div>

      {loading ? (
        <div className="loading">Crunching numbers…</div>
      ) : (
        <>
          <div className="kpi-grid">
            <div className="kpi-card">
              <span className="kpi-label">Page Views</span>
              <span className="kpi-value">{totalViews.toLocaleString()}</span>
            </div>
            <div className="kpi-card">
              <span className="kpi-label">Unique Visitors</span>
              <span className="kpi-value">{totalVisitors.toLocaleString()}</span>
            </div>
            <div className="kpi-card">
              <span className="kpi-label">Conversions</span>
              <span className="kpi-value">{totalConversions.toLocaleString()}</span>
            </div>
            <div className="kpi-card">
              <span className="kpi-label">Conv. Rate</span>
              <span className="kpi-value">{conversionRate}%</span>
            </div>
          </div>

          {/* Category filter */}
          <div className="filter-row">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`btn ${selectedCategory === cat ? 'btn-primary' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="section-title">
            <h3>This Month's Signals</h3>
            <small>({thisMonthData.length} events)</small>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Page Views</th>
                <th>Visitors</th>
                <th>Conversions</th>
                <th>Region</th>
              </tr>
            </thead>
            <tbody>
              {thisMonthData.map((row) => (
                <tr key={row.date}>
                  <td>{row.date}</td>
                  <td>{row.pageViews.toLocaleString()}</td>
                  <td>{row.uniqueVisitors.toLocaleString()}</td>
                  <td>{row.conversions}</td>
                  <td>{row.region}</td>
                </tr>
              ))}
              {thisMonthData.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', color: '#999' }}>
                    No events this month
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="section-title">
            <h3>Top Performing Days (all time)</h3>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Date</th>
                <th>Conversions</th>
                <th>Visitors</th>
                <th>Category</th>
              </tr>
            </thead>
            <tbody>
              {sortedByConversions.slice(0, 5).map((row, i) => (
                <tr key={row.date}>
                  <td>#{i + 1}</td>
                  <td>{row.date}</td>
                  <td>{row.conversions}</td>
                  <td>{row.uniqueVisitors.toLocaleString()}</td>
                  <td>{row.category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
