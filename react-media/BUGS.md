# Bug Registry — react-media

This file documents every intentional bug planted in the codebase.
Use it **after** you have attempted to find and fix the bugs on your own.

Bug count: **43 bugs** across 7 categories.

---

## Images & Media

### 1. Missing `alt` text — `ImageGallery.jsx` (`GalleryItem`)
Both the gallery card `<img>` and the lightbox `<img>` have no `alt` attribute.
Screen readers announce "image" with no context; search engines get no signal.
**Fix:** `<img alt={item.description || item.name} …/>`

### 2. No explicit `width` / `height` on images — `ImageGallery.jsx`
Without intrinsic dimensions the browser renders images as 0×0 and then jumps
when they load, causing **Cumulative Layout Shift (CLS)** — a Core Web Vitals failure.
**Fix:** Add `width={200} height={150}` (or use `aspect-ratio` in CSS).

### 3. No `loading="lazy"` — `ImageGallery.jsx`
Every `<img>` in the gallery loads immediately, even items far below the fold.
On the "Gallery" view (200 items) this fires 200 image requests on page load.
**Fix:** `<img loading="lazy" …/>`

### 4. Wrong image format — `mockData.js`, `ImageGallery.jsx`
Images are served as JPG/PNG (`format: 'PNG'` in mockData; `.png` extension).
WebP is ~30% smaller at equivalent quality; AVIF ~50% smaller.
**Fix:** Encode assets to WebP/AVIF; serve via `<picture>` with format negotiation.

### 5. No `srcset` / `sizes` — `ImageGallery.jsx`
A full 800×600 px image is downloaded and displayed in a 200 px card.
On a 2× display this wastes 4× the pixels actually rendered.
**Fix:**
```jsx
<img
  src={item.thumbnail}
  srcSet={`${item.thumbnail} 400w, ${item.url} 800w`}
  sizes="(max-width: 600px) 200px, 400px"
  …
/>
```

### 6. No CDN for images — `mockData.js`
All images point to `picsum.photos` — a third-party origin, not a CDN the app controls.
No cache headers, no geographic distribution, no image transformation pipeline.
**Fix:** Upload assets to Cloudflare Images, AWS CloudFront, or similar.

### 7. Unoptimised inline SVG — `App.jsx`
The logo SVG contains an unnecessary `xmlns:xlink`, redundant nested `<g>` wrappers,
and a fully transparent duplicate `<path>` (`opacity="0"`).
**Fix:** Run through `svgo`; remove unused attributes and duplicate paths.

### 8. Background image in CSS instead of `<img>` — `index.css`, `ImageGallery.jsx`
`.gallery-hero { background-image: url(…) }` — CSS background images:
- Cannot be lazy-loaded by the browser.
- Are invisible to LCP measurement.
- Cannot have `alt` text (accessibility failure).
**Fix:** Replace with `<img loading="lazy" src="…" alt="Gallery hero" width="1200" height="400" />`

### 9. No `onError` fallback — `ImageGallery.jsx`
Both the gallery card and lightbox `<img>` have no `onError` handler.
If the network request fails the browser shows a broken-image icon.
**Fix:** `<img onError={e => { e.currentTarget.src = '/placeholder.webp' }} …/>`

### 10. Images in list without memoisation — `ImageGallery.jsx`
`GalleryItem` is not wrapped in `React.memo`. Every time the parent re-renders
(e.g. lightbox state changes) all 200 items re-render, forcing the browser to
re-evaluate each `<img>` src and potentially re-decode images from cache.
**Fix:** `export default React.memo(GalleryItem, (prev, next) => prev.item.id === next.item.id && prev.isSelected === next.isSelected)`

---

## CSS & Styling

### 11. `@import` blocks parallel CSS loading — `index.css`
`@import url('…Roboto+Mono…')` at the top of the stylesheet forces the browser
to fully download `index.css` before it can discover and start the font download.
**Fix:** Move the font `<link>` tag to `index.html` so it loads in parallel.

### 12. No `box-sizing: border-box` — `index.css`
The global reset is missing `*, *::before, *::after { box-sizing: border-box }`.
`.form-input { width: 100%; padding: 10px 12px }` overflows its container because
padding is added on top of `width: 100%`.

### 13. No CSS custom properties — `index.css`
Every colour (`#4f46e5`, `#1a1a2e`, `#6b7280`, …) and spacing value is hardcoded.
The same value appears in 20+ rules, making global theming require a search-and-replace.
**Fix:** Define `--color-primary`, `--color-text-muted`, `--spacing-md`, etc. at `:root`.

### 14. Specificity wars with `!important` — `index.css`
`.btn.btn-secondary`, `.btn-danger`, `.stat-card.highlight`, `.stat-card.warning`,
`.stat-card.danger` all use `!important` to override parent rules.
**Fix:** Restructure selectors so specificity resolves correctly without `!important`.

### 15. Animating layout-triggering CSS properties — `index.css`, `AnimatedBanner.jsx`
- `@keyframes expandHeight` animates `height` → triggers layout every frame.
- `@keyframes slideInText` animates `left` and `width` → triggers layout every frame.
- Progress bar width set via JS state → triggers layout every `setInterval` tick.
**Fix:** Use `transform: scaleY()` / `transform: translateX()` / `transform: scaleX()`.

### 16. Overusing `will-change` — `index.css`
`.gallery-item { will-change: transform }` promotes every gallery card to its own GPU
compositing layer. With 200 cards this can exhaust device VRAM.
`.banner { will-change: transform, opacity, height, width }` promotes the banner
even when it is not animating.
**Fix:** Apply `will-change` only on `:hover` (or via JS just before animation starts),
and remove it once the animation ends.

### 17. Hardcoded `px` for font sizes — `index.css`
`font-size: 16px`, `font-size: 14px`, `font-size: 28px`, etc. ignore the user's
browser font size preference. If a user sets their browser default to 20px, the
site still renders at 14px.
**Fix:** Use `rem` units: `1rem`, `0.875rem`, `1.75rem`.

### 18. No `prefers-reduced-motion` check — `index.css`, `AnimatedBanner.jsx`
The banner expand/slide animations and the JS ticker animation all run unconditionally.
Users who enable "Reduce Motion" in macOS/Windows accessibility settings still see them.
**Fix:**
```css
@media (prefers-reduced-motion: no-preference) {
  .banner { animation: expandHeight 0.5s ease-out; }
}
```

### 19. Z-index chaos — `index.css`, `ImageGallery.jsx`, `SearchBar.jsx`
Multiple arbitrary z-index values with no defined scale:
`9999` (header) → `88888` (search dropdown) → `99999` (notification bell) →
`999999` (notification dropdown) → `99999999` (lightbox).
Any new modal now needs a higher value, leading to an arms race.
**Fix:** Define a z-index scale as CSS variables:
```css
:root {
  --z-sticky:  100;
  --z-dropdown: 200;
  --z-modal:   300;
}
```

### 20. Global class names colliding — `index.css`
`.btn`, `.card`, `.title`, `.form-input`, `.form-label` are global names that will
clash with any third-party library (e.g. Bootstrap, Ant Design) or a component that
happens to use the same name.
**Fix:** Use CSS Modules, BEM naming (`mv-btn`, `mv-card`), or styled-components.

### 21. Unused CSS shipped to client — `index.css`
The bottom section of `index.css` contains ~30 rules prefixed with `.legacy-` and
`.v1-` that are referenced nowhere in the component tree but are still included in
the production stylesheet.
**Fix:** Enable CSS purging (Vite + Tailwind, or PurgeCSS) to strip unused rules.

### 22. Flexbox overuse — `index.css`
`.app-header nav { display: flex }` uses flex for a simple row of inline buttons
where normal `inline-flex` on each button or the default inline flow would suffice.
Not a bug per se, but a common misapplication that adds unnecessary complexity.

---

## Browser APIs & DOM

### 23. Direct DOM manipulation of React-controlled elements — `SearchBar.jsx`
```js
document.getElementById('search-stats').textContent = '…'
document.getElementById('mv-search-input').value = ''
```
React controls both elements via state and props. Writing to them directly creates
two sources of truth; React's next render will overwrite the change, causing a flash.
**Fix:** Store the text in a state variable; call `inputRef.current.focus()` only (don't set `.value`).

### 24. `setTimeout` instead of `requestAnimationFrame` — `AnimatedBanner.jsx`
Visual state changes (opacity, ticker position) are scheduled with `setTimeout` /
`setInterval`. These are not synchronised with the display refresh cycle:
- They can fire between two paint frames, scheduling an extra layout pass.
- On a 120 Hz display, 16 ms intervals fire at half the refresh rate, dropping frames.
**Fix:** Use `requestAnimationFrame` for all per-frame visual updates.

### 25. Blocking the main thread — `helpers.js` (`computeStorageStats`)
The function runs a double `for` loop (items × 500 inner iterations) synchronously
on the main thread, called from `Dashboard.jsx`'s `useEffect`. With 200 items this
performs 100 000 iterations before the UI can update.
**Fix:** Move to a `Worker`:
```js
const worker = new Worker(new URL('./statsWorker.js', import.meta.url))
worker.postMessage(items)
worker.onmessage = e => setStats(e.data)
```

### 26. `localStorage` without `try-catch` — `SearchBar.jsx`
```js
localStorage.setItem('mv_searches', JSON.stringify(updated))
```
This throws a `DOMException` in private/incognito mode (Safari, Firefox) and when
storage quota (~5 MB) is exceeded. The uncaught exception crashes the event handler.
**Fix:** Wrap every `localStorage` read/write in `try-catch`.

### 27. Synchronous `localStorage` read on every render — `SearchBar.jsx`
```js
const recentSearches = JSON.parse(localStorage.getItem('mv_searches') || '[]')
```
This line is in the component body, so it runs synchronously on every render.
Even though localStorage is fast, it blocks the JS thread and runs more often than needed.
**Fix:** `const [recentSearches, setRecentSearches] = useState(() => JSON.parse(localStorage.getItem('mv_searches') || '[]'))`

### 28. `ResizeObserver` not cleaned up — `NotificationCenter.jsx`, `useResize.js`
Two `ResizeObserver` instances are created but `disconnect()` is never called on unmount.
The observers keep referencing detached DOM nodes; callbacks may fire after unmount.
**Fix:** `return () => resizeObserver.disconnect()` at the end of the `useEffect`.

### 29. `IntersectionObserver` not cleaned up — `NotificationCenter.jsx`
Same leak pattern: `io.observe(containerRef.current)` is called but `io.disconnect()`
is missing from the cleanup function returned by `useEffect`.
**Fix:** Add `io.disconnect()` to the `useEffect` cleanup.

### 30. Missing `passive: true` on scroll listener — `NotificationCenter.jsx`
```js
window.addEventListener('scroll', handleScroll)  // should be { passive: true }
```
Without `passive: true` the browser must wait for the JS handler to complete before
scrolling — even if `preventDefault()` is never called. This blocks the compositor
thread and can cause janky 60+ ms scroll delays.
**Fix:** `window.addEventListener('scroll', handleScroll, { passive: true })`

### 31. Accessing `window` at module scope — `SearchBar.jsx`
```js
const isMobile = window.innerWidth < 768   // line ~22, outside any hook
```
In any SSR framework (Next.js, Remix, Astro) this executes on the server where
`window` is undefined, throwing `ReferenceError: window is not defined`.
**Fix:** Move inside `useEffect`, or guard with `typeof window !== 'undefined'`.

### 32. `document.write()` usage — `helpers.js` (`legacyEmbedScript`)
`document.write('<script …>')` blocks HTML parsing when called after page load
and is rejected by any strict Content-Security-Policy. Calling it after DOMContentLoaded
replaces the entire document.
**Fix:** Create a `<script>` element and use `document.body.appendChild`.

---

## Performance & Loading

### 33. No code splitting — `App.jsx`
All six views (`Dashboard`, `ImageGallery`, `MediaList`, `AnimatedBanner`,
`NotificationCenter`, `UploadForm`) are eagerly imported, bundling everything into one JS chunk.
**Fix:**
```jsx
const Dashboard = React.lazy(() => import('./components/Dashboard'))
// … wrap in <Suspense fallback={<Spinner />}>
```

### 34. Full lodash import — `App.jsx`
```js
import _ from 'lodash'
```
Imports the entire ~70 KB (minified) lodash bundle even though only `_.filter` is used.
Vite/Rollup cannot tree-shake the default export.
**Fix:** `import filter from 'lodash-es/filter'` or just use `Array.prototype.filter`.

### 35. No memoisation of third-party component props — `Dashboard.jsx`
```jsx
<StatsPanel
  config={{ showTrends: true, showChart: false, decimals: 2 }}
  formatOptions={{ currency: 'USD', locale: 'en-US' }}
/>
```
New object literals are created on every render. Even if `StatsPanel` were wrapped
in `React.memo`, the shallow comparison would always fail.
**Fix:** `const CONFIG = { showTrends: true, … }` (module-level constant) or `useMemo`.

### 36. Waterfall font loading / no `font-display: swap` — `index.html`
The Google Fonts link uses `display=block` (invisible text during load).
No `<link rel="preload">` hint for the font file means it is discovered late.
**Fix:** Use `display=swap` and add `<link rel="preload" as="font" href="…" crossorigin />`.

### 37. No preloading of critical assets — `index.html`
Neither the LCP image nor the critical fonts have a `<link rel="preload">` hint.
The browser discovers them only after parsing HTML and CSS, adding 1–2 RTTs of delay.
**Fix:** `<link rel="preload" as="image" href="/hero.webp" />`

### 38. Polling instead of WebSocket — `usePolling.js`, `NotificationCenter.jsx`
`usePolling` fires an HTTP request every 5 000 ms for notification updates.
With 1 000 concurrent users this generates 12 requests/s of sustained polling load.
A WebSocket or SSE connection would push updates with sub-100 ms latency and near-zero overhead.
**Fix:** See `usePolling.js` for the WebSocket/SSE example.

### 39. No pagination or virtualisation on long lists — `MediaList.jsx`
`allAssets` contains 10 000 items. Every item is mounted as a real DOM node inside
a fixed-height scroll container. On a mid-range device this takes 2–4 s and allocates
hundreds of MB of DOM memory.
**Fix:** `react-window` `<FixedSizeList>` — only ~20 rows in DOM at any time.

### 40. Blocking main-thread computation — `helpers.js`, `Dashboard.jsx`
`computeStorageStats()` is called synchronously in `Dashboard.jsx`'s `useEffect`
before `setStats` is called. During this computation the browser cannot process
user input or paint frames.
**Fix:** Web Worker (see Bug #25).

---

## Architecture & Maintainability

### 41. God component — `Dashboard.jsx`
`Dashboard` performs data fetching (`useEffect` + `async` loader), business logic
(filtering by status, sorting, storage percentage calculation), and renders a full
table, a stats panel, and a gallery preview — all in one component.
**Fix:** Extract a `useDashboardData()` hook for data fetching; split into
`DashboardStats`, `RecentActivityTable`, and `DashboardPreview` presentational components.

### 42. Prop drilling 4+ levels deep — `App.jsx` → `Dashboard.jsx` → `StatsPanel.jsx` → `MetricCard` → `MetricValue`
`user`, `theme`, `config`, and `formatOptions` are passed through five component levels.
`MetricValue` (level 5) uses only `value` and ignores all other props.
**Fix:** Lift `user` and `theme` into a `React.createContext`; define `config` as a
module-level constant so it doesn't flow through the component tree at all.

### 43. Business logic inside JSX — `Dashboard.jsx`, `UploadForm.jsx`
- `recentActivity.sort(…)` called inline inside `{…}` in the render tree.
- Character-count comparison `formData.description.length > 450` used to pick a colour inline.
- Type → colour mapping hardcoded inline in multiple `<span style={…}>` expressions.
**Fix:** Compute derived values (`sortedActivity`, `isDescriptionNearLimit`) above the return
statement using `useMemo` or plain variables.

### 44. Inconsistent naming — `App.jsx`, `UploadForm.jsx`, `SearchBar.jsx`, `ImageGallery.jsx`
Three different event-handler conventions used across the same codebase:
- `handle` prefix: `handleNavClick`, `handleSearch`, `handleFileChange`
- `on` prefix: `onSearchChange`, `onTagsInput`
- `Handler` suffix: `itemClickHandler`, `submitHandler`
Also `onPress` (UploadForm / ImageGallery) vs `onClick` vs `onSelectItem`.
**Fix:** Pick one convention (`handleX`) and apply it consistently.

### 45. No separation between UI and container components — `Dashboard.jsx`, `UploadForm.jsx`
Both components mix data fetching/mutation, validation, business logic, and rendering.
A UI component should receive pre-processed data via props and emit events; a container
component should own the data and logic.

### 46. Hardcoded magic strings — `UploadForm.jsx`, `MediaList.jsx`, `Dashboard.jsx`
Status values (`'active'`, `'archived'`, `'processing'`, `'failed'`), type values
(`'image'`, `'video'`, `'document'`, `'audio'`), error messages, and placeholder text
are scattered as string literals across six files rather than imported from `constants.js`.
**Fix:** Use `STATUSES.ACTIVE`, `MEDIA_TYPES`, and a centralised `MESSAGES` object.

### 47. Circular imports — `utils/helpers.js` ↔ `utils/constants.js`
`constants.js` imports `formatFileSize` from `helpers.js`.
`helpers.js` imports `STATUSES` from `constants.js`.
In ESM this creates a cycle where one module may receive `undefined` for its imports
during initialisation (see comments in both files).
Symptoms: `MAX_FILE_SIZE_DISPLAY` renders as `"NaN Bytes"`; `getStatusColor()` returns
`undefined` on the first call.
**Fix:** Move shared primitives (`STATUSES`, `MEDIA_TYPES`, `MAX_FILE_SIZE`) to a new
`utils/enums.js` file that imports nothing from the project.

---

## Summary by file

| File | Bug IDs |
|------|---------|
| `index.html` | 36, 37 |
| `src/index.css` | 11–22 |
| `src/App.jsx` | 33, 34, 42, 44 |
| `src/data/mockData.js` | 4, 5, 6, 39 |
| `src/utils/helpers.js` | 25, 32, 47 |
| `src/utils/constants.js` | 47 |
| `src/hooks/usePolling.js` | 38 |
| `src/hooks/useResize.js` | 28 |
| `src/components/Dashboard.jsx` | 35, 41, 42, 43, 46 |
| `src/components/StatsPanel.jsx` | 24 (layout thrashing), 42 |
| `src/components/ImageGallery.jsx` | 1–3, 7–10, 19, 44 |
| `src/components/MediaList.jsx` | 10, 39, 46 |
| `src/components/SearchBar.jsx` | 23, 26, 27, 31 |
| `src/components/AnimatedBanner.jsx` | 15, 16, 18, 24 |
| `src/components/NotificationCenter.jsx` | 28, 29, 30, 38 |
| `src/components/UploadForm.jsx` | 43, 44, 45, 46 |
