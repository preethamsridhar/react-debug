import { useState, useEffect } from 'react';

export function useFetch(fetchFn) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetchFn()
      .then((result) => {
        setData(result);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message ?? 'Unknown error');
        setLoading(false);
      });
  }, [fetchFn]);

  return { data, loading, error };
}
