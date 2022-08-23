import React from 'react';
import { useUserState } from '../providers/authProvider';
import { useLocation, Navigate } from 'react-router-dom';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const user = useUserState();
  const location = useLocation();

  console.log(user);

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
