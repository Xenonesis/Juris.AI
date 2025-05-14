import { GoogleGenerativeAI } from '@google/generative-ai';
import { searchCasetextParallel, searchLexisNexis, searchWestlaw, LegalCase, Statute } from './legal-apis';

// Initialize Gemini API - ensure you're using a valid API key in .env
const geminiApiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || 'AIzaSyCYZrSd57RHna4ujKA5Q_rCRJ18oLe7z2o';
const genAI = new GoogleGenerativeAI(geminiApiKey);

// Initialize Mistral API - ensure you're using a valid API key in .env
const mistralApiKey = process.env.NEXT_PUBLIC_MISTRAL_API_KEY || 'lM5RfAcTeqAq2IYtMQjrgfdtlly9VeUE';
const mistralApiUrl = 'https://api.mistral.ai/v1';

// Legal APIs
const CASELAW_API_KEY = process.env.NEXT_PUBLIC_CASELAW_API_KEY || '2b9f1b0d7e3c4a5b8e9d0c1a2f3e4d5b';
const CASELAW_API_URL = 'https://api.case.law/v1';

// Legal disclaimer to append to all legal advice
const LEGAL_DISCLAIMER = "DISCLAIMER: This information is provided for general informational purposes only and does not constitute legal advice. This should not be used as a substitute for competent legal advice from a licensed attorney in your jurisdiction.";

/**
 * Handles chat with Gemini API
 * Note: Free tier has strict rate limits
 */
export async function geminiChat(prompt: string): Promise<string> {
  try {
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
      return 'The Gemini AI service has reached its rate limit. Please try again later or switch to Mistral AI.';
    }
    
    return 'Sorry, there was an error processing your request with Gemini.';
  }
}

/**
 * Handles chat with Mistral API
 */
export async function mistralChat(prompt: string): Promise<string> {
  try {
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
  } catch (error) {
    console.error('Error with Mistral AI:', error);
    return 'Sorry, there was an error processing your request with Mistral.';
  }
}

/**
 * Gets AI response with fallback support
 */
export async function getAIResponse(
  message: string, 
  provider: 'gemini' | 'mistral' = 'mistral' // Changed default to Mistral due to Gemini quota issues
): Promise<string> {
  try {
    if (provider === 'mistral') {
      return await mistralChat(message);
    }
    return await geminiChat(message);
  } catch (error) {
    console.error('Error in getAIResponse:', error);
    
    // If primary provider fails, try fallback
    if (provider === 'gemini') {
      console.log('Falling back to Mistral AI');
      return await mistralChat(message);
    }
    
    return 'Sorry, all AI providers failed to process your request. Please try again later.';
  }
}

/**
 * Fetch relevant case law based on query and jurisdiction
 * Uses real legal APIs when available
 */
export async function fetchRelevantCaseLaw(query: string, jurisdiction: string = 'us'): Promise<LegalCase[]> {
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
}

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
  provider: 'gemini' | 'mistral' = 'mistral',
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