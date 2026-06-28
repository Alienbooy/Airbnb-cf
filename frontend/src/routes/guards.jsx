import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function ProtectedRoute({ children, roles }) {
  const { user, isInitialized } = useAuth();
  
  if (typeof window === 'undefined') return null;
  if (!isInitialized) return null; // Wait for useEffect to load user from storage
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  
  return children;
}

export function PublicRoute({ children }) {
  return children;
}
