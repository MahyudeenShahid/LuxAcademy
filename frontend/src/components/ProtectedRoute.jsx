import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen bg-[#080410] flex items-center justify-center text-white">Loading...</div>;
  }

  // If user is not logged in, redirect to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If roles are specified, check if the user has the required role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Optionally redirect to a "Not Authorized" page or just the dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}