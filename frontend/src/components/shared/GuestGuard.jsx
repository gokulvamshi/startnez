import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { LoadingSpinner } from './LoadingSpinner';
import { ROUTES } from '../../config/routes';

export const GuestGuard = ({ children }) => {
  const { isAuthenticated, isOnboarded, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-canvas-light dark:bg-canvas-dark">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (isAuthenticated) {
    if (!isOnboarded) {
      return <Navigate to={ROUTES.ONBOARDING} replace />;
    }
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return children;
};

export default GuestGuard;
