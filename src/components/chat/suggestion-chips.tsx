'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, History, TrendingUp, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Suggestion {
  id: string;
  text: string;
  source?: 'history' | 'personal' | 'popular' | 'default' | 'fallback';
  relevance?: number;
}

interface SuggestionChipsProps {
  suggestions: Suggestion[];
  onSuggestionClick: (text: string) => void;
  loading?: boolean;
  className?: string;
}

const getSourceIcon = (source?: string) => {
  switch (source) {
    case 'history':
      return <History className="h-3 w-3" />;
    case 'personal':
      return <Star className="h-3 w-3" />;
    case 'popular':
      return <TrendingUp className="h-3 w-3" />;
    default:
      return <Sparkles className="h-3 w-3" />;
  }
};

const getSourceColor = (source?: string) => {
  switch (source) {
    case 'history':
      return 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800';
    case 'personal':
      return 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800';
    case 'popular':
      return 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100 dark:bg-green-950 dark:text-green-300 dark:border-green-800';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 dark:bg-gray-950 dark:text-gray-300 dark:border-gray-800';
  }
};

const getSourceLabel = (source?: string) => {
  switch (source) {
    case 'history':
      return 'Based on your history';
    case 'personal':
      return 'Your frequent topics';
    case 'popular':
      return 'Popular in your region';
    default:
      return 'Suggested';
  }
};

export function SuggestionChips({ 
  suggestions, 
  onSuggestionClick, 
  loading = false,
  className 
}: SuggestionChipsProps) {
  if (loading) {
    return (
      <div className={cn("space-y-3", className)}>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="h-4 w-4 animate-pulse" />
          <span>Loading personalized suggestions...</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-9 w-32 bg-muted/50 rounded-full animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (suggestions.length === 0) {
    return null;
  }

  // Group suggestions by source
  const groupedSuggestions = suggestions.reduce((acc, suggestion) => {
    const source = suggestion.source || 'default';
    if (!acc[source]) acc[source] = [];
    acc[source].push(suggestion);
    return acc;
  }, {} as Record<string, Suggestion[]>);

  // Order of preference for sources
  const sourceOrder = ['history', 'personal', 'popular', 'default', 'fallback'];
  const orderedSources = sourceOrder.filter(source => groupedSuggestions[source]);

  return (
    <div className={cn("space-y-4", className)}>
      <AnimatePresence>
        {orderedSources.map((source, sourceIndex) => (
          <motion.div
            key={source}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ delay: sourceIndex * 0.1 }}
            className="space-y-2"
          >
            {/* Source Header */}
            <div className="flex items-center gap-2">
              <Badge 
                variant="outline" 
                className={cn("text-xs", getSourceColor(source))}
              >
                {getSourceIcon(source)}
                {getSourceLabel(source)}
              </Badge>
            </div>

            {/* Suggestions for this source */}
            <div className="flex flex-wrap gap-2">
              {groupedSuggestions[source].map((suggestion, index) => (
                <motion.div
                  key={suggestion.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: (sourceIndex * 0.1) + (index * 0.05) }}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "h-auto py-2 px-3 text-left justify-start text-wrap max-w-md",
                      "transition-all duration-200 hover:shadow-sm",
                      getSourceColor(source)
                    )}
                    onClick={() => onSuggestionClick(suggestion.text)}
                  >
                    <div className="flex items-start gap-2 w-full">
                      <span className="text-xs leading-relaxed">
                        {suggestion.text}
                      </span>
                      {suggestion.relevance && suggestion.relevance > 80 && (
                        <Sparkles className="h-3 w-3 flex-shrink-0 mt-0.5 opacity-60" />
                      )}
                    </div>
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}