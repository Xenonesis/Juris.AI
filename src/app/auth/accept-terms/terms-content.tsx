'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  FileText, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  ExternalLink, 
  Clock,
  Scale,
  Lock,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/components/auth/supabase-auth-provider';
import Link from 'next/link';
import { JurisLogo } from '@/components/juris-logo';

export default function TermsAcceptancePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, refreshSession } = useAuth();
  
  const redirectTo = searchParams.get('redirect') || '/';
  const reason = searchParams.get('reason') || 'pending';
  
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/auth/login?redirect=' + encodeURIComponent(redirectTo));
      return;
    }
  }, [user, router, redirectTo]);

  const handleAcceptTerms = async () => {
    if (!user) {
      setError('User not authenticated. Please log in again.');
      return;
    }

    if (!acceptedTerms || !acceptedPrivacy) {
      setError('Please accept both Terms of Service and Privacy Policy to continue.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      
      // Update user profile with terms acceptance
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          terms_accepted: acceptedTerms,
          terms_accepted_at: new Date().toISOString(),
          privacy_accepted: acceptedPrivacy,
          privacy_accepted_at: new Date().toISOString(),
          account_status: 'active',
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (updateError) {
        console.error('Error updating profile:', updateError);
        setError('Failed to save your preferences. Please try again.');
        setLoading(false);
        return;
      }

      // Refresh session to update middleware checks
      await refreshSession();

      // Redirect to intended destination
      setTimeout(() => {
        router.push(redirectTo);
      }, 1000);

    } catch (error) {
      console.error('Error accepting terms:', error);
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Redirecting to login...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <JurisLogo />
          </div>
          <h1 className="text-3xl font-bold mb-2">Legal Agreement Required</h1>
          <p className="text-muted-foreground">
            Complete your account setup by accepting our legal terms
          </p>
        </div>

        {/* Terms Acceptance Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Legal Documents
            </CardTitle>
            <CardDescription>
              Please review and accept the following legal documents to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Terms of Service */}
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="accept-terms"
                  checked={acceptedTerms}
                  onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
                  className="mt-1"
                />
                <div className="space-y-2">
                  <label htmlFor="accept-terms" className="text-sm font-medium leading-5">
                    I have read and agree to the{" "}
                    <Link 
                      href="/terms-of-service" 
                      className="text-blue-600 hover:underline font-medium inline-flex items-center gap-1"
                      target="_blank"
                    >
                      Terms of Service
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </label>
                </div>
              </div>
            </div>

            <Separator />

            {/* Privacy Policy */}
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="accept-privacy"
                  checked={acceptedPrivacy}
                  onCheckedChange={(checked) => setAcceptedPrivacy(checked === true)}
                  className="mt-1"
                />
                <div className="space-y-2">
                  <label htmlFor="accept-privacy" className="text-sm font-medium leading-5">
                    I have read and agree to the{" "}
                    <Link 
                      href="/privacy-policy" 
                      className="text-blue-600 hover:underline font-medium inline-flex items-center gap-1"
                      target="_blank"
                    >
                      Privacy Policy
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </label>
                </div>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                onClick={handleAcceptTerms}
                disabled={loading || !acceptedTerms || !acceptedPrivacy}
                className="flex-1"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Saving...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    <span>Accept and Continue</span>
                  </div>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push('/auth/login')}
                disabled={loading}
              >
                <Lock className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
