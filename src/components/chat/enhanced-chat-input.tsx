'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Send, Loader2, Paperclip, Mic, Smile, ArrowUp 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSuggestions } from '@/hooks/useSuggestions';
import { SuggestionChips } from './suggestion-chips';

interface EnhancedChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  disabled?: boolean;
  loading?: boolean;
  placeholder?: string;
  maxLength?: number;
  showCharacterCount?: boolean;
  className?: string;
  jurisdiction?: string;
  legalMode?: boolean;
}

const MAX_HEIGHT = 200;
const MIN_HEIGHT = 56;

export function EnhancedChatInput({
  value,
  onChange,
  onSubmit,
  disabled = false,
  loading = false,
  placeholder = "Message Juris AI...",
  maxLength = 4000,
  showCharacterCount = true,
  className,
  jurisdiction = "general",
  legalMode = true
}: EnhancedChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [height, setHeight] = useState(MIN_HEIGHT);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const { suggestions, loading: suggestionsLoading, trackSuggestionUsage } = useSuggestions(jurisdiction, true);

  const handleSuggestionClick = (text: string) => {
    onChange(text);
    trackSuggestionUsage(text);
    // Hide suggestions briefly after selection to avoid visual clutter
    setShowSuggestions(false);
    
    // Small delay to ensure the text is set before focusing
    setTimeout(() => {
      textareaRef.current?.focus();
      // Move cursor to end of text
      if (textareaRef.current) {
        textareaRef.current.selectionStart = text.length;
        textareaRef.current.selectionEnd = text.length;
      }
      // Show suggestions again after a short delay
      setTimeout(() => setShowSuggestions(true), 500);
    }, 10);
  };

  // Auto-resize textarea
  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      const newHeight = Math.min(Math.max(scrollHeight, MIN_HEIGHT), MAX_HEIGHT);
      setHeight(newHeight);
      textareaRef.current.style.height = `${newHeight}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [value]);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= maxLength) {
      onChange(e.target.value);
      // Show suggestions again when user starts typing or clears input
      if (!showSuggestions) {
        setShowSuggestions(true);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !disabled && !loading) {
      e.preventDefault();
      if (value.trim()) {
        formRef.current?.requestSubmit();
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() && !disabled && !loading) {
      onSubmit(e);
    }
  };

  const characterCount = value.length;
  const isNearLimit = characterCount > maxLength * 0.8;
  const canSend = value.trim() && !disabled && !loading;

  return (
    <div className={cn("sticky bottom-0 bg-gradient-to-t from-background via-background/95 to-transparent pt-4 pb-4 px-4", className)}>
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="max-w-4xl mx-auto"
      >
        <Card className={cn(
          "relative overflow-hidden transition-all duration-200 border-2",
          isFocused 
            ? "border-primary/50 shadow-lg shadow-primary/10" 
            : "border-muted/50 shadow-sm",
          disabled && "opacity-50"
        )}>
          <form ref={formRef} onSubmit={handleSubmit} className="relative">
            {/* Main Input Area */}
            <div className="relative">
              <Textarea
                ref={textareaRef}
                value={value}
                onChange={handleTextareaChange}
                onKeyDown={handleKeyDown}
                onFocus={() => {
                  setIsFocused(true);
                  // Show suggestions when input is focused
                  setShowSuggestions(true);
                }}
                onBlur={() => {
                  // Delay hiding focus to allow suggestion clicks
                  setTimeout(() => setIsFocused(false), 150);
                }}
                placeholder={placeholder}
                disabled={disabled}
                className={cn(
                  "resize-none border-0 shadow-none focus-visible:ring-0 bg-transparent",
                  "pr-16 pl-4 py-4 text-sm leading-relaxed",
                  "placeholder:text-muted-foreground/60"
                )}
                style={{ 
                  height: `${height}px`,
                  minHeight: `${MIN_HEIGHT}px`,
                  maxHeight: `${MAX_HEIGHT}px`
                }}
              />

              {/* Action Buttons */}
              <div className="absolute right-2 bottom-2 flex items-center gap-1">
                {/* Additional Action Buttons */}
                <div className={cn(
                  "flex items-center gap-1 transition-opacity duration-200",
                  isFocused ? "opacity-100" : "opacity-0"
                )}>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50"
                          disabled={disabled}
                        >
                          <Paperclip className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="text-xs">
                        Attach file (coming soon)
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50"
                          disabled={disabled}
                        >
                          <Mic className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="text-xs">
                        Voice input (coming soon)
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                {/* Send Button */}
                <motion.div
                  whileHover={canSend ? { scale: 1.05 } : {}}
                  whileTap={canSend ? { scale: 0.95 } : {}}
                >
                  <Button 
                    type="submit" 
                    size="sm"
                    disabled={!canSend}
                    className={cn(
                      "h-9 w-9 p-0 rounded-full transition-all duration-200",
                      canSend 
                        ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-md" 
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <ArrowUp className="h-4 w-4" />
                    )}
                    <span className="sr-only">Send message</span>
                  </Button>
                </motion.div>
              </div>
            </div>

            {/* Footer with Character Count and Hints */}
            <div className={cn(
              "flex items-center justify-between px-4 py-2 border-t bg-muted/20 transition-all duration-200",
              isFocused ? "opacity-100" : "opacity-60"
            )}>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>Press Enter to send, Shift+Enter for new line</span>
              </div>
              
              {showCharacterCount && (
                <div className="flex items-center gap-2">
                  {isNearLimit && (
                    <Badge 
                      variant={characterCount >= maxLength ? "destructive" : "secondary"}
                      className="text-xs"
                    >
                      {characterCount >= maxLength ? "Limit reached" : "Near limit"}
                    </Badge>
                  )}
                  <span className={cn(
                    "text-xs transition-colors",
                    isNearLimit 
                      ? characterCount >= maxLength 
                        ? "text-destructive" 
                        : "text-warning" 
                      : "text-muted-foreground"
                  )}>
                    {characterCount}/{maxLength}
                  </span>
                </div>
              )}
            </div>
          </form>
        </Card>

        {/* Personalized Suggestions */}
        {isFocused && suggestions.length > 0 && showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ delay: 0.1 }}
            className="mt-3"
          >
            <SuggestionChips
              suggestions={suggestions.slice(0, 4)} // Show only first 4 suggestions
              onSuggestionClick={handleSuggestionClick}
              loading={suggestionsLoading}
            />
          </motion.div>
        )}

        {/* Quick Actions (Fallback) */}
        {isFocused && !value && suggestions.length === 0 && !suggestionsLoading && showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ delay: 0.1 }}
            className="mt-3 flex flex-wrap gap-2"
          >
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-7 rounded-full"
              onClick={() => handleSuggestionClick("What are the requirements for starting a business in California?")}
            >
              Business law question
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-7 rounded-full"
              onClick={() => handleSuggestionClick("Explain copyright law in the EU for digital content creators.")}
            >
              Copyright question
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-7 rounded-full"
              onClick={() => handleSuggestionClick("What are my rights as a tenant in New York City?")}
            >
              Tenant rights question
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
