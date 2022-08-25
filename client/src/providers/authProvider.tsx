import React, { useCallback, useState } from 'react';
import axios from 'axios';
import { localStorageUtil } from '../utils/localStorage';
import { useNavigate } from 'react-router-dom';

export interface User {
  token: string;
  username: string;
  id: string;
}

type AuthState = {
  user: User | null;
  loading: boolean;
  error: Error | null;
};

type AuthMethodsState = {
  login: <T>(data: T) => Promise<void>;
  register: <T>(data: T) => Promise<void>;
  signout: () => void;
};

type AuthProviderState = AuthState & AuthMethodsState;

const initialState: AuthState = {
  user: localStorageUtil.getItem('user'),
  loading: false,
  error: null,
};

const authContext = React.createContext<AuthProviderState>(undefined as any);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [authState, setAuthState] = useState<AuthState>(initialState);
  const navigate = useNavigate();

  const login = useCallback(async <T extends {}>(data: T) => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true }));

      const response = await axios.post(
        'http://localhost:3000/api/v1/auth/login',
        data
      );

      setAuthState((prev) => ({ ...prev, user: response.data, loading: false }));
      localStorageUtil.setItem('user', response.data);
    } catch (error: any) {
      setAuthState((prev) => ({ ...prev, error, loading: false }));
      localStorageUtil.removeItem('user');
    }
  }, []);

  const register = useCallback(async <T extends {}>(data: T) => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true }));
      const response = await axios.post(
        'http://localhost:3000/api/v1/auth/register',
        data
      );

      setAuthState((prev) => ({ ...prev, user: response.data, loading: false }));
      localStorageUtil.setItem('user', response.data);
    } catch (error: any) {
      setAuthState((prev) => ({ ...prev, error, loading: false }));
      localStorageUtil.removeItem('user');
    }
  }, []);

  const signout = useCallback(() => {
    setAuthState(initialState);
    navigate('/login');
    localStorageUtil.removeItem('user');
  }, [navigate]);

  const value = {
    ...authState,
    login,
    register,
    signout,
  };

  return <authContext.Provider value={value}>{children}</authContext.Provider>;
};

export const useAuth = () => React.useContext(authContext);

export const useUser = () => React.useContext(authContext).user;
