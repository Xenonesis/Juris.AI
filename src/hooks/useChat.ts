'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
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

interface LegalSources {
  case_law?: any[];
  statutes?: any[];
}

export function useChat() {
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

  const loadUserApiKeys = async (userId: string) => {
    if (!userId) return;
    
    try {
      const apiKeys = await getUserApiKeys(userId);
      setUserApiKeys(apiKeys);
    } catch (error) {
      console.error('Error loading user API keys:', error);
    }
  };

  useEffect(() => {
    try {
      const storedSources = localStorage.getItem('legalSources');
      if (storedSources) {
        setLegalSourcesMap(JSON.parse(storedSources));
      }
      
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
      
      return true;
    } catch (error) {
      console.error('Error saving message:', error);
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
    
    const hasApiKey = !!userApiKeys[aiProvider];
    
    if (!hasApiKey && aiProvider !== 'mistral') {
      setMissingApiKeyWarning(true);
      setTimeout(() => setMissingApiKeyWarning(false), 5000);
    }
    
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
    
    try {
      if (!user) {
        throw new Error('You must be logged in to send messages');
      }
      
      const userMessage: ChatMessage = {
        id: `temp-${Date.now()}`,
        user_id: user.id,
        content: currentInput,
        is_user_message: true,
        created_at: new Date().toISOString(),
      };
      
      setMessages(prevMessages => [...prevMessages, userMessage]);
      
      const tempAiMessageId = `temp-ai-${Date.now()}`;
      
      const tempAiMessage: ChatMessage = {
        id: tempAiMessageId,
        user_id: user.id,
        content: '',
        is_user_message: false,
        created_at: new Date().toISOString(),
        ai_name: aiProvider,
      };
      
      setMessages(prevMessages => [...prevMessages, tempAiMessage]);
      
      let aiResponse;
      
      if (legalMode) {
        aiResponse = await getLegalAdvice(currentInput, aiProvider, jurisdiction);
      } else {
        aiResponse = await getAIResponse(currentInput, aiProvider, userApiKeys);
      }
      
      const aiMessage: ChatMessage = {
        id: tempAiMessageId,
        user_id: user.id,
        content: aiResponse,
        is_user_message: false,
        created_at: new Date().toISOString(),
        ai_name: aiProvider,
      };
      
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === tempAiMessageId ? aiMessage : msg
        )
      );
      
      const userSaveSuccess = await saveMessage(userMessage);
      const aiSaveSuccess = await saveMessage(aiMessage);
      
      if (!userSaveSuccess || !aiSaveSuccess) {
        setSaveFailed(true);
        setTimeout(() => setSaveFailed(false), 5000);
      }
      
    } catch (error) {
      console.error('Error sending message:', error);
      
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

    try {
      localStorage.setItem('messageReactions', JSON.stringify(updatedReactions));
    } catch (error) {
      console.error('Error saving reactions to localStorage:', error);
    }
  };

  const handleRegenerateMessage = async (messageId: string) => {
    if (!user || processing || regeneratingMessageId) return;

    const messageIndex = messages.findIndex(msg => msg.id === messageId);
    if (messageIndex === -1) return;

    const messageToRegenerate = messages[messageIndex];
    if (messageToRegenerate.is_user_message) return;

    let userMessageIndex = messageIndex - 1;
    while (userMessageIndex >= 0 && !messages[userMessageIndex].is_user_message) {
      userMessageIndex--;
    }

    if (userMessageIndex < 0) return;

    const userMessage = messages[userMessageIndex];

    setRegeneratingMessageId(messageId);
    setProcessing(true);
    setIsTyping(true);

    try {
      let aiResponse;
      if (legalMode) {
        aiResponse = await getLegalAdvice(userMessage.content, aiProvider, jurisdiction);
      } else {
        aiResponse = await getAIResponse(userMessage.content, aiProvider, userApiKeys);
      }

      const newAiMessage: ChatMessage = {
        id: messageId,
        user_id: user.id,
        content: aiResponse,
        is_user_message: false,
        created_at: new Date().toISOString(),
        ai_name: aiProvider,
      };

      const updatedMessages = [...messages];
      updatedMessages[messageIndex] = newAiMessage;
      setMessages(updatedMessages);

      await saveMessage(newAiMessage);

    } catch (error) {
      console.error('Error regenerating message:', error);

      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        user_id: user.id,
        content: 'Sorry, there was an error regenerating the response. Please try again.',
        is_user_message: false,
        created_at: new Date().toISOString(),
      };

      const updatedMessages = [...messages];
      updatedMessages[messageIndex] = errorMessage;
      setMessages(updatedMessages);
    } finally {
      setProcessing(false);
      setIsTyping(false);
      setRegeneratingMessageId(null);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleNewChat = () => {
    setMessages([]);
  };

  return {
    user,
    loading,
    processing,
    messages,
    messageInput,
    setMessageInput,
    aiProvider,
    setAiProvider,
    legalMode,
    setLegalMode,
    jurisdiction,
    setJurisdiction,
    showSources,
    setShowSources,
    saveFailed,
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
  };
}
