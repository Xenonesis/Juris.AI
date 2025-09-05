-- Ensure the columns exist in profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS accepted_terms BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS accepted_privacy BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS terms_accepted_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS privacy_accepted_at TIMESTAMPTZ;

-- Reload PostgREST schema cache
NOTIFY pgrst, 'reload schema';

-- Verify columns exist
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND column_name IN ('accepted_terms', 'accepted_privacy', 'terms_accepted_at', 'privacy_accepted_at')
ORDER BY column_name;
