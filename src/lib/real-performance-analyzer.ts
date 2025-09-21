/**
 * Real Performance Analyzer for AI Model Responses
 * Analyzes actual AI responses to provide genuine performance metrics
 */

export interface RealPerformanceMetrics {
  accuracy: number;
  responseTime: number;
  relevance: number;
  reasoning: number;
  overall: number;
  wordCount: number;
  sentenceComplexity: number;
  legalTermDensity: number;
  citationCount: number;
  structureScore: number;
}

interface ResponseAnalysis {
  wordCount: number;
  sentenceCount: number;
  averageWordsPerSentence: number;
  legalTermCount: number;
  citationCount: number;
  hasStructure: boolean;
  hasConclusion: boolean;
  usesMarkdown: boolean;
  responseLength: number;
}

// Common legal terms to analyze density
const LEGAL_TERMS = [
  'jurisdiction', 'statute', 'precedent', 'case law', 'plaintiff', 'defendant', 
  'liability', 'contract', 'tort', 'negligence', 'constitutional', 'federal',
  'supreme court', 'circuit court', 'appeal', 'motion', 'brief', 'deposition',
  'discovery', 'evidence', 'testimony', 'witness', 'jury', 'verdict', 'judgment',
  'injunction', 'damages', 'remedy', 'settlement', 'arbitration', 'mediation',
  'legal counsel', 'attorney', 'bar', 'ethical', 'professional responsibility',
  'due process', 'equal protection', 'first amendment', 'fourth amendment',
  'criminal law', 'civil law', 'administrative law', 'commercial law',
  'intellectual property', 'copyright', 'trademark', 'patent', 'trade secret',
  'corporate law', 'securities', 'merger', 'acquisition', 'compliance',
  'regulation', 'enforcement', 'investigation', 'prosecution', 'defense'
];

/**
 * Analyzes the structure and content of an AI response
 */
function analyzeResponse(response: string): ResponseAnalysis {
  // Basic text analysis
  const words = response.trim().split(/\s+/).filter(word => word.length > 0);
  const sentences = response.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  // Count legal terms (case-insensitive)
  const legalTermCount = LEGAL_TERMS.reduce((count, term) => {
    const regex = new RegExp(`\\b${term.replace(/\s+/g, '\\s+')}\\b`, 'gi');
    const matches = response.match(regex);
    return count + (matches ? matches.length : 0);
  }, 0);
  
  // Count citations (basic patterns)
  const citationPatterns = [
    /\b\d+\s+[A-Z][a-z.]+\s+\d+/g, // e.g., "123 F.3d 456"
    /\bv\.\s+[A-Z][a-zA-Z\s]+/g,   // e.g., "v. Smith"
    /\(\d{4}\)/g,                   // e.g., "(2023)"
    /§\s*\d+/g,                     // e.g., "§ 123"
    /Art\.\s*\d+/g                  // e.g., "Art. 5"
  ];
  
  const citationCount = citationPatterns.reduce((count, pattern) => {
    const matches = response.match(pattern);
    return count + (matches ? matches.length : 0);
  }, 0);
  
  // Check for structure indicators
  const hasHeaders = /#{1,6}\s+/.test(response);
  const hasBulletPoints = /^\s*[-*+]\s+/m.test(response);
  const hasNumberedList = /^\s*\d+\.\s+/m.test(response);
  const hasStructure = hasHeaders || hasBulletPoints || hasNumberedList;
  
  // Check for conclusion
  const conclusionKeywords = ['conclusion', 'summary', 'recommendation', 'advice', 'therefore', 'in summary'];
  const hasConclusion = conclusionKeywords.some(keyword => 
    response.toLowerCase().includes(keyword.toLowerCase())
  );
  
  // Check for markdown usage
  const usesMarkdown = /(\*\*|__|\*|_|#{1,6}|`|\[.*\]\(.*\))/.test(response);
  
  return {
    wordCount: words.length,
    sentenceCount: sentences.length,
    averageWordsPerSentence: words.length / Math.max(sentences.length, 1),
    legalTermCount,
    citationCount,
    hasStructure,
    hasConclusion,
    usesMarkdown,
    responseLength: response.length
  };
}

/**
 * Calculates real performance metrics based on actual response content
 */
export function calculateRealPerformanceMetrics(
  response: string,
  responseTime: number,
  modelType: string,
  jurisdiction?: string
): RealPerformanceMetrics {
  const analysis = analyzeResponse(response);
  
  // Calculate accuracy based on content quality indicators
  let accuracy = 70; // Base score
  
  // Bonus points for comprehensive responses
  if (analysis.wordCount > 100) accuracy += 5;
  if (analysis.wordCount > 300) accuracy += 5;
  
  // Bonus for legal term usage (indicates domain expertise)
  const legalTermDensity = (analysis.legalTermCount / analysis.wordCount) * 100;
  if (legalTermDensity > 5) accuracy += 10;
  if (legalTermDensity > 10) accuracy += 5;
  
  // Bonus for citations (indicates research depth)
  if (analysis.citationCount > 0) accuracy += 5;
  if (analysis.citationCount > 2) accuracy += 5;
  
  // Bonus for structure
  if (analysis.hasStructure) accuracy += 5;
  if (analysis.hasConclusion) accuracy += 5;
  
  // Penalty for very short responses
  if (analysis.wordCount < 50) accuracy -= 15;
  
  // Calculate relevance based on legal content
  let relevance = 75; // Base score
  
  // Higher relevance for more legal terms
  relevance += Math.min(15, legalTermDensity);
  
  // Bonus for jurisdiction-specific content
  if (jurisdiction && response.toLowerCase().includes(jurisdiction.toLowerCase())) {
    relevance += 5;
  }
  
  // Calculate reasoning score based on response structure and depth
  let reasoning = 75; // Base score
  
  // Bonus for well-structured responses
  if (analysis.hasStructure) reasoning += 10;
  if (analysis.usesMarkdown) reasoning += 5;
  
  // Bonus for comprehensive analysis
  if (analysis.averageWordsPerSentence > 15 && analysis.averageWordsPerSentence < 30) {
    reasoning += 5; // Well-balanced sentence complexity
  }
  
  // Bonus for multiple perspectives/sections
  const sectionCount = (response.match(/#{1,6}\s+/g) || []).length;
  if (sectionCount > 2) reasoning += 5;
  
  // Calculate sentence complexity score
  const sentenceComplexity = Math.min(100, Math.max(0, 
    (analysis.averageWordsPerSentence / 25) * 100
  ));
  
  // Calculate structure score
  let structureScore = 0;
  if (analysis.hasStructure) structureScore += 40;
  if (analysis.hasConclusion) structureScore += 30;
  if (analysis.usesMarkdown) structureScore += 20;
  if (analysis.citationCount > 0) structureScore += 10;
  
  // Normalize all scores to 0-100 range
  accuracy = Math.min(100, Math.max(0, accuracy));
  relevance = Math.min(100, Math.max(0, relevance));
  reasoning = Math.min(100, Math.max(0, reasoning));
  structureScore = Math.min(100, structureScore);
  
  // Calculate overall score with weighted average
  const overall = Math.round(
    (accuracy * 0.4) + 
    (relevance * 0.3) + 
    (reasoning * 0.3)
  );
  
  return {
    accuracy: Math.round(accuracy),
    responseTime,
    relevance: Math.round(relevance),
    reasoning: Math.round(reasoning),
    overall,
    wordCount: analysis.wordCount,
    sentenceComplexity: Math.round(sentenceComplexity),
    legalTermDensity: Math.round(legalTermDensity * 10) / 10, // Round to 1 decimal
    citationCount: analysis.citationCount,
    structureScore: Math.round(structureScore)
  };
}

/**
 * Compares actual response times between models
 */
export function calculateActualResponseTime(startTime: number): number {
  return Date.now() - startTime;
}

/**
 * Determines the best model based on real performance metrics
 */
export function determineBestModel(performances: Record<string, RealPerformanceMetrics>): string | null {
  if (Object.keys(performances).length === 0) return null;
  
  let bestModel = null;
  let highestScore = 0;
  
  Object.entries(performances).forEach(([model, metrics]) => {
    // Calculate weighted score with emphasis on accuracy and legal relevance
    const weightedScore = 
      (metrics.accuracy * 0.35) +
      (metrics.relevance * 0.25) +
      (metrics.reasoning * 0.25) +
      (metrics.structureScore * 0.15);
    
    if (weightedScore > highestScore) {
      highestScore = weightedScore;
      bestModel = model;
    }
  });
  
  return bestModel;
}

/**
 * Analyzes response quality for legal specific metrics
 */
export function analyzeLegalResponseQuality(response: string, query: string): {
  relevanceToQuery: number;
  legalDepth: number;
  practicalAdvice: number;
  disclaimerPresent: boolean;
} {
  const queryWords = query.toLowerCase().split(/\s+/);
  const responseWords = response.toLowerCase().split(/\s+/);
  
  // Calculate relevance to original query
  const matchingWords = queryWords.filter(word => 
    responseWords.some(respWord => respWord.includes(word) || word.includes(respWord))
  );
  const relevanceToQuery = (matchingWords.length / queryWords.length) * 100;
  
  // Calculate legal depth based on legal terminology usage
  const legalTermMatches = LEGAL_TERMS.filter(term => 
    response.toLowerCase().includes(term.toLowerCase())
  );
  const legalDepth = Math.min(100, (legalTermMatches.length / 10) * 100);
  
  // Check for practical advice indicators
  const practicalAdviceKeywords = [
    'recommend', 'suggest', 'should', 'consider', 'next steps', 
    'action', 'strategy', 'approach', 'option', 'alternative'
  ];
  const practicalAdviceMatches = practicalAdviceKeywords.filter(keyword =>
    response.toLowerCase().includes(keyword)
  );
  const practicalAdvice = Math.min(100, (practicalAdviceMatches.length / 5) * 100);
  
  // Check for legal disclaimer
  const disclaimerKeywords = ['disclaimer', 'not legal advice', 'consult an attorney', 'licensed attorney'];
  const disclaimerPresent = disclaimerKeywords.some(keyword =>
    response.toLowerCase().includes(keyword.toLowerCase())
  );
  
  return {
    relevanceToQuery: Math.round(relevanceToQuery),
    legalDepth: Math.round(legalDepth),
    practicalAdvice: Math.round(practicalAdvice),
    disclaimerPresent
  };
}