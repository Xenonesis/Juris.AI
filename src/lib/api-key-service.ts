import { createClient } from '@/lib/supabase/client';

interface ApiKey {
  id: string;
  user_id: string;
  model_type: string;
  api_key: string;
  base_url?: string;
  model_id?: string;
  created_at: string;
  updated_at: string;
}

interface CustomProviderConfig {
  api_key: string;
  base_url?: string;
  model_id?: string;
}

/**
 * Loads user API keys from Supabase
 */
export async function getUserApiKeys(userId: string): Promise<Record<string, string>> {
  if (!userId) return {};
  
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    
    // Convert to a map of model_type -> api_key
    const apiKeyMap: Record<string, string> = {};
    (data || []).forEach((key: ApiKey) => {
      apiKeyMap[key.model_type] = key.api_key;
    });
    
    return apiKeyMap;
  } catch (error) {
    console.error('Error loading API keys:', error);
    return {};
  }
}

/**
 * Gets the preferred API key for a specific model
 * Falls back to environment variable if user hasn't set a key
 */
export function getApiKey(
  apiKeyMap: Record<string, string>, 
  modelType: string,
  fallbackEnvKey?: string
): string | null {
  // First check if user has a saved API key
  if (apiKeyMap[modelType]) {
    return apiKeyMap[modelType];
  }
  
  // Otherwise use environment variable fallback
  if (fallbackEnvKey) {
    return fallbackEnvKey;
  }
  
  // Check for global environment variables based on model type
  if (modelType === 'gemini') {
    return process.env.NEXT_PUBLIC_GEMINI_API_KEY || null;
  }
  
  if (modelType === 'mistral') {
    return process.env.NEXT_PUBLIC_MISTRAL_API_KEY || null;
  }
  
  if (modelType === 'openai') {
    return process.env.NEXT_PUBLIC_OPENAI_API_KEY || null;
  }
  
  if (modelType === 'anthropic') {
    return process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY || null;
  }
  
  if (modelType === 'chutes') {
    return process.env.NEXT_PUBLIC_CHUTES_API_KEY || null;
  }
  
  return null;
}

/**
 * Gets custom provider configuration including base URL and model ID
 */
export async function getCustomProviderConfig(userId: string): Promise<CustomProviderConfig | null> {
  if (!userId) return null;
  
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('api_keys')
      .select('api_key, base_url, model_id')
      .eq('user_id', userId)
      .eq('model_type', 'custom')
      .single();
    
    if (error || !data) return null;
    
    return {
      api_key: data.api_key,
      base_url: data.base_url,
      model_id: data.model_id
    };
  } catch (error) {
    console.error('Error loading custom provider config:', error);
    return null;
  }
} 