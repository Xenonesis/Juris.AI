'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

type AuthContextType = {
  user: any | null;
  session: any | null;
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
    console.error("Error using default supabase client, creating a new one:", e);
    // If that fails, create a new client
    return createClientComponentClient();
  }
};

export function SupabaseAuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
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
          console.error('Session error in provider:', sessionError);
          throw sessionError;
        }
        
        console.log('Auth provider - Initial session check:', !!currentSession);
        if (currentSession) {
          console.log('Auth provider - Session user:', currentSession.user.email);
          console.log('Auth provider - Session expires:', currentSession.expires_at ? new Date(currentSession.expires_at * 1000).toISOString() : 'unknown');
          
          // Log token (remove first/last 5 chars for security)
          const token = currentSession.access_token;
          const maskedToken = token ? `${token.substring(0, 5)}...${token.substring(token.length - 5)}` : 'none';
          console.log('Auth token available:', !!token, 'Token preview:', maskedToken);
        }
        
        setSession(currentSession);
        
        if (currentSession) {
          const { data: { user: currentUser }, error: userError } = await client.auth.getUser();
          
          if (userError) {
            console.error('User error in provider:', userError);
            throw userError;
          }
          
          console.log('Auth provider - User loaded:', currentUser?.email);
          setUser(currentUser);
          
          // Explicitly refresh token if it's getting close to expiry (24 hours)
          if (currentSession.expires_at) {
            const expiresAt = currentSession.expires_at * 1000; // convert to ms
            const twentyFourHoursFromNow = Date.now() + 24 * 60 * 60 * 1000;
            
            if (expiresAt < twentyFourHoursFromNow) {
              console.log("Auth provider - Token expiring soon, refreshing");
              try {
                const { data, error: refreshError } = await client.auth.refreshSession();
                if (refreshError) {
                  console.error("Error refreshing token in provider:", refreshError);
                } else {
                  console.log("Auth provider - Session refreshed successfully");
                  setSession(data.session);
                  setUser(data.user);
                }
              } catch (refreshError) {
                console.error("Exception refreshing token in provider:", refreshError);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error getting auth session in provider:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    getInitialSession();
    
    // Set up periodic refresh for long sessions
    const refreshInterval = setInterval(() => {
      console.log('Running periodic session refresh');
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
        console.log('Auth state changed:', event);
        setSession(newSession);
        setUser(newSession?.user || null);
        
        if (newSession) {
          console.log('Auth state change - Session user:', newSession.user.email);
        }
        
        if (event === 'SIGNED_IN') {
          console.log('Auth state change - SIGNED_IN event detected');
          setIsLoading(false);
          router.refresh();
        }
        
        if (event === 'SIGNED_OUT') {
          console.log('Auth state change - SIGNED_OUT event detected');
          setIsLoading(false);
          router.refresh();
          router.push('/');
        }

        if (event === 'TOKEN_REFRESHED') {
          console.log('Auth state change - TOKEN_REFRESHED event detected');
          setIsLoading(false);
        }

        setIsLoading(false);
      });
      
      return () => {
        subscription.unsubscribe();
      };
    } catch (error) {
      console.error('Error setting up auth subscription:', error);
      setIsLoading(false);
      return () => {};
    }
  }, [router]);

  const refreshSession = async () => {
    try {
      setIsLoading(true);
      const client = getSupabaseClient();
      console.log('Manually refreshing session');
      const { data, error } = await client.auth.refreshSession();
      
      if (error) {
        console.error('Error refreshing session:', error);
        throw error;
      }
      
      if (data.session) {
        console.log('Session refreshed successfully:', data.session.user.email);
        console.log('New session expires:', data.session.expires_at ? new Date(data.session.expires_at * 1000).toISOString() : 'unknown');
      } else {
        console.log('Session refresh returned no session');
      }
      
      setSession(data.session);
      setUser(data.user);
    } catch (error) {
      console.error('Exception refreshing session:', error);
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
      console.error('Error signing out:', error);
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