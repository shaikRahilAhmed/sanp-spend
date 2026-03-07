import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

interface User {
  id: string;
  fullName: string;
  email: string;
}

interface AuthContextProps {
  user: User | null;
  token: string | null;
  signIn: (email: string, password: string) => Promise<{ error: any | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any | null }>;
  signOut: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

const API_URL = '/api/auth';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing token on mount
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      verifyToken(storedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async (token: string) => {
    try {
      const response = await axios.get(`${API_URL}/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUser(response.data.user);
      setToken(token);
    } catch (error) {
      console.error('Token verification failed:', error);
      localStorage.removeItem('authToken');
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  async function signUp(email: string, password: string, fullName: string) {
    try {
      const response = await axios.post(`${API_URL}/signup`, {
        email,
        password,
        fullName
      });

      const { token: newToken, user: newUser } = response.data;
      
      localStorage.setItem('authToken', newToken);
      setToken(newToken);
      setUser(newUser);

      return { error: null };
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to create account';
      return { error: { message: errorMessage } };
    }
  }

  async function signIn(email: string, password: string) {
    try {
      const response = await axios.post(`${API_URL}/signin`, {
        email,
        password
      });

      const { token: newToken, user: newUser } = response.data;
      
      localStorage.setItem('authToken', newToken);
      setToken(newToken);
      setUser(newUser);

      return { error: null };
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to sign in';
      return { error: { message: errorMessage } };
    }
  }

  function signOut() {
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, signIn, signUp, signOut, loading }}>
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
