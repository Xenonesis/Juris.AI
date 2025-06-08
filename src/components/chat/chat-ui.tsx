'use client';

import React, { useRef, useState, useEffect } from 'react';
import { 
  User2, 
  Bot as BotIcon, 
  Send, 
  Copy, 
  ThumbsUp, 
  ThumbsDown, 
  Paperclip, 
  Loader2 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

// Keep consistent with the original ChatMessage interface
interface ChatMessage {
  id?: string;
  user_id: string;
  content: string;
  is_user_message: boolean;
  created_at: string;
  ai_name?: string;
  legal_sources?: LegalSources;
}

interface CaseLaw {
  id: string;
  name: string;
  citation: string;
  court: string;
  decision_date: string;
  jurisdiction: string;
  summary?: string;
  relevance: number;
}

interface Statute {
  id: string;
  title: string;
  code: string;
  section: string;
  jurisdiction: string;
  content: string;
  relevance: number;
}

interface LegalSources {
  case_law?: CaseLaw[];
  statutes?: Statute[];
}

interface ChatUIProps {
  messages: ChatMessage[];
  input: string;
  onInputChangeAction: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmitAction: (e: React.FormEvent) => void;
  isLoading: boolean;
  messageReactions: Record<string, 'like' | 'dislike' | null>;
  onReactionAction: (messageId: string, reaction: 'like' | 'dislike') => void;
  onCopyAction: (content: string, messageId?: string) => void;
  copiedMessageId: string | null;
  showSources: boolean;
  legalSourcesMap: Record<string, LegalSources>;
  toggleShowSourcesAction?: () => void;
}

// Helper to determine if messages should be grouped
const shouldGroupMessages = (curr: ChatMessage, prev: ChatMessage | undefined) => {
  if (!prev) return false;
  return curr.is_user_message === prev.is_user_message && 
    // Messages within 2 minutes should be grouped
    (new Date(curr.created_at).getTime() - new Date(prev.created_at).getTime() < 120000);
};

// Custom hook for media queries
const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Only run on client-side
    if (typeof window === 'undefined') return;
    
    const media = window.matchMedia(query);
    
    // Set initial value
    setMatches(media.matches);
    
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    
    // Add event listener
    media.addEventListener('change', listener);
    
    // Clean up
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
};

export function ChatUI({
  messages,
  input,
  onInputChangeAction,
  onSubmitAction,
  isLoading,
  messageReactions,
  onReactionAction,
  onCopyAction,
  copiedMessageId,
  showSources,
  legalSourcesMap
}: ChatUIProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (messagesEndRef.current && messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      const isNearBottom = scrollHeight - (scrollTop + clientHeight) < 200;
      
      if (isNearBottom) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [messages]);

  // Handle scroll events to show/hide scroll-to-bottom button
  useEffect(() => {
    const messagesContainer = messagesContainerRef.current;
    if (!messagesContainer) return;
    
    const handleScroll = () => {
      if (!messagesContainer) return;
      
      const { scrollTop, scrollHeight, clientHeight } = messagesContainer;
      const isAtBottom = scrollHeight - (scrollTop + clientHeight) < 100;
      
      // Show button if scrolled up and not at bottom
      setShowScrollButton(!isAtBottom && scrollHeight > clientHeight);
    };
    
    messagesContainer.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial check
    handleScroll();
    
    // Cleanup
    return () => {
      messagesContainer.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Auto-resize textarea
  const [textareaHeight, setTextareaHeight] = useState<number | undefined>(undefined);
  
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onInputChangeAction(e);
    
    // Reset height to auto to get the correct scrollHeight
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const newHeight = Math.min(192, Math.max(48, textareaRef.current.scrollHeight));
      textareaRef.current.style.height = `${newHeight}px`;
      setTextareaHeight(newHeight);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
      e.preventDefault();
      formRef.current?.requestSubmit();
    }
  };

  // Use media query for responsive design
  const isMobileView = useMediaQuery('(max-width: 768px)');
  
  // Client-side only state
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Only render the chat UI on the client side
  if (!isMounted) {
    return (
      <div className="flex flex-col h-full w-full max-w-5xl mx-auto bg-gradient-to-b from-background to-muted/10 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Remove unused prop to fix lint error
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _ = copiedMessageId;

  return (
    <div className="flex flex-col h-full w-full max-w-5xl mx-auto bg-gradient-to-b from-background to-muted/10 relative">
      {/* Scroll to bottom button */}
      <AnimatePresence>
        {showScrollButton && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={scrollToBottom}
            className="fixed right-8 bottom-24 z-10 p-2 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors"
            aria-label="Scroll to bottom"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
              <path d="M12 5v14"></path>
              <path d="m19 12-7 7-7-7"></path>
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
      {/* Message container */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto pb-24 px-2 sm:px-4 scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent hover:scrollbar-thumb-muted-foreground/30"
      >
        {messages.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="h-full flex flex-col items-center justify-center text-center p-8"
          >
            <div className="bg-primary/10 p-6 rounded-full mb-4">
              <BotIcon className="h-10 w-10 text-primary mx-auto" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Welcome to Juris AI</h2>
            <p className="text-muted-foreground max-w-md mb-6">
              Ask me anything about legal matters, case law, or statutes. I&apos;m here to help with your legal research.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md">
              {[
                'Explain the concept of negligence',
                'What are the elements of a contract?',
                'Recent Supreme Court rulings on free speech',
                'Difference between civil and criminal law'
              ].map((prompt, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    if (textareaRef.current) {
                      textareaRef.current.value = prompt;
                      textareaRef.current.focus();
                      // Trigger the input change manually
                      const event = { target: { value: prompt } } as React.ChangeEvent<HTMLTextAreaElement>;
                      onInputChangeAction(event);
                    }
                  }}
                  className="text-sm text-left p-3 rounded-lg border bg-card hover:bg-accent transition-colors"
                >
                  {prompt}
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          <div className="flex flex-col gap-6 py-6">
            {messages.map((message, index) => {
              const isGrouped = shouldGroupMessages(message, messages[index - 1]);
              const reaction = message.id ? messageReactions[message.id] : null;
              
              return (
                <motion.div
                  key={message.id || `msg-${index}`}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    transition: { 
                      type: 'spring', 
                      stiffness: 500, 
                      damping: 30 
                    } 
                  }}
                  className={cn(
                    "flex items-start gap-3 w-full max-w-3xl mx-auto px-2 sm:px-4",
                    message.is_user_message ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  {/* Avatar */}
                  <motion.div 
                    className={cn(
                      "flex-shrink-0",
                      isGrouped ? "invisible" : "visible"
                    )}
                    layout
                  >
                    <Avatar className={cn(
                      "h-8 w-8 transition-all duration-200",
                      message.is_user_message 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-muted text-foreground"
                    )}>
                      <AvatarFallback>
                        {message.is_user_message ? (
                          <User2 className="h-4 w-4" />
                        ) : (
                          <BotIcon className="h-4 w-4" />
                        )}
                      </AvatarFallback>
                    </Avatar>
                  </motion.div>
                  
                  {/* Message bubble */}
                  <div className={cn(
                    "group relative rounded-xl px-4 py-3 shadow-sm transition-all duration-200 max-w-[90%] sm:max-w-[85%] md:max-w-[80%]",
                    message.is_user_message 
                      ? "bg-primary text-primary-foreground rounded-tr-none" 
                      : "bg-muted/80 dark:bg-muted/40 rounded-tl-none",
                    isGrouped && message.is_user_message ? "mr-2" : "",
                    isGrouped && !message.is_user_message ? "ml-2" : "",
                    "border border-border/20 shadow-sm hover:shadow-md"
                  )}>
                    {/* Timestamp */}
                    <div className={cn(
                      "text-xs mb-1",
                      message.is_user_message ? "text-primary-foreground/70" : "text-muted-foreground"
                    )}>
                      {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    
                    {/* AI provider badge */}
                    {!message.is_user_message && !isGrouped && message.ai_name && (
                      <div className="text-xs font-medium mb-1 flex items-center gap-1.5">
                        <span className="inline-block h-2 w-2 rounded-full bg-green-500"></span>
                        <span className="text-muted-foreground">
                          {message.ai_name.charAt(0).toUpperCase() + message.ai_name.slice(1)} AI
                        </span>
                      </div>
                    )}
                    
                    {/* Message content */}
                    <div className="whitespace-pre-line break-words text-sm leading-relaxed">
                      {message.content}
                      
                      {/* Loading indicator */}
                      {isLoading && 
                       index === messages.length - 1 && 
                       !message.is_user_message && 
                       !message.content && (
                        <div className="flex space-x-1.5 py-2">
                          {[0, 1, 2].map((i) => (
                            <motion.div
                              key={i}
                              className="h-2 w-2 rounded-full bg-muted-foreground/30"
                              animate={{
                                y: [0, -5, 0],
                              }}
                              transition={{
                                duration: 1.2,
                                repeat: Infinity,
                                delay: i * 0.15,
                              }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {/* Legal sources section */}
                    {!message.is_user_message && showSources && message.id && legalSourcesMap[message.id] && (
                      <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-800 text-xs text-muted-foreground">
                        <div className="font-semibold mb-1">Legal sources:</div>
                        
                        {/* Case law */}
                        {(legalSourcesMap[message.id]?.case_law ?? []).length > 0 && (
                          <div className="mb-2">
                            <div className="font-medium">Case Law:</div>
                            <ul className="list-disc pl-4 space-y-1">
                              {legalSourcesMap[message.id]?.case_law?.map((caseItem: CaseLaw, i: number) => (
                                <li key={`case-${i}`}>
                                  <span className="font-medium">{caseItem.name}</span> {caseItem.citation && `(${caseItem.citation})`}
                                  {caseItem.summary && <p className="mt-0.5 text-xs opacity-80">{caseItem.summary}</p>}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {/* Statutes */}
                        {(legalSourcesMap[message.id]?.statutes ?? []).length > 0 && (
                          <div>
                            <div className="font-medium">Statutes:</div>
                            <ul className="list-disc pl-4 space-y-1">
                              {legalSourcesMap[message.id]?.statutes?.map((statute: Statute, i: number) => (
                                <li key={`statute-${i}`}>
                                  <span className="font-medium">{statute.title}</span>
                                  {statute.section && `, §${statute.section}`}
                                  {statute.content && <p className="mt-0.5 text-xs opacity-80">{statute.content.substring(0, 100)}...</p>}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Message actions */}
                    {!message.is_user_message && message.content && (
                      <div className={cn(
                        "absolute -bottom-8 right-0 opacity-0 transition-all duration-200 flex gap-1 bg-background/80 dark:bg-background/90 backdrop-blur-sm rounded-lg p-1 shadow-sm border border-border/50",
                        "group-hover:opacity-100 group-hover:translate-y-0 translate-y-1"
                      )}>
                        {isMobileView && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 rounded-md"
                            onClick={() => onCopyAction(message.content, message.id)}
                          >
                            <Copy className="h-3 w-3" />
                            <span className="sr-only">Copy message</span>
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className={cn(
                            "h-6 w-6 rounded-md",
                            reaction === 'like' ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : ""
                          )}
                          onClick={() => message.id && onReactionAction(message.id, 'like')}
                        >
                          <ThumbsUp className="h-3 w-3" />
                          <span className="sr-only">Like message</span>
                        </Button>
                        
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className={cn(
                            "h-6 w-6 rounded-md",
                            reaction === 'dislike' ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" : ""
                          )}
                          onClick={() => message.id && onReactionAction(message.id, 'dislike')}
                        >
                          <ThumbsDown className="h-3 w-3" />
                          <span className="sr-only">Dislike message</span>
                        </Button>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      
      {/* Input form */}
      <div className="sticky bottom-0 inset-x-0 bg-gradient-to-b from-transparent via-background/90 to-background pt-6 pb-4 px-2 sm:px-4">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="p-1 shadow-lg border border-border/50 bg-background/80 backdrop-blur-sm">
            <form 
              ref={formRef} 
              onSubmit={onSubmitAction} 
              className="flex items-end gap-1.5"
            >
              <div className="relative flex-1">
                <Textarea
                  ref={textareaRef}
                  value={input}
                  onChange={handleTextareaChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask your legal question..."
                  className="min-h-12 max-h-48 resize-none border-0 shadow-none focus-visible:ring-0 pr-12 py-3 pl-4"
                  style={{
                    height: textareaHeight ? `${Math.min(textareaHeight, 192)}px` : 'auto',
                  }}
                  rows={1}
                />
                <div className="absolute right-2 bottom-2 flex items-center gap-1">
                  <Button 
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
                    onClick={() => {
                      // Handle attachment
                    }}
                  >
                    <Paperclip className="h-4 w-4" />
                    <span className="sr-only">Attach file</span>
                  </Button>
                </div>
              </div>
              <Button 
                type="submit" 
                disabled={isLoading || !input.trim()} 
                size="icon" 
                className="h-12 w-12 shrink-0 rounded-xl m-1 bg-primary hover:bg-primary/90 transition-colors"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
                <span className="sr-only">Send message</span>
              </Button>
            </form>
          </Card>
          <p className="text-xs text-center text-muted-foreground mt-2">
            Juris AI may produce inaccurate information
          </p>
        </motion.div>
      </div>
    </div>
  );
}
