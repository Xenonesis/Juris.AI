/**
 * Terms Acceptance Verification System
 * Comprehensive system for managing and verifying terms acceptance
 */

import { createClient } from '@/lib/supabase/client';
import { createClient as createServerClient } from '@/lib/supabase/server';

export interface TermsVerificationResult {
  isValid: boolean;
  hasAcceptedTerms: boolean;
  hasAcceptedPrivacy: boolean;
  termsVersion: string | null;
  privacyVersion: string | null;
  termsAcceptedAt: string | null;
  privacyAcceptedAt: string | null;
  accountStatus: 'active' | 'pending_terms' | 'suspended';
  needsUpdate: boolean;
  errors: string[];
}

export interface TermsAcceptanceData {
  acceptTerms: boolean;
  acceptPrivacy: boolean;
  acceptCookies?: boolean;
  termsVersion?: string;
  privacyVersion?: string;
}

// Current versions of legal documents
export const CURRENT_TERMS_VERSION = '1.0';
export const CURRENT_PRIVACY_VERSION = '1.0';

/**
 * Verify user's current terms acceptance status
 */
export async function verifyTermsAcceptance(userId: string, useServerClient = false): Promise<TermsVerificationResult> {
  const errors: string[] = [];
  
  try {
    const supabase = useServerClient ? await createServerClient() : createClient();
    
    const { data: profile, error } = await supabase
      .from('profiles')
      .select(`
        terms_accepted,
        privacy_accepted,
        terms_version,
        privacy_version,
        terms_accepted_at,
        privacy_accepted_at,
        account_status,
        accepted_terms,
        accepted_privacy
      `)
      .eq('id', userId)
      .single();

    if (error) {
      errors.push(`Database error: ${error.message}`);
      return {
        isValid: false,
        hasAcceptedTerms: false,
        hasAcceptedPrivacy: false,
        termsVersion: null,
        privacyVersion: null,
        termsAcceptedAt: null,
        privacyAcceptedAt: null,
        accountStatus: 'pending_terms',
        needsUpdate: true,
        errors
      };
    }

    if (!profile) {
      errors.push('User profile not found');
      return {
        isValid: false,
        hasAcceptedTerms: false,
        hasAcceptedPrivacy: false,
        termsVersion: null,
        privacyVersion: null,
        termsAcceptedAt: null,
        privacyAcceptedAt: null,
        accountStatus: 'pending_terms',
        needsUpdate: true,
        errors
      };
    }

    // Check both old and new column names for backward compatibility
    const hasAcceptedTerms = profile.terms_accepted || profile.accepted_terms || false;
    const hasAcceptedPrivacy = profile.privacy_accepted || profile.accepted_privacy || false;
    const termsVersion = profile.terms_version;
    const privacyVersion = profile.privacy_version;

    // Check if versions are current
    const hasCurrentTermsVersion = termsVersion === CURRENT_TERMS_VERSION;
    const hasCurrentPrivacyVersion = privacyVersion === CURRENT_PRIVACY_VERSION;

    // Determine if update is needed
    const needsUpdate = !hasAcceptedTerms || 
                       !hasAcceptedPrivacy || 
                       !hasCurrentTermsVersion || 
                       !hasCurrentPrivacyVersion;

    // Determine account status
    let accountStatus: 'active' | 'pending_terms' | 'suspended' = 'pending_terms';
    if (hasAcceptedTerms && hasAcceptedPrivacy && hasCurrentTermsVersion && hasCurrentPrivacyVersion) {
      accountStatus = 'active';
    } else if (profile.account_status === 'suspended') {
      accountStatus = 'suspended';
    }

    return {
      isValid: true,
      hasAcceptedTerms,
      hasAcceptedPrivacy,
      termsVersion,
      privacyVersion,
      termsAcceptedAt: profile.terms_accepted_at,
      privacyAcceptedAt: profile.privacy_accepted_at,
      accountStatus,
      needsUpdate,
      errors
    };

  } catch (error) {
    errors.push(`Verification error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return {
      isValid: false,
      hasAcceptedTerms: false,
      hasAcceptedPrivacy: false,
      termsVersion: null,
      privacyVersion: null,
      termsAcceptedAt: null,
      privacyAcceptedAt: null,
      accountStatus: 'pending_terms',
      needsUpdate: true,
      errors
    };
  }
}

/**
 * Update user's terms acceptance
 */
export async function updateTermsAcceptance(
  userId: string, 
  acceptanceData: TermsAcceptanceData,
  useServerClient = false
): Promise<{ success: boolean; errors: string[] }> {
  const errors: string[] = [];

  try {
    // Validate input
    if (!acceptanceData.acceptTerms || !acceptanceData.acceptPrivacy) {
      errors.push('Both terms of service and privacy policy must be accepted');
      return { success: false, errors };
    }

    const supabase = useServerClient ? await createServerClient() : createClient();
    const now = new Date().toISOString();

    // Prepare update data with both old and new column names for compatibility
    const updateData = {
      // New column names
      terms_accepted: acceptanceData.acceptTerms,
      privacy_accepted: acceptanceData.acceptPrivacy,
      terms_version: acceptanceData.termsVersion || CURRENT_TERMS_VERSION,
      privacy_version: acceptanceData.privacyVersion || CURRENT_PRIVACY_VERSION,
      terms_accepted_at: acceptanceData.acceptTerms ? now : null,
      privacy_accepted_at: acceptanceData.acceptPrivacy ? now : null,
      account_status: (acceptanceData.acceptTerms && acceptanceData.acceptPrivacy) ? 'active' : 'pending_terms',
      
      // Old column names for backward compatibility
      accepted_terms: acceptanceData.acceptTerms,
      accepted_privacy: acceptanceData.acceptPrivacy,
      
      // Cookie consent if provided
      ...(acceptanceData.acceptCookies !== undefined && {
        cookie_consent_given: acceptanceData.acceptCookies,
        cookie_consent_at: acceptanceData.acceptCookies ? now : null,
      }),
      
      updated_at: now,
    };

    const { error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', userId);

    if (error) {
      errors.push(`Failed to update profile: ${error.message}`);
      return { success: false, errors };
    }

    // Also update auth user metadata for consistency
    try {
      const { error: metaError } = await supabase.auth.updateUser({
        data: {
          accepted_terms: acceptanceData.acceptTerms,
          accepted_privacy: acceptanceData.acceptPrivacy,
          terms_accepted_at: now,
          privacy_accepted_at: now,
          terms_version: acceptanceData.termsVersion || CURRENT_TERMS_VERSION,
          privacy_version: acceptanceData.privacyVersion || CURRENT_PRIVACY_VERSION,
        }
      });

      if (metaError) {
        console.warn('Warning: Could not update auth metadata:', metaError);
        // Don't fail the process for this
      }
    } catch (metaError) {
      console.warn('Warning: Error updating auth metadata:', metaError);
    }

    return { success: true, errors: [] };

  } catch (error) {
    errors.push(`Update error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return { success: false, errors };
  }
}

/**
 * Check if user needs to accept terms (simplified check)
 */
export async function userNeedsTermsAcceptance(userId: string, useServerClient = false): Promise<boolean> {
  const verification = await verifyTermsAcceptance(userId, useServerClient);
  return verification.needsUpdate;
}

/**
 * Get terms acceptance status for API responses
 */
export async function getTermsAcceptanceStatus(userId: string, useServerClient = false) {
  const verification = await verifyTermsAcceptance(userId, useServerClient);
  
  return {
    hasAcceptedTerms: verification.hasAcceptedTerms,
    hasAcceptedPrivacy: verification.hasAcceptedPrivacy,
    accountStatus: verification.accountStatus,
    termsAcceptedAt: verification.termsAcceptedAt,
    privacyAcceptedAt: verification.privacyAcceptedAt,
    termsVersion: verification.termsVersion,
    privacyVersion: verification.privacyVersion,
    currentTermsVersion: CURRENT_TERMS_VERSION,
    currentPrivacyVersion: CURRENT_PRIVACY_VERSION,
    needsUpdate: verification.needsUpdate,
    isValid: verification.isValid,
    errors: verification.errors,
  };
}

/**
 * Validate terms acceptance data
 */
export function validateTermsAcceptanceData(data: TermsAcceptanceData): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (typeof data.acceptTerms !== 'boolean') {
    errors.push('acceptTerms must be a boolean');
  }

  if (typeof data.acceptPrivacy !== 'boolean') {
    errors.push('acceptPrivacy must be a boolean');
  }

  if (!data.acceptTerms) {
    errors.push('Terms of service must be accepted');
  }

  if (!data.acceptPrivacy) {
    errors.push('Privacy policy must be accepted');
  }

  if (data.acceptCookies !== undefined && typeof data.acceptCookies !== 'boolean') {
    errors.push('acceptCookies must be a boolean if provided');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Create audit log entry for terms acceptance
 */
export async function createTermsAuditLog(
  userId: string,
  action: 'accepted' | 'declined' | 'updated',
  details: unknown,
  useServerClient = false
) {
  try {
    const supabase = useServerClient ? await createServerClient() : createClient();
    
    // This would require a separate audit table - for now just log to console

    // TODO: Implement actual audit table if needed
    // const { error } = await supabase
    //   .from('terms_audit_log')
    //   .insert({
    //     user_id: userId,
    //     action,
    //     details: JSON.stringify(details),
    //     created_at: new Date().toISOString(),
    //   });

  } catch (error) {
  }
}