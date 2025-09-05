-- Add terms acceptance columns to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS accepted_terms BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS accepted_privacy BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS terms_accepted_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS privacy_accepted_at TIMESTAMPTZ;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_terms_acceptance ON profiles(accepted_terms, accepted_privacy);
