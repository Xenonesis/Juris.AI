'use client';

import React, { useState, ReactNode } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  User, Bot, Copy, ThumbsUp, ThumbsDown, ChevronDown, ChevronUp, RotateCcw, Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';

const MAX_CONTENT_LENGTH = 500; // Characters before showing "read more"

interface MessageBubbleProps {
  message: {
    id?: string;
    content: string;
    is_user_message: boolean;
    created_at: string;
    ai_name?: string;
  };
  isTyping?: boolean;
  isRegenerating?: boolean;
  onCopy?: (content: string, messageId?: string) => void;
  onReaction?: (messageId: string, reaction: 'like' | 'dislike') => void;
  onRegenerate?: (messageId: string) => void;
  copiedMessageId?: string | null;
  messageReactions?: Record<string, 'like' | 'dislike' | null>;
  showSources?: boolean;
  legalSources?: {
    case_law?: any[];
    statutes?: any[];
  };
}

export function MessageBubble({
  message,
  isTyping = false,
  isRegenerating = false,
  onCopy,
  onReaction,
  onRegenerate,
  copiedMessageId,
  messageReactions,
  showSources,
  legalSources
}: MessageBubbleProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const shouldTruncate = message.content.length > MAX_CONTENT_LENGTH;
  const displayContent = shouldTruncate && !isExpanded 
    ? message.content.slice(0, MAX_CONTENT_LENGTH) + '...'
    : message.content;

  const currentReaction = message.id ? messageReactions?.[message.id] : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        "group flex items-start gap-3 w-full max-w-4xl mx-auto px-4 py-3",
        message.is_user_message ? "flex-row-reverse" : "flex-row"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Avatar */}
      <motion.div 
        className="flex-shrink-0"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Avatar className={cn(
          "h-9 w-9 transition-all duration-200 ring-2 ring-transparent",
          message.is_user_message 
            ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground ring-primary/20" 
            : "bg-gradient-to-br from-muted to-muted/80 text-foreground ring-muted/30",
          isHovered && "ring-opacity-100 scale-105"
        )}>
          <AvatarFallback className="bg-transparent">
            {message.is_user_message ? (
              <User className="h-4 w-4" />
            ) : (
              <Bot className="h-4 w-4" />
            )}
          </AvatarFallback>
        </Avatar>
      </motion.div>

      {/* Message Content */}
      <div className={cn(
        "relative flex-1 max-w-[85%]",
        message.is_user_message ? "ml-12" : "mr-12"
      )}>
        {/* AI Provider Badge */}
        {!message.is_user_message && message.ai_name && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-2"
          >
            <Badge 
              variant="outline" 
              className="text-xs bg-background/50 backdrop-blur-sm border-muted/50"
            >
              {message.ai_name.charAt(0).toUpperCase() + message.ai_name.slice(1)} AI
            </Badge>
          </motion.div>
        )}

        {/* Message Bubble */}
        <motion.div
          className={cn(
            "relative rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm transition-all duration-200",
            message.is_user_message
              ? "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground ml-auto"
              : "bg-gradient-to-br from-muted/50 to-muted/30 text-foreground border border-muted/50",
            isHovered && "shadow-md scale-[1.01]",
            isRegenerating && !message.is_user_message && "border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10"
          )}
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
          animate={isRegenerating ? {
            boxShadow: [
              "0 0 0 0 rgba(var(--primary), 0.1)",
              "0 0 0 4px rgba(var(--primary), 0.1)",
              "0 0 0 0 rgba(var(--primary), 0.1)"
            ]
          } : {}}
        >
          {/* Message Content */}
          <div className="break-words">
            {isRegenerating && !message.is_user_message ? (
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                </div>
                <span className="text-xs text-primary font-medium">Regenerating response...</span>
              </div>
            ) : isTyping && !message.is_user_message && !message.content ? (
              <div className="flex items-center gap-1">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
                </div>
                <span className="text-xs opacity-70 ml-2">AI is thinking...</span>
              </div>
            ) : (
              <>
                <div className={cn(
                  "markdown-content",
                  shouldTruncate && !isExpanded && "line-clamp-[10]"
                )}>
                  {message.is_user_message ? (
                    <div className="whitespace-pre-wrap">{displayContent}</div>
                  ) : (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        h1: (props) => <h1 className="text-lg font-bold mb-2 mt-3 first:mt-0" {...props} />,
                        h2: (props) => <h2 className="text-base font-bold mb-2 mt-3 first:mt-0" {...props} />,
                        h3: (props) => <h3 className="text-sm font-bold mb-1 mt-2 first:mt-0" {...props} />,
                        p: (props) => <p className="mb-2 last:mb-0 leading-relaxed" {...props} />,
                        ul: (props) => <ul className="mb-2 pl-4 space-y-1 list-disc" {...props} />,
                        ol: (props) => <ol className="mb-2 pl-4 space-y-1 list-decimal" {...props} />,
                        li: (props) => <li className="leading-relaxed" {...props} />,
                        strong: (props) => <strong className="font-semibold" {...props} />,
                        em: (props) => <em className="italic" {...props} />,
                        code: (props) => <code className="bg-muted/50 px-1 py-0.5 rounded text-xs font-mono" {...props} />,
                        pre: (props) => <pre className="bg-muted/50 p-2 rounded text-xs font-mono overflow-x-auto" {...props} />,
                        blockquote: (props) => <blockquote className="border-l-4 border-muted pl-4 italic" {...props} />,
                      }}
                    >
                      {shouldTruncate && !isExpanded ? displayContent : message.content}
                    </ReactMarkdown>
                  )}
                </div>
                {shouldTruncate && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className={cn(
                      "mt-2 h-auto p-1 text-xs font-medium",
                      message.is_user_message
                        ? "text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                  >
                    {isExpanded ? (
                      <>
                        <ChevronUp className="h-3 w-3 mr-1" />
                        Show less
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-3 w-3 mr-1" />
                        Read more
                      </>
                    )}
                  </Button>
                )}
              </>
            )}
          </div>

          {/* Legal Sources */}
          {!message.is_user_message && showSources && legalSources && (
            <div className="mt-3 pt-3 border-t border-current/20">
              <div className="text-xs font-medium mb-2 opacity-80">Legal Sources:</div>
              <div className="text-xs opacity-70 space-y-1">
                {legalSources.case_law?.slice(0, 2).map((caseItem: any, i: number) => (
                  <div key={`case-${i}`}>
                    <span className="font-medium">{caseItem.name}</span>
                    {caseItem.citation && ` (${caseItem.citation})`}
                  </div>
                ))}
                {legalSources.statutes?.slice(0, 2).map((statute: any, i: number) => (
                  <div key={`statute-${i}`}>
                    <span className="font-medium">{statute.title}</span>
                    {statute.section && `, §${statute.section}`}
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Message Actions */}
        {!message.is_user_message && message.content && (
          <motion.div
            className={cn(
              "flex items-center gap-1 mt-2 opacity-0 transition-opacity duration-200",
              (isHovered || currentReaction) && "opacity-100"
            )}
            initial={{ opacity: 0, y: 10 }}
            animate={{
              opacity: (isHovered || currentReaction) ? 1 : 0,
              y: (isHovered || currentReaction) ? 0 : 10
            }}
            transition={{ duration: 0.2 }}
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 rounded-full bg-background/80 backdrop-blur-sm border border-muted/50 hover:bg-background hover:border-muted"
                    onClick={() => onCopy?.(message.content, message.id)}
                  >
                    <Copy className={cn(
                      "h-3 w-3 transition-colors",
                      copiedMessageId === message.id ? "text-green-500" : "text-muted-foreground"
                    )} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">
                  {copiedMessageId === message.id ? "Copied!" : "Copy message"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "h-7 w-7 p-0 rounded-full bg-background/80 backdrop-blur-sm border border-muted/50 hover:bg-background hover:border-muted transition-colors",
                      isRegenerating ? "text-primary border-primary/50" : "hover:text-primary"
                    )}
                    onClick={() => message.id && onRegenerate?.(message.id)}
                    disabled={isRegenerating}
                  >
                    {isRegenerating ? (
                      <Loader2 className="h-3 w-3 animate-spin text-primary" />
                    ) : (
                      <RotateCcw className="h-3 w-3 text-muted-foreground" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">
                  {isRegenerating ? "Regenerating..." : "Regenerate response"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "h-7 w-7 p-0 rounded-full bg-background/80 backdrop-blur-sm border border-muted/50 hover:bg-background hover:border-muted transition-colors",
                      currentReaction === 'like' && "text-green-500 border-green-500/50 bg-green-500/10"
                    )}
                    onClick={() => message.id && onReaction?.(message.id, 'like')}
                  >
                    <ThumbsUp className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">
                  Helpful response
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "h-7 w-7 p-0 rounded-full bg-background/80 backdrop-blur-sm border border-muted/50 hover:bg-background hover:border-muted transition-colors",
                      currentReaction === 'dislike' && "text-red-500 border-red-500/50 bg-red-500/10"
                    )}
                    onClick={() => message.id && onReaction?.(message.id, 'dislike')}
                  >
                    <ThumbsDown className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">
                  Unhelpful response
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
