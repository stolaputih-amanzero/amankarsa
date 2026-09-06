'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';

interface AuthState {
  user: User | null;
  loading: boolean;
  signInAnonymously: () => Promise<void>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

const LOCAL_ANON_KEY = 'amankarsa_local_anon_user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
      } else if (typeof window !== 'undefined') {
        const cached = localStorage.getItem(LOCAL_ANON_KEY);
        if (cached) {
          try {
            setUser(JSON.parse(cached));
          } catch {
            // Graceful parse fallback
          }
        }
      }
      setLoading(false);
    }).catch(() => {
      if (typeof window !== 'undefined') {
        const cached = localStorage.getItem(LOCAL_ANON_KEY);
        if (cached) {
          try {
            setUser(JSON.parse(cached));
          } catch {
            // Graceful parse fallback
          }
        }
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInAnonymously = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInAnonymously();
      if (!error && data?.user) {
        setUser(data.user);
        setLoading(false);
        return;
      }
    } catch {
      // Supabase anonymous auth not configured or unreachable; fallback gracefully
    }

    // Graceful offline/local anonymous user session
    const fallbackUser: User = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : '00000000-0000-4000-8000-000000000001',
      app_metadata: {},
      user_metadata: { is_anonymous: true },
      aud: 'authenticated',
      created_at: new Date().toISOString(),
    } as User;

    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_ANON_KEY, JSON.stringify(fallbackUser));
    }
    setUser(fallbackUser);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInAnonymously }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
