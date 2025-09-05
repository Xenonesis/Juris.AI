import { createClient } from '@/lib/supabase/client';

export interface TermsAcceptance {
  accepted_terms: boolean;
  accepted_privacy: boolean;
  terms_accepted_at: string | null;
  privacy_accepted_at: string | null;
}

/**
 * Check if user has accepted terms and privacy policy
 */
export async function checkTermsAcceptance(userId: string): Promise<TermsAcceptance | null> {
  try {
    const supabase = createClient();
    
    // First try to get basic profile info to ensure user exists
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .single();
    
    if (profileError || !profile) {
      console.error('Profile not found:', profileError);
      return null;
    }
    
    // Now try to get terms acceptance data
    const { data, error } = await supabase
      .from('profiles')
      .select('accepted_terms, accepted_privacy, terms_accepted_at, privacy_accepted_at')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error checking terms acceptance:', error);
      // Return default values if columns don't exist yet
      return {
        accepted_terms: false,
        accepted_privacy: false,
        terms_accepted_at: null,
        privacy_accepted_at: null
      };
    }
    
    return data;
  } catch (error) {
    console.error('Error in checkTermsAcceptance:', error);
    return {
      accepted_terms: false,
      accepted_privacy: false,
      terms_accepted_at: null,
      privacy_accepted_at: null
    };
  }
}

/**
 * Update user's terms and privacy policy acceptance
 */
export async function updateTermsAcceptance(
  userId: string,
  acceptTerms: boolean = true,
  acceptPrivacy: boolean = true
): Promise<boolean> {
  try {
    const supabase = createClient();
    
    const now = new Date().toISOString();
    const updateData: any = {
      accepted_terms: acceptTerms,
      accepted_privacy: acceptPrivacy,
      updated_at: now,
    };
    
    if (acceptTerms) {
      updateData.terms_accepted_at = now;
    }
    
    if (acceptPrivacy) {
      updateData.privacy_accepted_at = now;
    }
    
    const { error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', userId);
    
    if (error) {
      console.error('Error updating terms acceptance:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in updateTermsAcceptance:', error);
    return false;
  }
}

/**
 * Check if user needs to accept terms (for existing users)
 */
export async function userNeedsTermsAcceptance(userId: string): Promise<boolean> {
  const acceptance = await checkTermsAcceptance(userId);
  
  if (!acceptance) {
    return true; // If we can't check, assume they need to accept
  }
  
  return !acceptance.accepted_terms || !acceptance.accepted_privacy;
}

/**
 * Create a terms acceptance dialog component data
 */
export function getTermsAcceptanceData() {
  return {
    title: "Terms and Privacy Policy",
    description: "Please review and accept our Terms of Service and Privacy Policy to continue using Juris.AI.",
    termsUrl: "/terms-of-service",
    privacyUrl: "/privacy-policy",
    termsText: "I agree to the Terms of Service",
    privacyText: "I agree to the Privacy Policy",
    acceptButtonText: "Accept and Continue",
    declineButtonText: "Decline",
  };
}
