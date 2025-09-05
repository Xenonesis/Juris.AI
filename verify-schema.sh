#!/bin/bash

echo "🔍 Verifying schema.sql has terms acceptance fields..."

# Check for required fields in profiles table
echo "1. Checking profiles table fields..."
if grep -q "accepted_terms BOOLEAN DEFAULT FALSE" supabase/schema.sql; then
    echo "✅ accepted_terms field present"
else
    echo "❌ accepted_terms field missing"
fi

if grep -q "accepted_privacy BOOLEAN DEFAULT FALSE" supabase/schema.sql; then
    echo "✅ accepted_privacy field present"
else
    echo "❌ accepted_privacy field missing"
fi

if grep -q "terms_accepted BOOLEAN DEFAULT FALSE" supabase/schema.sql; then
    echo "✅ terms_accepted field present"
else
    echo "❌ terms_accepted field missing"
fi

if grep -q "privacy_accepted BOOLEAN DEFAULT FALSE" supabase/schema.sql; then
    echo "✅ privacy_accepted field present"
else
    echo "❌ privacy_accepted field missing"
fi

if grep -q "account_status TEXT DEFAULT 'pending_terms'" supabase/schema.sql; then
    echo "✅ account_status field present"
else
    echo "❌ account_status field missing"
fi

if grep -q "cookie_consent_given BOOLEAN DEFAULT FALSE" supabase/schema.sql; then
    echo "✅ cookie_consent_given field present"
else
    echo "❌ cookie_consent_given field missing"
fi

# Check for indexes
echo "2. Checking indexes..."
if grep -q "idx_profiles_terms_status" supabase/schema.sql; then
    echo "✅ Terms status index present"
else
    echo "❌ Terms status index missing"
fi

if grep -q "idx_profiles_account_status" supabase/schema.sql; then
    echo "✅ Account status index present"
else
    echo "❌ Account status index missing"
fi

# Check for function
echo "3. Checking functions..."
if grep -q "update_terms_acceptance" supabase/schema.sql; then
    echo "✅ update_terms_acceptance function present"
else
    echo "❌ update_terms_acceptance function missing"
fi

echo ""
echo "🎉 Schema verification complete!"
