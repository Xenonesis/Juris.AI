'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import supabase from '@/lib/supabase';
import { getAIResponse, getLegalAdvice } from '@/lib/ai-services';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

interface ChatMessage {
  id?: string;
  user_id: string;
  content: string;
  is_user_message: boolean;
  created_at: string;
  ai_name?: string;
  legal_sources?: {
    case_law?: any[];
    statutes?: any[];
  };
}

export function ChatComponent() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [aiProvider, setAiProvider] = useState<'gemini' | 'mistral'>('mistral');
  const [legalMode, setLegalMode] = useState(true);
  const [jurisdiction, setJurisdiction] = useState('general');
  const [showSources, setShowSources] = useState(false);
  const [saveFailed, setSaveFailed] = useState(false);
  const [legalSourcesMap, setLegalSourcesMap] = useState<{[messageId: string]: any}>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        loadChatHistory(user.id);
        // Check database schema when component loads
        debugDatabaseSchema();
      }
    };

    fetchUser();
  }, []);

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
    } catch (error) {
      console.error('Error loading legal sources from localStorage:', error);
    }
  }, []);

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
        sortedMessages.map(async ({ saveAttemptTime, ...message }) => {
          // Only try to save messages that belong to the current user
          if (message.user_id === user.id) {
            const success = await saveMessage(message);
            return { message, success };
          }
          return { message, success: false };
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

  const validateMessage = (message: any): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    // Check required fields
    if (!message.user_id) errors.push('Missing user_id');
    if (!message.content) errors.push('Missing content');
    if (message.is_user_message === undefined) errors.push('Missing is_user_message flag');
    if (!message.created_at) errors.push('Missing created_at timestamp');
    
    // Check data types
    if (message.user_id && typeof message.user_id !== 'string') errors.push('user_id must be a string');
    if (message.content && typeof message.content !== 'string') errors.push('content must be a string');
    if (message.is_user_message !== undefined && typeof message.is_user_message !== 'boolean') errors.push('is_user_message must be a boolean');
    
    // Validate created_at format (should be ISO string)
    if (message.created_at) {
      try {
        new Date(message.created_at).toISOString();
      } catch (e) {
        errors.push('created_at must be a valid date in ISO format');
      }
    }
    
    // Check legal_sources structure if present
    if (message.legal_sources) {
      if (typeof message.legal_sources !== 'object') {
        errors.push('legal_sources must be an object');
      } else {
        if (message.legal_sources.case_law && !Array.isArray(message.legal_sources.case_law)) {
          errors.push('legal_sources.case_law must be an array');
        }
        if (message.legal_sources.statutes && !Array.isArray(message.legal_sources.statutes)) {
          errors.push('legal_sources.statutes must be an array');
        }
      }
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  };

  const sanitizeLegalSources = (sources: any): any | null => {
    if (!sources) return null;
    
    try {
      // First make sure it's an object
      if (typeof sources !== 'object') return null;
      
      // Create sanitized structure with only the expected fields
      const sanitized = {
        case_law: [],
        statutes: []
      };
      
      // Process case_law if it exists
      if (Array.isArray(sources.case_law)) {
        sanitized.case_law = sources.case_law.map(caseItem => {
          // Ensure each case has only expected fields with valid types
          return {
            id: String(caseItem.id || ''),
            name: String(caseItem.name || ''),
            citation: String(caseItem.citation || ''),
            court: String(caseItem.court || ''),
            decision_date: String(caseItem.decision_date || ''),
            jurisdiction: String(caseItem.jurisdiction || ''),
            summary: caseItem.summary ? String(caseItem.summary) : undefined,
            relevance: typeof caseItem.relevance === 'number' ? caseItem.relevance : 0.5
          };
        });
      }
      
      // Process statutes if they exist
      if (Array.isArray(sources.statutes)) {
        sanitized.statutes = sources.statutes.map(statute => {
          // Ensure each statute has only expected fields with valid types
          return {
            id: String(statute.id || ''),
            title: String(statute.title || ''),
            code: String(statute.code || ''),
            section: String(statute.section || ''),
            jurisdiction: String(statute.jurisdiction || ''),
            content: String(statute.content || ''),
            relevance: typeof statute.relevance === 'number' ? statute.relevance : 0.5
          };
        });
      }
      
      // Only return if there's actual data
      if (sanitized.case_law.length === 0 && sanitized.statutes.length === 0) {
        return null;
      }
      
      return sanitized;
    } catch (error) {
      console.error('Error sanitizing legal sources:', error);
      return null;
    }
  };

  const saveMessage = async (message: ChatMessage, retryCount = 0): Promise<boolean> => {
    try {
      // Extract fields that don't exist in the database schema
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
    } catch (error: any) {
      // Log detailed error information
      console.error('Error saving message:', {
        error: error.message || error,
        status: error.status || 'Unknown',
        statusText: error.statusText || 'Unknown',
        details: error.details || 'No details'
      });
      
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
    
    if (!messageInput.trim() || !user) return;
    
    const userMessage: ChatMessage = {
      user_id: user.id,
      content: messageInput,
      is_user_message: true,
      created_at: new Date().toISOString()
    };
    
    // Add user message to state
    setMessages((prev) => [...prev, userMessage]);
    
    // Save user message to database
    const userMessageSaved = await saveMessage(userMessage);
    if (!userMessageSaved) {
      setSaveFailed(true);
      setTimeout(() => setSaveFailed(false), 3000); // Hide after 3 seconds
    }
    
    // Clear input
    setMessageInput('');
    
    // Set processing state
    setProcessing(true);
    
    try {
      // Get AI response based on mode selection
      let aiResponseText;
      let legalSources = undefined;
      
      if (legalMode) {
        // Use specialized legal advice function with real data
        try {
          // Call the legal advice API endpoint directly for better integration
          const response = await fetch('/api/legal-advice', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              query: userMessage.content,
              provider: aiProvider,
              jurisdiction
            }),
          });
          
          if (!response.ok) {
            throw new Error('Legal API request failed');
          }
          
          const data = await response.json();
          aiResponseText = data.advice;
          
          // Store legal sources if available
          if (data.legalData) {
            legalSources = {
              case_law: data.legalData.caseLaw,
              statutes: data.legalData.statutes
            };
          }
        } catch (apiError) {
          console.error('Legal API error:', apiError);
          // Fallback to direct function call
          aiResponseText = await getLegalAdvice(userMessage.content, aiProvider, jurisdiction);
        }
      } else {
        // Use regular AI response
        aiResponseText = await getAIResponse(userMessage.content, aiProvider);
      }
      
      const aiResponse: ChatMessage = {
        user_id: user.id,
        content: aiResponseText,
        is_user_message: false,
        created_at: new Date().toISOString(),
        ai_name: 'Juris'
        // legal_sources field removed since it doesn't exist in the database
      };
      
      // Add AI response to state
      setMessages((prev) => [...prev, aiResponse]);
      
      // Save AI response to database
      const aiResponseSaved = await saveMessage(aiResponse);
      if (!aiResponseSaved) {
        setSaveFailed(true);
        setTimeout(() => setSaveFailed(false), 3000); // Hide after 3 seconds
      }
      
      // If we have legal sources, store them in our local state with a temporary ID
      if (legalSources) {
        const sanitizedSources = sanitizeLegalSources(legalSources);
        if (sanitizedSources) {
          // Generate a temporary ID for the message that we can reference later
          const tempId = `temp-${Date.now()}`;
          
          // Store the sources with this ID
          setLegalSourcesMap(prev => ({
            ...prev,
            [tempId]: sanitizedSources
          }));
          
          // Also store the ID with the message for reference
          aiResponse.id = tempId;
          
          // Save to localStorage for persistence across page refreshes
          try {
            const storedSources = JSON.parse(localStorage.getItem('legalSources') || '{}');
            storedSources[tempId] = sanitizedSources;
            localStorage.setItem('legalSources', JSON.stringify(storedSources));
          } catch (storageError) {
            console.error('Failed to store legal sources in localStorage:', storageError);
          }
        }
      }
      
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      // Add error message
      const errorResponse: ChatMessage = {
        user_id: user.id,
        content: "Sorry, there was an error processing your request. Please try again.",
        is_user_message: false,
        created_at: new Date().toISOString(),
        ai_name: 'Juris'
      };
      
      setMessages((prev) => [...prev, errorResponse]);
      await saveMessage(errorResponse);
    } finally {
      setProcessing(false);
    }
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Debug function to check table structure
  const debugDatabaseSchema = async () => {
    try {
      console.log('Checking database schema...');
      
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
      
      // Check table permissions
      const { data: permissionData, error: permissionError } = await supabase
        .rpc('debug_table_permissions', { table_name: 'chat_messages' })
        .single();
      
      if (permissionError) {
        console.log('Could not check table permissions:', permissionError);
        
        // Fallback: manually test different operations
        const testOperations = async () => {
          console.log('Testing table operations manually...');
          
          // Test SELECT
          const { error: selectError } = await supabase
            .from('chat_messages')
            .select('id')
            .limit(1);
          
          console.log('SELECT permission:', selectError ? 'Denied' : 'Granted');
          
          // Log INSERT permission without actually inserting a test message
          console.log('INSERT permission: Not tested to avoid creating test messages');
        };
        
        await testOperations();
      } else {
        console.log('Table permissions:', permissionData);
      }
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

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Chat with Law Advisor</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center py-4">Please log in to use the chat feature.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex flex-row items-center justify-between">
          <CardTitle>Chat with Juris</CardTitle>
          <div className="flex items-center space-x-2">
            <Link href="/chat/history" className="text-sm text-blue-500 hover:underline mr-2">
              View History
            </Link>
            <Select value={aiProvider} onValueChange={(value) => setAiProvider(value as 'gemini' | 'mistral')}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select AI" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mistral">Mistral AI</SelectItem>
                <SelectItem value="gemini">Google Gemini</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center justify-between mt-4 border-t pt-2">
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
                <SelectTrigger className="w-[140px]" id="jurisdiction">
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
      <CardContent className="space-y-4">
        <div className="h-[400px] overflow-y-auto p-4 border rounded-lg">
          {loading ? (
            <p className="text-center py-4">Loading chat history...</p>
          ) : messages.length === 0 ? (
            <p className="text-center py-4">Start a conversation by sending a message.</p>
          ) : (
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={message.id || index}
                  className={`flex ${message.is_user_message ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      message.is_user_message
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    {!message.is_user_message && message.ai_name && (
                      <div className="text-xs font-semibold mb-1 text-gray-500">
                        {message.ai_name}
                      </div>
                    )}
                    <p className="whitespace-pre-line">{message.content}</p>
                    
                    {/* Display legal sources from our local state map instead of the message object */}
                    {!message.is_user_message && showSources && message.id && legalSourcesMap[message.id] && (
                      <div className="mt-3 pt-2 border-t border-gray-300 text-sm">
                        <p className="font-semibold">Legal Sources:</p>
                        
                        {legalSourcesMap[message.id].case_law && legalSourcesMap[message.id].case_law.length > 0 && (
                          <div className="mt-1">
                            <p className="font-medium">Cases:</p>
                            <ul className="list-disc pl-4">
                              {legalSourcesMap[message.id].case_law.map((caseItem: any, idx: number) => (
                                <li key={idx} className="text-xs">
                                  {caseItem.name} ({caseItem.decision_date})
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {legalSourcesMap[message.id].statutes && legalSourcesMap[message.id].statutes.length > 0 && (
                          <div className="mt-1">
                            <p className="font-medium">Statutes:</p>
                            <ul className="list-disc pl-4">
                              {legalSourcesMap[message.id].statutes.map((statute: any, idx: number) => (
                                <li key={idx} className="text-xs">
                                  {statute.title}, {statute.section}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                    
                    <p className="text-xs opacity-70 mt-1">
                      {new Date(message.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <form onSubmit={handleSendMessage} className="w-full flex space-x-2">
          <Input
            placeholder={legalMode ? "Ask your legal question..." : "Type your message..."}
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            disabled={loading || processing}
            className="flex-1"
          />
          <Button type="submit" disabled={loading || processing || !messageInput.trim()}>
            {processing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Send'
            )}
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
} 