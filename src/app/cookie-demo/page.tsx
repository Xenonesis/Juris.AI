'use client';

import React, { useState } from 'react';
import { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Cookie, 
  Shield, 
  Eye, 
  Target, 
  Sliders, 
  CheckCircle, 
  AlertTriangle,
  Info,
  Settings,
  Download
} from 'lucide-react';
import { CookieDashboard } from '@/components/cookie-consent/cookie-dashboard';
import { CookieSettingsDialog } from '@/components/cookie-consent/cookie-settings-dialog';
import { useCookieConsent } from '@/hooks/useCookieConsent';
import { setCookie, deleteCookie, getCookie } from '@/lib/cookies';

export default function CookieDemoPage() {
  const [showSettings, setShowSettings] = useState(false);
  const [testResults, setTestResults] = useState<string[]>([]);
  const {
    consentSettings,
    hasConsent,
    needsRenewal,
    consentTimestamp,
    updateConsent,
    acceptAll,
    rejectAll,
    canUseAnalytics,
    canUseMarketing,
    canUsePreferences,
  } = useCookieConsent();

  const runCookieTests = () => {
    const results: string[] = [];

    try {
      // Test 1: Set and retrieve a test cookie
      setCookie('test_cookie', 'test_value', { maxAge: 60 });
      const retrieved = getCookie('test_cookie');
      results.push(retrieved === 'test_value' ? '✅ Cookie set/get test passed' : '❌ Cookie set/get test failed');

      // Test 2: Test secure cookie options
      setCookie('secure_test', 'secure_value', { 
        secure: true, 
        sameSite: 'strict',
        maxAge: 60 
      });
      results.push('✅ Secure cookie options applied');

      // Test 3: Test cookie deletion
      deleteCookie('test_cookie');
      const deleted = getCookie('test_cookie');
      results.push(!deleted ? '✅ Cookie deletion test passed' : '❌ Cookie deletion test failed');

      // Test 4: Test consent state
      results.push(hasConsent ? '✅ Consent state detected' : '⚠️ No consent state found');

      // Test 5: Test category permissions
      results.push(`Analytics consent: ${canUseAnalytics ? '✅ Enabled' : '❌ Disabled'}`);
      results.push(`Marketing consent: ${canUseMarketing ? '✅ Enabled' : '❌ Disabled'}`);
      results.push(`Preferences consent: ${canUsePreferences ? '✅ Enabled' : '❌ Disabled'}`);

      // Clean up
      deleteCookie('secure_test');

    } catch (error) {
      results.push(`❌ Test error: ${error}`);
    }

    setTestResults(results);
  };

  const handleSettingsSave = (settings: any) => {
    updateConsent(settings);
    setShowSettings(false);
  };

  return (
    <div className="container mx-auto px-4 py-12 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
          Cookie Management Demo
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Explore our comprehensive cookie consent system with GDPR compliance, security features, and user-friendly management tools.
        </p>
      </div>

      {/* Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cookie className="h-5 w-5" />
            Current Cookie Status
          </CardTitle>
          <CardDescription>
            Overview of your current cookie consent and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="text-sm">Necessary:</span>
              <Badge variant="default">Always On</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <span className="text-sm">Analytics:</span>
              <Badge variant={canUseAnalytics ? 'default' : 'secondary'}>
                {canUseAnalytics ? 'Enabled' : 'Disabled'}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              <span className="text-sm">Marketing:</span>
              <Badge variant={canUseMarketing ? 'default' : 'secondary'}>
                {canUseMarketing ? 'Enabled' : 'Disabled'}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Sliders className="h-4 w-4" />
              <span className="text-sm">Preferences:</span>
              <Badge variant={canUsePreferences ? 'default' : 'secondary'}>
                {canUsePreferences ? 'Enabled' : 'Disabled'}
              </Badge>
            </div>
          </div>

          {consentTimestamp && (
            <p className="text-sm text-muted-foreground">
              Last updated: {consentTimestamp.toLocaleString()}
            </p>
          )}

          {needsRenewal && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Consent Renewal Required</AlertTitle>
              <AlertDescription>
                Your cookie consent is older than 1 year and needs to be renewed.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Test and manage your cookie preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button onClick={acceptAll} variant="default">
              Accept All Cookies
            </Button>
            <Button onClick={rejectAll} variant="outline">
              Reject Non-Essential
            </Button>
            <Button onClick={() => setShowSettings(true)} variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Customize Settings
            </Button>
            <Button onClick={runCookieTests} variant="outline">
              Run Cookie Tests
            </Button>
          </div>

          {testResults.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Test Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1 font-mono text-sm">
                  {testResults.map((result, index) => (
                    <div key={index}>{result}</div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Features Showcase */}
      <Tabs defaultValue="features" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        </TabsList>

        <TabsContent value="features" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  GDPR Compliance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Explicit consent for non-essential cookies</li>
                  <li>• Granular category-based permissions</li>
                  <li>• Easy withdrawal of consent</li>
                  <li>• Automatic consent expiration (1 year)</li>
                  <li>• Comprehensive audit trail</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-500" />
                  Security Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• HttpOnly flags for sensitive cookies</li>
                  <li>• Secure flag for HTTPS transmission</li>
                  <li>• SameSite protection against CSRF</li>
                  <li>• Input sanitization and validation</li>
                  <li>• CSRF token generation and validation</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-purple-500" />
                  Analytics Integration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Consent-aware Google Analytics</li>
                  <li>• Facebook Pixel integration</li>
                  <li>• Automatic script loading/unloading</li>
                  <li>• Privacy-focused tracking</li>
                  <li>• Custom event tracking</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-orange-500" />
                  User Experience
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Non-intrusive banner design</li>
                  <li>• Detailed cookie information</li>
                  <li>• Floating preferences button</li>
                  <li>• Mobile-responsive interface</li>
                  <li>• Accessibility compliant</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Security Implementation</AlertTitle>
            <AlertDescription>
              Our cookie system implements multiple layers of security to protect user data and prevent attacks.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Cookie Security Flags</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <h4 className="font-medium">HttpOnly</h4>
                  <p className="text-sm text-muted-foreground">
                    Prevents client-side JavaScript access to sensitive cookies, protecting against XSS attacks.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Secure</h4>
                  <p className="text-sm text-muted-foreground">
                    Ensures cookies are only transmitted over HTTPS connections in production.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">SameSite</h4>
                  <p className="text-sm text-muted-foreground">
                    Protects against CSRF attacks by controlling when cookies are sent with cross-site requests.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Additional Protections</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <h4 className="font-medium">Input Validation</h4>
                  <p className="text-sm text-muted-foreground">
                    All cookie values are sanitized and validated to prevent injection attacks.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">CSRF Protection</h4>
                  <p className="text-sm text-muted-foreground">
                    CSRF tokens are automatically generated and validated for state-changing requests.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Audit Logging</h4>
                  <p className="text-sm text-muted-foreground">
                    Comprehensive logging of cookie operations for security monitoring.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="dashboard" className="space-y-4">
          <CookieDashboard />
        </TabsContent>
      </Tabs>

      <CookieSettingsDialog
        open={showSettings}
        onOpenChange={setShowSettings}
        onSave={handleSettingsSave}
      />
    </div>
  );
}