import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { apiClient } from '../api/client';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('mir_access_token'));
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMe = async () => {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      // Login already populated the user; don't immediately bounce the session.
      if (user) {
        setLoading(false);
        return;
      }
      try {
        const res = await apiClient.get('/auth/me');
        if (res.data && typeof res.data === 'object' && res.data.email) {
          setUser(res.data);
        } else {
          setUser(null);
          setToken(null);
          localStorage.removeItem('mir_access_token');
        }
      } catch (err) {
        console.error('Failed to authenticate token:', err);
        setUser(null);
        setToken(null);
        localStorage.removeItem('mir_access_token');
      } finally {
        setLoading(false);
      }
    };
    fetchMe();
  }, [token, user]);

  const login = async (email: string, pass: string) => {
    const res = await apiClient.post('/auth/login', {
      email: email.trim(),
      password: pass,
    });
    const access_token = res.data?.access_token;
    const loggedUser = res.data?.user;
    if (!access_token || !loggedUser?.email) {
      throw new Error('Login succeeded but the API returned an unexpected response.');
    }
    localStorage.setItem('mir_access_token', access_token);
    setToken(access_token);
    setUser(loggedUser);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('mir_access_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
