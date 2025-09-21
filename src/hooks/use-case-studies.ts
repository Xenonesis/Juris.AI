import { useState, useCallback } from 'react';
import { generateRealCaseStudies } from '@/lib/real-case-studies';
import { localJurisdictions } from '@/components/jurisdiction-select';

export interface CaseStudy {
  id: string;
  title: string;
  summary: string;
  jurisdiction?: string;
  outcome?: string;
  winProbability?: number;
  relevanceScore?: number;
  keyFactors?: string[];
  legalPrinciples?: string[];
  lessons?: string[];
}

export function useCaseStudies() {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCaseStudies = useCallback(async (query: string, jurisdiction: string, userApiKeys: Record<string, string>) => {
    setIsLoading(true);
    
    try {
      const jurisdictionLabel = localJurisdictions.find(
        (j: { value: string; label: string }) => j.value === jurisdiction
      )?.label || jurisdiction;

      // Generate real case studies using AI analysis
      const realCaseStudies = await generateRealCaseStudies(query, jurisdiction, userApiKeys);
      
      // Transform to our interface format
      const formattedCases: CaseStudy[] = realCaseStudies.map((realCase) => ({
        id: realCase.id,
        title: realCase.title,
        summary: realCase.summary,
        jurisdiction: jurisdictionLabel,
        outcome: realCase.outcome,
        winProbability: realCase.winProbability,
        relevanceScore: realCase.relevanceScore,
        keyFactors: realCase.keyFactors,
        legalPrinciples: realCase.legalPrinciples,
        lessons: realCase.lessons
      }));
      
      setCaseStudies(formattedCases);
    } catch (error) {
      console.error('Error generating case studies:', error);
      
      // Generate minimal fallback
      const jurisdictionLabel = localJurisdictions.find(
        (j: { value: string; label: string }) => j.value === jurisdiction
      )?.label || jurisdiction;

      setCaseStudies([
        { 
          id: `fallback_${Date.now()}`, 
          title: `${jurisdictionLabel} Legal Analysis`, 
          summary: `Case study analysis temporarily unavailable. Your legal question requires research into ${jurisdictionLabel} jurisdiction precedents and applicable statutes.`,
          jurisdiction: jurisdictionLabel,
          outcome: "Analysis Required",
          winProbability: 50,
          relevanceScore: 0.7
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetCaseStudies = useCallback(() => {
    setCaseStudies([]);
  }, []);

  return {
    caseStudies,
    isLoading,
    fetchCaseStudies,
    resetCaseStudies,
  };
}
