import { createContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { jwtDecode } from '../utils/jwtDecode';
import { api } from '../services/api';

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('@erp:token');
    
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        
        if (decodedToken.exp && decodedToken.exp < currentTime) {
          localStorage.removeItem('@erp:token');
          setUser(null);
        } else {
          api.defaults.headers.common.Authorization = `Bearer ${token}`;
          
          // Fetch current user data
          api.get('/users/me')
            .then(response => {
              setUser(response.data);
            })
            .catch(() => {
              localStorage.removeItem('@erp:token');
              setUser(null);
            })
            .finally(() => {
              setIsLoading(false);
            });
        }
      } catch (error) {
        localStorage.removeItem('@erp:token');
        setUser(null);
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  async function login(email: string, password: string) {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      
      localStorage.setItem('@erp:token', token);
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
      
      setUser(user);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Authentication failed');
      }
      throw new Error('Authentication failed');
    }
  }

  function logout() {
    localStorage.removeItem('@erp:token');
    api.defaults.headers.common.Authorization = '';
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}