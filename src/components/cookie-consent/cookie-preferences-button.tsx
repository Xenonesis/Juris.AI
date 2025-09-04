'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Cookie, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CookieSettingsDialog } from './cookie-settings-dialog';
import { useCookieConsent } from '@/hooks/useCookieConsent';

interface CookiePreferencesButtonProps {
  className?: string;
  variant?: 'floating' | 'inline';
}

export function CookiePreferencesButton({ 
  className = '', 
  variant = 'floating' 
}: CookiePreferencesButtonProps) {
  const [showSettings, setShowSettings] = useState(false);
  const { updateConsent, hasConsent } = useCookieConsent();

  const handleSettingsSave = (settings: any) => {
    updateConsent(settings);
    setShowSettings(false);
  };

  if (variant === 'inline') {
    return (
      <>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowSettings(true)}
          className={`flex items-center gap-2 ${className}`}
        >
          <Cookie className="h-4 w-4" />
          Cookie Preferences
        </Button>

        <CookieSettingsDialog
          open={showSettings}
          onOpenChange={setShowSettings}
          onSave={handleSettingsSave}
        />
      </>
    );
  }

  // Only show floating button if user has given consent
  if (!hasConsent) return null;

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`fixed bottom-4 left-4 z-40 ${className}`}
            >
              <Button
                size="icon"
                onClick={() => setShowSettings(true)}
                className="h-12 w-12 rounded-full shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Cookie className="h-5 w-5" />
              </Button>
            </motion.div>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Manage Cookie Preferences</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <CookieSettingsDialog
        open={showSettings}
        onOpenChange={setShowSettings}
        onSave={handleSettingsSave}
      />
    </>
  );
}