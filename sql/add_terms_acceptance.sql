-- Add terms acceptance columns to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS accepted_terms BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS accepted_privacy BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS terms_accepted_at TIMESTAMPTZ;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS privacy_accepted_at TIMESTAMPTZ;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_profiles_terms_acceptance ON profiles(accepted_terms, accepted_privacy);

-- Function to handle new user signup with terms
CREATE OR REPLACE FUNCTION handle_new_user_with_terms()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, accepted_terms, accepted_privacy, terms_accepted_at, privacy_accepted_at)
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
        END
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        accepted_terms = EXCLUDED.accepted_terms,
        accepted_privacy = EXCLUDED.accepted_privacy,
        terms_accepted_at = EXCLUDED.terms_accepted_at,
        privacy_accepted_at = EXCLUDED.privacy_accepted_at;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
DROP TRIGGER IF EXISTS on_auth_user_created_with_terms ON auth.users;
CREATE TRIGGER on_auth_user_created_with_terms
    AFTER INSERT OR UPDATE ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user_with_terms();
