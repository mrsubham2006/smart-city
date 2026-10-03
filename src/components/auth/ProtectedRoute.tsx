import React from 'react';
import { useRequireAuth } from '../../context/AuthContext';
import { UnauthorizedView } from './UnauthorizedView';

interface ProtectedRouteProps {
  currentPath: string;
  children: React.ReactNode;
  onNavigate: (path: string) => void;
  requiredRoleLabel?: string;
  show403OnError?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  currentPath,
  children,
  onNavigate,
  requiredRoleLabel,
  show403OnError = false
}) => {
  const authState = useRequireAuth(currentPath, (redirectPath) => {
    onNavigate(redirectPath);
  });

  if (authState.isLoading) {
    return null;
  }

  if (!authState.isAuthorized) {
    if (show403OnError && authState.errorReason === 'UNAUTHORIZED') {
      return (
        <UnauthorizedView
          attemptedPath={currentPath}
          requiredRoleLabel={requiredRoleLabel || authState.requiredRoleLabel || 'Authorized Clearance'}
          onNavigate={onNavigate}
        />
      );
    }
    return null; // Will redirect via useRequireAuth
  }

  return <>{children}</>;
};
