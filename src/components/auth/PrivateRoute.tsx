import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';
import { useAuth } from '../../hooks/useAuth';

type PrivateRouteProps = {
  children: ReactNode;
};

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}