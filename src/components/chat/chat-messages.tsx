'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { MessageBubble } from './message-bubble';
import { WelcomeScreen } from './welcome-screen';

interface ChatMessage {
  id?: string;
  user_id: string;
  content: string;
  is_user_message: boolean;
  created_at: string;
  ai_name?: string;
  legal_sources?: any;
}

interface LegalSources {
  case_law?: any[];
  statutes?: any[];
}

interface ChatMessagesProps {
  loading: boolean;
  messages: ChatMessage[];
  isTyping: boolean;
  regeneratingMessageId: string | null;
  copiedMessageId: string | null;
  messageReactions: Record<string, 'like' | 'dislike' | null>;
  showSources: boolean;
  legalSourcesMap: Record<string, LegalSources>;
  aiProvider: string;
  legalMode: boolean;
  jurisdiction: string;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  onExampleClick: (question: string) => void;
  onCopyMessage: (content: string, messageId?: string) => void;
  onMessageReaction: (messageId: string, reaction: 'like' | 'dislike') => void;
  onRegenerateMessage: (messageId: string) => void;
}

export function ChatMessages({
  loading,
  messages,
  isTyping,
  regeneratingMessageId,
  copiedMessageId,
  messageReactions,
  showSources,
  legalSourcesMap,
  aiProvider,
  legalMode,
  jurisdiction,
  messagesEndRef,
  onExampleClick,
  onCopyMessage,
  onMessageReaction,
  onRegenerateMessage
}: ChatMessagesProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <div className="relative">
            <Loader2 className="h-8 w-8 text-primary animate-spin mx-auto" />
            <div className="absolute inset-0 h-8 w-8 border-2 border-primary/20 rounded-full mx-auto animate-pulse" />
          </div>
          <p className="text-sm text-muted-foreground">Loading conversations...</p>
        </motion.div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <WelcomeScreen
        onExampleClick={onExampleClick}
        aiProvider={aiProvider}
        legalMode={legalMode}
        jurisdiction={jurisdiction}
      />
    );
  }

  return (
    <div className="py-4 space-y-1">
      <AnimatePresence mode="popLayout">
        {messages.map((message, index) => (
          <MessageBubble
            key={message.id || `msg-${index}`}
            message={message}
            isTyping={isTyping && !message.is_user_message && index === messages.length - 1}
            isRegenerating={regeneratingMessageId === message.id}
            onCopy={onCopyMessage}
            onReaction={onMessageReaction}
            onRegenerate={onRegenerateMessage}
            copiedMessageId={copiedMessageId}
            messageReactions={messageReactions}
            showSources={showSources}
            legalSources={message.id ? legalSourcesMap[message.id] : undefined}
          />
        ))}
      </AnimatePresence>
      <div ref={messagesEndRef} className="h-4" />
    </div>
  );
}
