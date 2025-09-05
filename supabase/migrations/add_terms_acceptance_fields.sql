-- Add terms and privacy policy acceptance fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS terms_accepted BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS terms_accepted_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS terms_version TEXT DEFAULT '1.0',
ADD COLUMN IF NOT EXISTS privacy_accepted BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS privacy_accepted_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS privacy_version TEXT DEFAULT '1.0',
ADD COLUMN IF NOT EXISTS cookie_consent_given BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS cookie_consent_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS account_status TEXT DEFAULT 'active' CHECK (account_status IN ('active', 'suspended', 'pending_terms'));

-- Create index for terms acceptance queries
CREATE INDEX IF NOT EXISTS idx_profiles_terms_accepted ON public.profiles(terms_accepted);
CREATE INDEX IF NOT EXISTS idx_profiles_privacy_accepted ON public.profiles(privacy_accepted);
CREATE INDEX IF NOT EXISTS idx_profiles_account_status ON public.profiles(account_status);

-- Create function to automatically create profile with terms acceptance
CREATE OR REPLACE FUNCTION public.handle_new_user_with_terms()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    email, 
    terms_accepted, 
    terms_accepted_at, 
    terms_version,
    privacy_accepted, 
    privacy_accepted_at, 
    privacy_version,
    account_status,
    created_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'accepted_terms')::boolean, FALSE),
    CASE 
      WHEN (NEW.raw_user_meta_data->>'accepted_terms')::boolean = TRUE 
      THEN COALESCE((NEW.raw_user_meta_data->>'terms_accepted_at')::timestamp with time zone, NOW())
      ELSE NULL
    END,
    COALESCE(NEW.raw_user_meta_data->>'terms_version', '1.0'),
    COALESCE((NEW.raw_user_meta_data->>'accepted_privacy')::boolean, FALSE),
    CASE 
      WHEN (NEW.raw_user_meta_data->>'accepted_privacy')::boolean = TRUE 
      THEN COALESCE((NEW.raw_user_meta_data->>'privacy_accepted_at')::timestamp with time zone, NOW())
      ELSE NULL
    END,
    COALESCE(NEW.raw_user_meta_data->>'privacy_version', '1.0'),
    CASE 
      WHEN (NEW.raw_user_meta_data->>'accepted_terms')::boolean = TRUE 
       AND (NEW.raw_user_meta_data->>'accepted_privacy')::boolean = TRUE 
      THEN 'active'
      ELSE 'pending_terms'
    END,
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    terms_accepted = COALESCE((NEW.raw_user_meta_data->>'accepted_terms')::boolean, profiles.terms_accepted),
    terms_accepted_at = CASE 
      WHEN (NEW.raw_user_meta_data->>'accepted_terms')::boolean = TRUE AND profiles.terms_accepted = FALSE
      THEN COALESCE((NEW.raw_user_meta_data->>'terms_accepted_at')::timestamp with time zone, NOW())
      ELSE profiles.terms_accepted_at
    END,
    privacy_accepted = COALESCE((NEW.raw_user_meta_data->>'accepted_privacy')::boolean, profiles.privacy_accepted),
    privacy_accepted_at = CASE 
      WHEN (NEW.raw_user_meta_data->>'accepted_privacy')::boolean = TRUE AND profiles.privacy_accepted = FALSE
      THEN COALESCE((NEW.raw_user_meta_data->>'privacy_accepted_at')::timestamp with time zone, NOW())
      ELSE profiles.privacy_accepted_at
    END,
    account_status = CASE 
      WHEN COALESCE((NEW.raw_user_meta_data->>'accepted_terms')::boolean, profiles.terms_accepted) = TRUE 
       AND COALESCE((NEW.raw_user_meta_data->>'accepted_privacy')::boolean, profiles.privacy_accepted) = TRUE 
      THEN 'active'
      ELSE 'pending_terms'
    END,
    updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created_with_terms ON auth.users;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created_with_terms
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_with_terms();

-- Function to check if user has accepted current terms
CREATE OR REPLACE FUNCTION public.user_has_accepted_current_terms(user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  current_terms_version TEXT := '1.0';
  current_privacy_version TEXT := '1.0';
  user_terms_accepted BOOLEAN;
  user_privacy_accepted BOOLEAN;
  user_terms_version TEXT;
  user_privacy_version TEXT;
BEGIN
  SELECT 
    terms_accepted, 
    privacy_accepted, 
    terms_version, 
    privacy_version
  INTO 
    user_terms_accepted, 
    user_privacy_accepted, 
    user_terms_version, 
    user_privacy_version
  FROM public.profiles 
  WHERE id = user_id;
  
  -- Return TRUE only if both terms and privacy are accepted and versions match
  RETURN (
    user_terms_accepted = TRUE 
    AND user_privacy_accepted = TRUE 
    AND user_terms_version = current_terms_version 
    AND user_privacy_version = current_privacy_version
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update terms acceptance
CREATE OR REPLACE FUNCTION public.update_terms_acceptance(
  user_id UUID,
  accept_terms BOOLEAN DEFAULT TRUE,
  accept_privacy BOOLEAN DEFAULT TRUE,
  terms_ver TEXT DEFAULT '1.0',
  privacy_ver TEXT DEFAULT '1.0'
)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE public.profiles 
  SET 
    terms_accepted = accept_terms,
    terms_accepted_at = CASE WHEN accept_terms THEN NOW() ELSE terms_accepted_at END,
    terms_version = terms_ver,
    privacy_accepted = accept_privacy,
    privacy_accepted_at = CASE WHEN accept_privacy THEN NOW() ELSE privacy_accepted_at END,
    privacy_version = privacy_ver,
    account_status = CASE 
      WHEN accept_terms = TRUE AND accept_privacy = TRUE THEN 'active'
      ELSE 'pending_terms'
    END,
    updated_at = NOW()
  WHERE id = user_id;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.user_has_accepted_current_terms(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_terms_acceptance(UUID, BOOLEAN, BOOLEAN, TEXT, TEXT) TO authenticated;

-- Update existing users to have pending_terms status if they haven't accepted terms
UPDATE public.profiles 
SET account_status = 'pending_terms'
WHERE (terms_accepted IS NULL OR terms_accepted = FALSE OR privacy_accepted IS NULL OR privacy_accepted = FALSE)
  AND account_status = 'active';

-- Add comment for documentation
COMMENT ON COLUMN public.profiles.terms_accepted IS 'Whether user has accepted the current terms of service';
COMMENT ON COLUMN public.profiles.terms_accepted_at IS 'When the user accepted the terms of service';
COMMENT ON COLUMN public.profiles.terms_version IS 'Version of terms accepted by the user';
COMMENT ON COLUMN public.profiles.privacy_accepted IS 'Whether user has accepted the current privacy policy';
COMMENT ON COLUMN public.profiles.privacy_accepted_at IS 'When the user accepted the privacy policy';
COMMENT ON COLUMN public.profiles.privacy_version IS 'Version of privacy policy accepted by the user';
COMMENT ON COLUMN public.profiles.account_status IS 'Current status of the user account (active, suspended, pending_terms)';
COMMENT ON FUNCTION public.user_has_accepted_current_terms(UUID) IS 'Checks if user has accepted current version of terms and privacy policy';
COMMENT ON FUNCTION public.update_terms_acceptance(UUID, BOOLEAN, BOOLEAN, TEXT, TEXT) IS 'Updates user terms and privacy policy acceptance status';