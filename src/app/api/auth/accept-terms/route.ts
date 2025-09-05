import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { 
  updateTermsAcceptance, 
  getTermsAcceptanceStatus, 
  validateTermsAcceptanceData,
  createTermsAuditLog 
} from '@/lib/terms-verification';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { acceptTerms, acceptPrivacy, acceptCookies } = body;

    // Validate input data
    const validation = validateTermsAcceptanceData({ acceptTerms, acceptPrivacy, acceptCookies });
    if (!validation.isValid) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.errors },
        { status: 400 }
      );
    }

    // Get current user
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Update terms acceptance using the verification system
    const updateResult = await updateTermsAcceptance(
      user.id,
      {
        acceptTerms,
        acceptPrivacy,
        acceptCookies,
      },
      true // Use server client
    );

    if (!updateResult.success) {
      return NextResponse.json(
        { error: 'Failed to save terms acceptance', details: updateResult.errors },
        { status: 500 }
      );
    }

    // Create audit log
    await createTermsAuditLog(
      user.id,
      'accepted',
      { acceptTerms, acceptPrivacy, acceptCookies },
      true
    );

    // Set cookie consent if accepted
    const response = NextResponse.json({ 
      success: true, 
      message: 'Terms accepted successfully' 
    });

    if (acceptCookies) {
      const now = new Date().toISOString();
      const cookieSettings = {
        necessary: true,
        analytics: true,
        marketing: false,
        preferences: true,
      };
      
      response.cookies.set('juris_cookie_consent', JSON.stringify(cookieSettings), {
        path: '/',
        maxAge: 365 * 24 * 60 * 60, // 1 year
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });
      
      response.cookies.set('juris_consent_timestamp', now, {
        path: '/',
        maxAge: 365 * 24 * 60 * 60, // 1 year
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });
    }

    return response;

  } catch (error) {
    console.error('Terms acceptance API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get current user's terms acceptance status
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get terms acceptance status using the verification system
    const status = await getTermsAcceptanceStatus(user.id, true);

    if (!status.isValid) {
      return NextResponse.json(
        { error: 'Failed to fetch terms status', details: status.errors },
        { status: 500 }
      );
    }

    return NextResponse.json({
      hasAcceptedTerms: status.hasAcceptedTerms,
      hasAcceptedPrivacy: status.hasAcceptedPrivacy,
      hasCookieConsent: false, // This would need to be added to the verification system
      accountStatus: status.accountStatus,
      termsAcceptedAt: status.termsAcceptedAt,
      privacyAcceptedAt: status.privacyAcceptedAt,
      termsVersion: status.termsVersion,
      privacyVersion: status.privacyVersion,
      currentTermsVersion: status.currentTermsVersion,
      currentPrivacyVersion: status.currentPrivacyVersion,
      needsUpdate: status.needsUpdate,
    });

  } catch (error) {
    console.error('Terms status API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}