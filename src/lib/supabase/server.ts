import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Hardcoded fallback values from src/lib/supabase.ts
const fallbackSupabaseUrl = 'https://oybdzbyqormgynyjwyyc.supabase.co';
const fallbackSupabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95YmR6Ynlxb3JtZ3lueWp3eXljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyMDc0ODUsImV4cCI6MjA2Mjc4MzQ4NX0.uz38qT6vRAxxcrkeu31sNqIDa44hyHbLQDJvrVHcLJY';

export async function createClient() {
  // Use environment variables if available, otherwise use fallback values
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || fallbackSupabaseUrl;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || fallbackSupabaseKey;

  return createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      // For server components, we rely on the middleware to handle cookies
      // This empty implementation is fine as long as middleware is set up correctly
      cookies: {
        get(name) {
          return undefined;
        },
        set(name, value, options) {
          // Server components can't set cookies
        },
        remove(name) {
          // Server components can't remove cookies
        },
      },
    }
  )
} 