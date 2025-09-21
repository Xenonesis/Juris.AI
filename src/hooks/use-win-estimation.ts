import { useCallback } from 'react';
import { calculateRealWinEstimation } from '@/lib/real-case-studies';
import { getAIResponse } from '@/lib/ai-services';
import type { CaseStudy } from './use-case-studies';

export function useWinEstimation() {
  const calculateWinEstimate = useCallback(async (
    query: string, 
    jurisdiction: string, 
    userApiKeys: Record<string, string>,
    caseStudies?: CaseStudy[]
  ): Promise<number> => {
    try {
      // Use AI to analyze the legal question for win probability
      const provider = userApiKeys.openai ? 'openai' : 
                      userApiKeys.anthropic ? 'anthropic' :
                      userApiKeys.mistral ? 'mistral' : 'gemini';

      const winAnalysisPrompt = `As a legal expert specializing in ${jurisdiction} law, analyze the following legal question and provide a realistic win probability estimate:

Query: "${query}"
Jurisdiction: ${jurisdiction}

Consider these factors in your analysis:
1. Legal strength of the position
2. Available evidence indicators in the query
3. Jurisdiction-specific legal standards
4. Common outcomes for similar cases
5. Potential legal challenges or weaknesses

Provide your analysis in this format:
Win Probability: [percentage number only, e.g., 75]

Analysis: [Brief explanation of factors that influence this probability]

Base your estimate on realistic legal analysis, not optimistic assumptions.`;

      const response = await getAIResponse(winAnalysisPrompt, provider, userApiKeys);
      
      // Extract probability from AI response
      const probabilityMatch = response.match(/Win Probability:\s*(\d+)/i);
      let aiEstimate = probabilityMatch ? parseInt(probabilityMatch[1]) : null;
      
      // If AI parsing fails, use the real case studies analysis
      if (aiEstimate === null || isNaN(aiEstimate)) {
        const realCaseStudies = caseStudies?.map(cs => ({
          id: cs.id,
          title: cs.title,
          summary: cs.summary,
          outcome: cs.outcome as 'Won' | 'Lost' | 'Settled' | 'Pending',
          winProbability: cs.winProbability || 50,
          jurisdiction: cs.jurisdiction || jurisdiction,
          relevanceScore: cs.relevanceScore || 0.7,
          keyFactors: cs.keyFactors || [],
          legalPrinciples: cs.legalPrinciples || [],
          lessons: cs.lessons || [],
          analysisSource: 'AI Generated' as const,
          dateAnalyzed: new Date().toISOString()
        })) || [];
        
        aiEstimate = calculateRealWinEstimation(query, jurisdiction, realCaseStudies);
      }
      
      // Ensure the estimate is within reasonable bounds
      return Math.min(95, Math.max(5, aiEstimate));
      
    } catch (error) {
      console.error('Error calculating win estimate:', error);
      
      // Fallback to basic analysis if AI fails
      const realCaseStudies = caseStudies?.map(cs => ({
        id: cs.id,
        title: cs.title,
        summary: cs.summary,
        outcome: cs.outcome as 'Won' | 'Lost' | 'Settled' | 'Pending',
        winProbability: cs.winProbability || 50,
        jurisdiction: cs.jurisdiction || jurisdiction,
        relevanceScore: cs.relevanceScore || 0.7,
        keyFactors: cs.keyFactors || [],
        legalPrinciples: cs.legalPrinciples || [],
        lessons: cs.lessons || [],
        analysisSource: 'AI Generated' as const,
        dateAnalyzed: new Date().toISOString()
      })) || [];
      
      return calculateRealWinEstimation(query, jurisdiction, realCaseStudies);
    }
  }, []);

  return { calculateWinEstimate };
}
