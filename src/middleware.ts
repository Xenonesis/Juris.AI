import { NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  // Skip middleware for static files and api routes
  if (
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/api') ||
    request.nextUrl.pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Update the session with the latest auth cookie and get user
  const { response, user } = await updateSession(request);
  
  // Consider authenticated if user is present
  const hasSession = !!user;

  // Protected routes that require authentication
  const protectedRoutes = ['/profile', '/chat'];
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname === route || request.nextUrl.pathname.startsWith(`${route}/`)
  );
  
  // If accessing a protected route without being authenticated, redirect to login
  if (isProtectedRoute && !hasSession) {
    const redirectUrl = new URL('/auth/login', request.url);
    redirectUrl.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }
  
  // If already logged in and trying to access login page, redirect to home
  if (hasSession && request.nextUrl.pathname === '/auth/login') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If authenticated user is on landing page, redirect to home
  if (hasSession && request.nextUrl.pathname === '/landing') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return response;
}

// Run middleware on all routes except for specific static files
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}; 