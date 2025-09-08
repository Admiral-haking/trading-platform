import { useEffect, useState } from 'react';
import api from '../utils/axios';

type InitResponse = { user: boolean };

export function useInit() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<InitResponse | null>(null);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    api
      .get<InitResponse>('/auth/init')
      .then((res) => {
        if (!mounted) return;
        setData(res.data);
        setError(null);
      })
      .catch((e) => {
        if (!mounted) return;
        setError(e);
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return { loading, data, error };
}

export default useInit;

