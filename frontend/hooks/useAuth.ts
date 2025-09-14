import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthToken, setAuthToken, removeAuthToken, getUser } from '@/lib/auth';

interface User {
  id: number;
  email: string;
  name: string;
  type: string;
}

interface LoginResult {
  success: boolean;
  user?: User;
  error?: string;
}

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = useCallback(async () => {
    try {
      const token = getAuthToken();
      const storedUser = getUser();

      if (token && storedUser) {
        setUser(storedUser);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<LoginResult> => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setAuthToken(data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        setIsAuthenticated(true);
        return { success: true, user: data.user };
      }

      return { success: false, error: data.message || 'فشل تسجيل الدخول' };
    } catch (error) {
      return { success: false, error: 'حدث خطأ في الاتصال' };
    }
  }, []);

  // UPDATED LOGOUT FUNCTION
  const logout = useCallback(async () => {
    const token = getAuthToken();
    
    // Call backend logout endpoint
    if (token) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/api/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });
      } catch (error) {
        console.error('Logout error:', error);
        // Continue with local logout even if backend call fails
      }
    }
    
    // Clear all authentication data
    removeAuthToken(); // This now also clears the cookie (see updated lib/auth.ts)
    setUser(null);
    setIsAuthenticated(false);
    
    // Redirect to login
    router.push('/login');
  }, [router]);

  return {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    checkAuth
  };
}