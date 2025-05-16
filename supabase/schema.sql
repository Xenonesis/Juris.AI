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