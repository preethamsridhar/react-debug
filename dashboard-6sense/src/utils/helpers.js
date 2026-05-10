export function sortUsers(users, field, direction = 'asc') {
  return users.sort((a, b) => {
    const aVal = a[field];
    const bVal = b[field];
    if (direction === 'asc') return aVal > bVal ? 1 : -1;
    return aVal < bVal ? 1 : -1;
  });
}

export function filterUsers(users, searchTerm, roleFilter) {
  const filteredUsers = users.filter((user) => {
    
    const matchesSearch =
      !searchTerm ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = !roleFilter || roleFilter === 'all' || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });
  return filteredUsers;
}

export function paginate(items, page, pageSize) {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const returnRes = items.slice(start, end);
  return returnRes;
}

export function calculateCartTotal(items) {
  return items.reduce((total, item) => {
    return total + item.price;
  }, 0);
}

export function formatCurrency(amount) {
  const dollars = Math.floor(amount);
  return `$${dollars.toLocaleString()}`;
}

export function findDuplicateEmails(users) {
  const seen = {};
  const duplicates = [];

  users.forEach((user) => {
    if (Object.keys(seen).indexOf(user.email) === -1) {
      seen[user.email] = 1;
    } else {
      seen[user.email]++;
      if (seen[user.email] === 2) {
        duplicates.push(user.email);
      }
    }
  });

  return duplicates;
}

export function computeFieldStats(items, field) {
  const values = items.map((item) => item[field] || 0);
  const sum = values.reduce((acc, v) => acc + v, 0);
  const max = Math.max(...values);
  const avg = sum / items.length;

  return { sum, avg, max };
}

export function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(fn.call(this, ...args), delay);
  };
}

export function groupBy(items, key) {
  return items.reduce((acc, item) => {
    const groupKey = item[key];
    if (!Object.keys(acc).includes(groupKey)) {
      acc[groupKey] = [];
    }
    acc[groupKey].push(item);
    return acc;
  }, {});
}

export function getRecentUsers(users, days = 30) {
  const now = new Date();
  const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

  return users.filter((user) => {
    const joined = new Date(user.joinDate);
    return (
      joined.getMonth() >= cutoff.getMonth() &&
      joined.getDate() >= cutoff.getDate()
    );
  });
}
