-- Verification script to check if api_keys table exists and troubleshoot issues
-- Run this in your Supabase SQL Editor to diagnose the problem

-- 1. Check if the api_keys table exists
SELECT table_name, table_schema 
FROM information_schema.tables 
WHERE table_name = 'api_keys';

-- 2. List all tables in the public schema
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- 3. Check if there are any policies on api_keys table (if it exists)
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'api_keys';

-- 4. Force refresh the schema cache (this might help with the caching issue)
NOTIFY pgrst, 'reload schema';

-- 5. If the table doesn't exist, create it again with a different approach
DO $$
BEGIN
    -- Drop table if it exists (to start fresh)
    DROP TABLE IF EXISTS public.api_keys CASCADE;
    
    -- Create the table
    CREATE TABLE public.api_keys (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
        model_type TEXT NOT NULL,
        api_key TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT now(),
        updated_at TIMESTAMPTZ DEFAULT now(),
        UNIQUE(user_id, model_type)
    );
    
    -- Create indexes
    CREATE INDEX idx_api_keys_user_id ON public.api_keys(user_id);
    CREATE INDEX idx_api_keys_model_type ON public.api_keys(model_type);
    
    -- Enable RLS
    ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;
    
    -- Create policies
    CREATE POLICY "Users can view their own API keys"
        ON public.api_keys FOR SELECT 
        USING (auth.uid() = user_id);
        
    CREATE POLICY "Users can insert their own API keys"
        ON public.api_keys FOR INSERT 
        WITH CHECK (auth.uid() = user_id);
        
    CREATE POLICY "Users can update their own API keys"
        ON public.api_keys FOR UPDATE
        USING (auth.uid() = user_id);
        
    CREATE POLICY "Users can delete their own API keys"
        ON public.api_keys FOR DELETE
        USING (auth.uid() = user_id);
    
    -- Add comment
    COMMENT ON TABLE public.api_keys IS 'Stores API keys for different AI models used by users';
    
    RAISE NOTICE 'api_keys table created successfully!';
    
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error creating api_keys table: %', SQLERRM;
END $$;