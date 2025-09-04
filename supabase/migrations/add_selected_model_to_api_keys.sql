-- Migration to add selected_model column to api_keys table
-- This allows storing specific model information for each API key

ALTER TABLE public.api_keys 
ADD COLUMN IF NOT EXISTS selected_model TEXT;

-- Add a comment for the new column
COMMENT ON COLUMN public.api_keys.selected_model IS 'Specific AI model selected for this API key (e.g., gpt-4, claude-3-opus)';

-- Create an index for better performance when querying by model
CREATE INDEX IF NOT EXISTS idx_api_keys_selected_model ON public.api_keys(selected_model);

-- Update the unique constraint to include selected_model if needed
-- Note: This allows multiple keys for the same provider but different models
-- If you want to maintain one key per provider, keep the existing constraint