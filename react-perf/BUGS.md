# react-perf — Bug Reference

**WorkspaceIQ** — multi-tenant SaaS admin portal. 22 intentional performance bugs spanning async patterns, main-thread blocking, memory leaks, layout shift, and React render inefficiencies.

---

## src/utils/perf.js

### BUG 1 — Heavy synchronous IIFE at module load time
**Location:** `perf.js`, top-level IIFE
**Bug:** A 200 000-iteration loop runs synchronously when the module is first imported, blocking the main thread before the app renders. This manifests as a long task in DevTools Performance tab.
```js
// buggy — runs at import time, blocks parse/paint
const _heavyInit = (() => {
  const lookup = new Map();
  for (let i = 0; i < 200_000; i++) { lookup.set(`key_${i}`, ...); }
  return lookup;
})();
// fix — lazy-initialize on first use, or move to a Web Worker
```

### BUG 2 — Memoization cache with no eviction (`_formatCache`)
**Location:** `perf.js`, `formatNumber`
**Bug:** `_formatCache` is a module-level `Map` that grows indefinitely. In a long-running SPA with many unique numeric values (API call counts, MAU, etc.) this is an unbounded memory leak.
```js
// fix — cap cache size or use an LRU:
if (_formatCache.size > 1000) _formatCache.clear();
```

### BUG 3 — Sequential `await` waterfall in `fetchTenantDashboardData`
**Location:** `perf.js`, `fetchTenantDashboardData`
**Bug:** Four independent fetches are `await`ed one after another. Total time = sum of all delays (~1 800 ms) instead of max (~600 ms).
```js
// buggy
const tenant  = await fetchers.fetchTenant(id);
const users   = await fetchers.fetchUsers(id);
const metrics = await fetchers.fetchMetrics(id);
const logs    = await fetchers.fetchLogs(id);

// fix
const [tenant, users, metrics, logs] = await Promise.all([
  fetchers.fetchTenant(id),
  fetchers.fetchUsers(id),
  fetchers.fetchMetrics(id),
  fetchers.fetchLogs(id),
]);
```

### BUG 4 — N+1 serial fetch in `fetchAllTenantSummaries`
**Location:** `perf.js`, `fetchAllTenantSummaries`
**Bug:** Iterates over tenant IDs with `for...of` + `await`, fetching each tenant sequentially. With 8 tenants × 300 ms = ~2 400 ms instead of 300 ms.
```js
// buggy
for (const id of tenantIds) {
  const t = await fetchTenant(id);
  results.push(t);
}

// fix
const results = await Promise.all(tenantIds.map(fetchTenant));
```

### BUG 5 — Unbounded event log accumulator
**Location:** `perf.js`, `recordEvent` / `eventLog`
**Bug:** `eventLog` is a module-level array that grows indefinitely with no max size, flush mechanism, or TTL. Memory usage increases monotonically for the lifetime of the session.
```js
// fix — trim or ring-buffer
if (eventLog.length > 500) eventLog.shift();
```

### BUG 6 — O(n²) search with pointless inner loop
**Location:** `perf.js`, `searchUsers`
**Bug:** For every user in `filter`, the callback contains an inner `for` loop scanning all users again. This is O(n²) and runs on every keystroke.
```js
// fix — remove the inner for loop; the filter predicate alone is O(n)
return users.filter((u) =>
  u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
);
```

### BUG 7 — Synchronous heavy computation on main thread in `computeUsageScore`
**Location:** `perf.js`, `computeUsageScore`
**Bug:** A 5 000 000-iteration loop runs synchronously in the render path (called directly in `TenantDetail` render), blocking the main thread and freezing the UI for ~100–500 ms per tenant switch.
```js
// fix — move to a Web Worker, or at minimum wrap in useMemo
// and remove the artificial loop; compute only the formula.
```

### BUG 8 — `Intl.DateTimeFormat` recreated inside every `map` call
**Location:** `perf.js`, `formatTimestamps`
**Bug:** `new Intl.DateTimeFormat(...)` is constructed inside `.map()`, creating a new formatter object for every log entry on every render. `Intl` constructors are expensive.
```js
// fix — hoist formatter outside the map
const fmt = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
return logs.map((log) => ({ ...log, formatted: fmt.format(new Date(log.ts)) }));
```

---

## src/hooks/useFetch.js

### BUG 9 — No AbortController (race condition on fast navigation)
**Location:** `useFetch.js`
**Bug:** If `tenantId` changes quickly (user clicks different tenants), multiple fetches run in parallel. Whichever resolves last wins and sets stale data. Additionally, if the component unmounts, `setState` is called on an unmounted component.
```js
// fix
useEffect(() => {
  const controller = new AbortController();
  fetchFn(controller.signal).then(...).catch(...);
  return () => controller.abort();
}, deps);
```

### BUG 10 — `fetchFn` in deps but callers pass non-memoized inline functions
**Location:** `useFetch.js` + call sites
**Bug:** The effect lists `deps` which callers populate with `[tenantId]`. But callers also pass `fetchFn` as an inline arrow function — if `fetchFn` were in deps, the effect would re-fire every render. As written, `fetchFn` is absent from deps (lint warning) and stale closures are possible.
```js
// fix — callers must wrap fetchFn in useCallback, then include it in deps
```

---

## src/hooks/usePolling.js

### BUG 11 — Interval stacks on every render (inline callback prop)
**Location:** `usePolling.js` + `MetricsPanel.jsx`, `OverviewPanel.jsx`
**Bug:** `usePolling` lists `[callback, delay]` as deps. Callers pass an inline arrow `() => setTick(n => n+1)` — a new reference on every render. Each render clears the old interval and registers a new one. Under frequent re-renders this can fire the callback far more often than `delay` ms.
```js
// fix — use useRef to hold the latest callback, keep effect deps as [delay] only
const callbackRef = useRef(callback);
useEffect(() => { callbackRef.current = callback; });
useEffect(() => {
  const id = setInterval(() => callbackRef.current(), delay);
  return () => clearInterval(id);
}, [delay]);
```

---

## src/hooks/useScrollShadow.js

### BUG 12 — `removeEventListener` with mismatched function reference
**Location:** `useScrollShadow.js`
**Bug:** The event listener is added as a named function expression `function onScroll() {...}`. The cleanup calls `removeEventListener('scroll', () => {})` — a completely different arrow function. The scroll listener is never removed → memory leak.
```js
// fix
el.addEventListener('scroll', onScroll);
return () => el.removeEventListener('scroll', onScroll);
```

### BUG 13 — Style mutation inside scroll handler (layout thrashing)
**Location:** `useScrollShadow.js`
**Bug:** `el.style.boxShadow = ...` is set synchronously inside the scroll callback with no `requestAnimationFrame`. This forces a style recalculation + paint on every scroll tick, causing jank at 60fps.
```js
// fix — batch with requestAnimationFrame
el.addEventListener('scroll', () => {
  requestAnimationFrame(() => {
    el.style.boxShadow = el.scrollTop > 0 ? '...' : 'none';
  });
});
```

---

## src/components/TenantSidebar.jsx

### BUG 14 — Inline style object recreated every render
**Location:** `TenantSidebar.jsx`, `itemStyle` inside `.map()`
**Bug:** `const itemStyle = { background: ..., borderLeft: ..., ... }` is a new object on every render for every item. This prevents any `React.memo` optimization downstream and increases GC pressure.
```js
// fix — use CSS classes with data attributes or CSS custom properties:
<li key={tenant.id} className={`tenant-item ${isSelected ? 'tenant-item--selected' : ''}`} ...>
```

### BUG 15 — Images without `width`/`height` and without `loading="lazy"`
**Location:** `TenantSidebar.jsx`, all `<img>` tags
**Bug:** All 8 tenant logos are eagerly fetched on mount. No `width`/`height` attributes means the browser can't reserve space → Cumulative Layout Shift (CLS). Should be `loading="lazy"` with explicit dimensions.
```jsx
// fix
<img src={tenant.logo} alt={tenant.name} width={32} height={32} loading="lazy" className="tenant-logo" />
```

---

## src/components/TenantDetail.jsx

### BUG 16 — Sequential fetch waterfall via `fetchTenantDashboardData`
**Location:** `TenantDetail.jsx`, `useEffect`
**Bug:** Delegates to `fetchTenantDashboardData` which `await`s four requests sequentially (Bug 3). Switching tenants takes ~1 800 ms instead of ~600 ms.

### BUG 17 — No AbortController on tenant switch
**Location:** `TenantDetail.jsx`, `useEffect`
**Bug:** Rapid tenant switching leaves stale in-flight promises. The last one to resolve writes its data regardless of which tenant is currently selected.
```js
// fix — see Bug 9 pattern
```

### BUG 18 — `computeUsageScore` called synchronously in render
**Location:** `TenantDetail.jsx`
**Bug:** `const score = computeUsageScore(metrics)` runs a 5M-iteration loop on the render thread every time the component renders (tab switches, any state update). Should be wrapped in `useMemo`.
```js
// fix
const score = useMemo(() => computeUsageScore(metrics), [metrics]);
// Long-term fix: move heavy computation to a Web Worker
```

---

## src/components/UserTable.jsx

### BUG 19 — `searchUsers` (O(n²)) not memoized, runs every render
**Location:** `UserTable.jsx`
**Bug:** `const filtered = searchUsers(users, query)` is called on every render — including re-renders caused by sort state changes unrelated to the query. The O(n²) inner loop (Bug 6) compounds this.
```js
// fix
const filtered = useMemo(() => searchUsers(users, query), [users, query]);
```

### BUG 20 — `key={index}` on table rows
**Location:** `UserTable.jsx`
**Bug:** Using the array index as `key` causes React to reuse stale DOM nodes when rows are reordered (e.g. sorting). Produces visual glitches and incorrect focus/animation state.
```jsx
// fix — use stable unique id
<tr key={user.id}>
```

---

## src/components/AssetGallery.jsx

### BUG 21 — Child-initiated waterfall fetch (data fetching too late)
**Location:** `AssetGallery.jsx`
**Bug:** `AssetGallery` fetches its own data inside `useEffect` after mounting. This creates a waterfall: parent renders → child mounts → child fetches → content appears. The data should be prefetched by the parent alongside the other tenant data.
```js
// fix — lift fetch to TenantDetail and pass assets as prop:
// <AssetGallery assets={data.assets} />
```

### BUG 22 — Images without `loading="lazy"`, `width`, or `height`
**Location:** `AssetGallery.jsx`
**Bug:** All 16 asset images are eagerly loaded with no dimensions. Results in: (a) 16 simultaneous image requests on tab open, (b) layout shift as images load in.
```jsx
// fix
<img src={asset.url} alt={asset.label} width={400} height={300} loading="lazy" className="asset-img" />
```

---

## src/components/MetricsPanel.jsx

### BUG 23 — `usePolling` passed inline arrow → stacking intervals
**Location:** `MetricsPanel.jsx`
**Bug:** `usePolling(() => setTick(...), 5000)` — the arrow function is a new reference on every render. The hook's `[callback, delay]` dep causes the interval to be replaced on each render. (See Bug 11.)

### BUG 24 — `formatTimestamps` called on every render with no memoization
**Location:** `MetricsPanel.jsx`
**Bug:** `const formattedLogs = formatTimestamps(logs)` runs on every render, including the tick-based re-renders from `usePolling`. `formatTimestamps` creates a new `Intl.DateTimeFormat` per log entry (Bug 8).
```js
// fix
const formattedLogs = useMemo(() => formatTimestamps(logs), [logs]);
```

---

## src/components/OverviewPanel.jsx

### BUG 25 — N+1 serial fetch via `fetchAllTenantSummaries` + no cleanup
**Location:** `OverviewPanel.jsx`
**Bug:** `loadData()` calls `fetchAllTenantSummaries` which serially awaits each tenant (Bug 4). Also called inside `usePolling` with an inline arrow (Bug 11 pattern). No AbortController for the initial fetch or polling calls.

---

## Summary Table

| # | File | Category | Description |
|---|------|----------|-------------|
| 1  | utils/perf.js             | Main Thread  | Heavy IIFE runs at module load time |
| 2  | utils/perf.js             | Memory Leak  | Unbounded memoization cache |
| 3  | utils/perf.js             | Async        | Sequential `await` waterfall (4 fetches ~1800ms) |
| 4  | utils/perf.js             | Async        | N+1 serial tenant fetch (~2400ms) |
| 5  | utils/perf.js             | Memory Leak  | Unbounded event log array |
| 6  | utils/perf.js             | Performance  | O(n²) search inner loop |
| 7  | utils/perf.js             | Main Thread  | 5M-iteration sync loop blocks render thread |
| 8  | utils/perf.js             | Performance  | `Intl.DateTimeFormat` recreated per map item |
| 9  | hooks/useFetch.js         | Race Cond.   | No AbortController → stale setState |
| 10 | hooks/useFetch.js         | Stale Closure| Non-memoized `fetchFn` causes stale deps |
| 11 | hooks/usePolling.js       | Performance  | Inline callback causes interval re-registration every render |
| 12 | hooks/useScrollShadow.js  | Memory Leak  | `removeEventListener` with wrong fn reference |
| 13 | hooks/useScrollShadow.js  | Paint Perf   | Style mutation in scroll handler without rAF |
| 14 | components/TenantSidebar  | Render Perf  | Inline style object new ref per render |
| 15 | components/TenantSidebar  | CLS / Network| Images without dimensions or lazy loading |
| 16 | components/TenantDetail   | Async        | Sequential fetch waterfall |
| 17 | components/TenantDetail   | Race Cond.   | No AbortController on tenant switch |
| 18 | components/TenantDetail   | Main Thread  | Sync heavy computation in render path |
| 19 | components/UserTable      | Render Perf  | O(n²) search not memoized, runs every render |
| 20 | components/UserTable      | Correctness  | `key={index}` on sorted rows |
| 21 | components/AssetGallery   | Async        | Child-initiated waterfall fetch |
| 22 | components/AssetGallery   | CLS / Network| Images without lazy loading or dimensions |
| 23 | components/MetricsPanel   | Performance  | Inline polling callback stacks intervals |
| 24 | components/MetricsPanel   | Render Perf  | `formatTimestamps` not memoized |
| 25 | components/OverviewPanel  | Async        | N+1 serial fetch + inline polling arrow |
