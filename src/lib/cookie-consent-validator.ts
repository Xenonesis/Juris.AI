/**
 * Cookie Consent Validation System
 * Ensures GDPR and legal compliance for cookie consent
 */

import { CookieConsentSettings } from './cookies';

export interface ConsentValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  complianceScore: number;
  recommendations: string[];
}

export interface ConsentRecord {
  timestamp: Date;
  settings: CookieConsentSettings;
  userAgent: string;
  ipAddress?: string;
  consentMethod: 'banner' | 'settings' | 'api';
  version: string;
}

/**
 * Validates cookie consent according to GDPR requirements
 */
export function validateConsent(settings: CookieConsentSettings): ConsentValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const recommendations: string[] = [];

  // GDPR Requirement 1: Explicit consent for non-essential cookies
  if (!settings.necessary) {
    errors.push('Essential cookies must always be enabled');
  }

  // GDPR Requirement 2: Granular consent
  const hasGranularConsent = typeof settings.analytics === 'boolean' &&
                            typeof settings.marketing === 'boolean' &&
                            typeof settings.preferences === 'boolean';

  if (!hasGranularConsent) {
    errors.push('Consent must be granular for each cookie category');
  }

  // GDPR Requirement 3: Clear information provided
  if (typeof window !== 'undefined') {
    const hasCookiePolicy = document.querySelector('a[href*="cookie-policy"]') ||
                           document.querySelector('a[href*="privacy-policy"]');
    
    if (!hasCookiePolicy) {
      warnings.push('Cookie policy or privacy policy link should be easily accessible');
    }
  }

  // GDPR Requirement 4: Easy withdrawal
  const hasEasyWithdrawal = typeof window !== 'undefined' && 
                           (document.querySelector('[data-cookie-preferences]') ||
                            document.body.textContent?.includes('cookie preferences'));

  if (!hasEasyWithdrawal) {
    warnings.push('Users should have easy access to modify cookie preferences');
  }

  // Calculate compliance score
  let score = 100;
  score -= errors.length * 25; // Major violations
  score -= warnings.length * 10; // Minor issues

  // Generate recommendations
  if (errors.length > 0) {
    recommendations.push('Fix critical compliance errors before deployment');
  }

  if (!settings.analytics && !settings.marketing && !settings.preferences) {
    recommendations.push('Consider explaining the benefits of optional cookies to users');
  }

  if (settings.marketing && !settings.analytics) {
    recommendations.push('Marketing cookies typically require analytics for proper attribution');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    complianceScore: Math.max(0, score),
    recommendations,
  };
}

/**
 * Records consent for audit trail (GDPR requirement)
 */
export function recordConsent(
  settings: CookieConsentSettings,
  method: 'banner' | 'settings' | 'api' = 'banner'
): ConsentRecord {
  const record: ConsentRecord = {
    timestamp: new Date(),
    settings,
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
    consentMethod: method,
    version: '1.0',
  };

  // Store in localStorage for audit purposes
  if (typeof localStorage !== 'undefined') {
    try {
      const existingRecords = JSON.parse(localStorage.getItem('consent_audit_trail') || '[]');
      existingRecords.push(record);
      
      // Keep only last 10 records to prevent storage bloat
      const recentRecords = existingRecords.slice(-10);
      localStorage.setItem('consent_audit_trail', JSON.stringify(recentRecords));
    } catch (error) {
      console.warn('Failed to store consent record:', error);
    }
  }

  return record;
}

/**
 * Checks if consent needs renewal (GDPR requirement for periodic renewal)
 */
export function needsConsentRenewal(consentTimestamp: Date): boolean {
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  
  return consentTimestamp < oneYearAgo;
}

/**
 * Validates that all required legal pages are accessible
 */
export function validateLegalPages(): { isValid: boolean; missingPages: string[] } {
  if (typeof window === 'undefined') {
    return { isValid: true, missingPages: [] };
  }

  const requiredPages = [
    { name: 'Privacy Policy', selectors: ['a[href*="privacy-policy"]', 'a[href*="privacy"]'] },
    { name: 'Terms of Service', selectors: ['a[href*="terms-of-service"]', 'a[href*="terms"]'] },
    { name: 'Cookie Policy', selectors: ['a[href*="cookie-policy"]', 'a[href*="cookies"]'] },
  ];

  const missingPages: string[] = [];

  requiredPages.forEach(page => {
    const hasPage = page.selectors.some(selector => 
      document.querySelector(selector) !== null
    );

    if (!hasPage) {
      missingPages.push(page.name);
    }
  });

  return {
    isValid: missingPages.length === 0,
    missingPages,
  };
}

/**
 * Generates a compliance report
 */
export function generateComplianceReport(): {
  consent: ConsentValidationResult;
  legalPages: { isValid: boolean; missingPages: string[] };
  auditTrail: ConsentRecord[];
  recommendations: string[];
} {
  // Get current consent settings
  const consentCookie = typeof document !== 'undefined' ? 
    document.cookie.split(';').find(c => c.trim().startsWith('juris_cookie_consent=')) : null;

  let currentSettings: CookieConsentSettings = {
    necessary: true,
    analytics: false,
    marketing: false,
    preferences: false,
  };

  if (consentCookie) {
    try {
      const value = consentCookie.split('=')[1];
      currentSettings = JSON.parse(decodeURIComponent(value));
    } catch (error) {
      console.warn('Failed to parse consent cookie:', error);
    }
  }

  const consentValidation = validateConsent(currentSettings);
  const legalPagesValidation = validateLegalPages();

  // Get audit trail
  let auditTrail: ConsentRecord[] = [];
  if (typeof localStorage !== 'undefined') {
    try {
      auditTrail = JSON.parse(localStorage.getItem('consent_audit_trail') || '[]');
    } catch (error) {
      console.warn('Failed to retrieve audit trail:', error);
    }
  }

  // Generate overall recommendations
  const recommendations: string[] = [
    ...consentValidation.recommendations,
  ];

  if (!legalPagesValidation.isValid) {
    recommendations.push(`Add missing legal pages: ${legalPagesValidation.missingPages.join(', ')}`);
  }

  if (auditTrail.length === 0) {
    recommendations.push('Implement consent audit trail for compliance');
  }

  return {
    consent: consentValidation,
    legalPages: legalPagesValidation,
    auditTrail,
    recommendations,
  };
}

/**
 * Checks if the current environment requires cookie consent
 */
export function requiresCookieConsent(): boolean {
  // Always require consent in production
  if (process.env.NODE_ENV === 'production') {
    return true;
  }

  // Check if user appears to be in a jurisdiction requiring consent
  if (typeof navigator !== 'undefined') {
    const language = navigator.language.toLowerCase();
    const europeanLanguages = [
      'de', 'fr', 'es', 'it', 'nl', 'pl', 'pt', 'sv', 'da', 'no', 'fi',
      'el', 'hu', 'cs', 'sk', 'sl', 'hr', 'bg', 'ro', 'et', 'lv', 'lt'
    ];

    // If browser language suggests European user, require consent
    if (europeanLanguages.some(lang => language.startsWith(lang))) {
      return true;
    }
  }

  // Default to requiring consent for safety
  return true;
}

/**
 * Validates cookie security implementation
 */
export function validateCookieSecurity(): {
  isSecure: boolean;
  issues: string[];
  recommendations: string[];
} {
  const issues: string[] = [];
  const recommendations: string[] = [];

  // Check if running on HTTPS in production
  if (typeof window !== 'undefined') {
    const isProduction = process.env.NODE_ENV === 'production';
    const isHttps = window.location.protocol === 'https:';

    if (isProduction && !isHttps) {
      issues.push('Production site should use HTTPS for secure cookie transmission');
    }

    // Check for secure cookie implementation
    const cookies = document.cookie.split(';');
    const hasSensitiveCookies = cookies.some(cookie => 
      cookie.includes('session') || cookie.includes('auth') || cookie.includes('csrf')
    );

    if (hasSensitiveCookies && !isHttps && isProduction) {
      issues.push('Sensitive cookies detected without HTTPS');
    }
  }

  // Security recommendations
  recommendations.push('Use HttpOnly flag for authentication cookies');
  recommendations.push('Implement SameSite=Strict for CSRF protection');
  recommendations.push('Set appropriate cookie expiration times');

  return {
    isSecure: issues.length === 0,
    issues,
    recommendations,
  };
}