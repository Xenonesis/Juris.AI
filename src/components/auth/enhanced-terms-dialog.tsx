'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FileText, Shield, AlertTriangle, ExternalLink, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/components/auth/supabase-auth-provider';
import { verifyTermsAcceptance, updateTermsAcceptance } from '@/lib/terms-verification';
import { createClient } from '@/lib/supabase/client';

interface EnhancedTermsDialogProps {
  onAcceptance?: (accepted: boolean) => void;
  forceShow?: boolean;
}

export function EnhancedTermsDialog({ onAcceptance, forceShow = false }: EnhancedTermsDialogProps) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [acceptedCookies, setAcceptedCookies] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [verificationResult, setVerificationResult] = useState<any>(null);

  // Check if user needs to accept terms
  useEffect(() => {
    async function checkUserTerms() {
      if (!user && !forceShow) {
        setChecking(false);
        return;
      }

      if (forceShow) {
        setIsOpen(true);
        setChecking(false);
        return;
      }

      try {
        const verification = await verifyTermsAcceptance(user!.id);
        setVerificationResult(verification);
        
        if (!verification.isValid) {
          setError('Unable to verify terms status');
          setIsOpen(true);
        } else {
          setIsOpen(verification.needsUpdate);
        }
      } catch (error) {
        console.error('Error checking terms acceptance:', error);
        setError('Error checking terms status');
        setIsOpen(true);
      } finally {
        setChecking(false);
      }
    }

    checkUserTerms();
  }, [user, forceShow]);

  const handleAccept = async () => {
    if (!user || (!acceptedTerms || !acceptedPrivacy)) {
      setError('Please accept both Terms of Service and Privacy Policy');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const result = await updateTermsAcceptance(user.id, {
        acceptTerms: acceptedTerms,
        acceptPrivacy: acceptedPrivacy,
        acceptCookies: acceptedCookies,
      });
      
      if (result.success) {
        setIsOpen(false);
        onAcceptance?.(true);
      } else {
        setError(result.errors.join(', '));
      }
    } catch (error) {
      console.error('Error updating terms acceptance:', error);
      setError('Failed to save terms acceptance. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDecline = async () => {
    if (!user) return;
    
    // Sign out the user if they decline
    const supabase = createClient();
    await supabase.auth.signOut();
    setIsOpen(false);
    onAcceptance?.(false);
  };

  // Don't render anything while checking or if user is not logged in (unless forced)
  if (checking || (!user && !forceShow)) {
    return null;
  }

  const canAccept = acceptedTerms && acceptedPrivacy;

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
            <Shield className="h-6 w-6 text-blue-600" />
          </div>
          <DialogTitle className="text-xl font-bold">
            Terms and Privacy Policy
          </DialogTitle>
          <DialogDescription className="text-center">
            {verificationResult?.needsUpdate 
              ? 'Our Terms of Service and Privacy Policy have been updated. Please review and accept the new terms to continue.'
              : 'To continue using Juris.AI, please review and accept our Terms of Service and Privacy Policy.'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {error && (
            <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-red-800 dark:text-red-200">
                  <p className="font-medium mb-1">Error</p>
                  <p>{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-amber-800 dark:text-amber-200">
                <p className="font-medium mb-1">Important Legal Documents</p>
                <p>Please read our Terms of Service and Privacy Policy carefully before accepting.</p>
                {verificationResult && (
                  <p className="mt-2 text-xs">
                    Current versions: Terms v{verificationResult.termsVersion || 'N/A'}, 
                    Privacy v{verificationResult.privacyVersion || 'N/A'}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="terms-dialog"
                checked={acceptedTerms}
                onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
                className="mt-1"
              />
              <label htmlFor="terms-dialog" className="text-sm leading-5 flex-1">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>I have read and agree to the</span>
                  <Link 
                    href="/terms-of-service" 
                    className="text-blue-600 hover:underline font-medium inline-flex items-center gap-1" 
                    target="_blank"
                  >
                    Terms of Service
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
              </label>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="privacy-dialog"
                checked={acceptedPrivacy}
                onCheckedChange={(checked) => setAcceptedPrivacy(checked === true)}
                className="mt-1"
              />
              <label htmlFor="privacy-dialog" className="text-sm leading-5 flex-1">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span>I have read and agree to the</span>
                  <Link 
                    href="/privacy-policy" 
                    className="text-blue-600 hover:underline font-medium inline-flex items-center gap-1" 
                    target="_blank"
                  >
                    Privacy Policy
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
              </label>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="cookies-dialog"
                checked={acceptedCookies}
                onCheckedChange={(checked) => setAcceptedCookies(checked === true)}
                className="mt-1"
              />
              <label htmlFor="cookies-dialog" className="text-sm leading-5 flex-1">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>I accept cookies for analytics and preferences (optional)</span>
                </div>
              </label>
            </div>
          </div>

          <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
            By accepting these terms, you confirm that you are at least 18 years old and have the legal capacity to enter into this agreement.
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={handleDecline}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            Decline & Sign Out
          </Button>
          <Button
            onClick={handleAccept}
            disabled={loading || !canAccept}
            className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {loading ? 'Updating...' : 'Accept & Continue'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}