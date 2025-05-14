import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { supabaseUrl, supabaseAnonKey } from './lib/supabase';

export async function middleware(req: NextRequest) {
  // Skip middleware for static files and api routes
  if (
    req.nextUrl.pathname.startsWith('/_next') ||
    req.nextUrl.pathname.startsWith('/api') ||
    req.nextUrl.pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  try {
    // Create a response object to store cookies
    const res = NextResponse.next();
    
    // Log all cookies for debugging
    console.log('All cookies:', Object.entries(req.cookies.getAll()).map(([key, value]) => key));
    
    // Create a Supabase client specifically for this middleware request
    const supabase = createMiddlewareClient({ req, res }, {
      supabaseUrl,
      supabaseKey: supabaseAnonKey,
      options: {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        }
      }
    });
    
    // Refresh the session if expired - this will update the cookie
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error("Middleware session error:", sessionError);
    }
    
    // Debug information
    console.log("Middleware path:", req.nextUrl.pathname);
    console.log("Session exists:", !!session);
    
    // Check for auth cookies
    const supabaseAuthToken = req.cookies.get('supabase-auth-token');
    const sbSession = req.cookies.get('sb-session');
    
    console.log("Auth cookies found:", {
      'supabase-auth-token': !!supabaseAuthToken,
      'sb-session': !!sbSession
    });
    
    if (session) {
      console.log("Session user:", session.user.email);
      
      if (session.expires_at) {
        console.log("Session expires:", new Date(session.expires_at * 1000).toISOString());
        
        // Explicitly refresh token if it's getting close to expiry (24 hours)
        const expiresAt = session.expires_at * 1000; // convert to ms
        const twentyFourHoursFromNow = Date.now() + 24 * 60 * 60 * 1000;
        
        if (expiresAt < twentyFourHoursFromNow) {
          console.log("Token expiring soon, refreshing...");
          const { error: refreshError } = await supabase.auth.refreshSession();
          if (refreshError) {
            console.error("Error refreshing token:", refreshError);
          } else {
            console.log("Session refreshed successfully");
          }
        }
      }
    }
    
    // Enhanced authentication check - check both cookies and session
    const isAuthenticated = !!supabaseAuthToken || !!sbSession || !!session;
    
    console.log("Is authenticated:", isAuthenticated);
    console.log("Is protected route:", isProtectedRoute);
    
    // Protected routes that require authentication
    const protectedRoutes = ['/profile', '/chat'];
    const isProtectedRoute = protectedRoutes.some(route => 
      req.nextUrl.pathname === route || req.nextUrl.pathname.startsWith(`${route}/`)
    );
    
    // If accessing a protected route without being authenticated, redirect to login
    if (isProtectedRoute && !isAuthenticated) {
      console.log(`Redirecting unauthenticated user from ${req.nextUrl.pathname} to login`);
      const redirectUrl = new URL('/auth/login', req.url);
      redirectUrl.searchParams.set('redirect', req.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }
    
    // If already logged in and trying to access login page, redirect to home
    if (isAuthenticated && req.nextUrl.pathname === '/auth/login') {
      console.log('Redirecting authenticated user from login to home');
      return NextResponse.redirect(new URL('/', req.url));
    }
    
    // Copy all cookies from the API response to the browser
    const response = NextResponse.next();
    
    // Copy any new cookies from res to response
    res.headers.getSetCookie().forEach(cookie => {
      response.headers.append('Set-Cookie', cookie);
    });
    
    return response;
  } catch (error) {
    console.error('Middleware error:', error);
    // If there's an error, continue without blocking navigation
    return NextResponse.next();
  }
}

// Run middleware on all routes except for specific static files
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}; 