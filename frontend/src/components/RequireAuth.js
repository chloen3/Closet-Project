import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

function RequireAuth({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    fetch('/me', { credentials: 'include' })
      .then(res => {
        if (res.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      })
      .catch(() => setIsAuthenticated(false));
  }, []);

  if (isAuthenticated === null) return null; // or a loading spinner
  if (!isAuthenticated) return <Navigate to="/login" />;

  return children;
}

export default RequireAuth;
