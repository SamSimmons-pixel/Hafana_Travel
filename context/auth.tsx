/**
 * Auth Context Provider — context/auth.tsx
 * 
 * 🎓 LESSON: Connected to your Laravel Sanctum Backend API!
 * 
 * Flow:
 *  1. App launch ➔ GET /api/user with stored Sanctum token
 *  2. Sign In ➔ POST /api/login ➔ receives token ➔ stores in SecureStore
 *  3. Sign Out ➔ POST /api/logout ➔ clears token
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiRequest, getAuthToken, setAuthToken } from '@/services/api';
import { User, AuthResponse } from '../types/auth';


interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (nomor_visa: string, tanggal_lahir: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => ({ error: null }),
  signOut: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Check stored session on launch (Laravel Auth::user())
  useEffect(() => {
    async function checkAuthStatus() {
      try {
        const token = await getAuthToken();
        if (token) {
          // Fetch authenticated user profile from Laravel: GET /api/user
          const userData = await apiRequest<User>('/user');
          setUser(userData);
        }
      } catch (err) {
        console.log('Sanctum session expired or backend unreachable');
        await setAuthToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    checkAuthStatus();
  }, []);

  // Sign In (POST /api/login)
  const signIn = async (nomor_visa: string, tanggal_lahir: string) => {
    try {
      // 🎓 Calls Laravel Route::post('/api/login')
      const res = await apiRequest<{ token: string; user: User }>('/login', {
        method: 'POST',
        body: JSON.stringify({ nomor_visa, tanggal_lahir: tanggal_lahir }),
      });

      await setAuthToken(res.token);
      setUser(res.user);
      return { error: null };
    } catch (err: any) {
      return { error: err.message };
    }
  };

  // Sign Out (POST /api/logout)
  const signOut = async () => {
    try {
      await apiRequest('/logout', { method: 'POST' });
    } catch (e) {
      // Ignore network errors on logout
    } finally {
      await setAuthToken(null);
      setUser(null);
    }
  };


  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
      throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
  
