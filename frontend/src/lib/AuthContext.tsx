'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { api } from './api';


interface User {
  id: string;
  name: string;
  email: string;
  isPremium: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Attempt to silently refresh token on load
    const initAuth = async () => {
      try {
        const storedToken = localStorage.getItem('accessToken');
        const storedUser = localStorage.getItem('user');

        // Check if token is still locally valid (naive check)
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }

        // Try getting new token if local storage is missing but HTTP cookie exists
        try {
          const data = await api.auth.refresh();
          setToken(data.accessToken);
          localStorage.setItem('accessToken', data.accessToken);
        } catch (err) {
          // Refresh failed, clear
          setToken(null);
          setUser(null);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('user');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('accessToken', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const logout = async () => {
    if (token) {
      try {
        await api.auth.logout();
      } catch (err) {
        console.error('Logout request failed:', err);
      }
    }
    setToken(null);
    setUser(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
