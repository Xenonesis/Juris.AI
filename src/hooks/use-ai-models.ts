import { useState, useCallback, useMemo } from 'react';
import { getAIResponse } from '@/lib/ai-services';
import { calculateRealPerformanceMetrics, calculateActualResponseTime } from '@/lib/real-performance-analyzer';
import type { AIProvider } from '@/lib/constants';

export interface ModelPerformance {
  accuracy: number;
  responseTime: number;
  relevance: number;
  reasoning: number;
  overall: number;
}

export interface ModelResults {
  gpt: string | null;
  claude: string | null;
  gemini: string | null;
  mistral: string | null;
  chutes: string | null;
}

export interface ModelPerformances {
  gpt?: ModelPerformance;
  claude?: ModelPerformance;
  gemini?: ModelPerformance;
  mistral?: ModelPerformance;
  chutes?: ModelPerformance;
}

export function useAIModels(userApiKeys: Record<string, string>) {
  const [results, setResults] = useState<ModelResults>({
    gpt: null,
    claude: null,
    gemini: null,
    mistral: null,
    chutes: null,
  });

  const [modelPerformances, setModelPerformances] = useState<ModelPerformances>({});
  const [isLoading, setIsLoading] = useState(false);

  // Memoize available models based on API keys
  const availableModels = useMemo(() => {
    return {
      hasOpenAI: !!userApiKeys['openai'],
      hasAnthropicClaude: !!userApiKeys['anthropic'],
      hasGemini: !!userApiKeys['gemini'],
      hasMistral: !!userApiKeys['mistral'],
      hasChutes: !!userApiKeys['chutes'],
    };
  }, [userApiKeys]);

  // Calculate actual response time without artificial variations
  const calculateResponseTime = useCallback((startTime: number): number => {
    return calculateActualResponseTime(startTime);
  }, []);

  // Calculate real performance metrics based on actual response content
  const calculateMetrics = useCallback((response: string, modelType: string, responseTime: number): ModelPerformance => {
    const realMetrics = calculateRealPerformanceMetrics(response, responseTime, modelType);
    
    return {
      accuracy: realMetrics.accuracy,
      responseTime: realMetrics.responseTime,
      relevance: realMetrics.relevance,
      reasoning: realMetrics.reasoning,
      overall: realMetrics.overall
    };
  }, []);

  // Process AI model response with quota fallback
  const processModelResponse = useCallback(async (
    prompt: string,
    provider: AIProvider,
    modelName: string,
    startTime: number
  ) => {
    try {
      const response = await getAIResponse(prompt, provider, userApiKeys);
      const responseTime = calculateResponseTime(startTime);
      const metrics = calculateMetrics(response, modelName, responseTime);
      
      setResults(prev => ({ ...prev, [modelName]: response }));
      setModelPerformances(prev => ({ ...prev, [modelName]: metrics }));
      
      return response;
    } catch (error) {
      console.error(`${provider} API error:`, error);
      
      // Handle quota exceeded errors specifically for Gemini
      if (provider === 'gemini' && error instanceof Error && 
          error.message?.includes('429') && error.message?.includes('quota')) {
        
        // Try to fallback to another available model
        const fallbackProvider = 
          availableModels.hasMistral ? 'mistral' :
          availableModels.hasOpenAI ? 'openai' :
          availableModels.hasAnthropicClaude ? 'anthropic' : null;
          
        if (fallbackProvider) {
          try {
            console.log(`Gemini quota exceeded, falling back to ${fallbackProvider}`);
            const fallbackResponse = await getAIResponse(prompt, fallbackProvider, userApiKeys);
            const responseTime = calculateResponseTime(startTime);
            const metrics = calculateMetrics(fallbackResponse, modelName, responseTime);
            
            const fallbackMessage = `🔄 **Auto-switched from Gemini to ${fallbackProvider.charAt(0).toUpperCase() + fallbackProvider.slice(1)}**

*Gemini quota exceeded - using ${fallbackProvider} instead*

---

${fallbackResponse}`;
            
            setResults(prev => ({ ...prev, [modelName]: fallbackMessage }));
            setModelPerformances(prev => ({ ...prev, [modelName]: metrics }));
            
            return fallbackMessage;
          } catch (fallbackError) {
            console.error(`Fallback to ${fallbackProvider} also failed:`, fallbackError);
          }
        }
        
        // If no fallback available or fallback failed, show quota message
        const errorMessage = `⚠️ **Gemini Quota Exceeded**

Free tier limit reached (50 requests/day).

**Solutions:**
1. Switch to another AI model using the selector above
2. Add your own Gemini API key in Profile Settings
3. Wait for quota reset (check error details)

**Quick Fix:** Use Mistral or OpenAI instead.`;
        
        setResults(prev => ({ ...prev, [modelName]: errorMessage }));
        return null;
      }
      
      const errorMessage = `Failed to get response from ${provider}.`;
      setResults(prev => ({ ...prev, [modelName]: errorMessage }));
      return null;
    }
  }, [userApiKeys, calculateResponseTime, calculateMetrics, availableModels]);

  // Query all available AI models
  const queryModels = useCallback(async (prompt: string) => {
    setIsLoading(true);
    
    const startTimes = {
      gpt: Date.now(),
      claude: Date.now(),
      gemini: Date.now(),
      mistral: Date.now(),
      chutes: Date.now(),
    };

    const modelPromises = [];

    // Process each available model
    if (availableModels.hasOpenAI) {
      modelPromises.push(processModelResponse(prompt, 'openai', 'gpt', startTimes.gpt));
    } else {
      setResults(prev => ({ ...prev, gpt: 'API key for OpenAI not provided.' }));
    }

    if (availableModels.hasAnthropicClaude) {
      modelPromises.push(processModelResponse(prompt, 'anthropic', 'claude', startTimes.claude));
    } else {
      setResults(prev => ({ ...prev, claude: 'API key for Claude not provided.' }));
    }

    if (availableModels.hasGemini) {
      modelPromises.push(processModelResponse(prompt, 'gemini', 'gemini', startTimes.gemini));
    } else {
      setResults(prev => ({ ...prev, gemini: 'API key for Gemini not provided.' }));
    }

    if (availableModels.hasMistral) {
      modelPromises.push(processModelResponse(prompt, 'mistral', 'mistral', startTimes.mistral));
    } else {
      setResults(prev => ({ ...prev, mistral: 'API key for Mistral not provided.' }));
    }

    if (availableModels.hasChutes) {
      modelPromises.push(processModelResponse(prompt, 'chutes', 'chutes', startTimes.chutes));
    } else {
      setResults(prev => ({ ...prev, chutes: 'API key for Chutes AI not provided.' }));
    }

    try {
      await Promise.allSettled(modelPromises);
    } catch (error) {
      console.error('Error processing AI models:', error);
    } finally {
      setIsLoading(false);
    }
  }, [availableModels, processModelResponse]);

  // Reset results
  const resetResults = useCallback(() => {
    setResults({
      gpt: null,
      claude: null,
      gemini: null,
      mistral: null,
      chutes: null,
    });
    setModelPerformances({});
  }, []);

  return {
    results,
    modelPerformances,
    isLoading,
    availableModels,
    queryModels,
    resetResults,
  };
}
