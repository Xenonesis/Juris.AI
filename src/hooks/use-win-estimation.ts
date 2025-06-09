import { useCallback } from 'react';
import { JURISDICTION_BASE_RANGES, JURISDICTION_QUERY_WEIGHTS } from '@/lib/constants';
import type { JurisdictionCode } from '@/lib/constants';

export function useWinEstimation() {
  const calculateWinEstimate = useCallback((query: string, jurisdiction: string): number => {
    // Get jurisdiction-specific base ranges
    const range = JURISDICTION_BASE_RANGES[jurisdiction as JurisdictionCode] || { min: 35, max: 65 };
    let baseChance = range.min + (Math.random() * (range.max - range.min));
    
    // Apply jurisdiction-specific query weights
    const weights = JURISDICTION_QUERY_WEIGHTS[jurisdiction as JurisdictionCode] || 
                   { evidence: 10, deadline: -15 };
    
    const queryLower = query.toLowerCase();
    
    // Evidence-related keywords
    if (queryLower.includes('evidence') || queryLower.includes('proof')) {
      baseChance += weights.evidence;
    }
    
    // Deadline-related keywords
    if (queryLower.includes('deadline') || queryLower.includes('statute of limitations')) {
      baseChance += weights.deadline;
    }
    
    // Special jurisdiction-specific modifiers
    const jurisdictionModifiers = {
      'us': () => queryLower.includes('constitutional') ? 5 : 0,
      'uk': () => queryLower.includes('parliament') ? 3 : 0,
      'in': () => queryLower.includes('supreme court') ? 7 : 0,
      'eu': () => queryLower.includes('directive') ? 6 : 0,
    };
    
    const modifier = jurisdictionModifiers[jurisdiction as keyof typeof jurisdictionModifiers];
    if (modifier) {
      baseChance += modifier();
    }
    
    // Add random variation
    baseChance += (Math.random() * 10 - 5);
    
    // Cap between 5% and 95%
    return Math.min(95, Math.max(5, Math.round(baseChance)));
  }, []);

  return { calculateWinEstimate };
}
