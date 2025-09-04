'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  getConsentSettings,
  saveConsentSettings,
  isCategoryConsented,
  needsConsentRenewal,
  getConsentTimestamp,
  clearNonEssentialCookies,
  CookieConsentSettings,
  COOKIE_CATEGORIES,
} from '@/lib/cookies';

export interface UseCookieConsentReturn {
  // Consent state
  consentSettings: CookieConsentSettings | null;
  hasConsent: boolean;
  needsRenewal: boolean;
  consentTimestamp: Date | null;
  
  // Category checks
  isNecessaryConsented: boolean;
  isAnalyticsConsented: boolean;
  isMarketingConsented: boolean;
  isPreferencesConsented: boolean;
  
  // Actions
  updateConsent: (settings: CookieConsentSettings) => void;
  acceptAll: () => void;
  rejectAll: () => void;
  clearCookies: () => void;
  
  // Utilities
  canUseAnalytics: boolean;
  canUseMarketing: boolean;
  canUsePreferences: boolean;
}

export function useCookieConsent(): UseCookieConsentReturn {
  const [consentSettings, setConsentSettings] = useState<CookieConsentSettings | null>(null);
  const [hasConsent, setHasConsent] = useState(false);
  const [needsRenewal, setNeedsRenewal] = useState(false);
  const [consentTimestamp, setConsentTimestamp] = useState<Date | null>(null);

  // Load initial consent state
  useEffect(() => {
    const loadConsentState = () => {
      const settings = getConsentSettings();
      const timestamp = getConsentTimestamp();
      const renewal = needsConsentRenewal();

      setConsentSettings(settings);
      setHasConsent(!!settings);
      setNeedsRenewal(renewal);
      setConsentTimestamp(timestamp);
    };

    loadConsentState();

    // Listen for consent changes from other components
    const handleConsentChange = (event: CustomEvent<CookieConsentSettings>) => {
      setConsentSettings(event.detail);
      setHasConsent(true);
      setNeedsRenewal(false);
      setConsentTimestamp(new Date());
    };

    window.addEventListener('cookieConsentChanged', handleConsentChange as EventListener);

    return () => {
      window.removeEventListener('cookieConsentChanged', handleConsentChange as EventListener);
    };
  }, []);

  // Category consent checks
  const isNecessaryConsented = consentSettings?.necessary ?? false;
  const isAnalyticsConsented = consentSettings?.analytics ?? false;
  const isMarketingConsented = consentSettings?.marketing ?? false;
  const isPreferencesConsented = consentSettings?.preferences ?? false;

  // Utility flags
  const canUseAnalytics = hasConsent && isAnalyticsConsented;
  const canUseMarketing = hasConsent && isMarketingConsented;
  const canUsePreferences = hasConsent && isPreferencesConsented;

  // Update consent settings
  const updateConsent = useCallback((settings: CookieConsentSettings) => {
    saveConsentSettings(settings);
    setConsentSettings(settings);
    setHasConsent(true);
    setNeedsRenewal(false);
    setConsentTimestamp(new Date());
  }, []);

  // Accept all cookies
  const acceptAll = useCallback(() => {
    const settings: CookieConsentSettings = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
    };
    updateConsent(settings);
  }, [updateConsent]);

  // Reject all non-essential cookies
  const rejectAll = useCallback(() => {
    const settings: CookieConsentSettings = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
    };
    updateConsent(settings);
  }, [updateConsent]);

  // Clear all non-essential cookies
  const clearCookies = useCallback(() => {
    clearNonEssentialCookies();
    setConsentSettings({
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
    });
  }, []);

  return {
    // State
    consentSettings,
    hasConsent,
    needsRenewal,
    consentTimestamp,
    
    // Category checks
    isNecessaryConsented,
    isAnalyticsConsented,
    isMarketingConsented,
    isPreferencesConsented,
    
    // Actions
    updateConsent,
    acceptAll,
    rejectAll,
    clearCookies,
    
    // Utilities
    canUseAnalytics,
    canUseMarketing,
    canUsePreferences,
  };
}

// Helper hook for specific category consent
export function useCategoryConsent(category: keyof CookieConsentSettings) {
  const { consentSettings, hasConsent } = useCookieConsent();
  
  return hasConsent && (consentSettings?.[category] ?? false);
}

// Helper hook for analytics
export function useAnalyticsConsent() {
  return useCategoryConsent('analytics');
}

// Helper hook for marketing
export function useMarketingConsent() {
  return useCategoryConsent('marketing');
}

// Helper hook for preferences
export function usePreferencesConsent() {
  return useCategoryConsent('preferences');
}