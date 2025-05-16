-- Create API Keys table
CREATE TABLE IF NOT EXISTS public.api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  model_type TEXT NOT NULL,
  api_key TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, model_type)
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to see only their own API keys
CREATE POLICY "Users can view their own API keys" 
ON public.api_keys FOR SELECT 
USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own API keys
CREATE POLICY "Users can insert their own API keys" 
ON public.api_keys FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update their own API keys
CREATE POLICY "Users can update their own API keys" 
ON public.api_keys FOR UPDATE
USING (auth.uid() = user_id);

-- Create policy to allow users to delete their own API keys
CREATE POLICY "Users can delete their own API keys" 
ON public.api_keys FOR DELETE
USING (auth.uid() = user_id);

-- Comment on the table
COMMENT ON TABLE public.api_keys IS 'Stores API keys for different AI models used by users'; 