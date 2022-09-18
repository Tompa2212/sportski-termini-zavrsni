import React, { useState } from 'react';
import axios from 'axios';
import { appStorage } from '../utils/app storage';
import { useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';

export interface User {
  username: string;
  id: string;
  initializationFinished: boolean;
}

export enum AuthStatus {
  PENDING = 0,
  SUCCESS = 1,
  ERROR = 2,
}

interface AuthProviderState {
  user: User | null;
  status: AuthStatus;
  login: <T extends {}>(data: T) => Promise<void>;
  register: <T extends {}>(data: T) => Promise<void>;
  signout: () => void;
}

const getUserInitialState = (): User | null => {
  const token = appStorage.getItem('token');

  if (!token) {
    return null;
  }

  const { id, username, initializationFinished } = jwt_decode<User>(token);

  return {
    id,
    username,
    initializationFinished,
  };
};

const initialUserState = getUserInitialState();

const authContext = React.createContext<AuthProviderState>(undefined as any);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [status, setStatus] = useState<AuthStatus>(AuthStatus.PENDING);
  const [user, setUser] = useState<User | null>(initialUserState);
  const navigate = useNavigate();

  const signout = () => {
    appStorage.removeItem('token');
    setUser(null);
    setStatus(AuthStatus.PENDING);

    navigate('/login');
  };

  const onSuccessAuth = (data: any) => {
    const { token, ...user } = data;

    setUser(user);
    setStatus(AuthStatus.SUCCESS);
    appStorage.setItem('token', token);
  };

  const register = async <T extends {}>(data: T) => {
    try {
      setStatus(AuthStatus.PENDING);
      const response = await axios.post(
        'http://localhost:3000/api/v1/auth/register',
        data
      );

      onSuccessAuth(response.data);
      navigate('/inicijalizacija');
    } catch (error: any) {
      setStatus(AuthStatus.ERROR);
    }
  };

  const login = async <T extends {}>(data: T) => {
    try {
      setStatus(AuthStatus.PENDING);

      const response = await axios.post(
        'http://localhost:3000/api/v1/auth/login',
        data
      );

      onSuccessAuth(response.data);
      navigate('/');
    } catch (error) {
      setStatus(AuthStatus.ERROR);
    }
  };

  const value = {
    user,
    status,
    login,
    register,
    signout,
  };

  return <authContext.Provider value={value}>{children}</authContext.Provider>;
};

export const useAuth = () => React.useContext(authContext);

export const useUser = () => React.useContext(authContext).user;
