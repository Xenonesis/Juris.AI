/**
 * Cookie Audit and Compliance Utilities
 * Provides tools for auditing cookie usage and ensuring GDPR compliance
 */

export interface CookieAuditResult {
  name: string;
  value: string;
  domain: string;
  path: string;
  expires?: Date;
  maxAge?: number;
  secure: boolean;
  httpOnly: boolean;
  sameSite: string;
  size: number;
  category: 'necessary' | 'analytics' | 'marketing' | 'preferences' | 'unknown';
  purpose: string;
  isFirstParty: boolean;
  hasConsent: boolean;
  complianceIssues: string[];
}

export interface CookieAuditSummary {
  totalCookies: number;
  categoryCounts: Record<string, number>;
  complianceScore: number;
  issues: string[];
  recommendations: string[];
  lastAuditDate: Date;
}

const COOKIE_CATEGORIES_MAP: Record<string, { category: string; purpose: string }> = {
  // Necessary cookies
  'juris_cookie_consent': { category: 'necessary', purpose: 'Stores cookie consent preferences' },
  'juris_consent_timestamp': { category: 'necessary', purpose: 'Tracks when consent was given' },
  'juris_session': { category: 'necessary', purpose: 'Maintains user session' },
  'juris_csrf_token': { category: 'necessary', purpose: 'CSRF protection' },
  'sb-': { category: 'necessary', purpose: 'Supabase authentication' },
  
  // Analytics cookies
  'juris_analytics': { category: 'analytics', purpose: 'First-party analytics tracking' },
  '_ga': { category: 'analytics', purpose: 'Google Analytics user identification' },
  '_ga_': { category: 'analytics', purpose: 'Google Analytics session data' },
  '_gid': { category: 'analytics', purpose: 'Google Analytics session identification' },
  '_gat': { category: 'analytics', purpose: 'Google Analytics throttling' },
  
  // Marketing cookies
  '_fbp': { category: 'marketing', purpose: 'Facebook Pixel tracking' },
  '_fbc': { category: 'marketing', purpose: 'Facebook click tracking' },
  'ads_data': { category: 'marketing', purpose: 'Advertising preferences' },
  
  // Preferences cookies
  'juris_preferences': { category: 'preferences', purpose: 'User interface preferences' },
  'theme': { category: 'preferences', purpose: 'Theme preference' },
  'jurisdiction_pref': { category: 'preferences', purpose: 'Legal jurisdiction preference' },
};

/**
 * Audit all cookies in the browser
 */
export function auditCookies(): CookieAuditResult[] {
  if (typeof document === 'undefined') return [];

  const cookies = document.cookie.split(';').filter(cookie => cookie.trim());
  const results: CookieAuditResult[] = [];

  cookies.forEach(cookie => {
    const [nameValue] = cookie.trim().split(';');
    const [name, value] = nameValue.split('=');
    
    if (name && value) {
      const auditResult = auditSingleCookie(name.trim(), value.trim());
      results.push(auditResult);
    }
  });

  return results;
}

/**
 * Audit a single cookie
 */
export function auditSingleCookie(name: string, value: string): CookieAuditResult {
  const category = getCookieCategory(name);
  const purpose = getCookiePurpose(name);
  const isFirstParty = isFirstPartyCookie(name);
  const hasConsent = checkCookieConsent(category);
  const complianceIssues = checkComplianceIssues(name, value, category, hasConsent);

  return {
    name,
    value: value.substring(0, 50) + (value.length > 50 ? '...' : ''), // Truncate for display
    domain: window.location.hostname,
    path: '/', // Default, would need to parse from Set-Cookie header for accuracy
    secure: window.location.protocol === 'https:',
    httpOnly: false, // Can't detect from client-side
    sameSite: 'lax', // Default assumption
    size: name.length + value.length,
    category: category as any,
    purpose,
    isFirstParty,
    hasConsent,
    complianceIssues,
  };
}

/**
 * Generate audit summary
 */
export function generateAuditSummary(auditResults: CookieAuditResult[]): CookieAuditSummary {
  const categoryCounts = auditResults.reduce((acc, cookie) => {
    acc[cookie.category] = (acc[cookie.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalIssues = auditResults.reduce((acc, cookie) => acc + cookie.complianceIssues.length, 0);
  const complianceScore = Math.max(0, 100 - (totalIssues * 10));

  const issues = Array.from(new Set(
    auditResults.flatMap(cookie => cookie.complianceIssues)
  ));

  const recommendations = generateRecommendations(auditResults);

  return {
    totalCookies: auditResults.length,
    categoryCounts,
    complianceScore,
    issues,
    recommendations,
    lastAuditDate: new Date(),
  };
}

/**
 * Get cookie category
 */
function getCookieCategory(name: string): string {
  for (const [pattern, info] of Object.entries(COOKIE_CATEGORIES_MAP)) {
    if (name.startsWith(pattern)) {
      return info.category;
    }
  }
  return 'unknown';
}

/**
 * Get cookie purpose
 */
function getCookiePurpose(name: string): string {
  for (const [pattern, info] of Object.entries(COOKIE_CATEGORIES_MAP)) {
    if (name.startsWith(pattern)) {
      return info.purpose;
    }
  }
  return 'Unknown purpose - requires classification';
}

/**
 * Check if cookie is first-party
 */
function isFirstPartyCookie(name: string): boolean {
  const firstPartyPatterns = ['juris_', 'sb-', 'theme', 'jurisdiction_'];
  return firstPartyPatterns.some(pattern => name.startsWith(pattern));
}

/**
 * Check if user has consented to cookie category
 */
function checkCookieConsent(category: string): boolean {
  if (category === 'necessary') return true;

  try {
    const consentCookie = document.cookie
      .split(';')
      .find(cookie => cookie.trim().startsWith('juris_cookie_consent='));
    
    if (!consentCookie) return false;

    const consentValue = consentCookie.split('=')[1];
    const consent = JSON.parse(decodeURIComponent(consentValue));
    
    return consent[category] === true;
  } catch {
    return false;
  }
}

/**
 * Check for compliance issues
 */
function checkComplianceIssues(
  name: string, 
  value: string, 
  category: string, 
  hasConsent: boolean
): string[] {
  const issues: string[] = [];

  // Check consent requirement
  if (category !== 'necessary' && !hasConsent) {
    issues.push('Cookie set without user consent');
  }

  // Check for sensitive data in cookie value
  if (containsSensitiveData(value)) {
    issues.push('Cookie may contain sensitive data');
  }

  // Check cookie size
  if (name.length + value.length > 4096) {
    issues.push('Cookie exceeds recommended size limit');
  }

  // Check for secure transmission
  if (window.location.protocol === 'https:' && !name.startsWith('__Secure-')) {
    if (category === 'necessary' || containsSensitiveData(value)) {
      issues.push('Sensitive cookie should use __Secure- prefix');
    }
  }

  // Check for unknown cookies
  if (category === 'unknown') {
    issues.push('Cookie purpose not documented');
  }

  return issues;
}

/**
 * Check if value contains sensitive data
 */
function containsSensitiveData(value: string): boolean {
  const sensitivePatterns = [
    /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/, // Credit card
    /\b\d{3}-\d{2}-\d{4}\b/, // SSN
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/, // Email
    /\b(?:\d{1,3}\.){3}\d{1,3}\b/, // IP address
  ];

  return sensitivePatterns.some(pattern => pattern.test(value));
}

/**
 * Generate compliance recommendations
 */
function generateRecommendations(auditResults: CookieAuditResult[]): string[] {
  const recommendations: string[] = [];
  const issues = auditResults.flatMap(cookie => cookie.complianceIssues);

  if (issues.includes('Cookie set without user consent')) {
    recommendations.push('Implement proper cookie consent management');
  }

  if (issues.includes('Cookie may contain sensitive data')) {
    recommendations.push('Review cookies for sensitive data and implement encryption');
  }

  if (issues.includes('Cookie exceeds recommended size limit')) {
    recommendations.push('Optimize cookie sizes or use server-side storage');
  }

  if (issues.includes('Cookie purpose not documented')) {
    recommendations.push('Document all cookie purposes and update privacy policy');
  }

  if (issues.includes('Sensitive cookie should use __Secure- prefix')) {
    recommendations.push('Use __Secure- prefix for sensitive cookies over HTTPS');
  }

  // Add general recommendations
  const unknownCookies = auditResults.filter(cookie => cookie.category === 'unknown');
  if (unknownCookies.length > 0) {
    recommendations.push(`Classify ${unknownCookies.length} unknown cookies`);
  }

  const thirdPartyCookies = auditResults.filter(cookie => !cookie.isFirstParty);
  if (thirdPartyCookies.length > 0) {
    recommendations.push('Review third-party cookie usage and data sharing agreements');
  }

  return Array.from(new Set(recommendations));
}

/**
 * Export audit results as JSON
 */
export function exportAuditResults(auditResults: CookieAuditResult[]): string {
  const summary = generateAuditSummary(auditResults);
  
  return JSON.stringify({
    summary,
    details: auditResults,
    exportDate: new Date().toISOString(),
    version: '1.0',
  }, null, 2);
}

/**
 * Schedule periodic cookie audits
 */
export function schedulePeriodicAudit(intervalMinutes = 60): () => void {
  const interval = setInterval(() => {
    const results = auditCookies();
    const summary = generateAuditSummary(results);
    
    console.log('Cookie Audit Summary:', summary);
    
    // Store audit results in localStorage for review
    localStorage.setItem('cookie_audit_results', exportAuditResults(results));
  }, intervalMinutes * 60 * 1000);

  return () => clearInterval(interval);
}