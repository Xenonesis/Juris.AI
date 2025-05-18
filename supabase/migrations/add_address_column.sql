-- Add address column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS address TEXT;

-- Comment on the address column
COMMENT ON COLUMN profiles.address IS 'User''s physical address'; 