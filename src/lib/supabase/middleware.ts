import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

// Hardcoded fallback values from src/lib/supabase.ts
const fallbackSupabaseUrl = 'https://oybdzbyqormgynyjwyyc.supabase.co';
const fallbackSupabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95YmR6Ynlxb3JtZ3lueWp3eXljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyMDc0ODUsImV4cCI6MjA2Mjc4MzQ4NX0.uz38qT6vRAxxcrkeu31sNqIDa44hyHbLQDJvrVHcLJY';

export async function updateSession(request: NextRequest) {
  // Create a new response with the same headers
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Use environment variables if available, otherwise use fallback values
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || fallbackSupabaseUrl;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || fallbackSupabaseKey;

  // Log which URL and key we're using (truncated for security)
  console.log(`Using Supabase URL: ${supabaseUrl}`);
  console.log(`Using Supabase Key: ${supabaseKey.substring(0, 10)}...`);

  // Create a Supabase client for the middleware
  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        get(name) {
          const cookie = request.cookies.get(name);
          if (cookie) {
            console.log(`Found cookie: ${name}`);
            return cookie.value;
          }
          return null;
        },
        set(name, value, options) {
          console.log(`Setting cookie: ${name}`);
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
          console.log(`Removing cookie: ${name}`);
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

  try {
    // This will refresh the auth session if expired
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      console.log(`User authenticated in middleware: ${user.email}`);
    } else {
      console.log('No authenticated user found in middleware');
    }
  } catch (error) {
    console.error('Error refreshing auth in middleware:', error);
  }

  return response;
} 