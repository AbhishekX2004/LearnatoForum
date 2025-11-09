import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/auth-context';

const RoleSelectionRoute = () => {
  const { user } = useAuth();

  if (!user) {
    // Not logged in, go to login
    return <Navigate to="/login" replace />;
  }

  if (user.role) {
    // Already has a role, go to home
    return <Navigate to="/" replace />;
  }

  // Logged in, no role. Show the page.
  return <Outlet />;
};

export default RoleSelectionRoute;