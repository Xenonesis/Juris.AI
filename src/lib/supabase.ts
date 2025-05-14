import { createClient } from '@supabase/supabase-js';
import { SupabaseClient } from '@supabase/supabase-js';

// Use environment variables if available, fallback to hardcoded values
export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://oybdzbyqormgynyjwyyc.supabase.co';
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95YmR6Ynlxb3JtZ3lueWp3eXljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyMDc0ODUsImV4cCI6MjA2Mjc4MzQ4NX0.uz38qT6vRAxxcrkeu31sNqIDa44hyHbLQDJvrVHcLJY';

// Safely create a Supabase client instance
let supabase: SupabaseClient;

// Check if localStorage contains any existing Supabase session tokens
function checkExistingTokens(): { key: string; value: string } | null {
  if (typeof window === 'undefined') return null;
  
  // Check multiple possible storage keys
  const possibleKeys = [
    'supabase-auth-token',
    'sb-session',
    'supabase.auth.token',
    'sb:token'
  ];
  
  for (const key of possibleKeys) {
    try {
      const value = localStorage.getItem(key);
      if (value) {
        console.log(`Found existing auth token with key: ${key}`);
        return { key, value };
      }
    } catch (e) {
      console.error(`Error checking key ${key}:`, e);
    }
  }
  
  return null;
}

try {
  // Make sure we're only creating the client in browser environments
  if (typeof window !== 'undefined') {
    // Check for existing tokens
    const existingToken = checkExistingTokens();
    console.log("Existing token found:", !!existingToken);

    supabase = createClient(supabaseUrl, supabaseAnonKey, {
      db: {
        schema: 'public',
      },
      auth: {
        storageKey: 'supabase-auth-token', // This matches the middleware's cookie name
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        flowType: 'pkce',
        storage: {
          getItem: (key: string): string | null => {
            try {
              const itemStr = localStorage.getItem(key);
              if (!itemStr) {
                console.log(`No auth item found for key: ${key}`);
                
                // If not found with the primary key, check other possible keys
                const existingToken = checkExistingTokens();
                if (existingToken) {
                  console.log(`Using alternative token from: ${existingToken.key}`);
                  return existingToken.value;
                }
                
                return null;
              }
              
              console.log(`Retrieved auth item for key: ${key}`);
              return itemStr;
            } catch (error) {
              console.error(`Error getting item from storage for key ${key}:`, error);
              return null;
            }
          },
          setItem: (key: string, value: string): void => {
            try {
              console.log(`Setting auth item for key: ${key}`);
              localStorage.setItem(key, value);
              
              // Also set under sb-session for compatibility
              if (key === 'supabase-auth-token') {
                localStorage.setItem('sb-session', value);
              }
            } catch (error) {
              console.error(`Error setting item in storage for key ${key}:`, error);
            }
          },
          removeItem: (key: string): void => {
            try {
              console.log(`Removing auth item for key: ${key}`);
              localStorage.removeItem(key);
              
              // Also remove under sb-session for compatibility
              if (key === 'supabase-auth-token') {
                localStorage.removeItem('sb-session');
              }
            } catch (error) {
              console.error(`Error removing item from storage for key ${key}:`, error);
            }
          },
        },
      },
      global: {
        // Add proper headers for REST API requests
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'apikey': supabaseAnonKey, // Include the API key for all requests
          'Prefer': 'return=minimal'  // Return minimal response for better performance
        }
      }
    });
    
    // Force a refresh on client init to ensure tokens are valid
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        console.error('Error getting session on init:', error);
      } else if (data.session) {
        console.log('Valid session found on init:', data.session.user.email);
        
        // Force refresh the session to update cookies
        supabase.auth.refreshSession().then(({ data: refreshData, error: refreshError }) => {
          if (refreshError) {
            console.error('Error refreshing session on init:', refreshError);
          } else if (refreshData && refreshData.session) {
            console.log('Session refreshed successfully on init');
          }
        });
      } else {
        console.log('No session found on init');
      }
    });
    
    console.log('Supabase client created successfully');
  } else {
    // For SSR, create a client without browser-specific features
    supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
    console.log('Supabase SSR client created');
  }
} catch (error) {
  console.error('Error initializing Supabase client:', error);
  // Create a minimal client as fallback
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export default supabase; 