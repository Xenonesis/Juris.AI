-- Add custom provider fields to api_keys table
-- This adds base_url and model_id columns for custom AI provider configurations

-- Add base_url column for custom provider endpoints
ALTER TABLE public.api_keys 
ADD COLUMN IF NOT EXISTS base_url TEXT;

-- Add model_id column for custom model identifiers
ALTER TABLE public.api_keys 
ADD COLUMN IF NOT EXISTS model_id TEXT;

-- Add comments for the new columns
COMMENT ON COLUMN public.api_keys.base_url IS 'Base URL for custom AI provider API endpoints (e.g., https://api.example.com/v1)';
COMMENT ON COLUMN public.api_keys.model_id IS 'Model identifier for custom AI providers (e.g., my-custom-model-v1)';

-- Create indexes for better performance when querying by these fields
CREATE INDEX IF NOT EXISTS idx_api_keys_base_url ON public.api_keys(base_url);
CREATE INDEX IF NOT EXISTS idx_api_keys_model_id ON public.api_keys(model_id);

-- Verify the columns were added successfully
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'api_keys' 
  AND table_schema = 'public'
  AND column_name IN ('base_url', 'model_id')
ORDER BY ordinal_position;