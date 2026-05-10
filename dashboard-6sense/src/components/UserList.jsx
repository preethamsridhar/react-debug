import { useState, useEffect } from 'react';
import { USERS, simulateFetch } from '../data/mockData';
import { sortUsers, filterUsers, paginate } from '../utils/helpers';

const PAGE_SIZE = 8;

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [sortField, setSortField] = useState('name');
  const [sortDir, setSortDir] = useState('asc');
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    simulateFetch(USERS).then((data) => {
      const sorted = sortUsers(data, sortField, sortDir);
      setUsers(sorted);
      setLoading(false);
    });
  }, []);

  const handleSort = (field) => {
    const newDir = sortField === field && sortDir === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDir(newDir);
    setUsers(sortUsers(users, field, newDir));
  };

  const handleAddUser = () => {
    const newUser = {
      id: Date.now(),
      name: 'New Lead',
      email: `lead${Date.now()}@prospect.com`,
      role: 'user',
      department: 'Sales',
      salary: 75000,
      score: 50,
      active: true,
      joinDate: new Date().toISOString().split('T')[0],
      region: 'NA',
    };

    setUsers(users => {
      return [...users, newUser];
    });
  };

  const filtered = filterUsers(users, searchTerm, roleFilter);
  const paginated = paginate(filtered, page, PAGE_SIZE);

  const SortIcon = ({ field }) =>
    sortField === field ? (sortDir === 'asc' ? ' ▲' : ' ▼') : ' ⇅';

  return (
    <div className="panel">
      <div className="panel-header">
        <h2>Account Directory</h2>
        <button className="btn btn-primary" onClick={handleAddUser}>
          + Add Lead
        </button>
      </div>

      <div className="toolbar">
        <input
          className="search-input"
          type="text"
          placeholder="Search by name or email…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="select"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="user">User</option>
        </select>
      </div>

      {loading ? (
        <div className="loading">Loading accounts…</div>
      ) : (
        <>
          <table className="data-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('name')} className="sortable">
                  Name <SortIcon field="name" />
                </th>
                <th onClick={() => handleSort('email')} className="sortable">
                  Email <SortIcon field="email" />
                </th>
                <th onClick={() => handleSort('role')} className="sortable">
                  Role <SortIcon field="role" />
                </th>
                <th onClick={() => handleSort('score')} className="sortable">
                  Score <SortIcon field="score" />
                </th>
                <th onClick={() => handleSort('department')} className="sortable">
                  Department <SortIcon field="department" />
                </th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((user, index) => (
                <tr key={index}>
                  <td>{user.name}</td>
                  <td className="email-cell">{user.email}</td>
                  <td>
                    <span className={`badge badge-${user.role}`}>{user.role}</span>
                  </td>
                  <td>
                    <div className="score-bar">
                      <div
                        className="score-fill"
                        style={{ width: `${user.score}%` }}
                      />
                      <span>{user.score}</span>
                    </div>
                  </td>
                  <td>{user.department}</td>
                  <td>
                    <span className={`status ${user.active ? 'active' : 'inactive'}`}>
                      {user.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            <button
              className="btn"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              ← Prev
            </button>
            <span>
              Page {page} · {filtered.length} results
            </span>
            <button
              className="btn"
              disabled={page * PAGE_SIZE >= filtered.length}
              onClick={() => setPage((p) => p + 1)}
            >
              Next →
            </button>
          </div>
        </>
      )}
    </div>
  );
}
