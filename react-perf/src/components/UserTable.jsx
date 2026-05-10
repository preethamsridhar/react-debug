import { useState, useMemo } from 'react';
import { searchUsers } from '../utils/perf';

// BUG: search runs on every render via searchUsers (O(n²) inner loop).
// BUG: No useMemo — result recomputed on any state change including unrelated ones.
// BUG: key={index} — row keys are positional, not stable.
export default function UserTable({ users }) {
  const [query, setQuery]   = useState('');
  const [sortCol, setSortCol] = useState('name');
  const [sortDir, setSortDir] = useState('asc');

  const filtered = searchUsers(users, query);

  const sorted = filtered.sort((a, b) => {
    const av = a[sortCol] ?? '';
    const bv = b[sortCol] ?? '';
    return sortDir === 'asc' ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
  });

  const handleSort = (col) => {
    if (col === sortCol) setSortDir((d) => d === 'asc' ? 'desc' : 'asc');
    else { setSortCol(col); setSortDir('asc'); }
  };

  const arrow = (col) => sortCol === col ? (sortDir === 'asc' ? ' ↑' : ' ↓') : '';

  return (
    <div className="user-table-wrapper">
      <div className="table-toolbar">
        <input
          className="search-input"
          placeholder="Search users…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <span className="table-count">{sorted.length} users</span>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            {['name','email','role','lastSeen'].map((col) => (
              <th key={col} onClick={() => handleSort(col)} style={{ cursor: 'pointer' }}>
                {col}{arrow(col)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((user, index) => (
            <tr key={index}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td><span className={`role-badge role-badge--${user.role}`}>{user.role}</span></td>
              <td>{new Date(user.lastSeen).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
