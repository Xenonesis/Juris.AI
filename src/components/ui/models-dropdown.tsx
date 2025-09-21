'use client';

import { useState, useEffect, useCallback } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Model {
  id: string;
  name: string;
  description?: string;
}

interface ModelsDropdownProps {
  provider: string;
  apiKey?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  showRefresh?: boolean;
}

// Cache for models to avoid repeated API calls
const modelsCache = new Map<string, { models: Model[], timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

async function fetchModels(provider: string, apiKey?: string, forceRefresh = false): Promise<Model[]> {
  // Check cache first
  const cacheKey = `${provider}-${apiKey || 'no-key'}`;
  const cached = modelsCache.get(cacheKey);
  
  if (!forceRefresh && cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.models;
  }

  try {
    let models: Model[] = [];
    
    switch (provider) {
      case 'openai':
        if (!apiKey) {
          models = [
            { id: 'gpt-4o', name: 'GPT-4o', description: 'Most capable GPT-4 model' },
            { id: 'gpt-4o-mini', name: 'GPT-4o Mini', description: 'Faster, cheaper GPT-4o' },
            { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', description: 'High-intelligence model' },
            { id: 'gpt-4', name: 'GPT-4', description: 'Previous generation flagship' },
            { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: 'Fast and efficient' }
          ];
        } else {
          const response = await fetch('https://api.openai.com/v1/models', {
            headers: { 
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (!response.ok) throw new Error(`OpenAI API error: ${response.status}`);
          
          const data = await response.json();
          models = data.data
            ?.filter((m: any) => m.id.includes('gpt') && !m.id.includes('instruct'))
            .sort((a: any, b: any) => b.created - a.created)
            .map((m: any) => ({
              id: m.id,
              name: m.id.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
              description: `OpenAI model - ${m.owned_by}`
            })) || [];
        }
        break;
        
      case 'openrouter':
        if (!apiKey) {
          models = [
            { id: 'openai/gpt-4o', name: 'GPT-4o', description: 'Via OpenRouter' },
            { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', description: 'Via OpenRouter' },
            { id: 'google/gemini-pro-1.5', name: 'Gemini Pro 1.5', description: 'Via OpenRouter' }
          ];
        } else {
          const response = await fetch('https://openrouter.ai/api/v1/models', {
            headers: { 
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (!response.ok) throw new Error(`OpenRouter API error: ${response.status}`);
          
          const data = await response.json();
          models = data.data
            ?.filter((m: any) => !m.id.includes('free') && m.pricing?.prompt)
            .sort((a: any, b: any) => parseFloat(a.pricing?.prompt || '0') - parseFloat(b.pricing?.prompt || '0'))
            .slice(0, 20)
            .map((m: any) => ({
              id: m.id,
              name: m.name || m.id,
              description: `$${m.pricing?.prompt}/1K tokens`
            })) || [];
        }
        break;
        
      case 'anthropic':
        if (apiKey) {
          // Try to validate the API key with a simple request
          try {
            const response = await fetch('https://api.anthropic.com/v1/messages', {
              method: 'POST',
              headers: {
                'x-api-key': apiKey,
                'Content-Type': 'application/json',
                'anthropic-version': '2023-06-01'
              },
              body: JSON.stringify({
                model: 'claude-3-haiku-20240307',
                max_tokens: 1,
                messages: [{ role: 'user', content: 'test' }]
              })
            });
            // If we get here without error, API key is valid
          } catch (error) {
            console.warn('Anthropic API key validation failed:', error);
          }
        }
        
        models = [
          { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet', description: 'Most intelligent model' },
          { id: 'claude-3-5-haiku-20241022', name: 'Claude 3.5 Haiku', description: 'Fastest model' },
          { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus', description: 'Most powerful model' },
          { id: 'claude-3-sonnet-20240229', name: 'Claude 3 Sonnet', description: 'Balanced performance' },
          { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku', description: 'Fast and efficient' }
        ];
        break;
        
      case 'gemini':
        if (apiKey) {
          try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
            if (response.ok) {
              const data = await response.json();
              models = data.models
                ?.filter((m: any) => m.name.includes('gemini'))
                .map((m: any) => ({
                  id: m.name.split('/').pop(),
                  name: m.displayName || m.name.split('/').pop(),
                  description: m.description || 'Google AI model'
                })) || [];
            }
          } catch (error) {
            console.warn('Gemini API error:', error);
          }
        }
        
        if (models.length === 0) {
          models = [
            { id: 'gemini-2.0-flash-exp', name: 'Gemini 2.0 Flash', description: 'Latest experimental model' },
            { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', description: 'Most capable model' },
            { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', description: 'Fast and efficient' },
            { id: 'gemini-pro', name: 'Gemini Pro', description: 'Previous generation' }
          ];
        }
        break;
        
      case 'mistral':
        if (apiKey) {
          try {
            const response = await fetch('https://api.mistral.ai/v1/models', {
              headers: { 'Authorization': `Bearer ${apiKey}` }
            });
            if (response.ok) {
              const data = await response.json();
              models = data.data?.map((m: any) => ({
                id: m.id,
                name: m.id.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
                description: `Mistral AI model`
              })) || [];
            }
          } catch (error) {
            console.warn('Mistral API error:', error);
          }
        }
        
        if (models.length === 0) {
          models = [
            { id: 'mistral-large-latest', name: 'Mistral Large', description: 'Most capable model' },
            { id: 'mistral-medium-latest', name: 'Mistral Medium', description: 'Balanced performance' },
            { id: 'mistral-small-latest', name: 'Mistral Small', description: 'Fast and efficient' },
            { id: 'codestral-latest', name: 'Codestral', description: 'Code generation specialist' }
          ];
        }
        break;
        
      case 'cohere':
        if (apiKey) {
          try {
            const response = await fetch('https://api.cohere.ai/v1/models', {
              headers: { 
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
              }
            });
            if (response.ok) {
              const data = await response.json();
              models = data.models
                ?.filter((m: any) => m.name && !m.name.includes('embed'))
                .map((m: any) => ({
                  id: m.name,
                  name: m.name.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
                  description: `${m.context_length ? `${m.context_length} tokens` : 'Cohere model'}`
                })) || [];
            }
          } catch (error) {
            console.warn('Cohere API error:', error);
          }
        }
        
        if (models.length === 0) {
          models = [
            { id: 'command-r-plus', name: 'Command R+', description: 'Most capable model' },
            { id: 'command-r', name: 'Command R', description: 'Balanced performance' },
            { id: 'command', name: 'Command', description: 'Fast and efficient' },
            { id: 'command-light', name: 'Command Light', description: 'Lightweight model' }
          ];
        }
        break;
        
      case 'together':
        if (apiKey) {
          try {
            const response = await fetch('https://api.together.xyz/v1/models', {
              headers: { 
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
              }
            });
            if (response.ok) {
              const data = await response.json();
              models = data.data
                ?.filter((m: any) => m.type === 'chat' && !m.id.includes('embed'))
                .slice(0, 15)
                .map((m: any) => ({
                  id: m.id,
                  name: m.display_name || m.id,
                  description: `${m.context_length ? `${m.context_length} tokens` : 'Together AI model'}`
                })) || [];
            }
          } catch (error) {
            console.warn('Together AI API error:', error);
          }
        }
        
        if (models.length === 0) {
          models = [
            { id: 'meta-llama/Llama-2-70b-chat-hf', name: 'Llama 2 70B Chat', description: 'Meta\'s flagship model' },
            { id: 'mistralai/Mixtral-8x7B-Instruct-v0.1', name: 'Mixtral 8x7B', description: 'Mixture of experts' },
            { id: 'togethercomputer/RedPajama-INCITE-Chat-3B-v1', name: 'RedPajama Chat 3B', description: 'Fast and efficient' },
            { id: 'NousResearch/Nous-Hermes-2-Mixtral-8x7B-DPO', name: 'Nous Hermes 2', description: 'Fine-tuned model' }
          ];
        }
        break;
        
      case 'huggingface':
        if (apiKey) {
          // Hugging Face doesn't have a models API endpoint, so we'll use popular models
          models = [
            { id: 'microsoft/DialoGPT-large', name: 'DialoGPT Large', description: 'Conversational AI' },
            { id: 'facebook/blenderbot-400M-distill', name: 'BlenderBot 400M', description: 'Facebook\'s chatbot' },
            { id: 'microsoft/DialoGPT-medium', name: 'DialoGPT Medium', description: 'Balanced performance' },
            { id: 'facebook/blenderbot_small-90M', name: 'BlenderBot Small', description: 'Lightweight model' }
          ];
        } else {
          models = [
            { id: 'microsoft/DialoGPT-large', name: 'DialoGPT Large', description: 'Conversational AI' },
            { id: 'facebook/blenderbot-400M-distill', name: 'BlenderBot 400M', description: 'Facebook\'s chatbot' }
          ];
        }
        break;
        
      case 'replicate':
        if (apiKey) {
          // Replicate doesn't have a public models list API, so we'll use popular models
          models = [
            { id: 'meta/llama-2-70b-chat', name: 'Llama 2 70B Chat', description: 'Meta\'s flagship model' },
            { id: 'mistralai/mixtral-8x7b-instruct-v0.1', name: 'Mixtral 8x7B', description: 'Mixture of experts' },
            { id: 'meta/llama-2-13b-chat', name: 'Llama 2 13B Chat', description: 'Balanced performance' },
            { id: 'meta/llama-2-7b-chat', name: 'Llama 2 7B Chat', description: 'Fast and efficient' }
          ];
        } else {
          models = [
            { id: 'meta/llama-2-70b-chat', name: 'Llama 2 70B Chat', description: 'Meta\'s flagship model' },
            { id: 'mistralai/mixtral-8x7b-instruct-v0.1', name: 'Mixtral 8x7B', description: 'Mixture of experts' }
          ];
        }
        break;
        
      case 'custom':
        models = [
          { id: 'custom-model-1', name: 'Custom Model 1', description: 'Your custom model' },
          { id: 'custom-model-2', name: 'Custom Model 2', description: 'Your custom model' }
        ];
        break;
        
      case 'chutes':
        models = [
          { id: 'zai-org/GLM-4.5-Air', name: 'GLM-4.5-Air', description: 'Chutes AI GLM model' },
          { id: 'zai-org/GLM-4-9B-Chat', name: 'GLM-4-9B-Chat', description: 'Smaller GLM model' },
          { id: 'zai-org/GLM-4-Plus', name: 'GLM-4-Plus', description: 'Enhanced GLM model' }
        ];
        break;
        
      default:
        models = [];
    }
    
    // Cache the results
    modelsCache.set(cacheKey, { models, timestamp: Date.now() });
    return models;
    
  } catch (error) {
    console.error(`Error fetching models for ${provider}:`, error);
    
    // Return cached data if available, otherwise fallback to static models
    const cached = modelsCache.get(cacheKey);
    if (cached) {
      return cached.models;
    }
    
    // Fallback to static models
    return fetchModels(provider, undefined, false);
  }
}

export function ModelsDropdown({ 
  provider, 
  apiKey, 
  value, 
  onValueChange, 
  placeholder = "Select model",
  showRefresh = true 
}: ModelsDropdownProps) {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadModels = useCallback(async (forceRefresh = false) => {
    if (!provider) {
      setModels([]);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const fetchedModels = await fetchModels(provider, apiKey, forceRefresh);
      setModels(fetchedModels);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load models');
      console.error('Error loading models:', err);
    } finally {
      setLoading(false);
    }
  }, [provider, apiKey]);

  useEffect(() => {
    loadModels();
  }, [loadModels]);

  const handleRefresh = () => {
    loadModels(true);
  };

  return (
    <div className="flex gap-2 items-center">
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="h-9 bg-background/50 flex-1">
          <SelectValue placeholder={loading ? "Loading models..." : placeholder} />
        </SelectTrigger>
        <SelectContent className="max-h-[300px]">
          {loading && (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              <span className="text-sm text-muted-foreground">Loading models...</span>
            </div>
          )}
          
          {error && (
            <div className="p-4 text-center">
              <p className="text-sm text-destructive mb-2">{error}</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefresh}
                className="h-7"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Retry
              </Button>
            </div>
          )}
          
          {!loading && !error && models.length === 0 && (
            <SelectItem value="" disabled>
              No models available for {provider}
            </SelectItem>
          )}
          
          {!loading && !error && models.map((model) => (
            <SelectItem key={model.id} value={model.id} className="flex flex-col items-start">
              <div className="flex flex-col">
                <span className="font-medium">{model.name}</span>
                {model.description && (
                  <span className="text-xs text-muted-foreground">{model.description}</span>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {showRefresh && provider && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={loading}
          className="h-9 px-3"
          title="Refresh models list"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
        </Button>
      )}
    </div>
  );
}
