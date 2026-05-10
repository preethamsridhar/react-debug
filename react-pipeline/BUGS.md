# react-pipeline — Bug Reference

Sales Pipeline & Deal Management app. 22 intentional bugs across utilities, hooks, context, and components.

---

## src/utils/pipeline.js

### BUG 1 — `calcWinRate`: wrong denominator
**Location:** `calcWinRate(deals)`
**Bug:** Divides closed-won count by `deals.length` (all deals), not just closed deals.
```js
// buggy
return won / deals.length;
// correct
const closed = deals.filter(d => ['Closed Won','Closed Lost'].includes(d.stage));
return closed.length > 0 ? won / closed.length : 0;
```

### BUG 2 — `forecastRevenue`: probability applied twice
**Location:** `forecastRevenue(deals)`
**Bug:** `deal.value * prob * prob` squares the probability, massively underweighting every stage.
```js
// buggy
return sum + deal.value * prob * prob;
// correct
return sum + deal.value * prob;
```

### BUG 3 — `getDealAge`: string date not converted
**Location:** `getDealAge(deal)`
**Bug:** `Date.now() - deal.createdAt` — `deal.createdAt` is an ISO string; subtracting a string from a number coerces it to `NaN`. All deal ages show as `NaN`.
```js
// buggy
const ageMs = Date.now() - deal.createdAt;
// correct
const ageMs = Date.now() - new Date(deal.createdAt).getTime();
```

### BUG 4 — `sortDeals`: numeric sort via string comparison
**Location:** `sortDeals(deals, field, direction)`
**Bug:** `String(a[field]) > String(b[field])` — lexicographic comparison means `"9" > "10"` is `true`, so numeric fields like `value` sort incorrectly.
```js
// buggy
const aStr = String(a[field]); const bStr = String(b[field]);
// correct — compare numerics numerically
if (typeof a[field] === 'number') return direction === 'asc' ? a[field] - b[field] : b[field] - a[field];
```

### BUG 5 — `groupDealsByStage`: O(n²) from full object copy every iteration
**Location:** `groupDealsByStage(deals)`
**Bug:** `Object.assign({}, acc)` inside the `reduce` callback copies the entire accumulator object on every iteration → O(n²) allocations for large deal lists.
```js
// buggy
const next = Object.assign({}, acc);
// correct — mutate acc in place (it's reduce's private accumulator)
if (!acc[key]) acc[key] = [];
acc[key].push(deal);
return acc;
```

### BUG 6 — `buildForecastBars`: running total never resets (cumulative sum)
**Location:** `buildForecastBars(deals)`
**Bug:** `runningTotal` accumulates across all stages, so each bar shows a cumulative sum rather than the value for that stage alone.
```js
// buggy
let runningTotal = 0;
return stages.map((stage) => { ... runningTotal += value; return { stage, value: runningTotal }; });
// correct — remove runningTotal, return per-stage value
return stages.map((stage) => { const value = ...; return { stage, value, count }; });
```

---

## src/context/PipelineContext.jsx

### BUG 7 — `setSelectedDeal` missing from context value
**Location:** `PipelineContext.jsx`, `value` object
**Bug:** `setSelectedDeal` is declared as state but omitted from the context value. Components that call `usePipeline().setSelectedDeal(...)` will get `undefined` and throw.
```js
// buggy value object
const value = { deals, setDeals, reps, activities, setActivities, selectedDeal, stageFilter, setStageFilter };
// correct — add setSelectedDeal
const value = { ..., selectedDeal, setSelectedDeal, ... };
```

---

## src/hooks/useLocalStorage.js

### BUG 8 — `JSON.parse` without try/catch
**Location:** `useLocalStorage.js`
**Bug:** If localStorage contains a corrupted or non-JSON value, `JSON.parse` throws a `SyntaxError` and crashes the app. Should be wrapped in try/catch.
```js
// buggy
const parsed = stored ? JSON.parse(stored) : initialValue;
// correct
let parsed = initialValue;
try { if (stored) parsed = JSON.parse(stored); } catch {}
```

### BUG 9 — `localStorage.setItem` called during render
**Location:** `useLocalStorage.js`
**Bug:** `localStorage.setItem(key, JSON.stringify(value))` is executed directly in the hook body (i.e. during the render phase). This is a side effect that should be inside a `useEffect`.
```js
// buggy — runs every render
localStorage.setItem(key, JSON.stringify(value));
// correct
useEffect(() => { localStorage.setItem(key, JSON.stringify(value)); }, [key, value]);
```

---

## src/hooks/useWindowSize.js

### BUG 10 — `removeEventListener` with mismatched function reference
**Location:** `useWindowSize.js`
**Bug:** The cleanup calls `removeEventListener('resize', () => handleResize())` — a new arrow function that is a different reference from the one added. The original listener is never removed, causing a memory leak.
```js
// buggy
return () => window.removeEventListener('resize', () => handleResize());
// correct
return () => window.removeEventListener('resize', handleResize);
```

---

## src/components/PipelineBoard.jsx

### BUG 11 — Stage totals `useEffect` has empty deps
**Location:** `PipelineBoard.jsx`
**Bug:** `useEffect(() => { ... setStageTotals(...) }, [])` only runs once on mount. When deals change (e.g. a deal is moved to a different stage), the totals displayed in the toolbar never update.
```js
// buggy
}, []);
// correct
}, [deals]);
```

### BUG 12 — Search filter not memoized
**Location:** `PipelineBoard.jsx`
**Bug:** `filterByStage` + `.filter(...)` runs on every render regardless of whether `deals`, `stageFilter`, or `search` actually changed. Should be wrapped in `useMemo`.
```js
// buggy — in render body
const visibleDeals = filterByStage(deals, stageFilter).filter(...);
// correct
const visibleDeals = useMemo(() => filterByStage(deals, stageFilter).filter(...), [deals, stageFilter, search]);
```

### BUG 13 — `handleDrop` mutates deals array in place
**Location:** `PipelineBoard.jsx`, `handleDrop`
**Bug:** `deals[idx] = { ...deals[idx], stage: targetStage }` mutates the existing array before spreading it. React may not detect the change correctly; the mutation also bypasses any referential checks.
```js
// buggy
deals[idx] = { ...deals[idx], stage: targetStage };
setDeals([...deals]);
// correct
setDeals((prev) => prev.map((d) => d.id === dealId ? { ...d, stage: targetStage } : d));
```

---

## src/components/DealCard.jsx

### BUG 14 — `formatDate` defined inside component (new ref every render)
**Location:** `DealCard.jsx`
**Bug:** `const formatDate = (dateStr) => {...}` is recreated on every render. It should be defined outside the component or memoized.
```js
// move outside component
function formatDate(dateStr) { ... }
```

### BUG 15 — Deal age shown in raw milliseconds
**Location:** `DealCard.jsx`
**Bug:** `const ageMs = new Date() - new Date(deal.createdAt)` gives milliseconds, but the UI renders it as `{ageDays}d old`. The variable is misnamed and never divided by `86_400_000`.
```js
// buggy
const ageMs = new Date() - new Date(deal.createdAt);
const ageDays = ageMs;                          // still milliseconds!
// correct
const ageDays = Math.floor((Date.now() - new Date(deal.createdAt).getTime()) / 86_400_000);
```

---

## src/components/RepLeaderboard.jsx

### BUG 16 — O(n²): deals re-filtered per rep inside render
**Location:** `RepLeaderboard.jsx`
**Bug:** `ranked` uses `calcRepStats` which already calls `deals.filter(d => d.repId === rep.id)` for each rep. Then, inside the `.map()` for the table rows, `deals.filter(d => d.repId === rep.id)` is called **again** per row — quadratic work.
```js
// buggy — double filter per rep
const repDealsLocal = deals.filter((d) => d.repId === rep.id);
// correct — use the already-computed repDeals from ranked
const { repDeals } = ranked[idx]; // or compute a Map once
```

### BUG 17 — `.sort()` mutates the `deals` prop
**Location:** `RepLeaderboard.jsx`
**Bug:** `const sorted = deals.sort((a, b) => b.value - a.value)` sorts in place, mutating the array that came from context. Other components reading `deals` will see an unexpectedly reordered array.
```js
// buggy
const sorted = deals.sort((a, b) => b.value - a.value);
// correct
const sorted = [...deals].sort((a, b) => b.value - a.value);
```

---

## src/components/ActivityFeed.jsx

### BUG 18 — `removeEventListener` with wrapped arrow function
**Location:** `ActivityFeed.jsx`
**Bug:** The cleanup does `containerRef.current?.removeEventListener('scroll', () => handleScroll())`. The arrow wrapper is a different function reference from what was added, so the scroll listener is never removed — memory leak.
```js
// buggy
return () => { containerRef.current?.removeEventListener('scroll', () => handleScroll()); };
// correct
return () => { containerRef.current?.removeEventListener('scroll', handleScroll); };
```

---

## src/components/DealForm.jsx

### BUG 19 — Form state not reset when `initialDeal` prop changes
**Location:** `DealForm.jsx`
**Bug:** `useState(initialDeal ?? EMPTY_DEAL)` only uses the initial value on first mount. If the parent renders `<DealForm initialDeal={differentDeal} />`, the form still shows the previous deal's data.
```js
// fix — add useEffect to sync prop
useEffect(() => { setForm(initialDeal ?? EMPTY_DEAL); }, [initialDeal]);
```

### BUG 20 — `parseInt` without radix
**Location:** `DealForm.jsx`, `handleValueChange`
**Bug:** `parseInt(e.target.value)` without a radix argument. Although usually fine with numeric inputs, it can misparse strings starting with `0` as octal in older engines. Best practice requires explicit base 10.
```js
// buggy
const raw = parseInt(e.target.value);
// correct
const raw = parseInt(e.target.value, 10);
```

### BUG 21 — No double-submit prevention
**Location:** `DealForm.jsx`, `handleSubmit`
**Bug:** The `submitting` flag is set to `true` and the button is disabled, but the form's `onSubmit` handler is not guarded. If a user submits via keyboard (Enter) before the state update propagates, `handleSubmit` can fire a second time, creating duplicate deals.
```js
// fix — guard at top of handler
if (submitting) return;
```

---

## src/components/ForecastChart.jsx

### BUG 22 — Division by zero in `closeRate`
**Location:** `ForecastChart.jsx`
**Bug:** `const closeRate = wonDeals.length / closedDeals.length`. When there are no closed deals, this is `0 / 0 = NaN`. The UI shows `'N/A'` for `isNaN(closeRate)` which partially masks it, but `Infinity` occurs when `wonDeals > 0` and `closedDeals.length === 0`.
```js
// correct
const closeRate = closedDeals.length > 0 ? wonDeals.length / closedDeals.length : 0;
```

---

## Summary Table

| # | File | Category | Description |
|---|------|----------|-------------|
| 1 | utils/pipeline.js | Logic | `calcWinRate` wrong denominator |
| 2 | utils/pipeline.js | Logic | `forecastRevenue` probability squared |
| 3 | utils/pipeline.js | Type Coercion | `getDealAge` string not converted to Date |
| 4 | utils/pipeline.js | Logic | `sortDeals` numeric sorted as strings |
| 5 | utils/pipeline.js | Performance | `groupDealsByStage` O(n²) object copy |
| 6 | utils/pipeline.js | Logic | `buildForecastBars` cumulative sum instead of per-stage |
| 7 | context/PipelineContext.jsx | State | `setSelectedDeal` missing from context value |
| 8 | hooks/useLocalStorage.js | Error Handling | `JSON.parse` without try/catch |
| 9 | hooks/useLocalStorage.js | Side Effect | `localStorage.setItem` in render body |
| 10 | hooks/useWindowSize.js | Memory Leak | `removeEventListener` wrong function ref |
| 11 | components/PipelineBoard.jsx | Stale State | Stage totals `useEffect` deps `[]` never updates |
| 12 | components/PipelineBoard.jsx | Performance | Search filter not memoized |
| 13 | components/PipelineBoard.jsx | Mutation | `handleDrop` mutates deals array |
| 14 | components/DealCard.jsx | Performance | `formatDate` defined inside component |
| 15 | components/DealCard.jsx | Logic | Deal age in milliseconds not days |
| 16 | components/RepLeaderboard.jsx | Performance | O(n²) double-filter per rep in render |
| 17 | components/RepLeaderboard.jsx | Mutation | `.sort()` mutates deals from context |
| 18 | components/ActivityFeed.jsx | Memory Leak | `removeEventListener` wrapped arrow fn |
| 19 | components/DealForm.jsx | Stale State | Form not reset when `initialDeal` prop changes |
| 20 | components/DealForm.jsx | Best Practice | `parseInt` without radix |
| 21 | components/DealForm.jsx | Logic | No double-submit guard |
| 22 | components/ForecastChart.jsx | Logic | Division by zero in `closeRate` |
