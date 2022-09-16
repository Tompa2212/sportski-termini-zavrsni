import React from 'react';
import { useAuth } from '../providers/authProvider';
import { useLocation, Navigate } from 'react-router-dom';
import { appStorage } from '../utils/app storage';
import jwt_decode from 'jwt-decode';

const isTokenValid = () => {
  const token = appStorage.getItem('token');

  if (!token) {
    return false;
  }

  const { exp } = jwt_decode<{ iat: number; exp: number }>(token);

  if (Date.now() > exp * 1000) {
    return false;
  }

  return true;
};

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!isTokenValid()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!user) {
    console.log('redirected back');

    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
