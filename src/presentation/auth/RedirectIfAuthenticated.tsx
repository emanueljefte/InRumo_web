import { Navigate } from 'react-router-dom';
import { useAuth } from '../../application/auth/useAuth';
import { getHomeRoute } from '../../application/auth/getHomeRoute';

export function RedirectIfAuthenticated({ children }: { children: React.ReactNode }) {
  const { session, profile, initializing } = useAuth();

  if (initializing) return null;
  if (session) return <Navigate to={getHomeRoute(profile)} replace />;

  return <>{children}</>;
}