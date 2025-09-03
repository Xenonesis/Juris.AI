-- Fix missing api_keys table in Supabase database
-- Run this script in your Supabase SQL editor

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
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON public.api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_model_type ON public.api_keys(model_type);

-- Set up Row Level Security (RLS)
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid errors
DO $$
BEGIN
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

-- Create policies for API keys
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

-- Add comment to the table
COMMENT ON TABLE public.api_keys IS 'Stores API keys for different AI models used by users';