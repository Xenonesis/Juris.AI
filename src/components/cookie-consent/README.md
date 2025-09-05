# Cookie Consent System

A comprehensive, GDPR-compliant cookie consent system for Juris.Ai with advanced security features and real-world legal compliance.

## 🚀 Features

### ✅ GDPR Compliance
- **Explicit Consent**: Clear opt-in for non-essential cookies
- **Granular Control**: Category-based permissions (Analytics, Marketing, Preferences)
- **Easy Withdrawal**: Simple consent modification through preferences panel
- **Consent Expiration**: Automatic renewal after 1 year
- **Audit Trail**: Complete consent history tracking for legal compliance

### 🔒 Security Features
- **HttpOnly Flags**: Prevents XSS attacks on sensitive cookies
- **Secure Flags**: Ensures HTTPS-only transmission in production
- **SameSite Protection**: Prevents CSRF attacks with SameSite=Strict
- **Input Validation**: Sanitizes all cookie values
- **CSRF Token Management**: Automatic token generation and validation

### 🎨 User Experience
- **Non-intrusive Design**: Elegant, animated banner that doesn't block content
- **Mobile Responsive**: Works perfectly on all device sizes
- **Accessibility Compliant**: Screen reader friendly with proper ARIA labels
- **Real-time Updates**: Instant consent state changes across the application
- **Floating Preferences**: Easy access to cookie settings via floating button

### 📊 Analytics Integration
- **Consent-Aware Loading**: Analytics scripts only load with user consent
- **Google Analytics**: Privacy-focused implementation with anonymization
- **Facebook Pixel**: Conversion tracking with consent validation
- **Custom Events**: Track consent decisions and user interactions

## 📁 File Structure

```
src/components/cookie-consent/
├── cookie-banner.tsx              # Main consent banner component
├── cookie-settings-dialog.tsx     # Detailed cookie management dialog
├── cookie-preferences-button.tsx  # Floating preferences access button
├── cookie-dashboard.tsx          # Comprehensive audit dashboard
└── index.ts                      # Export barrel file

src/lib/
├── cookies.ts                    # Core cookie management utilities
├── cookie-consent-validator.ts   # GDPR compliance validation
└── security/
    ├── cookie-security.ts        # Server-side secure cookie handling
    └── cookie-audit.ts          # Compliance auditing system

src/hooks/
└── useCookieConsent.ts          # React hook for consent management

src/app/
├── cookie-policy/               # Detailed cookie policy page
├── cookie-compliance/           # Compliance dashboard page
└── api/cookies/                # API endpoints for consent management
```

## 🛠️ Installation & Setup

### 1. Dependencies
The system uses existing project dependencies:
- React 18+
- Next.js 15+
- Framer Motion (for animations)
- Radix UI components
- Tailwind CSS

### 2. Environment Variables
Add to your `.env.local`:
```bash
# Optional: Analytics IDs (only used with user consent)
NEXT_PUBLIC_GA_ID=your_google_analytics_id
NEXT_PUBLIC_FB_PIXEL_ID=your_facebook_pixel_id

# Required: Encryption key for sensitive data
ENCRYPTION_KEY=your_secure_encryption_key
```

### 3. Integration
The system is already integrated into the main layout (`src/app/layout.tsx`):

```tsx
import { CookieBanner } from "@/components/cookie-consent/cookie-banner";
import { CookiePreferencesButton } from "@/components/cookie-consent/cookie-preferences-button";
import { ConsentAwareAnalytics } from "@/components/analytics/consent-aware-analytics";

// In your layout component:
<CookieBanner />
<CookiePreferencesButton />
<ConsentAwareAnalytics />
```

## 🎯 Usage

### Basic Usage
The cookie consent system works automatically once integrated. Users will see the consent banner on their first visit.

### Programmatic Access
```tsx
import { useCookieConsent } from '@/hooks/useCookieConsent';

function MyComponent() {
  const {
    consentSettings,
    hasConsent,
    canUseAnalytics,
    canUseMarketing,
    acceptAll,
    rejectAll,
    updateConsent
  } = useCookieConsent();

  // Check if analytics are allowed
  if (canUseAnalytics) {
    // Load analytics scripts
  }

  // Update consent programmatically
  const handleCustomConsent = () => {
    updateConsent({
      necessary: true,
      analytics: true,
      marketing: false,
      preferences: true,
    });
  };
}
```

### Server-Side Usage
```tsx
import { getSecureCookie, setSecureCookie } from '@/lib/security/cookie-security';

// In API routes or server components
const sessionId = getSecureCookie('juris_session');
setSecureCookie('user_preference', 'value', {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  maxAge: 86400, // 24 hours
});
```

## 🔧 Configuration

### Cookie Categories
Customize cookie categories in `src/lib/cookies.ts`:

```typescript
export const COOKIE_CATEGORIES = {
  NECESSARY: 'necessary',     // Always enabled
  ANALYTICS: 'analytics',     // Optional - site analytics
  MARKETING: 'marketing',     // Optional - advertising
  PREFERENCES: 'preferences', // Optional - user preferences
} as const;
```

### Security Settings
Adjust security settings in `src/lib/security/cookie-security.ts`:

```typescript
export const SECURE_COOKIE_DEFAULTS = {
  httpOnly: true,                              // Prevent XSS
  secure: process.env.NODE_ENV === 'production', // HTTPS only in prod
  sameSite: 'strict' as const,                 // CSRF protection
  path: '/',
} satisfies SecureCookieOptions;
```

## 📊 Monitoring & Compliance

### Compliance Dashboard
Visit `/cookie-compliance` to access the comprehensive compliance dashboard:
- Real-time compliance scoring
- Live system tests
- Consent audit trail
- GDPR compliance recommendations

### Audit Trail
All consent decisions are automatically logged with:
- Timestamp
- User consent choices
- Method of consent (banner, settings, API)
- User agent information
- Compliance validation results

### Export Reports
Generate compliance reports for legal documentation:
```tsx
import { generateComplianceReport } from '@/lib/cookie-consent-validator';

const report = generateComplianceReport();
// Export as JSON for legal records
```

## 🌍 Legal Compliance

### GDPR Requirements ✅
- ✅ **Lawful Basis**: Clear legal basis for each cookie category
- ✅ **Explicit Consent**: Unambiguous consent for non-essential cookies
- ✅ **Granular Consent**: Category-specific permissions
- ✅ **Easy Withdrawal**: Simple consent modification
- ✅ **Information Provision**: Detailed cookie policy and purposes
- ✅ **Record Keeping**: Comprehensive audit trail
- ✅ **Data Minimization**: Only essential cookies without consent

### CCPA Compliance ✅
- ✅ **Transparency**: Clear information about data collection
- ✅ **Opt-Out Rights**: Easy withdrawal of consent
- ✅ **Non-Discrimination**: Full functionality with essential cookies only

### ePrivacy Directive ✅
- ✅ **Prior Consent**: Consent before setting non-essential cookies
- ✅ **Clear Information**: Purpose and duration of cookies
- ✅ **Technical Implementation**: Secure cookie handling

## 🔍 Testing

### Manual Testing
1. Visit the site in incognito mode
2. Verify the consent banner appears
3. Test all consent options (Accept All, Essential Only, Customize)
4. Check cookie preferences button functionality
5. Verify analytics only load with consent

### Automated Testing
```bash
# Run the built-in compliance tests
npm run test:cookies

# Or visit the test page
# Navigate to /cookie-demo for interactive testing
```

### Compliance Validation
```typescript
import { validateConsent, generateComplianceReport } from '@/lib/cookie-consent-validator';

// Validate current consent
const validation = validateConsent(currentSettings);

// Generate full report
const report = generateComplianceReport();
```

## 🚨 Security Considerations

### Production Checklist
- [ ] HTTPS enabled for secure cookie transmission
- [ ] Environment variables properly configured
- [ ] Cookie encryption keys are secure and unique
- [ ] CSP headers include cookie domains
- [ ] Regular security audits scheduled

### Security Headers
The system automatically sets security headers:
```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

## 📈 Analytics Integration

### Google Analytics
```typescript
// Automatically loads only with consent
if (canUseAnalytics) {
  // GA4 with privacy settings
  gtag('config', 'GA_MEASUREMENT_ID', {
    anonymize_ip: true,
    cookie_flags: 'secure;samesite=lax',
  });
}
```

### Custom Analytics
```typescript
import { analytics } from '@/components/analytics/consent-aware-analytics';

// Track events only with consent
analytics.trackLegalQuery(query, jurisdiction);
analytics.trackDocumentUpload(fileType, fileSize);
```

## 🔄 Updates & Maintenance

### Regular Tasks
1. **Monthly**: Review compliance dashboard
2. **Quarterly**: Update cookie policy if new cookies added
3. **Annually**: Renew consent for existing users
4. **As Needed**: Update legal pages for regulatory changes

### Version Updates
When updating the cookie system:
1. Update version in `cookie-consent-validator.ts`
2. Test all functionality in staging
3. Export compliance report before deployment
4. Monitor consent rates after deployment

## 📞 Support

### Common Issues
1. **Banner not showing**: Check `requiresCookieConsent()` logic
2. **Analytics not loading**: Verify consent settings and API keys
3. **Compliance warnings**: Review recommendations in dashboard

### Legal Questions
For legal compliance questions, consult with:
- Data Protection Officer (DPO)
- Legal counsel familiar with GDPR/CCPA
- Privacy compliance specialists

## 📄 License

This cookie consent system is part of the Juris.Ai project and follows the same licensing terms.

---

**Last Updated**: December 2024  
**Version**: 1.0  
**Compliance**: GDPR, CCPA, ePrivacy Directive