# Bug Registry — react-debug

This file documents every intentional bug planted in the codebase. Use it **after** you have attempted to find and fix the bugs on your own.

---

## `src/utils/helpers.js`

### 1. `sortUsers` — in-place array mutation
`Array.prototype.sort` mutates the original array. Every caller that passes a state array will have that state silently corrupted without triggering a React re-render.

### 2. `filterUsers` — loose equality on role filter
`roleFilter == 'all'` uses `==` instead of `===`. Type coercion can produce unexpected matches in edge cases.

### 3. `paginate` — off-by-one (0-indexed vs 1-indexed)
`const start = page * pageSize` treats `page` as 0-indexed. Callers pass 1-indexed page numbers, so page 1 accidentally works but page 2 skips the first item of the second page.
**Expected:** `const start = (page - 1) * pageSize`

### 4. `calculateCartTotal` — ignores `quantity`
`total + item.price` sums unit prices only. Any item with `quantity > 1` produces a wrong subtotal.
**Expected:** `total + item.price * item.quantity`

### 5. `formatCurrency` — `Math.floor` drops cents
`$99.99` displays as `$99`. Rounding should be handled by `toFixed(2)` or `toLocaleString` with currency options.

### 6. `findDuplicateEmails` — O(n²) complexity
`Object.keys(seen).indexOf(user.email)` runs an O(n) scan on every iteration of the `forEach`, making the overall complexity O(n²). A simple `user.email in seen` check is O(1).

### 7. `computeFieldStats` — NaN when array is empty
`sum / items.length` produces `NaN` when `items` is empty. Needs a guard: `items.length === 0 ? 0 : sum / items.length`.

### 8. `debounce` — function executes immediately, no debounce
`setTimeout(fn.call(this, ...args), delay)` calls `fn` immediately and passes its return value (not a function) as the setTimeout callback. Nothing is debounced.
**Expected:** `setTimeout(() => fn.apply(this, args), delay)`

### 9. `groupBy` — O(n²) complexity
`Object.keys(acc).includes(groupKey)` is O(n) per `reduce` iteration. Use `groupKey in acc` for O(1) lookup.

### 10. `getRecentUsers` — ignores year in date comparison
Compares only `getMonth()` and `getDate()`, so a user who joined in January 2023 is returned when filtering for users who joined in January 2025.
**Expected:** compare against the full `cutoff` timestamp using `joined >= cutoff`.

---

## `src/context/AppContext.jsx`

### 11. Context `value` object not memoized
A plain object literal `{ user, setUser, theme, ... }` is created on every render of `AppProvider`. Every context consumer re-renders whenever **any** piece of state in the provider changes, even if that consumer only cares about one field.
**Fix:** `const value = useMemo(() => ({ ... }), [user, theme, notifications, cart])`

---

## `src/hooks/useFetch.js`

### 12. `setState` called after unmount
No cleanup or `isMounted` guard. If the component unmounts while the fetch is in flight, `setData`, `setLoading`, and `setError` are still called on the dead component.
**Fix:** Use an `AbortController` and return a cleanup function from the effect.

### 13. Race condition on rapid `fetchFn` changes
If `fetchFn` changes quickly (because the parent doesn't memoize it), multiple in-flight requests can resolve out of order and the stale response can overwrite the fresh one.

---

## `src/hooks/useDebounce.js`

### 14. `delay` missing from dependency array
`useEffect` only lists `value` as a dependency. If `delay` changes, the debounce period silently stays at the original value.
**Fix:** `}, [value, delay])`

---

## `src/components/Dashboard.jsx`

### 15. Expensive computations not memoized
`computeFieldStats` (iterates all users/products) and a recursive `fib(38)` are called unconditionally in the render body. They re-run on every single re-render, blocking the main thread.
**Fix:** Wrap each in `useMemo`.

### 16. Inline object prop defeats memoization
`const cardStyle = { borderRadius: 8, padding: 16 }` creates a new object reference on every render. Any memoized child receiving this as a prop will always re-render.
**Fix:** Declare `cardStyle` outside the component, or wrap in `useMemo`.

### 17. `handleSearch` not wrapped in `useCallback`
`handleSearch` is recreated on every Dashboard render. Because `SearchBar`'s `useEffect` lists `onSearch` in its dependency array, it re-fires on every parent render — not just when the query changes.
**Fix:** `const handleSearch = useCallback((query) => { ... }, [users])`

---

## `src/components/SearchBar.jsx`

### 18. `onSearch` in `useEffect` deps causes infinite re-runs
`useEffect` depends on `[query, onSearch]`. When the parent doesn't memoize `onSearch`, this effect fires on every parent render regardless of whether the query changed (see Bug #17).

### 19. No debouncing on search input
Every keystroke synchronously calls `onSearch`. In a real app this would trigger an API call on every character typed.
**Fix:** Debounce the query value before calling `onSearch`.

### 20. Suggestions list keyed by index
`suggestions.map((item, index) => <li key={index}>` — when the result set changes order (e.g. a new character filters differently), React reuses the wrong DOM nodes.
**Fix:** Use a stable unique identifier from the suggestion object.

---

## `src/components/UserList.jsx`

### 21. `sortField` and `sortDir` missing from `useEffect` deps
The fetch effect runs only once on mount. If the user changes the sort field before data loads, the initial sort uses stale values captured at mount time.

### 22. `handleAddUser` mutates state array directly
`users.push(newUser)` mutates the state array in place. `setUsers(users)` then sets the same reference — React's shallow comparison sees no change and skips the re-render. The new lead never appears in the list.
**Fix:** `setUsers([...users, newUser])`

### 23. List rows keyed by index
`paginated.map((user, index) => <tr key={index}>` — sorting, filtering, or inserting rows causes React to reuse the wrong DOM rows, producing visual glitches or lost input state.
**Fix:** `key={user.id}`

---

## `src/components/Analytics.jsx`

### 24. `data.sort()` mutates state array in place
`data.sort((a, b) => b.conversions - a.conversions)` sorts the state array in place. This corrupts the `data` state, causing the category filter and "This Month" table to display wrong results after the sort runs.
**Fix:** `[...data].sort(...)`

### 25. `thisMonthData` filter ignores year
`d.getMonth() === now.getMonth()` matches rows from the same calendar month across **all years**. A January 2024 row is returned for a January 2026 filter.
**Fix:** Also compare `d.getFullYear() === now.getFullYear()`.

### 26. All aggregations computed in render body, not memoized
`groupBy`, `filter`, and `reduce` chains run on every render. They should be wrapped in `useMemo`.

---

## `src/components/ProductGrid.jsx`

### 27. `filtered.sort()` mutates in place
`filtered.sort((a, b) => b.rating - a.rating)` mutates the `filtered` array. When `categoryFilter === 'All'`, `filtered` is the same reference as `products` state, so `products` state is silently mutated every render.
**Fix:** `[...filtered].sort(...)`

### 28. `handleAddToCart` mutates cart item object
`existing.quantity += 1` mutates the existing cart item object directly. Even though `setCart([...cart])` spreads the outer array, the mutated inner object is the same reference, so deep comparisons and `React.memo` on children won't detect the change correctly.
**Fix:** `setCart(cart.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i))`

### 29. `handleAddToCart` not wrapped in `useCallback`
New function reference on every render. If `ProductCard` were wrapped in `React.memo`, it would still re-render because `onAddToCart` changes.

### 30. `ProductCard` not wrapped in `React.memo`
Re-renders every time `ProductGrid` re-renders, even if `product` and `onAddToCart` are unchanged.

### 31. Products keyed by index
`sorted.map((product, index) => <ProductCard key={index}>` — reordering by category or rating causes React to reconcile against the wrong product.
**Fix:** `key={product.id}`

---

## `src/components/ShoppingCart.jsx`

### 32. `removeItem` mutates state array directly
`cart.splice(index, 1)` mutates the state array. `setCart(cart)` sets the same reference — React skips the re-render. The removed item stays visible.
**Fix:** `setCart(cart.filter(item => item.id !== id))`

### 33. `updateQuantity` mutates cart item object
`item.quantity = Math.max(1, item.quantity + delta)` mutates the object in place. `setCart([...cart])` creates a new outer array but inner objects are still mutated references.
**Fix:** `setCart(cart.map(i => i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i))`

### 34. `applyDiscountAsync` stale closure
The `setTimeout` callback closes over `cart` and `discount` at the time `applyDiscountAsync` is created. If the user adds items or changes the discount before the 2-second timer fires, the async result uses stale values.
**Fix:** Use `useRef` to hold the latest values, or use a functional state updater.

---

## `src/components/DataTable.jsx`

### 35. `window.addEventListener` never removed — memory leak
`window.addEventListener('keydown', handleKeyDown)` is called inside a `useEffect` that runs every time `refreshCount` changes, but there is no cleanup `return`. Listeners accumulate indefinitely.
**Fix:** `return () => window.removeEventListener('keydown', handleKeyDown)`

### 36. `setData` / `setLoading` called after unmount
No `isMounted` flag or `AbortController`. When the component unmounts while the fetch is in flight, state setters are still invoked on the dead component.

### 37. Auto-refresh `setInterval` never cleared — memory leak
`setInterval` in the second `useEffect` has no cleanup. The interval keeps firing after the component unmounts, incrementing `refreshCount` and triggering new fetches forever.
**Fix:** `return () => clearInterval(id)`

---

## `src/components/Notifications.jsx`

### 38. `setInterval` never cleared — memory leak
`setInterval` runs forever after mount. When the component unmounts, the interval continues, calling `setCount` and `setNotifications` on a dead component.
**Fix:** `const id = setInterval(...); return () => clearInterval(id)`

### 39. Stale closure on `count` — counter stuck at 1
`setCount(count + 1)` captures `count` from the initial render (value: `0`). The counter always increments from `0` to `1` and never goes higher.
**Fix:** `setCount(prev => prev + 1)`

### 40. Stale `count` in notification message
The notification message `Alert #${count}` always reads `count === 0` for the same closure reason as Bug #39. Every notification message says "Alert #0".
**Fix:** Use a ref or pass the value functionally.

### 41. Notifications array grows without bound
No maximum length cap. After many ticks the array consumes unbounded memory.
**Fix:** `setNotifications(prev => [newNotif, ...prev].slice(0, 50))`

---

## `src/components/UserForm.jsx`

### 42. `handleChange` mutates state object directly
`formData[field] = value` mutates the state object in place. `setFormData(formData)` sets the same reference — React sees no change and skips the re-render. Every controlled input appears frozen after the first keystroke.
**Fix:** `setFormData(prev => ({ ...prev, [field]: value }))`

### 43. Email field uses `defaultValue` (uncontrolled)
`defaultValue={formData.email}` makes the email input uncontrolled. After the first render, the DOM value diverges from `formData.email`. Validation and submission read stale data from state, not what the user typed.
**Fix:** Change to `value={formData.email}`

### 44. Weak email validation
`email.includes('@')` accepts `@`, `a@`, and `@b.com` as valid. A proper regex or the browser's built-in validity API should be used.

### 45. Form state not reset after submit
After a successful submission `formData` is never cleared. Re-opening the form (navigating away and back) shows the previous entry pre-filled.
**Fix:** Call `setFormData({ name: '', email: '', role: 'user', department: 'Engineering', score: 50 })` after `setSubmitted(true)`.

### 46. `score` stored as string, compared as number
`e.target.value` from `input[type=range]` is always a string. `formData.score > 50` works by JS coercion but storing a string in a field expected to be a number is a latent type bug that will surface if the value is used arithmetically elsewhere.
**Fix:** `handleChange('score', Number(e.target.value))`
