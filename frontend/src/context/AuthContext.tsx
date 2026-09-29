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
          // Fallback to JWT payload decode
          const decoded = decodeJwtUser(token);
          if (decoded) {
            setUser(decoded);
          } else {
            setUser(null);
            setToken(null);
            localStorage.removeItem('mir_access_token');
          }
        }
      } catch (err) {
        console.error('Failed to authenticate token:', err);
        const decoded = decodeJwtUser(token);
        if (decoded) {
          setUser(decoded);
        } else {
          setUser(null);
          setToken(null);
          localStorage.removeItem('mir_access_token');
        }
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

    const data = res.data || {};
    const access_token = data.access_token || data.token || data.data?.access_token || data.data?.token;

    if (!access_token) {
      throw new Error('Authentication succeeded but no access token was returned.');
    }

    localStorage.setItem('mir_access_token', access_token);
    setToken(access_token);

    // 1. Try finding user in the login response
    let loggedUser: User | null = data.user || data.data?.user || null;
    if (!loggedUser && data.email) {
      loggedUser = {
        id: data.id || 'usr_staff',
        email: data.email,
        full_name: data.full_name || 'Staff Member',
        role: data.role || 'STAFF',
        is_active: data.is_active !== false,
        created_at: data.created_at || new Date().toISOString(),
      };
    }

    // 2. If user object is missing, fetch /auth/me with the access token
    if (!loggedUser || !loggedUser.email) {
      try {
        const meRes = await apiClient.get('/auth/me', {
          headers: { Authorization: `Bearer ${access_token}` },
        });
        if (meRes.data && typeof meRes.data === 'object' && meRes.data.email) {
          loggedUser = meRes.data;
        }
      } catch (meErr) {
        console.warn('Could not fetch user profile from /auth/me after login:', meErr);
      }
    }

    // 3. Fallback: decode JWT payload
    if (!loggedUser || !loggedUser.email) {
      const decoded = decodeJwtUser(access_token);
      if (decoded) {
        loggedUser = decoded;
      }
    }

    if (!loggedUser || !loggedUser.email) {
      throw new Error('Login succeeded but user profile could not be resolved.');
    }

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

function decodeJwtUser(token: string): User | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const payload = JSON.parse(jsonPayload);
    if (!payload.sub) return null;
    if (payload.exp && payload.exp * 1000 < Date.now()) return null;
    return {
      id: payload.id || 'usr_staff',
      email: payload.sub,
      full_name: payload.full_name || (payload.sub.split('@')[0].toUpperCase() + ' Staff'),
      role: payload.role || 'STAFF',
      is_active: true,
      created_at: new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
