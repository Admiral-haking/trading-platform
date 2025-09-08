import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { getToken } from '../../utils/axios';

type Props = { children: React.ReactNode };

export default function AuthGuard({ children }: Props) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const path = router.pathname;
  const token = mounted ? getToken() : null;

  const shouldRedirectToLogin = useMemo(() => {
    if (!mounted) return false;
    // Only allow /login without a token
    if (path === '/login') return false;
    return !token;
  }, [mounted, path, token]);

  const shouldRedirectToCheck = useMemo(() => {
    if (!mounted) return false;
    if (path === '/login' && token) return true;
    return false;
  }, [mounted, path, token]);

  useEffect(() => {
    if (shouldRedirectToLogin) {
      router.replace('/login');
    } else if (shouldRedirectToCheck) {
      router.replace('/check');
    }
  }, [router, shouldRedirectToLogin, shouldRedirectToCheck]);

  if (!mounted) return null;
  if (shouldRedirectToLogin || shouldRedirectToCheck) return null;
  return <>{children}</>;
}

