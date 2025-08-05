import { useEffect, useState } from 'react';
import { useLocation, Navigate, Outlet } from 'react-router-dom';

type AuthStatus = 'loading' | 'authed' | 'denied';

export default function RequireAuth(): JSX.Element {
  const [status, setStatus] = useState<AuthStatus>('loading');
  const location = useLocation();

  useEffect(() => {
    fetch('/me', { credentials: 'include' })
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('unauth');
      })
      .then(() => setStatus('authed'))
      .catch(() => setStatus('denied'));
  }, []);

  if (status === 'loading') {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Checking authentication…</div>;
  }

  if (status === 'denied') {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
