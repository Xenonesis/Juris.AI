'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { createClientComponentClient, User, Session } from '@supabase/auth-helpers-nextjs';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  signOut: async () => {},
  refreshSession: async () => {},
});

export const useAuth = () => useContext(AuthContext);

// Get a supabase client, with fallback to a new client if the default fails
const getSupabaseClient = () => {
  try {
    // First try to use the default client
    return createClient();
  } catch (e) {
    // If that fails, create a new client
    return createClientComponentClient();
  }
};

export function SupabaseAuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshCount, setRefreshCount] = useState(0);

  // Get session and user
  useEffect(() => {
    async function getInitialSession() {
      try {
        setIsLoading(true);
        
        const client = getSupabaseClient();
        
        // Check for existing session
        const { data: { session: currentSession }, error: sessionError } = await client.auth.getSession();
        
        if (sessionError) {
          throw sessionError;
        }
        
        if (currentSession) {
          
          // Log token (remove first/last 5 chars for security)
          const token = currentSession.access_token;
          const maskedToken = token ? `${token.substring(0, 5)}...${token.substring(token.length - 5)}` : 'none';
        }
        
        setSession(currentSession);
        
        if (currentSession) {
          const { data: { user: currentUser }, error: userError } = await client.auth.getUser();
          
          if (userError) {
            throw userError;
          }
          
          setUser(currentUser);
          
          // Explicitly refresh token if it's getting close to expiry (24 hours)
          if (currentSession.expires_at) {
            const expiresAt = currentSession.expires_at * 1000; // convert to ms
            const twentyFourHoursFromNow = Date.now() + 24 * 60 * 60 * 1000;
            
            if (expiresAt < twentyFourHoursFromNow) {
              try {
                const { data, error: refreshError } = await client.auth.refreshSession();
                if (refreshError) {
                } else {
                  setSession(data.session);
                  setUser(data.user);
                }
              } catch (refreshError) {
              }
            }
          }
        }
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    }
    
    getInitialSession();
    
    // Set up periodic refresh for long sessions
    const refreshInterval = setInterval(() => {
      setRefreshCount(prev => prev + 1);
    }, 10 * 60 * 1000); // Every 10 minutes
    
    return () => clearInterval(refreshInterval);
  }, []);
  
  // Refresh session when refreshCount changes
  useEffect(() => {
    if (refreshCount > 0) {
      refreshSession();
    }
  }, [refreshCount]);

  // Listen for auth changes
  useEffect(() => {
    try {
      const client = getSupabaseClient();
      const { data: { subscription } } = client.auth.onAuthStateChange(async (event, newSession) => {
        
        // Set session and user first
        setSession(newSession);
        setUser(newSession?.user || null);
        
        if (newSession) {
        }
        
        if (event === 'SIGNED_IN') {
          // Set loading to false immediately for sign-in
          setIsLoading(false);
          router.refresh();
        } else if (event === 'SIGNED_OUT') {
          setIsLoading(false);
          router.refresh();
          router.push('/');
        } else if (event === 'TOKEN_REFRESHED') {
          setTimeout(() => {
            setIsLoading(false);
          }, 100);
        } else {
          // For other events, set loading to false immediately
          setIsLoading(false);
        }
      });
      
      return () => {
        subscription.unsubscribe();
      };
    } catch (error) {
      setIsLoading(false);
      return () => {};
    }
  }, [router]);

  const refreshSession = async () => {
    try {
      setIsLoading(true);
      const client = getSupabaseClient();
      const { data, error } = await client.auth.refreshSession();
      
      if (error) {
        throw error;
      }
      
      if (data.session) {
      } else {
      }
      
      setSession(data.session);
      setUser(data.user);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      const client = getSupabaseClient();
      await client.auth.signOut({ scope: 'local' });
      setUser(null);
      setSession(null);
      router.push('/');
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    session,
    isLoading,
    signOut,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
} 