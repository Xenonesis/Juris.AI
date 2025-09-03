import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables. Please check your .env file.');
  }

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