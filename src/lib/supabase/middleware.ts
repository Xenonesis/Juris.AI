import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

export async function updateSession(request: NextRequest) {
  // Create a new response with the same headers
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables in middleware');
    return { response, user: null };
  }

  // Create a Supabase client for the middleware
  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        get(name) {
          const cookie = request.cookies.get(name);
          if (cookie) {
            return cookie.value;
          }
          return null;
        },
        set(name, value, options) {
          // Update request cookies
          request.cookies.set({
            name,
            value,
            ...options,
          });
          
          // Create a new response with updated cookies
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          
          // Set the cookie in the response
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name) {
          // Remove from request
          request.cookies.delete(name);
          
          // Create a new response
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          
          // Remove from response
          response.cookies.delete(name);
        },
      },
    }
  );

  let user = null;
  try {
    // This will refresh the auth session if expired
    const { data: { user: authUser } } = await supabase.auth.getUser();
    user = authUser;
    
    if (user) {
    } else {
    }
  } catch (error) {
    console.error('Error refreshing auth in middleware:', error);
  }

  return { response, user };
} 