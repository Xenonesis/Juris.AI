'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import supabase from '@/lib/supabase';
import Link from 'next/link';
import { format } from 'date-fns';

interface ChatMessage {
  id: string;
  user_id: string;
  content: string;
  is_user_message: boolean;
  created_at: string;
  ai_name?: string;
}

interface ChatSession {
  date: string;
  messages: ChatMessage[];
}

export default function ChatHistoryPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);

  useEffect(() => {
    async function fetchUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        await fetchChatHistory(user.id);
      }
      
      setLoading(false);
    }
    
    fetchUser();
  }, []);

  const fetchChatHistory = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      
      if (data) {
        // Group messages by date (YYYY-MM-DD)
        const groupedByDate: Record<string, ChatMessage[]> = {};
        
        data.forEach((message: ChatMessage) => {
          const date = new Date(message.created_at).toISOString().split('T')[0];
          if (!groupedByDate[date]) {
            groupedByDate[date] = [];
          }
          groupedByDate[date].push(message);
        });
        
        // Convert to array of chat sessions
        const sessions = Object.entries(groupedByDate).map(([date, messages]) => ({
          date,
          messages
        })).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Sort by date, newest first
        
        setChatSessions(sessions);
      }
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  };

  if (loading) {
    return (
      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="py-10">
              <p className="text-center">Loading chat history...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="py-10">
              <p className="text-center">Please log in to view your chat history.</p>
              <div className="mt-4 flex justify-center">
                <Button asChild>
                  <Link href="/auth/login">Log In</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Juris Chat History</h1>
          <Button asChild>
            <Link href="/chat">New Chat</Link>
          </Button>
        </div>
        
        {chatSessions.length === 0 ? (
          <Card>
            <CardContent className="py-10">
              <p className="text-center">No chat history found. Start a new conversation!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {chatSessions.map((session) => (
              <Card key={session.date}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {format(new Date(session.date), 'MMMM d, yyyy')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {session.messages.map((message) => (
                      <div
                        key={message.id}
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
                          <p className="text-xs opacity-70 mt-1">
                            {format(new Date(message.created_at), 'h:mm a')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 