import { GoogleGenerativeAI } from '@google/generative-ai';
import { searchCasetextParallel, searchLexisNexis, searchWestlaw, LegalCase, Statute } from './legal-apis';
import { getApiKey } from './api-key-service';
import { apiCache, createCacheKey, withCache } from './api-cache';

// Server-side API keys (never expose to client)
const defaultGeminiApiKey = process.env.GEMINI_API_KEY || '';
const defaultMistralApiKey = process.env.MISTRAL_API_KEY || '';
const defaultOpenAIApiKey = process.env.OPENAI_API_KEY || '';
const defaultAnthropicApiKey = process.env.ANTHROPIC_API_KEY || '';

// API URLs
const mistralApiUrl = 'https://api.mistral.ai/v1';
const openaiApiUrl = 'https://api.openai.com/v1';
const anthropicApiUrl = 'https://api.anthropic.com/v1';

// Legal APIs (server-side only)
const CASELAW_API_KEY = process.env.CASELAW_API_KEY || '';
const CASELAW_API_URL = 'https://api.case.law/v1';

// Legal disclaimer to append to all legal advice
const LEGAL_DISCLAIMER = "DISCLAIMER: This information is provided for general informational purposes only and does not constitute legal advice. This should not be used as a substitute for competent legal advice from a licensed attorney in your jurisdiction.";

/**
 * Handles chat with Gemini API
 * Note: Free tier has strict rate limits
 */
export async function geminiChat(prompt: string, apiKey?: string): Promise<string> {
  try {
    // Use provided API key or fall back to default
    const geminiApiKey = apiKey || defaultGeminiApiKey;
    const genAI = new GoogleGenerativeAI(geminiApiKey);
    
    // Create a chat instance with the correct model name
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }); // Using Flash model (lower quota usage)
    
    // Generate content with proper error handling
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        maxOutputTokens: 800, // Increased token count for more detailed responses
        temperature: 0.7
      }
    });
    
    const response = await result.response;
    const text = response.text();
    return text;
  } catch (error: any) {
    console.error('Error with Gemini AI:', error);
    
    // Check for rate limit errors
    if (error.message && error.message.includes('429') && error.message.includes('quota')) {
      return 'The Gemini AI service has reached its rate limit. Please try again later or switch to another AI model.';
    }

    // Check for API key errors
    if (error.message && (error.message.includes('invalid API key') || error.message.includes('API key not valid'))) {
      return 'The Gemini API key is invalid. Please check your API key in the settings.';
    }
    
    return 'Sorry, there was an error processing your request with Gemini.';
  }
}

/**
 * Handles chat with Mistral API
 */
export async function mistralChat(prompt: string, apiKey?: string): Promise<string> {
  try {
    // Use provided API key or fall back to default
    const mistralApiKey = apiKey || defaultMistralApiKey;
    
    const response = await fetch(`${mistralApiUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${mistralApiKey}`
      },
      body: JSON.stringify({
        model: 'mistral-medium', // Using medium model for better legal analysis
        messages: [
          { 
            role: 'user', 
            content: prompt 
          }
        ],
        temperature: 0.4, // Lower temperature for more factual responses
        max_tokens: 800 // Increased token count for detailed legal responses
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Mistral API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error: any) {
    console.error('Error with Mistral AI:', error);
    
    // Check for API key errors
    if (error.message && (
      error.message.includes('invalid API key') || 
      error.message.includes('API key not valid') ||
      error.message.includes('401')
    )) {
      return 'The Mistral API key is invalid. Please check your API key in the settings.';
    }
    
    return 'Sorry, there was an error processing your request with Mistral.';
  }
}

/**
 * Handles chat with OpenAI's GPT-4
 */
export async function openaiChat(prompt: string, apiKey?: string): Promise<string> {
  try {
    // Use provided API key or fall back to default
    const openaiApiKey = apiKey || defaultOpenAIApiKey;
    
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not provided');
    }
    
    const response = await fetch(`${openaiApiUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4', // Using GPT-4 for best legal understanding
        messages: [
          { 
            role: 'user', 
            content: prompt 
          }
        ],
        temperature: 0.3, // Lower temperature for factual responses
        max_tokens: 1000, // Allow for detailed legal analysis
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error: any) {
    console.error('Error with OpenAI:', error);
    
    // Check for API key errors
    if (error.message && (
      error.message.includes('invalid API key') || 
      error.message.includes('API key not valid') ||
      error.message.includes('401')
    )) {
      return 'The OpenAI API key is invalid. Please check your API key in the settings.';
    }
    
    // Check for rate limit errors
    if (error.message && error.message.includes('429')) {
      return 'The OpenAI service has reached its rate limit. Please try again later or switch to another AI model.';
    }
    
    return 'Sorry, there was an error processing your request with OpenAI.';
  }
}

/**
 * Handles chat with Anthropic's Claude
 */
export async function claudeChat(prompt: string, apiKey?: string): Promise<string> {
  try {
    // Use provided API key or fall back to default
    const anthropicApiKey = apiKey || defaultAnthropicApiKey;
    
    if (!anthropicApiKey) {
      throw new Error('Anthropic API key not provided');
    }
    
    const response = await fetch(`${anthropicApiUrl}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicApiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-opus-20240229', // Using Claude 3 Opus for best reasoning
        messages: [
          { 
            role: 'user', 
            content: prompt 
          }
        ],
        temperature: 0.3,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Anthropic API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data.content[0].text;
  } catch (error: any) {
    console.error('Error with Claude AI:', error);
    
    // Check for API key errors
    if (error.message && (
      error.message.includes('invalid API key') || 
      error.message.includes('API key not valid') ||
      error.message.includes('401')
    )) {
      return 'The Anthropic/Claude API key is invalid. Please check your API key in the settings.';
    }
    
    return 'Sorry, there was an error processing your request with Claude.';
  }
}

/**
 * Gets AI response with user's API key if available (with caching)
 */
export const getAIResponse = withCache(
  async (
    message: string,
    provider: 'openai' | 'anthropic' | 'gemini' | 'mistral' | 'cohere' | 'together' | 'openrouter' | 'huggingface' | 'replicate' | 'custom' = 'mistral',
    apiKeyMap: Record<string, string> = {},
    selectedModel?: string
  ): Promise<string> => {
  try {
    // Get the appropriate API key for the selected provider
    const apiKey = getApiKey(apiKeyMap, provider, 
      provider === 'mistral' ? defaultMistralApiKey :
      provider === 'gemini' ? defaultGeminiApiKey :
      provider === 'openai' ? defaultOpenAIApiKey :
      provider === 'anthropic' ? defaultAnthropicApiKey : undefined
    );
    
    switch (provider) {
      case 'mistral':
        return await mistralChat(message, apiKey || undefined);
      case 'gemini':
        return await geminiChat(message, apiKey || undefined);
      case 'openai':
        return await openaiChat(message, apiKey || undefined);
      case 'anthropic':
        return await claudeChat(message, apiKey || undefined);
      case 'openrouter':
        // For OpenRouter, use their API with the user's API key
        if (!apiKey) {
          throw new Error('OpenRouter API key is required');
        }
        return await openaiChat(message, apiKey); // OpenRouter uses OpenAI-compatible API
      case 'custom':
        // For custom providers, fallback to Mistral if no specific implementation
        if (!apiKey) {
          throw new Error('Custom provider API key is required');
        }
        return await mistralChat(message, apiKey);
      case 'cohere':
        // For Cohere, fallback to Mistral if no specific implementation
        if (!apiKey) {
          throw new Error('Cohere API key is required');
        }
        return await mistralChat(message, apiKey);
      case 'together':
        // For Together AI, fallback to Mistral if no specific implementation
        if (!apiKey) {
          throw new Error('Together AI API key is required');
        }
        return await mistralChat(message, apiKey);
      case 'huggingface':
        // For Hugging Face, fallback to Mistral if no specific implementation
        if (!apiKey) {
          throw new Error('Hugging Face API key is required');
        }
        return await mistralChat(message, apiKey);
      case 'replicate':
        // For Replicate, fallback to Mistral if no specific implementation
        if (!apiKey) {
          throw new Error('Replicate API key is required');
        }
        return await mistralChat(message, apiKey);
      default:
        return await mistralChat(message, apiKey || undefined);
    }
  } catch (error) {
    console.error('Error in getAIResponse:', error);
    
    // If primary provider fails, try fallback to Mistral
    if (provider !== 'mistral') {
      console.log('Falling back to Mistral AI');
      const fallbackApiKey = getApiKey(apiKeyMap, 'mistral', defaultMistralApiKey);
      return await mistralChat(message, fallbackApiKey || undefined);
    }

    return 'Sorry, all AI providers failed to process your request. Please try again later.';
  }
  },
  // Cache key generator
  (message: string, provider?: 'openai' | 'anthropic' | 'gemini' | 'mistral' | 'cohere' | 'together' | 'openrouter' | 'huggingface' | 'replicate' | 'custom', apiKeyMap?: Record<string, string>, selectedModel?: string) =>
    createCacheKey('ai-response', provider || 'mistral', message.slice(0, 100), selectedModel || 'default'),
  // Cache for 10 minutes
  10 * 60 * 1000
);

/**
 * Fetch relevant case law based on query and jurisdiction (with caching)
 * Uses real legal APIs when available
 */
export const fetchRelevantCaseLaw = withCache(
  async (query: string, jurisdiction: string = 'us'): Promise<LegalCase[]> => {
  try {
    // Try to fetch cases from Casetext (or mock version)
    const cases = await searchCasetextParallel(query, jurisdiction, 3);
    
    // Return results
    return cases;
  } catch (error) {
    console.error('Error fetching case law:', error);
    
    // Fallback to direct API call if adapter fails
    try {
      // Map jurisdiction to Case.law jurisdiction if needed
      const jurisdictionMap: {[key: string]: string} = {
        'us': 'us',
        'uk': 'uk',
        'canada': 'ca',
        'australia': 'au',
        'general': 'us'
      };
      
      const mappedJurisdiction = jurisdictionMap[jurisdiction] || 'us';
      
      // Format search query
      const searchQuery = encodeURIComponent(query);
      
      const response = await fetch(`${CASELAW_API_URL}/cases/?search=${searchQuery}&jurisdiction=${mappedJurisdiction}&limit=3`, {
        headers: {
          'Authorization': `Token ${CASELAW_API_KEY}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Case Law API error: ${response.status}`);
      }
      
      const data = await response.json();
      return data.results || [];
    } catch (fallbackError) {
      console.error('Fallback case law fetch failed:', fallbackError);
      return [];
    }
  }
  },
  // Cache key generator
  (query: string, jurisdiction: string) => createCacheKey('case-law', jurisdiction, query.slice(0, 50)),
  // Cache for 30 minutes
  30 * 60 * 1000
);

/**
 * Fetch relevant statutes based on query and jurisdiction
 * Uses real legal APIs when available
 */
export async function fetchRelevantStatutes(query: string, jurisdiction: string = 'us'): Promise<Statute[]> {
  try {
    // Try to get statutes from LexisNexis (or our mock version)
    const result = await searchLexisNexis(query, jurisdiction, 3);
    return result.statutes;
  } catch (error) {
    console.error('Error fetching statutes from LexisNexis:', error);
    
    // Fallback to Westlaw
    try {
      const westlawResult = await searchWestlaw(query, jurisdiction, 2);
      return westlawResult.statutes;
    } catch (westlawError) {
      console.error('Error fetching statutes from Westlaw:', westlawError);
      
      // Last resort fallback to mock data
      return [
        {
          id: "fallback_statute_1",
          title: "General Legal Principles Act",
          code: jurisdiction === 'us' ? 'U.S. Code' : 'Legal Code',
          section: "Section 42",
          jurisdiction: jurisdiction,
          content: "Legal principles relevant to this query would typically be found in this section.",
          relevance: 0.7
        }
      ];
    }
  }
}

/**
 * Provides specialized legal advice using AI providers with legal-specific prompting and real legal data
 */
export async function getLegalAdvice(
  query: string,
  provider: 'gemini' | 'mistral' | 'openai' | 'anthropic' | 'cohere' | 'together' | 'openrouter' | 'huggingface' | 'replicate' | 'custom' = 'mistral',
  jurisdiction: string = 'general'
): Promise<string> {
  try {
    // 1. Fetch relevant case law and statutes in parallel
    const [caseLaw, statutes] = await Promise.all([
      fetchRelevantCaseLaw(query, jurisdiction),
      fetchRelevantStatutes(query, jurisdiction)
    ]);
    
    // 2. Format the prompt with legal context, jurisdiction, and real legal references
    let legalContext = '';
    
    // Add case law references if available
    if (caseLaw.length > 0) {
      legalContext += "\nRelevant Case Law:\n";
      caseLaw.forEach((caseItem: LegalCase, index: number) => {
        legalContext += `${index + 1}. "${caseItem.name}" (${caseItem.decision_date}) - ${caseItem.court}\n`;
        if (caseItem.citation) {
          legalContext += `   Citation: ${caseItem.citation}\n`;
        }
        if (caseItem.summary) {
          legalContext += `   Summary: ${caseItem.summary}\n`;
        }
      });
    }
    
    // Add statute references if available
    if (statutes.length > 0) {
      legalContext += "\nRelevant Statutes:\n";
      statutes.forEach((statute: Statute, index: number) => {
        legalContext += `${index + 1}. ${statute.title}, ${statute.code} ${statute.section}\n`;
        legalContext += `   Content: "${statute.content}"\n`;
      });
    }
    
    const legalPrompt = `
You are Juris, an experienced legal advisor with expertise in global legal systems. You are knowledgeable about laws in the United States, United Kingdom, European Union, Canada, Australia, India, Nepal, China, and other jurisdictions. You excel at providing accurate, well-structured legal information based on relevant statutes and case law.

Please analyze the following legal question:

Question: ${query}
Jurisdiction: ${jurisdiction}
${legalContext}

Provide a comprehensive legal analysis that includes:
1. Applicable legal principles and frameworks specific to the ${jurisdiction} jurisdiction
2. Analysis based on the relevant statutes and case law provided
3. Standard legal approaches to this issue in ${jurisdiction}
4. Practical steps that would typically be recommended in this situation
5. Important factors that might affect the outcome

Format your response as a professional legal analysis. Focus on providing substantive, accurate legal information based on the legal references and established principles. Maintain a formal, authoritative tone throughout your response.
`;

    // 3. Get AI response using the enhanced prompt
    let response;
    if (provider === 'mistral') {
      response = await mistralChat(legalPrompt);
    } else {
      response = await geminiChat(legalPrompt);
    }

    // 4. Format the final response with legal references and disclaimer
    let finalResponse = response;
    
    // Add sourceable references section if we have case law or statutes
    if (caseLaw.length > 0 || statutes.length > 0) {
      finalResponse += "\n\n**Sources Referenced:**\n";
      
      if (caseLaw.length > 0) {
        finalResponse += "\nCase Law:\n";
        caseLaw.forEach((caseItem: LegalCase, index: number) => {
          finalResponse += `${index + 1}. ${caseItem.name} (${caseItem.decision_date}) - ${caseItem.citation}\n`;
        });
      }
      
      if (statutes.length > 0) {
        finalResponse += "\nStatutes:\n";
        statutes.forEach((statute: Statute, index: number) => {
          finalResponse += `${index + 1}. ${statute.title}, ${statute.code} ${statute.section}\n`;
        });
      }
    }

    // Add disclaimer
    return `${finalResponse}\n\n${LEGAL_DISCLAIMER}`;
  } catch (error) {
    console.error('Error in getLegalAdvice:', error);
    return `Sorry, there was an error processing your legal query. Please try again later.\n\n${LEGAL_DISCLAIMER}`;
  }
} 
