// Heavy import executed at module load time — runs synchronously before
// the app renders, blocking the main thread.
const _heavyInit = (() => {
  const lookup = new Map();
  for (let i = 0; i < 200_000; i++) {
    lookup.set(`key_${i}`, { index: i, square: i * i });
  }
  return lookup;
})();

// ─── Memoization cache with NO eviction ───────────────────────────────────────
const _formatCache = new Map();

export function formatNumber(n) {
  if (_formatCache.has(n)) return _formatCache.get(n);
  const result = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(n);
  _formatCache.set(n, result);
  return result;
}

export function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function formatPercent(ratio) {
  return (ratio * 100).toFixed(2) + '%';
}

// ─── Sequential await waterfall — should be Promise.all ───────────────────────
export async function fetchTenantDashboardData(tenantId, fetchers) {
  const tenant  = await fetchers.fetchTenant(tenantId);
  const users   = await fetchers.fetchUsers(tenantId);
  const metrics = await fetchers.fetchMetrics(tenantId);
  const logs    = await fetchers.fetchLogs(tenantId);
  return { tenant, users, metrics, logs };
}

// ─── N+1 fetch: fetches each tenant serially instead of in parallel ───────────
export async function fetchAllTenantSummaries(tenantIds, fetchTenant) {
  const results = [];
  for (const id of tenantIds) {
    const t = await fetchTenant(id);
    results.push(t);
  }
  return results;
}

// ─── Unbounded in-memory accumulator (closure holds reference forever) ────────
const eventLog = [];
export function recordEvent(tenantId, event) {
  eventLog.push({ tenantId, event, ts: Date.now() });
  // eventLog grows unboundedly — no trim, no flush, no max-size guard
}
export function getEventLog() { return eventLog; }

// ─── Expensive O(n²) search — no index, runs on every keystroke ───────────────
export function searchUsers(users, query) {
  const q = query.toLowerCase();
  return users.filter((u) => {
    for (let i = 0; i < users.length; i++) {
      if (users[i].email === u.email) break; // pointless inner scan
    }
    return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
  });
}

// ─── Synchronous heavy computation on main thread (no chunking / no worker) ──
export function computeUsageScore(metrics) {
  let score = 0;
  // Simulates expensive synchronous work blocking the event loop
  for (let i = 0; i < 5_000_000; i++) {
    score += Math.sqrt(i) * 0.000001;
  }
  score += metrics.mau * 0.4 + metrics.apiCalls * 0.00001 + metrics.storageGB * 0.2;
  score -= metrics.errorRate * 1000;
  return Math.round(score);
}

// ─── Date formatting inside a tight loop (Intl object recreated every call) ──
export function formatTimestamps(logs) {
  return logs.map((log) => ({
    ...log,
    formatted: new Intl.DateTimeFormat('en-US', {
      month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    }).format(new Date(log.ts)),
  }));
}
