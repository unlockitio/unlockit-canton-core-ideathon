import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { cantonApi } from '../services/cantonApi';

interface AuthContextType {
  party: string | null;
  userId: string | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (userId: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [party, setParty] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedParty = localStorage.getItem('party');
    const storedUserId = localStorage.getItem('userId');
    const storedToken = localStorage.getItem('token');

    if (storedParty && storedUserId && storedToken) {
      setParty(storedParty);
      setUserId(storedUserId);
      setToken(storedToken);
      cantonApi.setAuth(storedToken, storedParty);
    }
    setIsLoading(false);
  }, []);

  const login = async (selectedUserId: string) => {
    try {
      const token = await cantonApi.getToken(selectedUserId);

      cantonApi.setAuth(token, selectedUserId);
      const userParty = cantonApi.getParty();

      if (userParty) {
        setParty(userParty);
        setUserId(selectedUserId);
        setToken(token);

        localStorage.setItem('party', userParty);
        localStorage.setItem('userId', selectedUserId);
        localStorage.setItem('token', token);
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    setParty(null);
    setUserId(null);
    setToken(null);

    localStorage.removeItem('party');
    localStorage.removeItem('userId');
    localStorage.removeItem('token');

    cantonApi.clearAuth();
  };

  return (
    <AuthContext.Provider
      value={{
        party,
        userId,
        token,
        isAuthenticated: !!party && !!token,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
