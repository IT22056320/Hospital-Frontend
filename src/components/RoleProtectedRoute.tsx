// src/components/RoleProtectedRoute.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthService from '../services/AuthService';

const RoleProtectedRoute: React.FC<{ allowedRole: string }> = ({ allowedRole }) => {
  const token = AuthService.isAuthenticated();
  const userRole = AuthService.getRole();

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (userRole !== allowedRole) {
    return <Navigate to="/unauthorized" />;
  }

  return <Outlet />;
};

export default RoleProtectedRoute;
