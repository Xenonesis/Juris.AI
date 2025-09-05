-- Fix terms acceptance schema to match API expectations
-- This migration aligns the database schema with the API implementation

-- Add missing columns that the API expects
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS terms_accepted BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS privacy_accepted BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS terms_version TEXT DEFAULT '1.0';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS privacy_version TEXT DEFAULT '1.0';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS account_status TEXT DEFAULT 'pending_terms';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS cookie_consent_given BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS cookie_consent_at TIMESTAMPTZ;

-- Copy data from old columns to new columns if they exist
UPDATE profiles 
SET 
  terms_accepted = COALESCE(accepted_terms, FALSE),
  privacy_accepted = COALESCE(accepted_privacy, FALSE),
  terms_version = CASE WHEN accepted_terms = TRUE THEN '1.0' ELSE NULL END,
  privacy_version = CASE WHEN accepted_privacy = TRUE THEN '1.0' ELSE NULL END,
  account_status = CASE 
    WHEN COALESCE(accepted_terms, FALSE) = TRUE AND COALESCE(accepted_privacy, FALSE) = TRUE 
    THEN 'active' 
    ELSE 'pending_terms' 
  END
WHERE id IS NOT NULL;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_terms_status ON profiles(terms_accepted, privacy_accepted, account_status);
CREATE INDEX IF NOT EXISTS idx_profiles_account_status ON profiles(account_status);

-- Update the trigger function to handle both old and new column names
CREATE OR REPLACE FUNCTION handle_new_user_with_terms()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (
        id, 
        email, 
        accepted_terms, 
        accepted_privacy, 
        terms_accepted_at, 
        privacy_accepted_at,
        terms_accepted,
        privacy_accepted,
        terms_version,
        privacy_version,
        account_status,
        created_at,
        updated_at
    )
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE((NEW.raw_user_meta_data->>'accepted_terms')::boolean, FALSE),
        COALESCE((NEW.raw_user_meta_data->>'accepted_privacy')::boolean, FALSE),
        CASE 
            WHEN (NEW.raw_user_meta_data->>'accepted_terms')::boolean = TRUE 
            THEN NOW()
            ELSE NULL
        END,
        CASE 
            WHEN (NEW.raw_user_meta_data->>'accepted_privacy')::boolean = TRUE 
            THEN NOW()
            ELSE NULL
        END,
        COALESCE((NEW.raw_user_meta_data->>'accepted_terms')::boolean, FALSE),
        COALESCE((NEW.raw_user_meta_data->>'accepted_privacy')::boolean, FALSE),
        CASE 
            WHEN (NEW.raw_user_meta_data->>'accepted_terms')::boolean = TRUE 
            THEN '1.0'
            ELSE NULL
        END,
        CASE 
            WHEN (NEW.raw_user_meta_data->>'accepted_privacy')::boolean = TRUE 
            THEN '1.0'
            ELSE NULL
        END,
        CASE 
            WHEN (NEW.raw_user_meta_data->>'accepted_terms')::boolean = TRUE 
                AND (NEW.raw_user_meta_data->>'accepted_privacy')::boolean = TRUE 
            THEN 'active'
            ELSE 'pending_terms'
        END,
        NOW(),
        NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        accepted_terms = EXCLUDED.accepted_terms,
        accepted_privacy = EXCLUDED.accepted_privacy,
        terms_accepted_at = EXCLUDED.terms_accepted_at,
        privacy_accepted_at = EXCLUDED.privacy_accepted_at,
        terms_accepted = EXCLUDED.terms_accepted,
        privacy_accepted = EXCLUDED.privacy_accepted,
        terms_version = EXCLUDED.terms_version,
        privacy_version = EXCLUDED.privacy_version,
        account_status = EXCLUDED.account_status,
        updated_at = NOW();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function for updating terms acceptance (used by the API)
CREATE OR REPLACE FUNCTION update_terms_acceptance(
    user_id UUID,
    accept_terms BOOLEAN,
    accept_privacy BOOLEAN,
    terms_ver TEXT DEFAULT '1.0',
    privacy_ver TEXT DEFAULT '1.0'
)
RETURNS BOOLEAN AS $$
DECLARE
    rows_affected INTEGER;
BEGIN
    UPDATE profiles 
    SET 
        terms_accepted = accept_terms,
        privacy_accepted = accept_privacy,
        accepted_terms = accept_terms,
        accepted_privacy = accept_privacy,
        terms_accepted_at = CASE WHEN accept_terms THEN NOW() ELSE terms_accepted_at END,
        privacy_accepted_at = CASE WHEN accept_privacy THEN NOW() ELSE privacy_accepted_at END,
        terms_version = CASE WHEN accept_terms THEN terms_ver ELSE terms_version END,
        privacy_version = CASE WHEN accept_privacy THEN privacy_ver ELSE privacy_version END,
        account_status = CASE 
            WHEN accept_terms AND accept_privacy THEN 'active'
            ELSE 'pending_terms'
        END,
        updated_at = NOW()
    WHERE id = user_id;
    
    GET DIAGNOSTICS rows_affected = ROW_COUNT;
    RETURN rows_affected > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION update_terms_acceptance(UUID, BOOLEAN, BOOLEAN, TEXT, TEXT) TO authenticated;