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
  signIn: (name: string, tanggal_lahir: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updatePhone: (no_hp: string) => Promise<{ error: any }>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => ({ error: null }),
  signOut: async () => {},
  updatePhone: async () => ({ error: null }),
  refreshUser: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    try {
      const userData = await apiRequest<User>('/user');
      setUser(userData);
    } catch (err) {
      console.log('Error refreshing user profile:', err);
    }
  };

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

  // Sign In (POST /api/auth/login) with full name (uppercase) & tanggal_lahir
  const signIn = async (name: string, tanggal_lahir: string) => {
    try {
      const res = await apiRequest<{ token: string; user: User }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ name: name.toUpperCase().trim(), tanggal_lahir }),
      });

      await setAuthToken(res.token);
      setUser(res.user);
      return { error: null };
    } catch (err: any) {
      return { error: err.message };
    }
  };

  // Update Phone Number (PATCH /api/user/phone)
  const updatePhone = async (no_hp: string) => {
    try {
      const res = await apiRequest<{ message: string; user: User }>('/user/phone', {
        method: 'PATCH',
        body: JSON.stringify({ no_hp: no_hp.trim() }),
      });

      if (res.user) {
        setUser(res.user);
      }
      return { error: null };
    } catch (err: any) {
      return { error: err.message };
    }
  };

  // Sign Out (POST /api/auth/logout)
  const signOut = async () => {
    try {
      await apiRequest('/auth/logout', { method: 'POST' });
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
        updatePhone,
        refreshUser,
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
  
