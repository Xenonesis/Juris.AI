'use client';

import React, { useRef, useState } from 'react';
import { User2, Bot as BotIcon, Send, Copy, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

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

  // Auto-resize textarea
  const [textareaHeight, setTextareaHeight] = useState<number | undefined>(undefined);
  
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onInputChangeAction(e);
    
    // Reset height to auto to get the correct scrollHeight
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const newHeight = Math.min(200, textareaRef.current.scrollHeight);
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

  return (
    <div className="flex flex-col h-full w-full max-w-5xl mx-auto">
      {/* Message container */}
      <div className="flex-1 overflow-y-auto pb-24">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-muted-foreground text-center p-8">
            <p>No messages yet. Start a conversation!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6 py-6 px-4">
            {messages.map((message, index) => {
              const isGrouped = shouldGroupMessages(message, messages[index - 1]);
              const reaction = message.id ? messageReactions[message.id] : null;
              
              return (
                <motion.div
                  key={message.id || `msg-${index}`}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex items-start gap-3 max-w-3xl mx-auto",
                    message.is_user_message ? "flex-row-reverse self-end" : "self-start"
                  )}
                >
                  {/* Avatar */}
                  {!isGrouped && (
                    <Avatar className={cn(
                      "h-8 w-8",
                      message.is_user_message ? "bg-primary" : "bg-muted"
                    )}>
                      <AvatarFallback>
                        {message.is_user_message ? (
                          <User2 className="h-4 w-4 text-primary-foreground" />
                        ) : (
                          <BotIcon className="h-4 w-4 text-primary" />
                        )}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  {/* Message bubble */}
                  <div className={cn(
                    "group relative rounded-lg px-4 py-3 shadow-sm",
                    message.is_user_message 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted/60",
                    isGrouped && message.is_user_message ? "mr-11" : "",
                    isGrouped && !message.is_user_message ? "ml-11" : ""
                  )}>
                    {/* AI provider badge */}
                    {!message.is_user_message && !isGrouped && message.ai_name && (
                      <div className="text-xs text-muted-foreground font-medium mb-1">
                        {message.ai_name.charAt(0).toUpperCase() + message.ai_name.slice(1)} AI
                      </div>
                    )}
                    
                    {/* Message content */}
                    <div className="whitespace-pre-line break-words text-sm">
                      {message.content}
                      
                      {/* Loading indicator */}
                      {isLoading && 
                       index === messages.length - 1 && 
                       !message.is_user_message && 
                       !message.content && (
                        <span className="inline-block animate-pulse">...</span>
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
                    {!message.is_user_message && (
                      <div className={cn(
                        "absolute -bottom-8 right-0 opacity-0 transition-opacity flex gap-2",
                        "group-hover:opacity-100 focus-within:opacity-100"
                      )}>
                        {message.content && (
                          <>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6 rounded-md"
                              onClick={() => onCopyAction(message.content, message.id)}
                            >
                              <Copy className={cn(
                                "h-3 w-3", 
                                copiedMessageId === message.id ? "text-green-500" : "text-muted-foreground"
                              )} />
                              <span className="sr-only">Copy message</span>
                            </Button>
                            
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
                          </>
                        )}
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
      <div className="sticky bottom-0 inset-x-0 bg-gradient-to-b from-transparent to-background p-4">
        <Card className="max-w-2xl mx-auto p-2 sm:p-3 shadow-lg border border-input">
          <form ref={formRef} onSubmit={onSubmitAction} className="flex items-end gap-2">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask your legal question..."
              className="min-h-10 resize-none border-none shadow-none focus-visible:ring-0"
              style={{
                height: textareaHeight ? `${textareaHeight}px` : 'auto',
                maxHeight: '200px'
              }}
            />
            <Button 
              type="submit" 
              disabled={isLoading || !input.trim()} 
              size="icon" 
              className="shrink-0"
            >
              <Send className="h-4 w-4" />
              <span className="sr-only">Send message</span>
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
