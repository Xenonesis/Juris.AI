#!/bin/bash

echo "🔍 Verifying TypeScript fixes..."

# Check for CheckedState fixes
echo "1. Checking CheckedState fixes..."
if grep -q "onCheckedChange={(checked) => set.*checked === true" src/app/auth/accept-terms/page.tsx; then
    echo "✅ accept-terms page fixed"
else
    echo "❌ accept-terms page not fixed"
fi

if grep -q "onCheckedChange={(checked) => set.*checked === true" src/components/auth/auth-form.tsx; then
    echo "✅ auth-form component fixed"
else
    echo "❌ auth-form component not fixed"
fi

if grep -q "onCheckedChange={(checked) => set.*checked === true" src/components/auth/enhanced-terms-dialog.tsx; then
    echo "✅ enhanced-terms-dialog component fixed"
else
    echo "❌ enhanced-terms-dialog component not fixed"
fi

if grep -q "onCheckedChange={(checked) => set.*checked === true" src/components/auth/terms-acceptance-dialog.tsx; then
    echo "✅ terms-acceptance-dialog component fixed"
else
    echo "❌ terms-acceptance-dialog component not fixed"
fi

# Check for dataShared fix
echo "2. Checking dataShared fix..."
if grep -q "'dataShared' in cookie && cookie.dataShared" src/app/cookie-policy/page.tsx; then
    echo "✅ dataShared property fixed with type narrowing"
else
    echo "❌ dataShared property not fixed"
fi

# Check for analytics fix
echo "3. Checking analytics fix..."
if grep -q "(window as any).fbq" src/components/analytics/consent-aware-analytics.tsx; then
    echo "✅ Analytics type assertion fixed"
else
    echo "❌ Analytics type assertion not fixed"
fi

# Check for cookie security fix
echo "4. Checking cookie security fix..."
if grep -q "cookieStore as any" src/lib/security/cookie-security.ts; then
    echo "✅ Cookie security type assertions added"
else
    echo "❌ Cookie security type assertions not added"
fi

# Check for hideCloseButton fix
echo "5. Checking DialogContent fix..."
if ! grep -q "hideCloseButton" src/components/auth/terms-acceptance-dialog.tsx; then
    echo "✅ hideCloseButton prop removed"
else
    echo "❌ hideCloseButton prop still present"
fi

echo ""
echo "🎉 Verification complete! Run 'npx tsc --noEmit' to confirm all TypeScript errors are resolved."
