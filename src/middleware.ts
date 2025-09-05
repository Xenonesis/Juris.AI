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
  
  // Debug auth information
  console.log(`Checking auth for path: ${request.nextUrl.pathname}`);
  console.log(`User authenticated: ${!!user}`);
  if (user) {
    console.log(`User email: ${user.email}`);
  }
  
  // Consider authenticated if user is present
  const hasSession = !!user;

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

  // Check terms acceptance for authenticated users (but skip terms check for now to debug)
  // const termsRedirect = await checkTermsAcceptance(request);
  // if (termsRedirect) {
  //   return termsRedirect;
  // }

  return response;
}

// Run middleware on all routes except for specific static files
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}; 