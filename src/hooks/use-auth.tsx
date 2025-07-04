'use client';

import type { User } from 'firebase/auth';
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, googleProvider, isFirebaseEnabled } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  isFirebaseEnabled: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseEnabled || !auth) {
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async () => {
    if (!isFirebaseEnabled || !auth || !googleProvider) {
      console.error('Firebase is not configured for login.');
      return;
    }
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Error during sign-in:', error);
      setLoading(false);
    }
  };

  const logout = async () => {
    if (!isFirebaseEnabled || !auth) {
      console.error('Firebase is not configured for logout.');
      return;
    }
    setLoading(true);
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error during sign-out:', error);
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, isFirebaseEnabled }}
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
