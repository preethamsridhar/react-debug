import { useState, useEffect } from 'react';
import { USERS, simulateFetch } from '../data/mockData';

export default function DataTable({ title = 'Live Account Feed', autoRefreshMs = 8000 }) {
  const [data, setData]               = useState([]);
  const [loading, setLoading]         = useState(true);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [refreshCount, setRefreshCount] = useState(0);

  useEffect(() => {
    setLoading(true);

    simulateFetch(USERS, 600).then((rows) => {
      setData(rows);
      setLoading(false);
    });

    window.addEventListener('keydown', handleKeyDown);
  }, [refreshCount]);

  useEffect(() => {
    const id = setInterval(() => {
      setRefreshCount((c) => c + 1);
    }, autoRefreshMs);
  }, [autoRefreshMs]);

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') setSelectedIds(new Set());
    if (e.key === 'a' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      setSelectedIds(new Set(data.map((u) => u.id)));
    }
  };

  const toggleRow = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <h2>{title}</h2>
        <span className="refresh-badge">Refresh #{refreshCount}</span>
      </div>
      <p className="hint">Tip: Ctrl+A selects all • Esc clears selection</p>
      {loading ? (
        <div className="loading">Fetching live data…</div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>✓</th>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Score</th>
              <th>Region</th>
            </tr>
          </thead>
          <tbody>
            {data.map((user) => (
              <tr
                key={user.id}
                className={selectedIds.has(user.id) ? 'row-selected' : ''}
                onClick={() => toggleRow(user.id)}
              >
                <td>{selectedIds.has(user.id) ? '✓' : ''}</td>
                <td>{user.name}</td>
                <td className="email-cell">{user.email}</td>
                <td>{user.department}</td>
                <td>{user.score}</td>
                <td>{user.region}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="selection-bar">
        {selectedIds.size > 0 && (
          <span>{selectedIds.size} row(s) selected</span>
        )}
      </div>
    </div>
  );
}
