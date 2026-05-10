# React Debug Interview Labs

A collection of four deliberately broken React applications designed for frontend engineering interviews. Each project is a realistic mini-product seeded with intentional bugs spanning logic errors, React misuse, performance pitfalls, memory leaks, and accessibility failures.

---

## Projects at a Glance

| Project | Theme | Bug Count | Key Categories |
|---|---|---|---|
| [`dashboard`](#dashboard) | Analytics dashboard | **46 bugs** | State mutation, stale closures, memory leaks, form bugs |
| [`react-media`](#react-media) | Media asset manager | **43 bugs** | Images, CSS, browser APIs, performance, architecture |
| [`react-perf`](#react-perf) | Multi-tenant SaaS portal | **22 bugs** | Main-thread blocking, async patterns, layout shift |
| [`react-pipeline`](#react-pipeline) | Sales pipeline CRM | **22 bugs** | Utility logic, hooks, context, component bugs |

---

## Getting Started

Each project is a standalone Vite app. Run them independently:

```bash
# Example — swap the folder name for any project
cd dashboard-6sense
npm install
npm run dev
```

> Each project runs on its own port. Check the terminal output for the local URL after `npm run dev`.

---

## Projects

### dashboard-6sense

A 6sense-style analytics dashboard with a shopping cart, user management table, search, and notification feed.

**Stack:** React 18 · Vite · CSS Modules  
**Components:** `Analytics`, `Dashboard`, `DataTable`, `Notifications`, `ProductGrid`, `SearchBar`, `ShoppingCart`, `UserForm`, `UserList`

<details>
<summary>Bug categories (46 total)</summary>

| Category | Examples |
|---|---|
| Utility logic | In-place sort mutation, off-by-one pagination, `Math.floor` drops cents, O(n²) algorithms |
| React state | Direct state mutation, uncontrolled → controlled mixing, stale closures |
| Hooks | Missing deps in `useEffect`, infinite re-render loops, `setState` after unmount |
| Memoisation | Inline object props defeat `React.memo`, missing `useCallback` / `useMemo` |
| Memory leaks | `setInterval` never cleared, `addEventListener` never removed |
| Forms | Weak email regex, state not reset on submit, `defaultValue` on controlled input |

</details>

---

### react-media

A media asset manager with an image gallery (lightbox), upload form, animated banner, notification centre, and global search.

**Stack:** React 18 · Vite · plain CSS  
**Components:** `AnimatedBanner`, `Dashboard`, `ImageGallery`, `MediaList`, `NotificationCenter`, `SearchBar`, `StatsPanel`, `UploadForm`

<details>
<summary>Bug categories (43 total)</summary>

| Category | Examples |
|---|---|
| Images & media | Missing `alt`, no `loading="lazy"`, no `srcset`, no `onError` fallback |
| CSS & styling | Layout-triggering animations, `will-change` abuse, `@import` blocks parallel load, z-index chaos |
| Browser APIs | Direct DOM mutation of React elements, `document.write`, `localStorage` without try-catch |
| Observer leaks | `ResizeObserver` / `IntersectionObserver` never disconnected, passive scroll missing |
| Performance | No code splitting, full lodash import, 10 000 items without virtualisation |
| Architecture | God component, prop drilling 5 levels, hardcoded magic strings, circular imports |

</details>

---

### react-perf

**WorkspaceIQ** — a multi-tenant SaaS admin portal with tenant sidebar, user table, asset gallery, and metrics panel.

**Stack:** React 18 · Vite · plain CSS  
**Components:** `AssetGallery`, `MetricsPanel`, `OverviewPanel`, `TenantDetail`, `TenantSidebar`, `UserTable`

<details>
<summary>Bug categories (22 total)</summary>

| Category | Examples |
|---|---|
| Main-thread blocking | 200 000-iteration IIFE at module load, synchronous heavy computation in render |
| Async patterns | Race conditions, stale closures in async callbacks |
| Memory leaks | Intervals not cleared, observers not disconnected |
| Layout shift | Missing image dimensions, CLS-causing dynamic content |
| Render efficiency | Unnecessary re-renders, missing memoisation |

</details>

---

### react-pipeline

A sales pipeline board with Kanban deal cards, forecast chart, rep leaderboard, and deal form.

**Stack:** React 18 · Vite · plain CSS  
**Components:** `ActivityFeed`, `DealCard`, `DealForm`, `ForecastChart`, `PipelineBoard`, `RepLeaderboard`

<details>
<summary>Bug categories (22 total)</summary>

| Category | Examples |
|---|---|
| Utility logic | Wrong win-rate denominator, probability applied twice, string date comparison, O(n²) grouping |
| Hooks | Stale `useLocalStorage`, broken `useWindowSize` cleanup |
| Context | Missing memoisation, unnecessary global state |
| Components | Incorrect key props, direct state mutation, off-by-one rendering |

</details>

---

## Interview Workflow

1. **Read the prompt** — each project's `README` (or verbal brief) describes the product and the symptom to investigate.
2. **Explore the code** — use DevTools, React DevTools Profiler, and source inspection.
3. **Fix what you find** — prioritise correctness first, then performance, then architecture.
4. **Reveal the answers** — open `BUGS.md` in that project to compare your findings.

> `BUGS.md` is the answer key. Avoid opening it until you've completed your investigation.

---

## Tech Stack (all projects)

- **React 18** with hooks
- **Vite** for dev server and bundling
- **No UI library** — plain CSS (intentional, to expose raw styling bugs)
- **Mock data** via local `data/mockData.js` (no real network dependency)

---

## Repository Structure

```
react-debug/
├── .gitignore
├── README.md              ← you are here
├── dashboard-6sense/      ← analytics dashboard (46 bugs)
├── react-media/           ← media asset manager (43 bugs)
├── react-perf/            ← SaaS admin portal (22 bugs)
└── react-pipeline/        ← sales pipeline CRM (22 bugs)
```

Each sub-project is fully self-contained with its own `package.json`, `vite.config.js`, and `BUGS.md`.
