/**
 * Server-side cookie security utilities
 * Implements secure cookie handling with HttpOnly, Secure, and SameSite flags
 */

import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export interface SecureCookieOptions {
  maxAge?: number;
  expires?: Date;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
  path?: string;
  domain?: string;
}

export const SECURE_COOKIE_DEFAULTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/',
} satisfies SecureCookieOptions;

export const SESSION_COOKIE_OPTIONS = {
  ...SECURE_COOKIE_DEFAULTS,
  maxAge: 24 * 60 * 60, // 24 hours
  httpOnly: true,
  sameSite: 'strict' as const,
} satisfies SecureCookieOptions;

export const CSRF_COOKIE_OPTIONS = {
  ...SECURE_COOKIE_DEFAULTS,
  maxAge: 24 * 60 * 60, // 24 hours
  httpOnly: true,
  sameSite: 'strict' as const,
} satisfies SecureCookieOptions;

export const CONSENT_COOKIE_OPTIONS = {
  ...SECURE_COOKIE_DEFAULTS,
  maxAge: 365 * 24 * 60 * 60, // 1 year
  httpOnly: false, // Allow client-side access for consent management
  sameSite: 'lax' as const,
} satisfies SecureCookieOptions;

/**
 * Set a secure cookie with proper security flags
 */
export function setSecureCookie(
  name: string,
  value: string,
  options: SecureCookieOptions = {}
): void {
  const cookieStore = cookies();
  const finalOptions = { ...SECURE_COOKIE_DEFAULTS, ...options };

  (cookieStore as any).set(name, value, finalOptions);
}

/**
 * Get a secure cookie value
 */
export function getSecureCookie(name: string): string | undefined {
  const cookieStore = cookies();
  return (cookieStore as any).get(name)?.value;
}

/**
 * Delete a secure cookie
 */
export function deleteSecureCookie(name: string, path = '/'): void {
  const cookieStore = cookies();
  (cookieStore as any).delete({ name, path });
}

/**
 * Generate and set CSRF token
 */
export function generateCSRFToken(): string {
  const token = crypto.randomUUID();
  setSecureCookie('juris_csrf_token', token, CSRF_COOKIE_OPTIONS);
  return token;
}

/**
 * Validate CSRF token
 */
export function validateCSRFToken(token: string): boolean {
  const storedToken = getSecureCookie('juris_csrf_token');
  return storedToken === token && token.length > 0;
}

/**
 * Set session cookie with enhanced security
 */
export function setSessionCookie(sessionId: string, userId?: string): void {
  const sessionData = userId ? `${sessionId}:${userId}` : sessionId;
  setSecureCookie('juris_session', sessionData, SESSION_COOKIE_OPTIONS);
}

/**
 * Get session data from cookie
 */
export function getSessionFromCookie(): { sessionId: string; userId?: string } | null {
  const sessionData = getSecureCookie('juris_session');
  if (!sessionData) return null;

  const [sessionId, userId] = sessionData.split(':');
  return { sessionId, userId };
}

/**
 * Clear session cookie
 */
export function clearSessionCookie(): void {
  deleteSecureCookie('juris_session');
}

/**
 * Middleware helper to enhance cookie security
 */
export function enhanceCookieSecurity(request: NextRequest, response: NextResponse): NextResponse {
  const isProduction = process.env.NODE_ENV === 'production';
  const isHttps = request.headers.get('x-forwarded-proto') === 'https' || 
                  request.url.startsWith('https://');

  // Only apply strict security in production with HTTPS
  if (!isProduction || !isHttps) {
    return response;
  }

  // Get all cookies and enhance security for sensitive ones
  const cookies = request.cookies.getAll();
  const sensitiveCookiePatterns = [
    /session/i,
    /auth/i,
    /csrf/i,
    /token/i,
    /key/i,
  ];

  cookies.forEach(cookie => {
    const isSensitive = sensitiveCookiePatterns.some(pattern => 
      pattern.test(cookie.name)
    );

    if (isSensitive) {
      response.cookies.set(cookie.name, cookie.value, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: '/',
        maxAge: 24 * 60 * 60, // 24 hours for sensitive cookies
      });
    }
  });

  return response;
}

/**
 * Cookie consent validation
 */
export function hasValidConsent(request: NextRequest): boolean {
  const consentCookie = request.cookies.get('juris_cookie_consent');
  if (!consentCookie) return false;

  try {
    const consent = JSON.parse(consentCookie.value);
    return consent.necessary === true;
  } catch {
    return false;
  }
}

/**
 * Check if analytics cookies are consented
 */
export function canUseAnalyticsCookies(request: NextRequest): boolean {
  const consentCookie = request.cookies.get('juris_cookie_consent');
  if (!consentCookie) return false;

  try {
    const consent = JSON.parse(consentCookie.value);
    return consent.analytics === true;
  } catch {
    return false;
  }
}

/**
 * Check if marketing cookies are consented
 */
export function canUseMarketingCookies(request: NextRequest): boolean {
  const consentCookie = request.cookies.get('juris_cookie_consent');
  if (!consentCookie) return false;

  try {
    const consent = JSON.parse(consentCookie.value);
    return consent.marketing === true;
  } catch {
    return false;
  }
}

/**
 * Sanitize cookie value to prevent injection
 */
export function sanitizeCookieValue(value: string): string {
  // Remove potentially dangerous characters
  return value
    .replace(/[<>\"'&]/g, '') // Remove HTML/JS injection chars
    .replace(/[\r\n]/g, '') // Remove line breaks
    .trim()
    .substring(0, 4096); // Limit length
}

/**
 * Validate cookie name format
 */
export function isValidCookieName(name: string): boolean {
  // Cookie names should only contain alphanumeric chars, hyphens, and underscores
  return /^[a-zA-Z0-9_-]+$/.test(name) && name.length <= 256;
}

/**
 * Create secure cookie string for Set-Cookie header
 */
export function createSecureCookieString(
  name: string,
  value: string,
  options: SecureCookieOptions = {}
): string {
  if (!isValidCookieName(name)) {
    throw new Error('Invalid cookie name');
  }

  const sanitizedValue = sanitizeCookieValue(value);
  const finalOptions = { ...SECURE_COOKIE_DEFAULTS, ...options };

  let cookieString = `${name}=${encodeURIComponent(sanitizedValue)}`;

  if (finalOptions.maxAge) {
    cookieString += `; Max-Age=${finalOptions.maxAge}`;
  }

  if (finalOptions.expires) {
    cookieString += `; Expires=${finalOptions.expires.toUTCString()}`;
  }

  if (finalOptions.path) {
    cookieString += `; Path=${finalOptions.path}`;
  }

  if (finalOptions.domain) {
    cookieString += `; Domain=${finalOptions.domain}`;
  }

  if (finalOptions.secure) {
    cookieString += '; Secure';
  }

  if (finalOptions.httpOnly) {
    cookieString += '; HttpOnly';
  }

  if (finalOptions.sameSite) {
    cookieString += `; SameSite=${finalOptions.sameSite}`;
  }

  return cookieString;
}