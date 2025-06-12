'use client';

import { useState, useEffect, useRef, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  RefreshCcw, AlertTriangle, ChevronDown, Loader2, Bot
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { createClient } from '@/lib/supabase/client';
import { getAIResponse, getLegalAdvice } from '@/lib/ai-services';
import { getUserApiKeys } from '@/lib/api-key-service';
import { MessageBubble } from './message-bubble';
import { EnhancedChatInput } from './enhanced-chat-input';
import { WelcomeScreen } from './welcome-screen';
import { useSearchParams } from 'next/navigation';

interface ChatMessage {
  id?: string;
  user_id: string;
  content: string;
  is_user_message: boolean;
  created_at: string;
  ai_name?: string;
  legal_sources?: any;
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

export function ModernChat() {
  const searchParams = useSearchParams();
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [aiProvider, setAiProvider] = useState<'gemini' | 'mistral'>('mistral');
  const [legalMode, setLegalMode] = useState(true);
  const [jurisdiction, setJurisdiction] = useState('general');
  const [showSources, setShowSources] = useState(false);
  const [saveFailed, setSaveFailed] = useState(false);
  const [legalSourcesMap, setLegalSourcesMap] = useState<Record<string, LegalSources>>({});
  const [isTyping, setIsTyping] = useState(false); 
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [messageReactions, setMessageReactions] = useState<Record<string, 'like' | 'dislike' | null>>({});
  const [userApiKeys, setUserApiKeys] = useState<Record<string, string>>({});
  const [missingApiKeyWarning, setMissingApiKeyWarning] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [regeneratingMessageId, setRegeneratingMessageId] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        // Check if we should load a specific session
        const sessionDate = searchParams.get('session');
        if (sessionDate) {
          loadSpecificSession(user.id, sessionDate);
        } else {
          loadChatHistory(user.id);
        }
        loadUserApiKeys(user.id);
      }
    };

    fetchUser();
  }, [searchParams]);

  // Load user API keys
  const loadUserApiKeys = async (userId: string) => {
    if (!userId) return;
    
    try {
      const apiKeys = await getUserApiKeys(userId);
      setUserApiKeys(apiKeys);
    } catch (error) {
      console.error('Error loading user API keys:', error);
    }
  };

  // Load legal sources from localStorage when component mounts
  useEffect(() => {
    try {
      const storedSources = localStorage.getItem('legalSources');
      if (storedSources) {
        setLegalSourcesMap(JSON.parse(storedSources));
      }
      
      // Load message reactions from localStorage
      const storedReactions = localStorage.getItem('messageReactions');
      if (storedReactions) {
        setMessageReactions(JSON.parse(storedReactions));
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
    }
  }, []);

  const loadChatHistory = async (userId: string) => {
    setLoading(true);

    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      if (data) {
        setMessages(data);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSpecificSession = async (userId: string, sessionDate: string) => {
    setLoading(true);

    try {
      const supabase = createClient();

      // Load messages from the specific date
      const startOfDay = new Date(sessionDate);
      const endOfDay = new Date(sessionDate);
      endOfDay.setDate(endOfDay.getDate() + 1);

      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', startOfDay.toISOString())
        .lt('created_at', endOfDay.toISOString())
        .order('created_at', { ascending: true });

      if (error) throw error;

      if (data) {
        setMessages(data);
      }
    } catch (error) {
      console.error('Error loading specific session:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveMessage = async (message: ChatMessage): Promise<boolean> => {
    try {
      const { ai_name, legal_sources, ...messageToSave } = message;
      
      const sanitizedMessage = {
        user_id: messageToSave.user_id || '',
        content: messageToSave.content || '',
        is_user_message: !!messageToSave.is_user_message,
        created_at: messageToSave.created_at || new Date().toISOString()
      };
      
      if (!sanitizedMessage.user_id || !sanitizedMessage.content) {
        throw new Error('Missing required fields (user_id or content)');
      }
      
      const supabase = createClient();
      const { error } = await supabase
        .from('chat_messages')
        .insert(sanitizedMessage);
      
      if (error) {
        throw error;
      }
      
      return true; // Success
    } catch (error) {
      console.error('Error saving message:', error);
      
      // For simplicity in this demo, we're not implementing full retry logic
      return false;
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!messageInput.trim() || processing) return;
    
    const currentInput = messageInput.trim();
    setMessageInput('');
    setProcessing(true);
    setIsTyping(true);
    
    // Check if user has API key for selected provider
    const hasApiKey = !!userApiKeys[aiProvider];
    
    // Show warning if using providers without API key
    if (!hasApiKey && aiProvider !== 'mistral') {
      setMissingApiKeyWarning(true);
      setTimeout(() => setMissingApiKeyWarning(false), 5000);
    }
    
    // Scroll to bottom
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
    
    try {
      if (!user) {
        throw new Error('You must be logged in to send messages');
      }
      
      // Add user message to chat
      const userMessage: ChatMessage = {
        id: `temp-${Date.now()}`,
        user_id: user.id,
        content: currentInput,
        is_user_message: true,
        created_at: new Date().toISOString(),
      };
      
      setMessages(prevMessages => [...prevMessages, userMessage]);
      
      // Generate temp ID for the AI message
      const tempAiMessageId = `temp-ai-${Date.now()}`;
      
      // Add temporary AI message to show typing indicator
      const tempAiMessage: ChatMessage = {
        id: tempAiMessageId,
        user_id: user.id,
        content: '',
        is_user_message: false,
        created_at: new Date().toISOString(),
        ai_name: aiProvider,
      };
      
      setMessages(prevMessages => [...prevMessages, tempAiMessage]);
      
      // Process the message with the appropriate AI system
      let aiResponse;
      
      if (legalMode) {
        aiResponse = await getLegalAdvice(currentInput, aiProvider, jurisdiction);
      } else {
        aiResponse = await getAIResponse(currentInput, aiProvider, userApiKeys);
      }
      
      // Create the actual AI response message
      const aiMessage: ChatMessage = {
        id: tempAiMessageId,
        user_id: user.id,
        content: aiResponse,
        is_user_message: false,
        created_at: new Date().toISOString(),
        ai_name: aiProvider,
      };
      
      // Update the temporary message with the actual response
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === tempAiMessageId ? aiMessage : msg
        )
      );
      
      // Save both messages to the database
      const userSaveSuccess = await saveMessage(userMessage);
      const aiSaveSuccess = await saveMessage(aiMessage);
      
      // Show warning if saving failed
      if (!userSaveSuccess || !aiSaveSuccess) {
        setSaveFailed(true);
        setTimeout(() => setSaveFailed(false), 5000);
      }
      
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Show error message in chat
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        user_id: user?.id || 'anonymous',
        content: 'Sorry, there was an error processing your message. Please try again.',
        is_user_message: false,
        created_at: new Date().toISOString(),
      };
      
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setProcessing(false);
      setIsTyping(false);

      // Scroll to bottom again after response
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const handleCopyMessage = (content: string, messageId?: string) => {
    navigator.clipboard.writeText(content);
    if (messageId) {
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    }
  };

  const handleMessageReaction = (messageId: string, reaction: 'like' | 'dislike') => {
    const currentReaction = messageReactions[messageId];
    const newReaction = currentReaction === reaction ? null : reaction;

    const updatedReactions = {
      ...messageReactions,
      [messageId]: newReaction
    };

    setMessageReactions(updatedReactions);

    // Save to localStorage
    try {
      localStorage.setItem('messageReactions', JSON.stringify(updatedReactions));
    } catch (error) {
      console.error('Error saving reactions to localStorage:', error);
    }
  };

  const handleRegenerateMessage = async (messageId: string) => {
    if (!user || processing || regeneratingMessageId) return;

    // Find the message to regenerate
    const messageIndex = messages.findIndex(msg => msg.id === messageId);
    if (messageIndex === -1) return;

    const messageToRegenerate = messages[messageIndex];
    if (messageToRegenerate.is_user_message) return; // Can't regenerate user messages

    // Find the previous user message to get the original prompt
    let userMessageIndex = messageIndex - 1;
    while (userMessageIndex >= 0 && !messages[userMessageIndex].is_user_message) {
      userMessageIndex--;
    }

    if (userMessageIndex < 0) return; // No user message found

    const userMessage = messages[userMessageIndex];

    setRegeneratingMessageId(messageId);
    setProcessing(true);
    setIsTyping(true);

    try {
      // Generate new AI response
      let aiResponse;
      if (legalMode) {
        aiResponse = await getLegalAdvice(userMessage.content, aiProvider, jurisdiction);
      } else {
        aiResponse = await getAIResponse(userMessage.content, aiProvider, userApiKeys);
      }

      // Create the new AI response message
      const newAiMessage: ChatMessage = {
        id: messageId, // Keep the same ID to replace the existing message
        user_id: user.id,
        content: aiResponse,
        is_user_message: false,
        created_at: new Date().toISOString(),
        ai_name: aiProvider,
      };

      // Update the message in the array
      const updatedMessages = [...messages];
      updatedMessages[messageIndex] = newAiMessage;
      setMessages(updatedMessages);

      // Save the regenerated message to the database
      await saveMessage(newAiMessage);

    } catch (error) {
      console.error('Error regenerating message:', error);

      // Show error message
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        user_id: user.id,
        content: 'Sorry, there was an error regenerating the response. Please try again.',
        is_user_message: false,
        created_at: new Date().toISOString(),
      };

      // Replace the message with error
      const updatedMessages = [...messages];
      updatedMessages[messageIndex] = errorMessage;
      setMessages(updatedMessages);
    } finally {
      setProcessing(false);
      setIsTyping(false);
      setRegeneratingMessageId(null);
    }
  };



  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Start new chat
  const handleNewChat = () => {
    setMessages([]);
  };

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
      {/* Enhanced Chat Header */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur-md shadow-sm"
      >
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="hover:bg-primary/10 hover:border-primary/30 transition-all duration-200"
              onClick={handleNewChat}
            >
              <RefreshCcw className="h-4 w-4 mr-2" />
              New Chat
            </Button>

            {messages.length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
              >
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                  {aiProvider.charAt(0).toUpperCase() + aiProvider.slice(1)} AI
                </Badge>
              </motion.div>
            )}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
            className={cn(
              "flex items-center gap-2 hover:bg-muted/50 transition-all duration-200",
              showSettings && "bg-muted/50"
            )}
          >
            Settings
            <motion.div
              animate={{ rotate: showSettings ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="h-3 w-3" />
            </motion.div>
          </Button>
        </div>
      </motion.header>
      
      {/* Enhanced Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="border-b bg-gradient-to-r from-muted/30 to-muted/20 overflow-hidden"
          >
            <div className="p-4 space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="space-y-2"
                >
                  <Label htmlFor="ai-provider-select" className="text-sm font-medium">AI Provider</Label>
                  <Select
                    value={aiProvider}
                    onValueChange={(value) => setAiProvider(value as 'gemini' | 'mistral')}
                  >
                    <SelectTrigger id="ai-provider-select" className="h-9 bg-background/50">
                      <SelectValue placeholder="Select AI provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mistral">Mistral AI</SelectItem>
                      <SelectItem value="gemini">Google Gemini</SelectItem>
                    </SelectContent>
                  </Select>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <Label htmlFor="legal-mode" className="text-sm font-medium">Legal Mode</Label>
                    <Switch
                      id="legal-mode"
                      checked={legalMode}
                      onCheckedChange={setLegalMode}
                    />
                  </div>

                  <AnimatePresence>
                    {legalMode && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-center justify-between"
                      >
                        <Label htmlFor="show-sources" className="text-sm font-medium">Show Sources</Label>
                        <Switch
                          id="show-sources"
                          checked={showSources}
                          onCheckedChange={setShowSources}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                <AnimatePresence>
                  {legalMode && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: 0.3 }}
                      className="space-y-2"
                    >
                      <Label htmlFor="jurisdiction-select" className="text-sm font-medium">Jurisdiction</Label>
                      <Select value={jurisdiction} onValueChange={setJurisdiction}>
                        <SelectTrigger id="jurisdiction-select" className="h-9 bg-background/50">
                          <SelectValue placeholder="Select jurisdiction" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General</SelectItem>
                          <SelectItem value="us">United States</SelectItem>
                          <SelectItem value="uk">United Kingdom</SelectItem>
                          <SelectItem value="eu">European Union</SelectItem>
                          <SelectItem value="canada">Canada</SelectItem>
                          <SelectItem value="australia">Australia</SelectItem>
                          <SelectItem value="in">India</SelectItem>
                          <SelectItem value="np">Nepal</SelectItem>
                          <SelectItem value="cn">China</SelectItem>
                        </SelectContent>
                      </Select>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced API Key Warning */}
      <AnimatePresence>
        {missingApiKeyWarning && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/30 dark:to-orange-900/30 border-l-4 border-yellow-400"
          >
            <div className="p-3 flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                  API Key Missing
                </p>
                <p className="text-xs text-yellow-700 dark:text-yellow-400 mt-1">
                  You don't have an API key for {aiProvider}. Results may be limited. Configure your API keys in settings.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Chat area */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
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
        ) : messages.length === 0 ? (
          <WelcomeScreen
            onExampleClick={(question) => setMessageInput(question)}
            aiProvider={aiProvider}
            legalMode={legalMode}
            jurisdiction={jurisdiction}
          />
        ) : (
          <div className="py-4 space-y-1">
            <AnimatePresence mode="popLayout">
              {messages.map((message, index) => (
                <MessageBubble
                  key={message.id || `msg-${index}`}
                  message={message}
                  isTyping={isTyping && !message.is_user_message && index === messages.length - 1}
                  isRegenerating={regeneratingMessageId === message.id}
                  onCopy={handleCopyMessage}
                  onReaction={handleMessageReaction}
                  onRegenerate={handleRegenerateMessage}
                  copiedMessageId={copiedMessageId}
                  messageReactions={messageReactions}
                  showSources={showSources}
                  legalSources={message.id ? legalSourcesMap[message.id] : undefined}
                />
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} className="h-4" />
          </div>
        )}
      </div>

      {/* Enhanced Input Area */}
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
