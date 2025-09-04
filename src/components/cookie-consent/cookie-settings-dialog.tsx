'use client';

import React, { useState, useEffect } from 'react';
import { Shield, Eye, Target, Sliders, Info, Clock, Database } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  getConsentSettings, 
  getConsentTimestamp,
  CookieConsentSettings,
  COOKIE_NAMES 
} from '@/lib/cookies';

interface CookieSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (settings: CookieConsentSettings) => void;
}

interface CookieCategory {
  id: keyof CookieConsentSettings;
  title: string;
  description: string;
  icon: React.ReactNode;
  required: boolean;
  cookies: Array<{
    name: string;
    purpose: string;
    duration: string;
    type: 'first-party' | 'third-party';
  }>;
}

const cookieCategories: CookieCategory[] = [
  {
    id: 'necessary',
    title: 'Strictly Necessary',
    description: 'These cookies are essential for the website to function properly. They cannot be disabled.',
    icon: <Shield className="h-5 w-5" />,
    required: true,
    cookies: [
      {
        name: COOKIE_NAMES.CONSENT,
        purpose: 'Stores your cookie consent preferences',
        duration: '1 year',
        type: 'first-party',
      },
      {
        name: COOKIE_NAMES.SESSION,
        purpose: 'Maintains your session and authentication state',
        duration: 'Session',
        type: 'first-party',
      },
      {
        name: COOKIE_NAMES.CSRF_TOKEN,
        purpose: 'Prevents cross-site request forgery attacks',
        duration: '24 hours',
        type: 'first-party',
      },
    ],
  },
  {
    id: 'analytics',
    title: 'Analytics & Performance',
    description: 'These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.',
    icon: <Eye className="h-5 w-5" />,
    required: false,
    cookies: [
      {
        name: COOKIE_NAMES.ANALYTICS,
        purpose: 'Tracks page views, user interactions, and performance metrics',
        duration: '2 years',
        type: 'first-party',
      },
      {
        name: '_ga',
        purpose: 'Google Analytics - distinguishes unique users',
        duration: '2 years',
        type: 'third-party',
      },
      {
        name: '_ga_*',
        purpose: 'Google Analytics - session and campaign data',
        duration: '2 years',
        type: 'third-party',
      },
    ],
  },
  {
    id: 'marketing',
    title: 'Marketing & Advertising',
    description: 'These cookies are used to deliver relevant advertisements and track the effectiveness of our marketing campaigns.',
    icon: <Target className="h-5 w-5" />,
    required: false,
    cookies: [
      {
        name: '_fbp',
        purpose: 'Facebook Pixel - tracks conversions and user behavior',
        duration: '3 months',
        type: 'third-party',
      },
      {
        name: 'ads_data',
        purpose: 'Stores advertising preferences and targeting data',
        duration: '1 year',
        type: 'first-party',
      },
    ],
  },
  {
    id: 'preferences',
    title: 'Preferences & Functionality',
    description: 'These cookies remember your preferences and settings to provide a more personalized experience.',
    icon: <Sliders className="h-5 w-5" />,
    required: false,
    cookies: [
      {
        name: COOKIE_NAMES.PREFERENCES,
        purpose: 'Stores your UI preferences, theme, and language settings',
        duration: '1 year',
        type: 'first-party',
      },
      {
        name: 'jurisdiction_pref',
        purpose: 'Remembers your selected legal jurisdiction',
        duration: '6 months',
        type: 'first-party',
      },
    ],
  },
];

export function CookieSettingsDialog({ open, onOpenChange, onSave }: CookieSettingsDialogProps) {
  const [settings, setSettings] = useState<CookieConsentSettings>({
    necessary: true,
    analytics: false,
    marketing: false,
    preferences: false,
  });

  useEffect(() => {
    if (open) {
      const currentSettings = getConsentSettings();
      if (currentSettings) {
        setSettings(currentSettings);
      }
    }
  }, [open]);

  const handleToggle = (category: keyof CookieConsentSettings, enabled: boolean) => {
    setSettings(prev => ({
      ...prev,
      [category]: enabled,
    }));
  };

  const handleAcceptAll = () => {
    const allEnabled: CookieConsentSettings = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
    };
    onSave(allEnabled);
  };

  const handleRejectAll = () => {
    const onlyNecessary: CookieConsentSettings = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
    };
    onSave(onlyNecessary);
  };

  const handleSaveCustom = () => {
    onSave(settings);
  };

  const consentTimestamp = getConsentTimestamp();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Cookie Settings
          </DialogTitle>
          <DialogDescription>
            Manage your cookie preferences. You can enable or disable different types of cookies below.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="categories" className="flex-1 overflow-hidden">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="details">Cookie Details</TabsTrigger>
          </TabsList>

          <TabsContent value="categories" className="space-y-4 overflow-y-auto max-h-[60vh]">
            {cookieCategories.map((category) => (
              <Card key={category.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        {category.icon}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{category.title}</CardTitle>
                        {category.required && (
                          <Badge variant="secondary" className="mt-1">
                            Required
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Switch
                      checked={settings[category.id]}
                      onCheckedChange={(checked) => handleToggle(category.id, checked)}
                      disabled={category.required}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">
                    {category.description}
                  </CardDescription>
                  <div className="mt-3 text-xs text-muted-foreground">
                    {category.cookies.length} cookie{category.cookies.length !== 1 ? 's' : ''} in this category
                  </div>
                </CardContent>
              </Card>
            ))}

            {consentTimestamp && (
              <Card className="bg-muted/50">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>
                      Last updated: {consentTimestamp.toLocaleDateString()} at {consentTimestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="details" className="space-y-4 overflow-y-auto max-h-[60vh]">
            {cookieCategories.map((category) => (
              <Card key={category.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {category.icon}
                    {category.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {category.cookies.map((cookie, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                          {cookie.name}
                        </code>
                        <Badge variant={cookie.type === 'first-party' ? 'default' : 'secondary'}>
                          {cookie.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{cookie.purpose}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Duration: {cookie.duration}</span>
                      </div>
                      {index < category.cookies.length - 1 && <Separator />}
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <div className="flex gap-2 flex-1">
            <Button variant="outline" onClick={handleRejectAll} className="flex-1">
              Reject All
            </Button>
            <Button variant="outline" onClick={handleAcceptAll} className="flex-1">
              Accept All
            </Button>
          </div>
          <Button onClick={handleSaveCustom} className="sm:w-auto">
            Save Preferences
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}