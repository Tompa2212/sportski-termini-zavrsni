import React, { useCallback, useState } from 'react';
import axios from 'axios';

export interface User {
  token: string;
  username: string;
  email: string;
  id: string;
}

type AuthState = {
  user: User | null;
  status: 'pending' | 'success' | 'error';
  error: Error | null;
};

type AuthMethodsState = {
  login: <T>(data: T) => Promise<void>;
  register: <T>(data: T) => Promise<void>;
  signout: () => void;
};

type AuthProviderState = AuthState & AuthMethodsState;

const initialState: AuthState = {
  user: null,
  status: 'pending',
  error: null,
};

const authContext = React.createContext<AuthProviderState>(undefined as any);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [authState, setAuthState] = useState<AuthState>(initialState);

  const login = useCallback(async <T extends {}>(data: T) => {
    try {
      const response = await axios.post(
        'http://localhost:3000/api/v1/auth/login',
        data
      );

      setAuthState((prev) => ({ ...prev, user: response.data, status: 'success' }));
    } catch (error: any) {
      setAuthState((prev) => ({ ...prev, error, status: 'error' }));
    }
  }, []);

  const register = useCallback(async <T extends {}>(data: T) => {
    try {
      const response = await axios.post(
        'http://localhost:3000/api/v1/auth/register',
        data
      );

      setAuthState(response.data);
    } catch (error: any) {
      setAuthState((prev) => ({ ...prev, error, status: 'error' }));
    }
  }, []);

  const signout = useCallback(() => {
    setAuthState(initialState);
  }, []);

  const value = {
    ...authState,
    login,
    register,
    signout,
  };

  return <authContext.Provider value={value}>{children}</authContext.Provider>;
};

export const useAuth = () => React.useContext(authContext);

export const useUserState = () => {
  const data = React.useContext(authContext);

  return data ? data.user : null;
};
