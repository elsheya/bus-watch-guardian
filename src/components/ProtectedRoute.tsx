
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children,
  roles = [] 
}) => {
  const { isAuthenticated, hasRole, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-primary animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles.length > 0 && !hasRole(roles)) {
    console.log(`Access denied for user ${user?.name} (${user?.role}). Required roles: ${roles.join(', ')}`);
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};
