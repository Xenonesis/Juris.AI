-- Fix for missing selected_model column in api_keys table
-- This resolves the error: "Could not find the 'selected_model' column of 'api_keys' in the schema cache"
-- 
-- Instructions:
-- 1. Go to your Supabase dashboard
-- 2. Navigate to SQL Editor
-- 3. Copy and paste this entire script
-- 4. Click "Run" to execute

-- Add the selected_model column if it doesn't exist
ALTER TABLE public.api_keys 
ADD COLUMN IF NOT EXISTS selected_model TEXT;

-- Add a comment for the new column
COMMENT ON COLUMN public.api_keys.selected_model IS 'Specific AI model selected for this API key (e.g., gpt-4, claude-3-opus)';

-- Create an index for better performance when querying by model
CREATE INDEX IF NOT EXISTS idx_api_keys_selected_model ON public.api_keys(selected_model);

-- Verify the column was added successfully
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'api_keys' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- Optional: Check if there are any existing API keys that need the new column
SELECT 
    id,
    user_id,
    model_type,
    selected_model,
    created_at
FROM public.api_keys
LIMIT 5;