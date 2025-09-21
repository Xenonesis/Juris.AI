'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/supabase-auth-provider';

interface Suggestion {
  id: string;
  text: string;
  source?: 'history' | 'personal' | 'popular' | 'default' | 'fallback';
  relevance?: number;
}

interface SuggestionsResponse {
  suggestions: Suggestion[];
  meta?: {
    jurisdiction: string;
    userId?: string;
    includeHistory: boolean;
    totalSuggestions: number;
    sources: string[];
  };
  error?: string;
}

export function useSuggestions(jurisdiction: string = 'general', includeHistory: boolean = true) {
  const { user } = useAuth();
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSuggestions = async () => {
    if (!user && includeHistory) {
      // If no user but history is requested, just get popular/default suggestions
      setIncludeHistory(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        jurisdiction,
        includeHistory: includeHistory.toString()
      });

      if (user && includeHistory) {
        params.append('userId', user.id);
      }

      const response = await fetch(`/api/suggestions?${params}`);
      const data: SuggestionsResponse = await response.json();

      if (response.ok) {
        setSuggestions(data.suggestions || []);
        if (data.error) {
          console.warn('Suggestions API warning:', data.error);
        }
      } else {
        throw new Error(data.error || 'Failed to fetch suggestions');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Error fetching suggestions:', err);
      
      // Set fallback suggestions
      setSuggestions([
        { id: 'fallback-1', text: 'What are my tenant rights regarding property repairs?', source: 'fallback' },
        { id: 'fallback-2', text: 'How do I contest a will in probate court?', source: 'fallback' },
        { id: 'fallback-3', text: 'Can I void a contract signed under false pretenses?', source: 'fallback' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const trackSuggestionUsage = async (queryText: string) => {
    if (!user) return;

    try {
      await fetch('/api/suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          queryText
        })
      });
    } catch (err) {
      console.error('Error tracking suggestion usage:', err);
      // Don't throw error as this is non-critical
    }
  };

  const refreshSuggestions = () => {
    fetchSuggestions();
  };

  useEffect(() => {
    fetchSuggestions();
  }, [user, jurisdiction, includeHistory]);

  return {
    suggestions,
    loading,
    error,
    refreshSuggestions,
    trackSuggestionUsage
  };
}

// Helper function to set include history (for cases where user logs in/out)
function setIncludeHistory(value: boolean) {
  // This is a placeholder - in a real implementation, you might want to 
  // pass this as a parameter or use a different approach
}