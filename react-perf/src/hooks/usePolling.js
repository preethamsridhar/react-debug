import { useEffect, useRef } from 'react';

// BUG: Each call to usePolling registers a new interval.
// If the component re-renders (e.g. parent state changes), the previous interval
// is NOT cleared before a new one is created because intervalRef.current is only
// cleared in the cleanup, but the effect re-runs whenever `callback` or `delay`
// changes — and callers pass inline arrow functions (new ref every render),
// causing intervals to stack up.
export function usePolling(callback, delay) {
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(callback, delay);
    return () => clearInterval(intervalRef.current);
  }, [callback, delay]);
}
