'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

interface ChatSession {
  date: string;
  messages: Array<{
    id?: string;
    user_id: string;
    content: string;
    is_user_message: boolean;
    created_at: string;
    ai_name?: string;
  }>;
}

export function useChatSidebar() {
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [recentSessions, setRecentSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        loadRecentSessions(user.id);
      } else {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const loadRecentSessions = async (userId: string) => {
    if (!userId) return;

    try {
      const supabase = createClient();
      
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data: messages, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', sevenDaysAgo.toISOString())
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error loading recent sessions:', error);
        return;
      }

      if (messages && messages.length > 0) {
        const sessionMap = new Map<string, ChatSession>();

        messages.forEach((message) => {
          const messageDate = new Date(message.created_at);
          const dateKey = messageDate.toDateString();

          if (!sessionMap.has(dateKey)) {
            sessionMap.set(dateKey, {
              date: dateKey,
              messages: []
            });
          }

          sessionMap.get(dateKey)!.messages.push(message);
        });

        const sessions = Array.from(sessionMap.values())
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 3);

        setRecentSessions(sessions);
      }
    } catch (error) {
      console.error('Error loading recent sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSessionClick = (session: ChatSession) => {
    const sessionDate = new Date(session.date).toISOString().split('T')[0];
    window.location.href = `/chat?session=${sessionDate}`;
  };

  return {
    user,
    recentSessions,
    loading,
    handleSessionClick
  };
}
