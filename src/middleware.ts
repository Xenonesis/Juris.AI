import { NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import { checkTermsAcceptance } from '@/lib/auth/terms-middleware'

export async function middleware(request: NextRequest) {
  // Skip middleware for static files and api routes
  if (
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/api') ||
    request.nextUrl.pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Update the session with the latest auth cookie
  const response = await updateSession(request);
  
  // Check terms acceptance for protected routes
  const termsRedirect = await checkTermsAcceptance(request);
  if (termsRedirect) {
    return termsRedirect;
  }
  
  // Get user data after session update
  const cookies = request.cookies.getAll();
  
  // Debug cookie information
  console.log(`Checking auth for path: ${request.nextUrl.pathname}`);
  console.log(`Found ${cookies.length} cookies`);
  
  // More comprehensive session check
  // Look for all potential Supabase auth cookies
  const authCookieNames = [
    'sb-access-token',
    'sb-refresh-token',
    'sb-session',
    'supabase-auth-token',
    '__session'
  ];
  
  const authCookies = cookies.filter(cookie => 
    authCookieNames.includes(cookie.name) ||
    cookie.name.startsWith('sb-') ||
    cookie.name.includes('supabase')
  );
  
  // Log found auth cookies (just names, not values for security)
  if (authCookies.length > 0) {
    console.log(`Found auth cookies: ${authCookies.map(c => c.name).join(', ')}`);
  } else {
    console.log('No auth cookies found');
  }
  
  // Consider authenticated if any auth cookies are present
  const hasSession = authCookies.length > 0;

  // Protected routes that require authentication
  const protectedRoutes = ['/profile', '/chat'];
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname === route || request.nextUrl.pathname.startsWith(`${route}/`)
  );
  
  // If accessing a protected route without being authenticated, redirect to login
  if (isProtectedRoute && !hasSession) {
    console.log(`Redirecting unauthenticated user from ${request.nextUrl.pathname} to login`);
    const redirectUrl = new URL('/auth/login', request.url);
    redirectUrl.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }
  
  // If already logged in and trying to access login page, redirect to home
  if (hasSession && request.nextUrl.pathname === '/auth/login') {
    console.log('Redirecting authenticated user from login to home');
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If authenticated user is on landing page, redirect to home
  if (hasSession && request.nextUrl.pathname === '/landing') {
    console.log('Redirecting authenticated user from landing to home');
    return NextResponse.redirect(new URL('/', request.url));
  }

  return response;
}

// Run middleware on all routes except for specific static files
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}; 