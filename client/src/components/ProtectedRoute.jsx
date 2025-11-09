import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/auth-context';

const ProtectedRoute = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // User is not logged in
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!user.role) {
    // User is logged in BUT has not selected a role
    return <Navigate to="/select-role" replace />;
  }

  // User is logged in and has a role, render the page
  return <Outlet />;
};

export default ProtectedRoute;