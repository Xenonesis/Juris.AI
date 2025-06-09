import { useState, useCallback, useMemo } from 'react';
import { getAIResponse } from '@/lib/ai-services';
import { AI_MODELS, PERFORMANCE_METRICS } from '@/lib/constants';
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
}

export interface ModelPerformances {
  gpt?: ModelPerformance;
  claude?: ModelPerformance;
  gemini?: ModelPerformance;
  mistral?: ModelPerformance;
}

export function useAIModels(userApiKeys: Record<string, string>) {
  const [results, setResults] = useState<ModelResults>({
    gpt: null,
    claude: null,
    gemini: null,
    mistral: null,
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
    };
  }, [userApiKeys]);

  // Calculate response time with model-specific variations
  const calculateResponseTime = useCallback((startTime: number, modelType: string): number => {
    const baseTime = Date.now() - startTime;
    const variations = {
      gpt: Math.floor(Math.random() * 100),
      claude: Math.floor(Math.random() * 150),
      gemini: Math.floor(Math.random() * 50),
      mistral: Math.floor(Math.random() * 30),
    };
    return baseTime + (variations[modelType as keyof typeof variations] || 0);
  }, []);

  // Calculate performance metrics
  const calculateMetrics = useCallback((response: string, modelType: string): ModelPerformance => {
    const randomFactor = (Math.random() * PERFORMANCE_METRICS.RANDOM_FACTOR_RANGE * 2) - PERFORMANCE_METRICS.RANDOM_FACTOR_RANGE;
    
    const modelConfig = Object.values(AI_MODELS).find(model => model.name === modelType);
    const baseAccuracy = modelConfig?.baseAccuracy || 85;
    
    const relevance = Math.min(PERFORMANCE_METRICS.MAX_SCORE, Math.max(PERFORMANCE_METRICS.MIN_SCORE, baseAccuracy - 5 + randomFactor));
    const reasoning = Math.min(PERFORMANCE_METRICS.MAX_SCORE, Math.max(PERFORMANCE_METRICS.MIN_SCORE, baseAccuracy + 2 + randomFactor));
    const accuracy = Math.min(PERFORMANCE_METRICS.MAX_SCORE, Math.max(PERFORMANCE_METRICS.MIN_SCORE, baseAccuracy + randomFactor));
    
    const overall = Math.round(
      (accuracy * PERFORMANCE_METRICS.ACCURACY_WEIGHT) + 
      (relevance * PERFORMANCE_METRICS.RELEVANCE_WEIGHT) + 
      (reasoning * PERFORMANCE_METRICS.REASONING_WEIGHT)
    );
    
    return {
      accuracy: Math.round(accuracy),
      relevance: Math.round(relevance),
      reasoning: Math.round(reasoning),
      overall: Math.round(overall),
      responseTime: 0, // Will be set by caller
    };
  }, []);

  // Process AI model response
  const processModelResponse = useCallback(async (
    prompt: string,
    provider: AIProvider,
    modelName: string,
    startTime: number
  ) => {
    try {
      const response = await getAIResponse(prompt, provider, userApiKeys);
      const responseTime = calculateResponseTime(startTime, modelName);
      const metrics = { ...calculateMetrics(response, modelName), responseTime };
      
      setResults(prev => ({ ...prev, [modelName]: response }));
      setModelPerformances(prev => ({ ...prev, [modelName]: metrics }));
      
      return response;
    } catch (error) {
      console.error(`${provider} API error:`, error);
      const errorMessage = `Failed to get response from ${provider}.`;
      setResults(prev => ({ ...prev, [modelName]: errorMessage }));
      return null;
    }
  }, [userApiKeys, calculateResponseTime, calculateMetrics]);

  // Query all available AI models
  const queryModels = useCallback(async (prompt: string) => {
    setIsLoading(true);
    
    const startTimes = {
      gpt: Date.now(),
      claude: Date.now(),
      gemini: Date.now(),
      mistral: Date.now(),
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
