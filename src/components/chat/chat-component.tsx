'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { createClient } from '@/lib/supabase/client';
import { getAIResponse, getLegalAdvice } from '@/lib/ai-services';
import { getUserApiKeys } from '@/lib/api-key-service';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Loader2, User2, Bot as BotIcon, Copy, Share2, ThumbsUp, 
  ThumbsDown, Sparkles, SendHorizonal, Paperclip, PlusCircle, Key
} from 'lucide-react';
import Link from 'next/link';

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

interface ChatMessage {
  id?: string;
  user_id: string;
  content: string;
  is_user_message: boolean;
  created_at: string;
  ai_name?: string;
  legal_sources?: LegalSources;
}

// Helper to determine if messages should be grouped
const shouldGroupMessages = (curr: ChatMessage, prev: ChatMessage | undefined) => {
  if (!prev) return false;
  return curr.is_user_message === prev.is_user_message && 
    // Messages within 2 minutes should be grouped
    (new Date(curr.created_at).getTime() - new Date(prev.created_at).getTime() < 120000);
};

export function ChatComponent() {
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [messageIdCounter, setMessageIdCounter] = useState(0);

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        loadChatHistory(user.id);
        loadUserApiKeys(user.id);
        // Check database schema when component loads
        debugDatabaseSchema();
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

  // Add effect to recover any cached failed messages after initial load
  useEffect(() => {
    if (user) {
      recoverFailedMessages();
    }
  }, [user]);

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

  // Focus input field when component loads
  useEffect(() => {
    if (inputRef.current && !loading) {
      inputRef.current.focus();
    }
  }, [loading]);

  const recoverFailedMessages = async () => {
    try {
      const failedMessagesJson = localStorage.getItem('failedMessages');
      if (!failedMessagesJson) return;
      
      const failedMessages = JSON.parse(failedMessagesJson) as (ChatMessage & { saveAttemptTime: string })[];
      if (failedMessages.length === 0) return;
      
      console.log(`Attempting to recover ${failedMessages.length} failed messages`);
      
      // Process failed messages in order of original save attempt
      const sortedMessages = [...failedMessages].sort(
        (a, b) => new Date(a.saveAttemptTime).getTime() - new Date(b.saveAttemptTime).getTime()
      );
      
      const recoveryResults = await Promise.all(
        sortedMessages.map(async (messageObj) => {
          // Only try to save messages that belong to the current user
          if (messageObj.user_id === user?.id) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { saveAttemptTime, ...message } = messageObj;
            const success = await saveMessage(message);
            return { message, success };
          }
          return { message: messageObj, success: false };
        })
      );
      
      // Remove successfully saved messages from localStorage
      const stillFailedMessages = recoveryResults
        .filter(result => !result.success)
        .map(result => ({
          ...result.message,
          saveAttemptTime: new Date().toISOString() // Update the attempt time
        }));
      
      if (stillFailedMessages.length > 0) {
        localStorage.setItem('failedMessages', JSON.stringify(stillFailedMessages));
        console.log(`${recoveryResults.length - stillFailedMessages.length} messages recovered, ${stillFailedMessages.length} still pending`);
      } else {
        localStorage.removeItem('failedMessages');
        console.log('All messages recovered successfully');
      }
    } catch (error) {
      console.error('Error recovering cached messages:', error);
    }
  };

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

  const sanitizeLegalSources = (sources: unknown): LegalSources | null => {
    if (!sources || typeof sources !== "object") return null;
    try {
      const sanitized: LegalSources = {
        case_law: [],
        statutes: []
      };

      // Process case_law if it exists
      const srcObj = sources as { case_law?: unknown[]; statutes?: unknown[] };
      if (Array.isArray(srcObj.case_law)) {
        sanitized.case_law = srcObj.case_law.map((caseItem: unknown) => {
          const c = caseItem as Partial<CaseLaw>;
          return {
            id: String(c.id ?? ""),
            name: String(c.name ?? ""),
            citation: String(c.citation ?? ""),
            court: String(c.court ?? ""),
            decision_date: String(c.decision_date ?? ""),
            jurisdiction: String(c.jurisdiction ?? ""),
            summary: c.summary ? String(c.summary) : undefined,
            relevance: typeof c.relevance === 'number' ? c.relevance : 0.5,
          };
        });
      }

      // Process statutes if they exist
      if (Array.isArray(srcObj.statutes)) {
        sanitized.statutes = srcObj.statutes.map((statute: unknown) => {
          const s = statute as Partial<Statute>;
          return {
            id: String(s.id ?? ""),
            title: String(s.title ?? ""),
            code: String(s.code ?? ""),
            section: String(s.section ?? ""),
            jurisdiction: String(s.jurisdiction ?? ""),
            content: String(s.content ?? ""),
            relevance: typeof s.relevance === 'number' ? s.relevance : 0.5,
          };
        });
      }

      if (
        (!sanitized.case_law || sanitized.case_law.length === 0) &&
        (!sanitized.statutes || sanitized.statutes.length === 0)
      ) {
        return null;
      }

      return sanitized;
    } catch (error) {
      console.error("Error sanitizing legal sources:", error);
      return null;
    }
  };

  const saveMessage = async (message: ChatMessage, retryCount = 0): Promise<boolean> => {
    try {
      // Extract fields that don't exist in the database schema
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { ai_name, legal_sources, ...messageToSave } = message;
      
      // Ensure all fields have valid types for existing columns
      const sanitizedMessage = {
        user_id: messageToSave.user_id || '',
        content: messageToSave.content || '',
        is_user_message: !!messageToSave.is_user_message,
        created_at: messageToSave.created_at || new Date().toISOString()
      };
      
      // Note: legal_sources is completely removed as it doesn't exist in the database
      
      // Validate core message fields before saving
      if (!sanitizedMessage.user_id || !sanitizedMessage.content) {
        throw new Error('Missing required fields (user_id or content)');
      }
      
      console.log('Saving message with structure:', JSON.stringify(sanitizedMessage, null, 2));
      
      const supabase = createClient();
      const { error } = await supabase
        .from('chat_messages')
        .insert(sanitizedMessage);
      
      if (error) {
        console.error('Supabase error details:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        
        throw error;
      }
      
      return true; // Success
    } catch (error) {
      // Log detailed error information
      console.error('Error saving message:', error);
      // Implement retry logic (max 3 attempts)
      if (retryCount < 2) {
        console.log(`Retrying save message attempt ${retryCount + 1}...`);
        // Wait for a short time before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount)));
        return saveMessage(message, retryCount + 1);
      }
      // If all retries fail, add the message to localStorage for later recovery
      try {
        const failedMessages = JSON.parse(localStorage.getItem('failedMessages') || '[]');
        failedMessages.push({...message, saveAttemptTime: new Date().toISOString()});
        localStorage.setItem('failedMessages', JSON.stringify(failedMessages));
      } catch (storageError) {
        console.error('Could not save failed message to localStorage:', storageError);
      }
      return false; // Failed after retries
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
    
    // Show warning if using Gemini or other providers without API key
    if (!hasApiKey && aiProvider !== 'mistral') {
      setMissingApiKeyWarning(true);
      // Auto-hide warning after 5 seconds
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
        inputRef.current?.focus();
      }, 300);
      
      // Scroll to bottom again after response
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  // Handle copy message to clipboard
  const handleCopyMessage = (content: string, messageId?: string) => {
    navigator.clipboard.writeText(content);
    if (messageId) {
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    }
  };

  // Handle message reaction
  const handleMessageReaction = (messageId: string, reaction: 'like' | 'dislike') => {
    const currentReaction = messageReactions[messageId];
    
    // Toggle reaction if clicking the same button
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

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Debug function to check table structure
  const debugDatabaseSchema = async () => {
    try {
      console.log('Checking database schema...');
      
      const supabase = createClient();
      // Query just one row to see table structure
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .limit(1);
      
      if (error) {
        console.error('Error checking schema:', error);
        return;
      }
      
      if (data && data.length > 0) {
        console.log('Database schema for chat_messages:', Object.keys(data[0]));
        console.log('Sample row:', data[0]);
      } else {
        console.log('No data found in chat_messages table');
        
        // If no data, query table definition if available through Supabase API
        const { data: tableData, error: tableError } = await supabase
          .rpc('get_table_definition', { table_name: 'chat_messages' })
          .single();
        
        if (tableError) {
          console.log('Could not retrieve table definition:', tableError);
        } else if (tableData) {
          console.log('Table definition:', tableData);
        }
      }
    } catch (error) {
      console.error('Error debugging database schema:', error);
    }
  };

  const debugSupabaseConnection = async () => {
    try {
      console.log('Testing Supabase connection...');
      
      const supabase = createClient();
      // Check authentication status
      const { data: authData, error: authError } = await supabase.auth.getSession();
      if (authError) {
        console.error('Authentication error:', authError);
      } else {
        console.log('Auth status:', authData.session ? 'Authenticated' : 'Not authenticated');
      }
      
      // Try a simple query to test database connection
      const startTime = Date.now();
      const { data, error } = await supabase
        .from('chat_messages')
        .select('count', { count: 'exact', head: true });
      
      const duration = Date.now() - startTime;
      
      if (error) {
        console.error('Database connection error:', error);
      } else {
        console.log(`Database connection successful (${duration}ms):`, data);
      }
      
      // Test table operations manually
      console.log('Testing table operations manually...');
      
      // Test SELECT
      const { error: selectError } = await supabase
        .from('chat_messages')
        .select('id')
        .limit(1);
      
      console.log('SELECT permission:', selectError ? 'Denied' : 'Granted');
      
      // Log INSERT permission without actually inserting a test message
      console.log('INSERT permission: Not tested to avoid creating test messages');
      
    } catch (error) {
      console.error('Error testing Supabase connection:', error);
    }
  };

  // Call the debug function when user logs in
  useEffect(() => {
    if (user) {
      debugSupabaseConnection();
    }
  }, [user]);

  useEffect(() => {
    // Generate IDs for any messages that don't have them
    if (messages.some(msg => !msg.id)) {
      const messagesWithIds = messages.map(msg => {
        if (!msg.id) {
          return { ...msg, id: `generated-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` };
        }
        return msg;
      });
      
      setMessages(messagesWithIds);
    }
  }, [messages]);

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Chat with Juris.Ai</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center py-4">Please log in to use the chat feature.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full rounded-xl overflow-hidden border-gray-200 shadow-md">
      <CardHeader className="pb-2 border-b bg-gradient-to-r from-slate-50 to-gray-100 dark:from-gray-900 dark:to-slate-800">
        <div className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8 bg-primary">
              <AvatarFallback>
                <BotIcon className="w-4 h-4 text-primary-foreground" />
              </AvatarFallback>
            </Avatar>
            <CardTitle className="text-xl">Juris</CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            <Link href="/chat/history" className="text-sm text-blue-500 hover:underline mr-2">
              View History
            </Link>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Select value={aiProvider} onValueChange={(value) => setAiProvider(value as 'gemini' | 'mistral')}>
                      <SelectTrigger className="w-[120px] h-8">
                        <SelectValue placeholder="Select AI" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mistral">Mistral AI</SelectItem>
                        <SelectItem value="gemini">Google Gemini</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Select AI model</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <div className="flex items-center justify-between mt-4 pt-2">
          <div className="flex items-center space-x-2">
            <Switch
              id="legal-mode"
              checked={legalMode}
              onCheckedChange={setLegalMode}
            />
            <Label htmlFor="legal-mode">Legal Advice Mode</Label>
          </div>
          
          {legalMode && (
            <div className="flex items-center space-x-2">
              <Label htmlFor="jurisdiction" className="text-sm">Jurisdiction:</Label>
              <Select value={jurisdiction} onValueChange={setJurisdiction}>
                <SelectTrigger className="w-[140px] h-8" id="jurisdiction">
                  <SelectValue placeholder="Jurisdiction" />
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
        <div className="flex items-center justify-between mt-2">
          {legalMode && (
            <div className="flex items-center space-x-2">
              <Switch
                id="show-sources"
                checked={showSources}
                onCheckedChange={setShowSources}
              />
              <Label htmlFor="show-sources" className="text-sm">Show Legal Sources</Label>
            </div>
          )}
        </div>
        {/* API key warning */}
        {missingApiKeyWarning && (
          <div className="flex items-center justify-center my-2">
            <div className="bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-400 rounded-lg p-3 text-sm flex items-center">
              <Key className="h-4 w-4 mr-2 flex-shrink-0" />
              <p className="text-xs">
                You don't have an API key set for {aiProvider}. 
                <Link href="/profile?tab=api-keys" className="ml-1 underline">
                  Add your key in settings
                </Link> for better results.
              </p>
            </div>
          </div>
        )}
        {saveFailed && (
          <div className="mt-2 text-sm text-amber-600 bg-amber-50 p-2 rounded-md flex items-center justify-between">
            <span>Some messages failed to save to the server but have been cached locally.</span>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs" 
              onClick={recoverFailedMessages}
            >
              Retry
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[480px] md:h-[560px] overflow-y-auto bg-gradient-to-b from-background/70 to-muted/40 relative flex flex-col snap-y scrollbar-thumb-rounded scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-700 dark:scrollbar-track-gray-900">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-primary/60" />
              <span className="ml-2 text-muted-foreground">Loading chat history...</span>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <div className="w-16 h-16 mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Welcome to Juris</h3>
              <p className="text-muted-foreground max-w-sm">
                Start a conversation by sending a message. 
                {legalMode && " Ask any legal question across multiple jurisdictions."}
              </p>
            </div>
          ) : (
            <AnimatePresence initial={false} mode="sync">
              {messages.map((message, index) => {
                const isGrouped = shouldGroupMessages(message, messages[index - 1]);
                return (
                <motion.div
                  key={message.id || `msg-${index}`}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 30,
                    mass: 0.5,
                  }}
                  className={`flex w-full ${message.is_user_message ? 'justify-end' : 'justify-start'} items-end snap-end
                    ${isGrouped ? 'mt-1' : 'mt-4 md:mt-6'} px-4 md:px-6`}
                >
                  {/* Avatar - only shown for first message in a group */}
                  {!message.is_user_message && !isGrouped && (
                    <div className="mr-2 flex-shrink-0">
                      <Avatar className="h-8 w-8 border bg-muted">
                        <AvatarFallback>
                          <BotIcon className="w-5 h-5 text-primary" />
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  )}
                  
                  {/* Message Spacer for Grouped Messages */}
                  {!message.is_user_message && isGrouped && (
                    <div className="w-10"></div>
                  )}
                  
                  <div className="group relative">
                    <div
                      className={[
                        "relative max-w-[300px] md:max-w-[450px] lg:max-w-[550px] min-w-[70px] px-4 py-2.5 rounded-2xl shadow-sm transition-all text-[0.95rem] leading-6",
                        message.is_user_message
                          ? "bg-primary text-primary-foreground ml-auto rounded-br-sm"
                          : "bg-muted/50 hover:bg-muted/80 text-foreground rounded-bl-sm",
                        isGrouped ? (message.is_user_message ? "rounded-tr-2xl" : "rounded-tl-2xl") : ""
                      ].join(' ')}
                    >
                      {/* AI name on top - only for first message in a group */}
                      {!message.is_user_message && !isGrouped && message.ai_name && (
                        <div className="text-xs font-semibold mb-1 text-gray-500 flex items-center">
                          {message.ai_name}
                        </div>
                      )}
                      
                      {/* Message body */}
                      <p className="whitespace-pre-line break-words">{message.content}</p>

                      {/* Legal sources */}
                      {!message.is_user_message && showSources && message.id && legalSourcesMap[message.id] && (
                        <div className="mt-3 pt-2 border-t border-gray-300 text-xs">
                          <button
                            className="font-semibold underline text-blue-600 hover:text-blue-800 mb-1"
                            type="button"
                          >
                            Legal Sources
                          </button>
                          {!!legalSourcesMap[message.id]?.case_law && legalSourcesMap[message.id]!.case_law!.length > 0 && (
                            <div className="mt-1">
                              <span className="font-medium">Cases:</span>
                              <ul className="list-disc pl-4">
                                {legalSourcesMap[message.id]!.case_law!.map((caseItem: CaseLaw, idx: number) => (
                                  <li key={`${caseItem.id || caseItem.name}-${idx}`} className="text-xs">
                                    {caseItem.name} ({caseItem.decision_date})
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {!!legalSourcesMap[message.id]?.statutes && legalSourcesMap[message.id]!.statutes!.length > 0 && (
                            <div className="mt-1">
                              <span className="font-medium">Statutes:</span>
                              <ul className="list-disc pl-4">
                                {legalSourcesMap[message.id]!.statutes!.map((statute: Statute, idx: number) => (
                                  <li key={`${statute.id || statute.title}-${idx}`} className="text-xs">
                                    {statute.title}, {statute.section}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* Message Actions */}
                      {!message.is_user_message && (
                        <div className="absolute -right-1 top-0 transform translate-x-full opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  size="icon" 
                                  variant="ghost" 
                                  className="h-7 w-7"
                                  onClick={() => handleCopyMessage(message.content, message.id)}
                                >
                                  {copiedMessageId === message.id ? (
                                    <span className="text-green-500 text-xs">Copied</span>
                                  ) : (
                                    <Copy className="h-3.5 w-3.5" />
                                  )}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Copy response</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  size="icon" 
                                  variant="ghost"
                                  className={`h-7 w-7 ${message.id && messageReactions[message.id] === 'like' ? 'bg-green-100 text-green-600' : ''}`}
                                  onClick={() => message.id && handleMessageReaction(message.id, 'like')}
                                >
                                  <ThumbsUp className="h-3.5 w-3.5" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Good response</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  size="icon" 
                                  variant="ghost"
                                  className={`h-7 w-7 ${message.id && messageReactions[message.id] === 'dislike' ? 'bg-red-100 text-red-600' : ''}`}
                                  onClick={() => message.id && handleMessageReaction(message.id, 'dislike')}
                                >
                                  <ThumbsDown className="h-3.5 w-3.5" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Incorrect or unhelpful</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      )}

                      {/* Timestamp - only for last message in group */}
                      {(!messages[index + 1] || !shouldGroupMessages(messages[index + 1], message)) && (
                        <span className={`absolute ${message.is_user_message ? 'right-1' : 'left-1'} bottom-0 text-[10px] opacity-60 leading-4 px-0.5`}>
                          {new Date(message.created_at).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* User Avatar - only shown for first message in a group */}
                  {message.is_user_message && !isGrouped && (
                    <div className="ml-2 flex-shrink-0">
                      <Avatar className="h-8 w-8 border bg-primary">
                        <AvatarFallback>
                          <User2 className="w-5 h-5 text-primary-foreground" />
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  )}
                  
                  {/* Message Spacer for grouped messages */}
                  {message.is_user_message && isGrouped && (
                    <div className="w-10"></div>
                  )}
                </motion.div>
              )})}
              
              {/* Typing indicator */}
              {isTyping && (
                <motion.div
                  key="typing-indicator"
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex w-full justify-start items-end mt-4 px-4 md:px-6"
                >
                  <div className="mr-2 flex-shrink-0">
                    <Avatar className="h-8 w-8 border bg-muted">
                      <AvatarFallback>
                        <BotIcon className="w-5 h-5 text-primary" />
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="bg-muted/50 px-4 py-3 rounded-2xl rounded-bl-sm min-w-[60px]">
                    <div className="flex space-x-1 items-center h-5">
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" 
                        style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" 
                        style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" 
                        style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} className="pt-6" />
            </AnimatePresence>
          )}
        </div>
      </CardContent>
      <CardFooter className="border-t p-3">
        <form onSubmit={handleSendMessage} className="w-full flex items-end gap-2">
          <div className="relative flex-1">
            <Input
              ref={inputRef}
              placeholder={legalMode 
                ? "Ask your legal question..." 
                : "Type your message..."}
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              disabled={loading || processing}
              className="min-h-[50px] pl-4 pr-12 py-3 rounded-xl"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (messageInput.trim()) {
                    handleSendMessage(e);
                  }
                }
              }}
              aria-label="Message input"
              
            />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button" 
                    size="icon"
                    variant="ghost"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    disabled={loading || processing}
                  >
                    <PlusCircle className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>Add attachment (coming soon)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Button 
            type="submit" 
            disabled={loading || processing || !messageInput.trim()}
            className="rounded-xl h-[50px] px-5"
            aria-label="Send message"
          >
            {processing ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <SendHorizonal className="h-5 w-5" />
            )}
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
} 