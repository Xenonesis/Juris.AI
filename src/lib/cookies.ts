/**
 * Cookie management utilities with security features
 * Implements HttpOnly, Secure, and SameSite flags for enhanced security
 */

export interface CookieOptions {
  expires?: Date;
  maxAge?: number;
  domain?: string;
  path?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
}

export interface CookieConsentSettings {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

export const COOKIE_NAMES = {
  CONSENT: 'juris_cookie_consent',
  CONSENT_TIMESTAMP: 'juris_consent_timestamp',
  SESSION: 'juris_session',
  PREFERENCES: 'juris_preferences',
  ANALYTICS: 'juris_analytics',
  CSRF_TOKEN: 'juris_csrf_token',
} as const;

export const COOKIE_CATEGORIES = {
  NECESSARY: 'necessary',
  ANALYTICS: 'analytics',
  MARKETING: 'marketing',
  PREFERENCES: 'preferences',
} as const;

/**
 * Default secure cookie options
 */
export const getSecureCookieOptions = (isProduction = process.env.NODE_ENV === 'production'): CookieOptions => ({
  secure: isProduction, // Only send over HTTPS in production
  httpOnly: false, // Allow client-side access for consent management
  sameSite: 'lax',
  path: '/',
  maxAge: 365 * 24 * 60 * 60, // 1 year
});

/**
 * Secure cookie options for sensitive data
 */
export const getSensitiveCookieOptions = (isProduction = process.env.NODE_ENV === 'production'): CookieOptions => ({
  secure: isProduction,
  httpOnly: true, // Prevent XSS attacks
  sameSite: 'strict',
  path: '/',
  maxAge: 24 * 60 * 60, // 24 hours
});

/**
 * Set a cookie with security options
 */
export function setCookie(name: string, value: string, options: CookieOptions = {}): void {
  if (typeof document === 'undefined') return;

  const defaultOptions = getSecureCookieOptions();
  const finalOptions = { ...defaultOptions, ...options };

  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

  if (finalOptions.expires) {
    cookieString += `; expires=${finalOptions.expires.toUTCString()}`;
  }

  if (finalOptions.maxAge) {
    cookieString += `; max-age=${finalOptions.maxAge}`;
  }

  if (finalOptions.domain) {
    cookieString += `; domain=${finalOptions.domain}`;
  }

  if (finalOptions.path) {
    cookieString += `; path=${finalOptions.path}`;
  }

  if (finalOptions.secure) {
    cookieString += '; secure';
  }

  if (finalOptions.httpOnly) {
    cookieString += '; httponly';
  }

  if (finalOptions.sameSite) {
    cookieString += `; samesite=${finalOptions.sameSite}`;
  }

  document.cookie = cookieString;
}

/**
 * Get a cookie value
 */
export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;

  const nameEQ = encodeURIComponent(name) + '=';
  const cookies = document.cookie.split(';');

  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.indexOf(nameEQ) === 0) {
      return decodeURIComponent(cookie.substring(nameEQ.length));
    }
  }

  return null;
}

/**
 * Delete a cookie
 */
export function deleteCookie(name: string, path = '/', domain?: string): void {
  if (typeof document === 'undefined') return;

  let cookieString = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}`;
  
  if (domain) {
    cookieString += `; domain=${domain}`;
  }

  document.cookie = cookieString;
}

/**
 * Check if cookies are enabled
 */
export function areCookiesEnabled(): boolean {
  if (typeof document === 'undefined') return false;

  try {
    const testCookie = 'test_cookie';
    setCookie(testCookie, 'test', { maxAge: 1 });
    const enabled = getCookie(testCookie) === 'test';
    deleteCookie(testCookie);
    return enabled;
  } catch {
    return false;
  }
}

/**
 * Get current consent settings
 */
export function getConsentSettings(): CookieConsentSettings | null {
  const consent = getCookie(COOKIE_NAMES.CONSENT);
  if (!consent) return null;

  try {
    return JSON.parse(consent);
  } catch {
    return null;
  }
}

/**
 * Save consent settings
 */
export function saveConsentSettings(settings: CookieConsentSettings): void {
  const timestamp = new Date().toISOString();
  
  setCookie(COOKIE_NAMES.CONSENT, JSON.stringify(settings), getSecureCookieOptions());
  setCookie(COOKIE_NAMES.CONSENT_TIMESTAMP, timestamp, getSecureCookieOptions());

  // Clean up cookies based on consent
  if (!settings.analytics) {
    deleteCookie(COOKIE_NAMES.ANALYTICS);
  }

  if (!settings.preferences) {
    deleteCookie(COOKIE_NAMES.PREFERENCES);
  }

  // Dispatch custom event for other components to listen to
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('cookieConsentChanged', { 
      detail: settings 
    }));
  }
}

/**
 * Check if consent is required (GDPR compliance)
 */
export function isConsentRequired(): boolean {
  // Check if user is likely in EU/GDPR jurisdiction
  if (typeof navigator === 'undefined') return true;

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const europeanTimezones = [
    'Europe/', 'Atlantic/Azores', 'Atlantic/Madeira', 'Atlantic/Canary'
  ];

  return europeanTimezones.some(tz => timezone.startsWith(tz));
}

/**
 * Check if specific cookie category is consented
 */
export function isCategoryConsented(category: keyof CookieConsentSettings): boolean {
  const settings = getConsentSettings();
  if (!settings) return false;

  return settings[category];
}

/**
 * Get consent timestamp
 */
export function getConsentTimestamp(): Date | null {
  const timestamp = getCookie(COOKIE_NAMES.CONSENT_TIMESTAMP);
  if (!timestamp) return null;

  try {
    return new Date(timestamp);
  } catch {
    return null;
  }
}

/**
 * Check if consent needs renewal (older than 1 year)
 */
export function needsConsentRenewal(): boolean {
  const timestamp = getConsentTimestamp();
  if (!timestamp) return true;

  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  return timestamp < oneYearAgo;
}

/**
 * Clear all non-essential cookies
 */
export function clearNonEssentialCookies(): void {
  const settings: CookieConsentSettings = {
    necessary: true,
    analytics: false,
    marketing: false,
    preferences: false,
  };

  saveConsentSettings(settings);
}