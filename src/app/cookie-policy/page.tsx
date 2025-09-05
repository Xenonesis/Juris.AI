import React from 'react';
import { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Cookie, 
  Shield, 
  Eye, 
  Target, 
  Sliders, 
  Clock, 
  Globe, 
  Lock,
  FileText,
  ExternalLink,
  Info
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const metadata: Metadata = {
  title: "Cookie Policy - Juris.Ai",
  description: "Detailed information about how Juris.Ai uses cookies and similar tracking technologies.",
};

interface CookieInfo {
  name: string;
  purpose: string;
  duration: string;
  type: 'Essential' | 'Analytics' | 'Marketing' | 'Preferences';
  provider: string;
  dataShared?: string;
}

const cookieCategories = [
  {
    id: 'essential',
    title: 'Essential Cookies',
    icon: <Shield className="h-6 w-6" />,
    description: 'These cookies are strictly necessary for the website to function and cannot be switched off. They are usually only set in response to actions made by you which amount to a request for services.',
    canDisable: false,
    cookies: [
      {
        name: 'juris_cookie_consent',
        purpose: 'Stores your cookie consent preferences and choices',
        duration: '1 year',
        type: 'Essential' as const,
        provider: 'Juris.Ai (First-party)',
      },
      {
        name: 'juris_consent_timestamp',
        purpose: 'Records when you gave consent to track consent validity',
        duration: '1 year',
        type: 'Essential' as const,
        provider: 'Juris.Ai (First-party)',
      },
      {
        name: 'juris_session',
        purpose: 'Maintains your login session and authentication state',
        duration: 'Session (until browser closes)',
        type: 'Essential' as const,
        provider: 'Juris.Ai (First-party)',
      },
      {
        name: 'juris_csrf_token',
        purpose: 'Protects against cross-site request forgery attacks',
        duration: '24 hours',
        type: 'Essential' as const,
        provider: 'Juris.Ai (First-party)',
      },
      {
        name: 'sb-*',
        purpose: 'Supabase authentication and session management',
        duration: 'Session to 1 year',
        type: 'Essential' as const,
        provider: 'Supabase (Third-party)',
        dataShared: 'Authentication data shared with Supabase for user management',
      },
    ],
  },
  {
    id: 'analytics',
    title: 'Analytics Cookies',
    icon: <Eye className="h-6 w-6" />,
    description: 'These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve our website and services.',
    canDisable: true,
    cookies: [
      {
        name: 'juris_analytics',
        purpose: 'Tracks page views, user interactions, and site performance metrics',
        duration: '2 years',
        type: 'Analytics' as const,
        provider: 'Juris.Ai (First-party)',
      },
      {
        name: '_ga',
        purpose: 'Google Analytics - distinguishes unique users and sessions',
        duration: '2 years',
        type: 'Analytics' as const,
        provider: 'Google Analytics (Third-party)',
        dataShared: 'Anonymized usage data shared with Google for analytics',
      },
      {
        name: '_ga_*',
        purpose: 'Google Analytics - stores session and campaign information',
        duration: '2 years',
        type: 'Analytics' as const,
        provider: 'Google Analytics (Third-party)',
        dataShared: 'Session and campaign data shared with Google',
      },
      {
        name: '_gid',
        purpose: 'Google Analytics - distinguishes users for 24 hours',
        duration: '24 hours',
        type: 'Analytics' as const,
        provider: 'Google Analytics (Third-party)',
        dataShared: 'User identification data shared with Google',
      },
    ],
  },
  {
    id: 'marketing',
    title: 'Marketing Cookies',
    icon: <Target className="h-6 w-6" />,
    description: 'These cookies are used to deliver advertisements more relevant to you and your interests. They may also be used to limit the number of times you see an advertisement and measure the effectiveness of advertising campaigns.',
    canDisable: true,
    cookies: [
      {
        name: '_fbp',
        purpose: 'Facebook Pixel - tracks conversions and user behavior for advertising',
        duration: '3 months',
        type: 'Marketing' as const,
        provider: 'Meta/Facebook (Third-party)',
        dataShared: 'Conversion and behavioral data shared with Meta for advertising optimization',
      },
      {
        name: '_fbc',
        purpose: 'Facebook click tracking for attribution and conversion measurement',
        duration: '7 days',
        type: 'Marketing' as const,
        provider: 'Meta/Facebook (Third-party)',
        dataShared: 'Click attribution data shared with Meta',
      },
      {
        name: 'ads_data',
        purpose: 'Stores advertising preferences and targeting information',
        duration: '1 year',
        type: 'Marketing' as const,
        provider: 'Juris.Ai (First-party)',
      },
    ],
  },
  {
    id: 'preferences',
    title: 'Preference Cookies',
    icon: <Sliders className="h-6 w-6" />,
    description: 'These cookies allow the website to remember choices you make (such as your user name, language, or the region you are in) and provide enhanced, more personal features.',
    canDisable: true,
    cookies: [
      {
        name: 'juris_preferences',
        purpose: 'Stores your UI preferences, theme settings, and display options',
        duration: '1 year',
        type: 'Preferences' as const,
        provider: 'Juris.Ai (First-party)',
      },
      {
        name: 'jurisdiction_pref',
        purpose: 'Remembers your selected legal jurisdiction for relevant content',
        duration: '6 months',
        type: 'Preferences' as const,
        provider: 'Juris.Ai (First-party)',
      },
      {
        name: 'theme',
        purpose: 'Stores your preferred color theme (light/dark mode)',
        duration: '1 year',
        type: 'Preferences' as const,
        provider: 'Juris.Ai (First-party)',
      },
    ],
  },
];

const CookiePolicyPage = () => {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20 bg-gradient-to-b from-background to-slate-50 dark:from-background dark:to-slate-900">
      <header className="text-center mb-16 md:mb-20">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent mb-4">
          Cookie Policy
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          This policy explains how Juris.Ai uses cookies and similar tracking technologies to enhance your experience and provide our services.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </header>

      {/* Introduction */}
      <Card className="mb-8 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-6 w-6 text-primary" />
            What Are Cookies?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            Cookies are small text files that are placed on your computer or mobile device when you visit a website. 
            They are widely used to make websites work more efficiently and to provide information to website owners.
          </p>
          <p>
            We use cookies and similar technologies to enhance your browsing experience, analyze site traffic, 
            personalize content, and serve targeted advertisements. This policy explains what cookies we use, 
            why we use them, and how you can control them.
          </p>
        </CardContent>
      </Card>

      {/* Cookie Categories */}
      <div className="space-y-8">
        {cookieCategories.map((category) => (
          <Card key={category.id} className="shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-full">
                    {category.icon}
                  </div>
                  <div>
                    <CardTitle className="text-2xl">{category.title}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={category.canDisable ? "secondary" : "default"}>
                        {category.canDisable ? "Optional" : "Required"}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {category.cookies.length} cookie{category.cookies.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <CardDescription className="text-base leading-relaxed mt-3">
                {category.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {category.cookies.map((cookie, index) => (
                  <div key={index}>
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2">
                            <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                              {cookie.name}
                            </code>
                            <Badge variant="outline" className="text-xs">
                              {cookie.provider}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {cookie.purpose}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>Duration: {cookie.duration}</span>
                            </div>
                            {cookie.provider.includes('Third-party') && (
                              <div className="flex items-center gap-1">
                                <Globe className="h-3 w-3" />
                                <span>Third-party</span>
                              </div>
                            )}
                          </div>
                          {'dataShared' in cookie && cookie.dataShared && (
                            <Alert className="mt-2">
                              <Lock className="h-4 w-4" />
                              <AlertDescription className="text-xs">
                                <strong>Data Sharing:</strong> {cookie.dataShared}
                              </AlertDescription>
                            </Alert>
                          )}
                        </div>
                      </div>
                    </div>
                    {index < category.cookies.length - 1 && <Separator className="mt-4" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Managing Cookies */}
      <Card className="mt-8 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cookie className="h-6 w-6 text-primary" />
            Managing Your Cookie Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-foreground mb-2">Through Our Website</h4>
              <p className="text-sm">
                You can manage your cookie preferences at any time by clicking the cookie preferences button 
                (cookie icon) in the bottom-left corner of our website. This allows you to enable or disable 
                different categories of cookies according to your preferences.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">Through Your Browser</h4>
              <p className="text-sm">
                Most web browsers allow you to control cookies through their settings. You can set your browser 
                to refuse cookies or to alert you when cookies are being sent. However, please note that if you 
                disable cookies, some parts of our website may not function properly.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">Third-Party Opt-Outs</h4>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li>Google Analytics: <a href="https://tools.google.com/dlpage/gaoptout" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Google Analytics Opt-out</a></li>
                <li>Facebook: <a href="https://www.facebook.com/settings?tab=ads" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Facebook Ad Preferences</a></li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Legal Information */}
      <Card className="mt-8 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            Legal Basis and Your Rights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-foreground mb-2">Legal Basis for Processing</h4>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li><strong>Essential cookies:</strong> Necessary for the performance of our contract with you</li>
                <li><strong>Analytics cookies:</strong> Based on your consent and our legitimate interest in improving our services</li>
                <li><strong>Marketing cookies:</strong> Based on your explicit consent</li>
                <li><strong>Preference cookies:</strong> Based on your consent and our legitimate interest in providing personalized services</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">Your Rights</h4>
              <p className="text-sm">
                Under applicable data protection laws, you have the right to:
              </p>
              <ul className="text-sm space-y-1 list-disc list-inside mt-2">
                <li>Withdraw your consent at any time</li>
                <li>Access information about the cookies we use</li>
                <li>Request deletion of your data</li>
                <li>Object to processing based on legitimate interests</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Related Policies */}
      <Card className="mt-8 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="h-6 w-6 text-primary" />
            Related Policies
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a 
              href="/privacy-policy"
              className="flex items-center gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <Shield className="h-5 w-5 text-primary" />
              <div>
                <h4 className="font-medium">Privacy Policy</h4>
                <p className="text-sm text-muted-foreground">Learn how we collect, use, and protect your personal information</p>
              </div>
            </a>
            <a 
              href="/terms-of-service"
              className="flex items-center gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <FileText className="h-5 w-5 text-primary" />
              <div>
                <h4 className="font-medium">Terms of Service</h4>
                <p className="text-sm text-muted-foreground">Read the terms and conditions for using our services</p>
              </div>
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card className="mt-8 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            Contact Us
          </CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          <p className="mb-4">
            If you have any questions about this Cookie Policy or our use of cookies, please contact us:
          </p>
          <div className="space-y-2 text-sm">
            <p><strong>Email:</strong> <a href="mailto:ititsaddy7@gmail.com" className="text-primary hover:underline">ititsaddy7@gmail.com</a></p>
            <p><strong>Website:</strong> <a href="https://juris.ai" className="text-primary hover:underline">https://juris.ai</a></p>
          </div>
          <p className="mt-4 text-xs">
            This Cookie Policy was last updated on {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}. We may update this policy from time to time, and we will notify you of any material changes.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CookiePolicyPage;