import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import api from '../services/api';

interface User {
      _id: string; // Changed from id to _id to match MongoDB
      name: string;
      email: string;
      role: string;
}

interface AuthContextType {
      user: User | null;
      loading: boolean;
      login: (token: string, userData?: User) => void;
      logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
      const [user, setUser] = useState<User | null>(null);
      const [loading, setLoading] = useState(true);

      const fetchUser = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                  setLoading(false);
                  return;
            }

            try {
                  const res = await api.get('/auth/me');
                  setUser(res.data);
            } catch (err) {
                  console.error("Failed to fetch user", err);
                  // If token is invalid/expired, clear it
                  logout();
            } finally {
                  setLoading(false);
            }
      };

      useEffect(() => {
            fetchUser();
      }, []);

      const login = (token: string, userData?: User) => {
            localStorage.setItem('token', token);
            if (userData) {
                  setUser(userData);
            } else {
                  fetchUser();
            }
      };

      const logout = () => {
            localStorage.removeItem('token');
            setUser(null);
      };

      return (
            <AuthContext.Provider value={{ user, loading, login, logout }}>
                  {children}
            </AuthContext.Provider>
      );
};

export const useAuth = () => {
      const context = useContext(AuthContext);
      if (context === undefined) {
            throw new Error('useAuth must be used within an AuthProvider');
      }
      return context;
};
