interface ModelOption {
  id: string;
  name: string;
  provider: string;
}

export async function fetchOpenAIModels(apiKey?: string): Promise<ModelOption[]> {
  if (!apiKey) return [];
  try {
    const response = await fetch('https://api.openai.com/v1/models', {
      headers: { 'Authorization': `Bearer ${apiKey}` }
    });
    const data = await response.json();
    return data.data?.filter((m: any) => m.id.includes('gpt')).map((m: any) => ({
      id: m.id,
      name: m.id,
      provider: 'openai'
    })) || [];
  } catch { return []; }
}

export async function fetchOpenRouterModels(apiKey?: string): Promise<ModelOption[]> {
  if (!apiKey) return [];
  try {
    const response = await fetch('https://openrouter.ai/api/v1/models', {
      headers: { 'Authorization': `Bearer ${apiKey}` }
    });
    const data = await response.json();
    return data.data?.slice(0, 10).map((m: any) => ({
      id: m.id,
      name: m.name || m.id,
      provider: 'openrouter'
    })) || [];
  } catch { return []; }
}

export async function fetchAvailableModels(apiKeys: Record<string, string>): Promise<ModelOption[]> {
  const [openaiModels, openrouterModels] = await Promise.all([
    fetchOpenAIModels(apiKeys.openai),
    fetchOpenRouterModels(apiKeys.openrouter)
  ]);
  
  return [
    { id: 'mistral-large', name: 'Mistral Large', provider: 'mistral' },
    { id: 'gemini-pro', name: 'Gemini Pro', provider: 'gemini' },
    { id: 'claude-3', name: 'Claude 3', provider: 'anthropic' },
    ...openaiModels,
    ...openrouterModels
  ];
}
