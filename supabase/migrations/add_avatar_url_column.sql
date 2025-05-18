-- Add avatar_url column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Comment on the avatar_url column
COMMENT ON COLUMN profiles.avatar_url IS 'URL to user''s avatar image'; 