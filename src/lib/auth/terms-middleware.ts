/**
 * Terms and Privacy Policy Middleware
 * Ensures users cannot access protected routes without accepting terms
 */

import { NextRequest, NextResponse } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export interface TermsAcceptanceStatus {
  hasAcceptedTerms: boolean;
  hasAcceptedPrivacy: boolean;
  accountStatus: 'active' | 'pending_terms' | 'suspended';
  termsVersion: string;
  privacyVersion: string;
  needsUpdate: boolean;
}

// Routes that don't require terms acceptance
const PUBLIC_ROUTES = [
  '/',
  '/about',
  '/services',
  '/landing',
  '/auth/login',
  '/auth/callback',
  '/terms-of-service',
  '/privacy-policy',
  '/cookie-policy',
  '/api/auth',
  '/api/cookies',
  '/_next',
  '/favicon',
  '/public',
];

// Routes that require authentication but should be accessible for terms acceptance
const TERMS_ACCEPTANCE_ROUTES = [
  '/auth/accept-terms',
  '/auth/logout',
];

// Current versions of legal documents
const CURRENT_TERMS_VERSION = '1.0';
const CURRENT_PRIVACY_VERSION = '1.0';

/**
 * Check if a route is public (doesn't require authentication)
 */
export function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(route => {
    if (route.endsWith('*')) {
      return pathname.startsWith(route.slice(0, -1));
    }
    return pathname === route || pathname.startsWith(route + '/');
  });
}

/**
 * Check if a route is for terms acceptance
 */
export function isTermsAcceptanceRoute(pathname: string): boolean {
  return TERMS_ACCEPTANCE_ROUTES.some(route => pathname.startsWith(route));
}

/**
 * Get user's terms acceptance status from database
 */
export async function getUserTermsStatus(
  request: NextRequest,
  userId: string
): Promise<TermsAcceptanceStatus | null> {
  try {
    const response = NextResponse.next();
    const supabase = createMiddlewareClient({ req: request, res: response });

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('terms_accepted, privacy_accepted, account_status, terms_version, privacy_version, terms_accepted_at, privacy_accepted_at')
      .eq('id', userId)
      .single();

    if (error || !profile) {
      console.error('Error fetching user profile:', error);
      return null;
    }

    const hasAcceptedTerms = profile.terms_accepted === true;
    const hasAcceptedPrivacy = profile.privacy_accepted === true;
    const termsVersionMatch = profile.terms_version === CURRENT_TERMS_VERSION;
    const privacyVersionMatch = profile.privacy_version === CURRENT_PRIVACY_VERSION;

    // Check if terms need to be re-accepted due to version changes
    const needsUpdate = !termsVersionMatch || !privacyVersionMatch;

    return {
      hasAcceptedTerms: hasAcceptedTerms && termsVersionMatch,
      hasAcceptedPrivacy: hasAcceptedPrivacy && privacyVersionMatch,
      accountStatus: profile.account_status || 'pending_terms',
      termsVersion: profile.terms_version || '0.0',
      privacyVersion: profile.privacy_version || '0.0',
      needsUpdate,
    };
  } catch (error) {
    console.error('Error checking terms status:', error);
    return null;
  }
}

/**
 * Middleware function to check terms acceptance
 */
export async function checkTermsAcceptance(
  request: NextRequest
): Promise<NextResponse | null> {
  const { pathname } = request.nextUrl;

  // Skip terms check for public routes
  if (isPublicRoute(pathname)) {
    return null;
  }

  // Skip terms check for terms acceptance routes
  if (isTermsAcceptanceRoute(pathname)) {
    return null;
  }

  try {
    const response = NextResponse.next();
    const supabase = createMiddlewareClient({ req: request, res: response });

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      // User not authenticated, redirect to login
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Check terms acceptance status
    const termsStatus = await getUserTermsStatus(request, user.id);

    if (!termsStatus) {
      // Error getting terms status, redirect to terms acceptance
      const termsUrl = new URL('/auth/accept-terms', request.url);
      termsUrl.searchParams.set('redirect', pathname);
      termsUrl.searchParams.set('reason', 'error');
      return NextResponse.redirect(termsUrl);
    }

    // Check if user needs to accept terms
    const needsTermsAcceptance = 
      !termsStatus.hasAcceptedTerms || 
      !termsStatus.hasAcceptedPrivacy || 
      termsStatus.needsUpdate ||
      termsStatus.accountStatus === 'pending_terms';

    if (needsTermsAcceptance) {
      const termsUrl = new URL('/auth/accept-terms', request.url);
      termsUrl.searchParams.set('redirect', pathname);
      
      if (termsStatus.needsUpdate) {
        termsUrl.searchParams.set('reason', 'update');
      } else if (!termsStatus.hasAcceptedTerms) {
        termsUrl.searchParams.set('reason', 'terms');
      } else if (!termsStatus.hasAcceptedPrivacy) {
        termsUrl.searchParams.set('reason', 'privacy');
      } else {
        termsUrl.searchParams.set('reason', 'pending');
      }

      return NextResponse.redirect(termsUrl);
    }

    // Check if account is suspended
    if (termsStatus.accountStatus === 'suspended') {
      const suspendedUrl = new URL('/auth/suspended', request.url);
      return NextResponse.redirect(suspendedUrl);
    }

    // User has accepted terms, allow access
    return null;
  } catch (error) {
    console.error('Terms middleware error:', error);
    
    // On error, redirect to terms acceptance for safety
    const termsUrl = new URL('/auth/accept-terms', request.url);
    termsUrl.searchParams.set('redirect', pathname);
    termsUrl.searchParams.set('reason', 'error');
    return NextResponse.redirect(termsUrl);
  }
}

/**
 * Update user's terms acceptance in database
 */
export async function updateTermsAcceptance(
  request: NextRequest,
  userId: string,
  acceptTerms: boolean = true,
  acceptPrivacy: boolean = true
): Promise<boolean> {
  try {
    const response = NextResponse.next();
    const supabase = createMiddlewareClient({ req: request, res: response });

    const { error } = await supabase.rpc('update_terms_acceptance', {
      user_id: userId,
      accept_terms: acceptTerms,
      accept_privacy: acceptPrivacy,
      terms_ver: CURRENT_TERMS_VERSION,
      privacy_ver: CURRENT_PRIVACY_VERSION,
    });

    if (error) {
      console.error('Error updating terms acceptance:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error updating terms acceptance:', error);
    return false;
  }
}

/**
 * Check if user has valid session and accepted terms
 */
export async function validateUserAccess(request: NextRequest): Promise<{
  isAuthenticated: boolean;
  hasAcceptedTerms: boolean;
  user: any;
  termsStatus: TermsAcceptanceStatus | null;
}> {
  try {
    const response = NextResponse.next();
    const supabase = createMiddlewareClient({ req: request, res: response });

    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return {
        isAuthenticated: false,
        hasAcceptedTerms: false,
        user: null,
        termsStatus: null,
      };
    }

    const termsStatus = await getUserTermsStatus(request, user.id);
    const hasAcceptedTerms = termsStatus ? 
      (termsStatus.hasAcceptedTerms && termsStatus.hasAcceptedPrivacy && !termsStatus.needsUpdate) : 
      false;

    return {
      isAuthenticated: true,
      hasAcceptedTerms,
      user,
      termsStatus,
    };
  } catch (error) {
    console.error('Error validating user access:', error);
    return {
      isAuthenticated: false,
      hasAcceptedTerms: false,
      user: null,
      termsStatus: null,
    };
  }
}