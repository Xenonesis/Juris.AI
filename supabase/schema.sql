-- Create profiles table for storing user profile information
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT,
  email TEXT,
  phone TEXT,
  country TEXT,
  state TEXT,
  pincode TEXT,
  address TEXT,
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chat_messages table for storing chat history
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  content TEXT NOT NULL,
  is_user_message BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ai_name TEXT -- Name of the AI provider that generated this message
);

-- Create API keys table for storing user's AI model API keys
CREATE TABLE IF NOT EXISTS public.api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  model_type TEXT NOT NULL,
  api_key TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, model_type)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON public.chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON public.chat_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON public.profiles(created_at);
CREATE INDEX IF NOT EXISTS idx_profiles_updated_at ON public.profiles(updated_at);
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON public.api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_model_type ON public.api_keys(model_type);

-- Set up RLS (Row Level Security) policies
-- Profiles: Users can only read and update their own profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid errors
DO $$
BEGIN
    -- Drop profile policies if they exist
    IF EXISTS (
        SELECT 1 FROM pg_policy 
        WHERE polname = 'Users can view their own profile' AND polrelid = 'public.profiles'::regclass
    ) THEN
        DROP POLICY "Users can view their own profile" ON public.profiles;
    END IF;
    
    IF EXISTS (
        SELECT 1 FROM pg_policy 
        WHERE polname = 'Users can update their own profile' AND polrelid = 'public.profiles'::regclass
    ) THEN
        DROP POLICY "Users can update their own profile" ON public.profiles;
    END IF;
    
    IF EXISTS (
        SELECT 1 FROM pg_policy 
        WHERE polname = 'Users can insert their own profile' AND polrelid = 'public.profiles'::regclass
    ) THEN
        DROP POLICY "Users can insert their own profile" ON public.profiles;
    END IF;
    
    -- Drop chat message policies if they exist
    IF EXISTS (
        SELECT 1 FROM pg_policy 
        WHERE polname = 'Users can view their own messages' AND polrelid = 'public.chat_messages'::regclass
    ) THEN
        DROP POLICY "Users can view their own messages" ON public.chat_messages;
    END IF;
    
    IF EXISTS (
        SELECT 1 FROM pg_policy 
        WHERE polname = 'Users can insert their own messages' AND polrelid = 'public.chat_messages'::regclass
    ) THEN
        DROP POLICY "Users can insert their own messages" ON public.chat_messages;
    END IF;
    
    -- Drop API keys policies if they exist
    IF EXISTS (
        SELECT 1 FROM pg_policy 
        WHERE polname = 'Users can view their own API keys' AND polrelid = 'public.api_keys'::regclass
    ) THEN
        DROP POLICY "Users can view their own API keys" ON public.api_keys;
    END IF;
    
    IF EXISTS (
        SELECT 1 FROM pg_policy 
        WHERE polname = 'Users can insert their own API keys' AND polrelid = 'public.api_keys'::regclass
    ) THEN
        DROP POLICY "Users can insert their own API keys" ON public.api_keys;
    END IF;
    
    IF EXISTS (
        SELECT 1 FROM pg_policy 
        WHERE polname = 'Users can update their own API keys' AND polrelid = 'public.api_keys'::regclass
    ) THEN
        DROP POLICY "Users can update their own API keys" ON public.api_keys;
    END IF;
    
    IF EXISTS (
        SELECT 1 FROM pg_policy 
        WHERE polname = 'Users can delete their own API keys' AND polrelid = 'public.api_keys'::regclass
    ) THEN
        DROP POLICY "Users can delete their own API keys" ON public.api_keys;
    END IF;
END $$;

-- Create policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Chat Messages: Users can only read and create their own messages
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own messages"
  ON public.chat_messages
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own messages"
  ON public.chat_messages
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- API Keys: Users can only read, create, update and delete their own API keys
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own API keys"
  ON public.api_keys
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own API keys"
  ON public.api_keys
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own API keys"
  ON public.api_keys
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own API keys"
  ON public.api_keys
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create user_suggestions table for storing personalized query suggestions
CREATE TABLE IF NOT EXISTS public.user_suggestions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  query_text TEXT NOT NULL,
  last_used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  use_count INTEGER DEFAULT 1
);

-- Create popular_suggestions table for storing popular queries by jurisdiction
CREATE TABLE IF NOT EXISTS public.popular_suggestions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  jurisdiction TEXT NOT NULL,
  query_text TEXT NOT NULL,
  popularity INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(jurisdiction, query_text)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_suggestions_user_id ON public.user_suggestions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_suggestions_last_used ON public.user_suggestions(last_used_at);
CREATE INDEX IF NOT EXISTS idx_popular_suggestions_jurisdiction ON public.popular_suggestions(jurisdiction);
CREATE INDEX IF NOT EXISTS idx_popular_suggestions_popularity ON public.popular_suggestions(popularity);

-- Set up RLS policies for user_suggestions
ALTER TABLE public.user_suggestions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid errors
DO $$
BEGIN
    -- Drop user_suggestions policies if they exist
    IF EXISTS (
        SELECT 1 FROM pg_policy 
        WHERE polname = 'Users can view their own suggestions' AND polrelid = 'public.user_suggestions'::regclass
    ) THEN
        DROP POLICY "Users can view their own suggestions" ON public.user_suggestions;
    END IF;
    
    IF EXISTS (
        SELECT 1 FROM pg_policy 
        WHERE polname = 'Users can insert their own suggestions' AND polrelid = 'public.user_suggestions'::regclass
    ) THEN
        DROP POLICY "Users can insert their own suggestions" ON public.user_suggestions;
    END IF;
    
    IF EXISTS (
        SELECT 1 FROM pg_policy 
        WHERE polname = 'Users can update their own suggestions' AND polrelid = 'public.user_suggestions'::regclass
    ) THEN
        DROP POLICY "Users can update their own suggestions" ON public.user_suggestions;
    END IF;
    
    IF EXISTS (
        SELECT 1 FROM pg_policy 
        WHERE polname = 'Users can delete their own suggestions' AND polrelid = 'public.user_suggestions'::regclass
    ) THEN
        DROP POLICY "Users can delete their own suggestions" ON public.user_suggestions;
    END IF;
    
    -- Drop popular_suggestions policies if they exist
    IF EXISTS (
        SELECT 1 FROM pg_policy 
        WHERE polname = 'Everyone can read popular suggestions' AND polrelid = 'public.popular_suggestions'::regclass
    ) THEN
        DROP POLICY "Everyone can read popular suggestions" ON public.popular_suggestions;
    END IF;
    
    IF EXISTS (
        SELECT 1 FROM pg_policy 
        WHERE polname = 'Service role can manage popular suggestions' AND polrelid = 'public.popular_suggestions'::regclass
    ) THEN
        DROP POLICY "Service role can manage popular suggestions" ON public.popular_suggestions;
    END IF;
END $$;

-- Create policies for user_suggestions
CREATE POLICY "Users can view their own suggestions"
  ON public.user_suggestions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own suggestions"
  ON public.user_suggestions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own suggestions"
  ON public.user_suggestions
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own suggestions"
  ON public.user_suggestions
  FOR DELETE
  USING (auth.uid() = user_id);

-- Set up RLS policies for popular_suggestions
ALTER TABLE public.popular_suggestions ENABLE ROW LEVEL SECURITY;

-- Everyone can read popular suggestions
CREATE POLICY "Everyone can read popular suggestions"
  ON public.popular_suggestions
  FOR SELECT
  TO authenticated, anon
  USING (true);

-- Only service role can manage popular suggestions
CREATE POLICY "Service role can manage popular suggestions"
  ON public.popular_suggestions
  USING (auth.uid() IS NOT NULL AND auth.jwt() ? 'role' AND auth.jwt()->>'role' = 'service_role');

-- Insert some initial popular suggestions for each jurisdiction
INSERT INTO public.popular_suggestions (jurisdiction, query_text, popularity)
VALUES 
  ('us', 'How do I file for bankruptcy protection?', 100),
  ('us', 'What are the requirements for a valid will?', 95),
  ('us', 'Can I sue my employer for discrimination?', 90),
  
  ('uk', 'What are my rights as a tenant in the UK?', 100),
  ('uk', 'How do I appeal a parking fine in London?', 95),
  ('uk', 'What is the process for divorce in England?', 90),
  
  ('ca', 'How does parental leave work in Canada?', 100),
  ('ca', 'What are my rights in a traffic stop?', 95),
  ('ca', 'How do I contest a will in Canada?', 90),
  
  ('au', 'What are the defamation laws in Australia?', 100),
  ('au', 'How do I fight an unfair dismissal?', 95),
  ('au', 'What are my rights as a tenant in Sydney?', 90),
  
  ('in', 'How do I file an RTI application?', 100),
  ('in', 'What are the steps to fight a property dispute?', 95),
  ('in', 'How does the bail process work in India?', 90),
  
  ('np', 'What are property inheritance laws in Nepal?', 100),
  ('np', 'How do I register a company in Nepal?', 95),
  ('np', 'What are labor laws for foreign employment?', 90),
  
  ('cn', 'What are the business registration requirements?', 100),
  ('cn', 'How do intellectual property rights work in China?', 95),
  ('cn', 'What is the process for labor dispute resolution?', 90),
  
  ('eu', 'What are my GDPR rights as a consumer?', 100),
  ('eu', 'How do EU consumer protection laws work?', 95),
  ('eu', 'What should I know about EU employment contracts?', 90)
ON CONFLICT (jurisdiction, query_text) DO UPDATE
SET popularity = popular_suggestions.popularity + 1;

-- Create a trigger to automatically create a profile when a new user signs up
-- First check if the function exists and drop it if it does
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if profile already exists to avoid duplicate key errors
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = NEW.id) THEN
    -- Insert the new profile safely with at least the required fields
    INSERT INTO public.profiles (id, email, created_at, updated_at)
    VALUES (
      NEW.id, 
      COALESCE(NEW.email, ''), 
      NOW(), 
      NOW()
    );
  END IF;
  RETURN NEW;
EXCEPTION 
  WHEN others THEN
    -- Log the error (this will appear in Supabase logs)
    RAISE LOG 'Error in handle_new_user trigger: %', SQLERRM;
    -- Still return NEW to allow user creation to proceed
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop the trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create the trigger on auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add comments to tables
COMMENT ON TABLE public.api_keys IS 'Stores API keys for different AI models used by users'; 