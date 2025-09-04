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
      const requiresConsent = isConsentRequired();

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

    saveConsentSettings(settings);
    setShowBanner(false);
    setIsLoading(false);
  };

  const handleAcceptNecessary = async () => {
    setIsLoading(true);
    
    const settings: CookieConsentSettings = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
    };

    saveConsentSettings(settings);
    setShowBanner(false);
    setIsLoading(false);
  };

  const handleCustomize = () => {
    setShowSettings(true);
  };

  const handleSettingsSave = (settings: CookieConsentSettings) => {
    saveConsentSettings(settings);
    setShowBanner(false);
    setShowSettings(false);
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
                    We use cookies to enhance your experience, analyze site usage, and assist in our marketing efforts. 
                    You can customize your preferences or accept all cookies to continue.
                  </p>
                  
                  {/* Cookie Categories Preview */}
                  <div className="flex flex-wrap gap-2">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Shield className="h-3 w-3" />
                      <span>Essential</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Eye className="h-3 w-3" />
                      <span>Analytics</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Target className="h-3 w-3" />
                      <span>Marketing</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Sliders className="h-3 w-3" />
                      <span>Preferences</span>
                    </div>
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

              {/* Privacy Policy Link */}
              <div className="mt-4 pt-4 border-t">
                <p className="text-xs text-muted-foreground">
                  By continuing to use our site, you agree to our{' '}
                  <a 
                    href="/privacy-policy" 
                    className="text-primary hover:underline font-medium"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Privacy Policy
                  </a>
                  {' '}and{' '}
                  <a 
                    href="/terms-of-service" 
                    className="text-primary hover:underline font-medium"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Terms of Service
                  </a>
                  . You can change your preferences at any time.
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