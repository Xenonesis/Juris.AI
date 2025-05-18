'use client';

import { useState, useEffect, useRef, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  User, Bot, ThumbsUp, ThumbsDown, Copy, Send,
  RefreshCcw, AlertTriangle, ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { createClient } from '@/lib/supabase/client';
import { getAIResponse, getLegalAdvice } from '@/lib/ai-services';
import { getUserApiKeys } from '@/lib/api-key-service';

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
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        loadChatHistory(user.id);
        loadUserApiKeys(user.id);
      }
    };

    fetchUser();
  }, []);

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
      
      // Focus input field after sending
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 300);
      
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

  // Auto-resize textarea height as user types
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessageInput(e.target.value);
    
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !processing) {
      e.preventDefault();
      formRef.current?.requestSubmit();
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
      {/* Chat header */}
      <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-background/80 backdrop-blur-sm p-3">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            className="mr-2"
            onClick={handleNewChat}
          >
            <RefreshCcw className="h-4 w-4 mr-1" />
            New Chat
          </Button>
          
          {messages.length > 0 && (
            <Badge variant="outline" className="text-xs">
              {aiProvider.charAt(0).toUpperCase() + aiProvider.slice(1)} AI
            </Badge>
          )}
        </div>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setShowSettings(!showSettings)}
          className="flex items-center gap-1"
        >
          Settings
          <ChevronDown className="h-3 w-3 ml-1" />
        </Button>
      </header>
      
      {/* Settings panel (collapsible) */}
      {showSettings && (
        <div className="border-b bg-muted/20 p-3 grid gap-3 text-sm">
          <div className="flex flex-wrap gap-4">
            <div className="min-w-[180px]">
              <Label htmlFor="ai-provider-select" className="text-xs mb-1 block">AI Provider</Label>
              <Select 
                value={aiProvider} 
                onValueChange={(value) => setAiProvider(value as 'gemini' | 'mistral')}
              >
                <SelectTrigger id="ai-provider-select" className="h-8">
                  <SelectValue placeholder="Select AI provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mistral">Mistral AI</SelectItem>
                  <SelectItem value="gemini">Google Gemini</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="min-w-[140px]">
              <div className="mb-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="legal-mode" className="text-xs">Legal Mode</Label>
                  <Switch 
                    id="legal-mode" 
                    checked={legalMode} 
                    onCheckedChange={setLegalMode}
                  />
                </div>
              </div>
              
              {legalMode && (
                <div className="mb-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-sources" className="text-xs">Show Sources</Label>
                    <Switch 
                      id="show-sources" 
                      checked={showSources} 
                      onCheckedChange={setShowSources}
                    />
                  </div>
                </div>
              )}
            </div>
            
            {legalMode && (
              <div className="min-w-[180px]">
                <Label htmlFor="jurisdiction-select" className="text-xs mb-1 block">Jurisdiction</Label>
                <Select value={jurisdiction} onValueChange={setJurisdiction}>
                  <SelectTrigger id="jurisdiction-select" className="h-8">
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
              </div>
            )}
          </div>
        </div>
      )}

      {/* API key warning */}
      {missingApiKeyWarning && (
        <div className="bg-yellow-50 dark:bg-yellow-900/30 p-2 text-yellow-800 dark:text-yellow-300 text-xs flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          <span>You don't have an API key for {aiProvider}. Results may be limited.</span>
        </div>
      )}
      
      {/* Chat area */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin h-8 w-8 border-t-2 border-primary rounded-full mx-auto"></div>
              <p className="mt-4 text-sm text-muted-foreground">Loading conversations...</p>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="max-w-md space-y-4">
              <div className="p-4 rounded-full bg-primary/10 mx-auto w-16 h-16 flex items-center justify-center">
                <Bot className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-2xl font-bold">How can I assist you today?</h1>
              <p className="text-muted-foreground">
                Ask me any legal question across multiple jurisdictions and I'll do my best to help.
              </p>
              <div className="p-3 bg-muted rounded-lg text-left">
                <p className="text-sm font-medium">Example questions:</p>
                <ul className="mt-2 text-sm space-y-2">
                  <li className="p-2 hover:bg-muted-foreground/10 rounded cursor-pointer">
                    "What are the requirements for starting a business in California?"
                  </li>
                  <li className="p-2 hover:bg-muted-foreground/10 rounded cursor-pointer">
                    "Explain copyright law in the EU for digital content creators."
                  </li>
                  <li className="p-2 hover:bg-muted-foreground/10 rounded cursor-pointer">
                    "What are my rights as a tenant in New York City?"
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((message, index) => (
              <motion.div
                key={message.id || `msg-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={cn(
                  "flex items-start gap-3",
                  message.is_user_message ? "justify-end" : ""
                )}
              >
                {!message.is_user_message && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div className={cn(
                  "relative rounded-lg px-3 py-2 max-w-[85%] text-sm",
                  message.is_user_message 
                    ? "bg-primary text-primary-foreground ml-12" 
                    : "bg-muted/40"
                )}>
                  {/* AI provider badge */}
                  {!message.is_user_message && message.ai_name && (
                    <div className="text-xs font-medium text-muted-foreground mb-1">
                      {message.ai_name.charAt(0).toUpperCase() + message.ai_name.slice(1)}
                    </div>
                  )}
                  
                  <div className="whitespace-pre-line break-words">
                    {message.content || (isTyping && !message.is_user_message && index === messages.length - 1 && (
                      <span className="inline-block animate-pulse">...</span>
                    ))}
                  </div>
                  
                  {/* Legal sources */}
                  {!message.is_user_message && showSources && message.id && (() => {
                    const sources = message.id ? legalSourcesMap[message.id] : undefined;
                    const caseLaw = sources?.case_law || [];
                    const statutes = sources?.statutes || [];
                    
                    if (!sources || (caseLaw.length === 0 && statutes.length === 0)) {
                      return null;
                    }
                    
                    return (
                      <div className="mt-3 pt-2 border-t border-muted text-xs">
                        <div className="font-medium mb-1">Legal sources:</div>
                        
                        {caseLaw.length > 0 && (
                          <div className="mb-2">
                            <div className="text-xs font-medium">Case Law:</div>
                            <ul className="list-disc pl-4 space-y-1">
                              {caseLaw.slice(0, 3).map((caseItem, i) => (
                                <li key={`case-${i}`} className="text-xs">
                                  <span className="font-medium">{caseItem.name}</span>
                                  {caseItem.citation && ` (${caseItem.citation})`}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {statutes.length > 0 && (
                          <div>
                            <div className="text-xs font-medium">Statutes:</div>
                            <ul className="list-disc pl-4 space-y-1">
                              {statutes.slice(0, 3).map((statute, i) => (
                                <li key={`statute-${i}`} className="text-xs">
                                  <span className="font-medium">{statute.title}</span>
                                  {statute.section && `, §${statute.section}`}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                  
                  {/* Message actions */}
                  {!message.is_user_message && message.content && (
                    <div className="absolute -bottom-8 right-0 flex gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6 rounded-md bg-background/80 backdrop-blur-sm"
                              onClick={() => handleCopyMessage(message.content, message.id)}
                            >
                              <Copy className={cn(
                                "h-3 w-3", 
                                copiedMessageId === message.id ? "text-green-500" : ""
                              )} />
                              <span className="sr-only">Copy</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="bottom">
                            <p className="text-xs">Copy message</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className={cn(
                                "h-6 w-6 rounded-md bg-background/80 backdrop-blur-sm",
                                messageReactions[message.id || ''] === 'like' ? "text-green-500" : ""
                              )}
                              onClick={() => message.id && handleMessageReaction(message.id, 'like')}
                            >
                              <ThumbsUp className="h-3 w-3" />
                              <span className="sr-only">Like</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="bottom">
                            <p className="text-xs">Helpful response</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className={cn(
                                "h-6 w-6 rounded-md bg-background/80 backdrop-blur-sm",
                                messageReactions[message.id || ''] === 'dislike' ? "text-red-500" : ""
                              )}
                              onClick={() => message.id && handleMessageReaction(message.id, 'dislike')}
                            >
                              <ThumbsDown className="h-3 w-3" />
                              <span className="sr-only">Dislike</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="bottom">
                            <p className="text-xs">Unhelpful response</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  )}
                </div>
                
                {message.is_user_message && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-muted">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      
      {/* Input area */}
      <div className="sticky bottom-0 bg-background border-t p-4">
        <form 
          ref={formRef} 
          onSubmit={handleSendMessage}
          className="relative max-w-3xl mx-auto"
        >
          <Textarea
            ref={textareaRef}
            value={messageInput}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder="Message Juris AI..."
            className="resize-none pr-12 py-3 max-h-[200px] min-h-[56px]"
            disabled={processing}
          />
          <Button 
            type="submit" 
            size="icon" 
            className="absolute right-2 bottom-2"
            disabled={!messageInput.trim() || processing}
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </form>

      </div>
    </div>
  );
}
