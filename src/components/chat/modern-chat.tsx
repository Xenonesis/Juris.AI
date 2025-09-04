'use client';

import { Bot } from 'lucide-react';
import { useChat } from '@/hooks/useChat';
import { ChatHeader } from './chat-header';
import { ChatSettings } from './chat-settings';
import { ApiKeyWarning } from './api-key-warning';
import { ChatMessages } from './chat-messages';
import { EnhancedChatInput } from './enhanced-chat-input';

export function ModernChat() {
  const {
    user,
    loading,
    processing,
    messages,
    messageInput,
    setMessageInput,
    aiProvider,
    setAiProvider,
    selectedModel,
    setSelectedModel,
    legalMode,
    setLegalMode,
    jurisdiction,
    setJurisdiction,
    showSources,
    setShowSources,
    legalSourcesMap,
    isTyping,
    copiedMessageId,
    messageReactions,
    userApiKeys,
    missingApiKeyWarning,
    showSettings,
    setShowSettings,
    regeneratingMessageId,
    messagesEndRef,
    handleSendMessage,
    handleCopyMessage,
    handleMessageReaction,
    handleRegenerateMessage,
    handleNewChat
  } = useChat();

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center p-8 max-w-md">
          <Bot className="mx-auto h-12 w-12 text-primary" />
          <h2 className="mt-4 text-xl font-medium">Sign in to use Juris AI</h2>
          <p className="mt-2 text-muted-foreground">Please sign in to start a conversation with our AI legal assistant.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <ChatHeader
        messages={messages}
        aiProvider={aiProvider}
        showSettings={showSettings}
        onNewChat={handleNewChat}
        onToggleSettings={() => setShowSettings(!showSettings)}
      />
      
      <ChatSettings
        showSettings={showSettings}
        aiProvider={aiProvider}
        setAiProvider={setAiProvider}
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
        legalMode={legalMode}
        setLegalMode={setLegalMode}
        showSources={showSources}
        setShowSources={setShowSources}
        jurisdiction={jurisdiction}
        setJurisdiction={setJurisdiction}
        userApiKeys={userApiKeys}
      />

      <ApiKeyWarning
        show={missingApiKeyWarning}
        aiProvider={aiProvider}
      />
      
      <div className="flex-1 overflow-y-auto">
        <ChatMessages
          loading={loading}
          messages={messages}
          isTyping={isTyping}
          regeneratingMessageId={regeneratingMessageId}
          copiedMessageId={copiedMessageId}
          messageReactions={messageReactions}
          showSources={showSources}
          legalSourcesMap={legalSourcesMap}
          aiProvider={aiProvider}
          legalMode={legalMode}
          jurisdiction={jurisdiction}
          messagesEndRef={messagesEndRef}
          onExampleClick={setMessageInput}
          onCopyMessage={handleCopyMessage}
          onMessageReaction={handleMessageReaction}
          onRegenerateMessage={handleRegenerateMessage}
        />
      </div>

      <EnhancedChatInput
        value={messageInput}
        onChange={setMessageInput}
        onSubmit={handleSendMessage}
        disabled={processing}
        loading={processing}
        placeholder={legalMode
          ? "Ask your legal question..."
          : "Message Juris AI..."}
        maxLength={4000}
        showCharacterCount={true}
      />
    </div>
  );
}
