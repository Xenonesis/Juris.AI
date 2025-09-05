'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, Settings, X, Shield, Eye, Target, Sliders } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  getConsentSettings, 
  saveConsentSettings, 
  needsConsentRenewal,
  isConsentRequired,
  CookieConsentSettings 
} from '@/lib/cookies';
import { 
  validateConsent, 
  recordConsent, 
  requiresCookieConsent 
} from '@/lib/cookie-consent-validator';
import { CookieSettingsDialog } from './cookie-settings-dialog';

export function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if we need to show the banner
    const checkConsent = () => {
      const hasConsent = getConsentSettings();
      const needsRenewal = needsConsentRenewal();
      const requiresConsent = requiresCookieConsent();

      // Show banner if consent is required and either no consent exists or renewal is needed
      setShowBanner(requiresConsent && (!hasConsent || needsRenewal));
    };

    // Delay to avoid hydration issues
    const timer = setTimeout(checkConsent, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleAcceptAll = async () => {
    setIsLoading(true);
    
    const settings: CookieConsentSettings = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
    };

    // Validate consent before saving
    const validation = validateConsent(settings);
    if (!validation.isValid) {
      console.error('Consent validation failed:', validation.errors);
      setIsLoading(false);
      return;
    }

    // Record consent for audit trail
    recordConsent(settings, 'banner');
    
    // Save consent settings
    saveConsentSettings(settings);
    setShowBanner(false);
    setIsLoading(false);

    // Track consent acceptance for analytics (if enabled)
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'cookie_consent', {
        event_category: 'engagement',
        event_label: 'accept_all',
      });
    }
  };

  const handleAcceptNecessary = async () => {
    setIsLoading(true);
    
    const settings: CookieConsentSettings = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
    };

    // Validate consent before saving
    const validation = validateConsent(settings);
    if (!validation.isValid) {
      console.error('Consent validation failed:', validation.errors);
      setIsLoading(false);
      return;
    }

    // Record consent for audit trail
    recordConsent(settings, 'banner');
    
    // Save consent settings
    saveConsentSettings(settings);
    setShowBanner(false);
    setIsLoading(false);

    // Track consent rejection (using essential cookies only)
  };

  const handleCustomize = () => {
    setShowSettings(true);
  };

  const handleSettingsSave = (settings: CookieConsentSettings) => {
    // Validate consent before saving
    const validation = validateConsent(settings);
    if (!validation.isValid) {
      console.error('Consent validation failed:', validation.errors);
      return;
    }

    // Record consent for audit trail
    recordConsent(settings, 'settings');
    
    // Save consent settings
    saveConsentSettings(settings);
    setShowBanner(false);
    setShowSettings(false);

    // Track custom consent settings
    if (typeof window !== 'undefined' && window.gtag && settings.analytics) {
      window.gtag('event', 'cookie_consent', {
        event_category: 'engagement',
        event_label: 'custom_settings',
        custom_parameters: {
          analytics: settings.analytics,
          marketing: settings.marketing,
          preferences: settings.preferences,
        },
      });
    }
  };

  if (!showBanner) return null;

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/95 backdrop-blur-sm border-t shadow-lg"
        >
          <Card className="max-w-6xl mx-auto">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
                {/* Icon and Title */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Cookie className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Cookie Preferences</h3>
                    <Badge variant="secondary" className="text-xs">
                      GDPR Compliant
                    </Badge>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 space-y-3">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">We value your privacy.</strong> This website uses cookies to provide essential functionality, 
                    analyze usage patterns, and enhance your experience. Some cookies require your consent, while others are essential for the site to work.
                  </p>
                  
                  {/* Cookie Categories Preview */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <div className="flex items-center gap-1 text-xs bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded">
                      <Shield className="h-3 w-3 text-green-600" />
                      <span className="font-medium">Essential</span>
                      <span className="text-green-600">Always On</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">
                      <Eye className="h-3 w-3 text-blue-600" />
                      <span className="font-medium">Analytics</span>
                      <span className="text-blue-600">Optional</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs bg-purple-50 dark:bg-purple-900/20 px-2 py-1 rounded">
                      <Target className="h-3 w-3 text-purple-600" />
                      <span className="font-medium">Marketing</span>
                      <span className="text-purple-600">Optional</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded">
                      <Sliders className="h-3 w-3 text-orange-600" />
                      <span className="font-medium">Preferences</span>
                      <span className="text-orange-600">Optional</span>
                    </div>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    <strong>Essential cookies</strong> are automatically enabled and cannot be disabled as they&apos;re required for basic website functionality.
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCustomize}
                    disabled={isLoading}
                    className="flex items-center gap-2"
                  >
                    <Settings className="h-4 w-4" />
                    Customize
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAcceptNecessary}
                    disabled={isLoading}
                  >
                    Essential Only
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleAcceptAll}
                    disabled={isLoading}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Accept All
                  </Button>
                </div>
              </div>

              {/* Legal Links and Information */}
              <div className="mt-4 pt-4 border-t space-y-2">
                <p className="text-xs text-muted-foreground">
                  We use cookies to provide essential website functionality, analyze usage patterns, and enhance your experience. 
                  Essential cookies are always active, while optional cookies require your consent.
                </p>
                <div className="flex flex-wrap items-center gap-4 text-xs">
                  <a 
                    href="/privacy-policy" 
                    className="text-primary hover:underline font-medium inline-flex items-center gap-1"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Privacy Policy
                  </a>
                  <a 
                    href="/terms-of-service" 
                    className="text-primary hover:underline font-medium inline-flex items-center gap-1"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Terms of Service
                  </a>
                  <span className="text-muted-foreground">
                    Last updated: {new Date().toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  By clicking &quot;Accept All&quot;, you consent to our use of cookies. You can manage your preferences anytime.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      <CookieSettingsDialog
        open={showSettings}
        onOpenChange={setShowSettings}
        onSave={handleSettingsSave}
      />
    </>
  );
}