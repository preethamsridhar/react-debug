import { useState, useEffect } from 'react';

// BUG: No AbortController — if the component unmounts or tenantId changes quickly
// (tab-switching), the stale fetch resolves and calls setState on unmounted component.
// BUG: fetchFn is not memoized by callers, so this effect re-fires on every render.
export function useFetch(fetchFn, deps = []) {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchFn()
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch((e) => {
        setError(e);
        setLoading(false);
      });
  }, deps);

  return { data, loading, error };
}
