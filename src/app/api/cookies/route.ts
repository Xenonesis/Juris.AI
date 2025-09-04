import { NextRequest, NextResponse } from 'next/server';
import { 
  setSecureCookie, 
  getSecureCookie, 
  deleteSecureCookie,
  CONSENT_COOKIE_OPTIONS,
  sanitizeCookieValue,
  isValidCookieName 
} from '@/lib/security/cookie-security';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'status':
        return getCookieStatus(request);
      case 'policy':
        return getCookiePolicy();
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Cookie API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, settings } = body;

    switch (action) {
      case 'update-consent':
        return updateConsent(request, settings);
      case 'clear-cookies':
        return clearCookies(request);
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Cookie API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function getCookieStatus(request: NextRequest) {
  const consentCookie = request.cookies.get('juris_cookie_consent');
  const timestampCookie = request.cookies.get('juris_consent_timestamp');

  if (!consentCookie) {
    return NextResponse.json({
      hasConsent: false,
      needsConsent: true,
      timestamp: null,
      settings: null,
    });
  }

  try {
    const settings = JSON.parse(consentCookie.value);
    const timestamp = timestampCookie?.value ? new Date(timestampCookie.value) : null;
    
    // Check if consent needs renewal (older than 1 year)
    const needsRenewal = timestamp ? 
      (Date.now() - timestamp.getTime()) > (365 * 24 * 60 * 60 * 1000) : 
      true;

    return NextResponse.json({
      hasConsent: true,
      needsConsent: needsRenewal,
      timestamp: timestamp?.toISOString(),
      settings,
    });
  } catch {
    return NextResponse.json({
      hasConsent: false,
      needsConsent: true,
      timestamp: null,
      settings: null,
    });
  }
}

function getCookiePolicy() {
  const policy = {
    categories: [
      {
        id: 'necessary',
        name: 'Strictly Necessary',
        description: 'These cookies are essential for the website to function properly.',
        required: true,
        cookies: [
          {
            name: 'juris_cookie_consent',
            purpose: 'Stores your cookie consent preferences',
            duration: '1 year',
            type: 'first-party',
          },
          {
            name: 'juris_session',
            purpose: 'Maintains your session and authentication state',
            duration: 'Session',
            type: 'first-party',
          },
          {
            name: 'juris_csrf_token',
            purpose: 'Prevents cross-site request forgery attacks',
            duration: '24 hours',
            type: 'first-party',
          },
        ],
      },
      {
        id: 'analytics',
        name: 'Analytics & Performance',
        description: 'These cookies help us understand how visitors interact with our website.',
        required: false,
        cookies: [
          {
            name: 'juris_analytics',
            purpose: 'Tracks page views and user interactions',
            duration: '2 years',
            type: 'first-party',
          },
          {
            name: '_ga',
            purpose: 'Google Analytics - distinguishes unique users',
            duration: '2 years',
            type: 'third-party',
          },
        ],
      },
      {
        id: 'marketing',
        name: 'Marketing & Advertising',
        description: 'These cookies are used to deliver relevant advertisements.',
        required: false,
        cookies: [
          {
            name: '_fbp',
            purpose: 'Facebook Pixel - tracks conversions',
            duration: '3 months',
            type: 'third-party',
          },
        ],
      },
      {
        id: 'preferences',
        name: 'Preferences & Functionality',
        description: 'These cookies remember your preferences and settings.',
        required: false,
        cookies: [
          {
            name: 'juris_preferences',
            purpose: 'Stores UI preferences and settings',
            duration: '1 year',
            type: 'first-party',
          },
        ],
      },
    ],
    lastUpdated: '2024-01-01T00:00:00Z',
    version: '1.0',
  };

  return NextResponse.json(policy);
}

function updateConsent(request: NextRequest, settings: any) {
  // Validate settings
  if (!settings || typeof settings !== 'object') {
    return NextResponse.json({ error: 'Invalid settings' }, { status: 400 });
  }

  const requiredFields = ['necessary', 'analytics', 'marketing', 'preferences'];
  for (const field of requiredFields) {
    if (typeof settings[field] !== 'boolean') {
      return NextResponse.json({ error: `Invalid ${field} setting` }, { status: 400 });
    }
  }

  // Ensure necessary cookies are always enabled
  settings.necessary = true;

  const response = NextResponse.json({ 
    success: true, 
    settings,
    timestamp: new Date().toISOString(),
  });

  // Set consent cookies with secure options
  response.cookies.set('juris_cookie_consent', JSON.stringify(settings), CONSENT_COOKIE_OPTIONS);
  response.cookies.set('juris_consent_timestamp', new Date().toISOString(), CONSENT_COOKIE_OPTIONS);

  return response;
}

function clearCookies(request: NextRequest) {
  const response = NextResponse.json({ success: true });

  // Clear non-essential cookies
  const cookiesToClear = [
    'juris_analytics',
    'juris_preferences',
    '_ga',
    '_ga_*',
    '_fbp',
  ];

  cookiesToClear.forEach(cookieName => {
    response.cookies.delete(cookieName);
  });

  // Set minimal consent
  const minimalSettings = {
    necessary: true,
    analytics: false,
    marketing: false,
    preferences: false,
  };

  response.cookies.set('juris_cookie_consent', JSON.stringify(minimalSettings), CONSENT_COOKIE_OPTIONS);
  response.cookies.set('juris_consent_timestamp', new Date().toISOString(), CONSENT_COOKIE_OPTIONS);

  return response;
}