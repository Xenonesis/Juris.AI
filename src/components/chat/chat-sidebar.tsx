"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from "next/link";
import { Plus, Settings, History, Scale, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';

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

export function ChatSidebar() {
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [recentSessions, setRecentSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      console.log('ChatSidebar - User:', user?.id);
      setUser(user);

      if (user) {
        loadRecentSessions(user.id);
      } else {
        console.log('ChatSidebar - No user found');
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const loadRecentSessions = async (userId: string) => {
    if (!userId) return;

    try {
      const supabase = createClient();
      
      // Get recent messages from the last 7 days
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

      console.log('Fetched messages:', messages?.length || 0, messages);

      if (messages && messages.length > 0) {
        // Group messages by date
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

        // Convert to array and sort by date (most recent first)
        const sessions = Array.from(sessionMap.values())
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 3); // Show only the 3 most recent sessions

        setRecentSessions(sessions);
      }
    } catch (error) {
      console.error('Error loading recent sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSessionTitle = (session: ChatSession) => {
    // Find the first user message to use as title
    const firstUserMessage = session.messages
      .filter(msg => msg.is_user_message === true)
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())[0];

    if (firstUserMessage) {
      // Truncate and clean the message for display
      const title = firstUserMessage.content
        .replace(/[#*`]/g, '') // Remove markdown
        .trim()
        .substring(0, 30);
      return title.length < firstUserMessage.content.length ? `${title}...` : title;
    }

    return 'Untitled Chat';
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays === 1) {
        return '1 day ago';
      } else if (diffInDays < 7) {
        return `${diffInDays} days ago`;
      } else {
        return format(date, 'MMM d');
      }
    }
  };

  const handleSessionClick = (session: ChatSession) => {
    // Navigate to chat with session parameter
    const sessionDate = format(new Date(session.date), 'yyyy-MM-dd');
    window.location.href = `/chat?session=${sessionDate}`;
  };

  return (
    <div className="w-[280px] border-r border-muted/20 bg-gradient-to-b from-card/80 to-card/60 backdrop-blur-md hidden md:flex md:flex-col shadow-xl">
      <div className="flex items-center justify-between p-6 border-b border-muted/20">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/25">
            <Scale className="h-5 w-5 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            Juris AI
          </h1>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-primary/10 hover:scale-105 transition-all duration-200 rounded-xl"
          asChild
        >
          <Link href="/chat">
            <Plus className="h-4 w-4" />
            <span className="sr-only">New chat</span>
          </Link>
        </Button>
      </div>

      <div className="flex-1 overflow-auto p-6 pt-4 scrollbar-thin scrollbar-thumb-muted/30 scrollbar-track-transparent">
        <div className="space-y-3">
          <Button
            variant="ghost"
            className="w-full justify-start hover:bg-primary/10 hover:text-primary transition-all duration-200 rounded-xl group"
            asChild
          >
            <Link href="/chat/history">
              <History className="mr-3 h-4 w-4 group-hover:scale-110 transition-transform" />
              Chat History
            </Link>
          </Button>

          <div className="pt-4 space-y-3">
            <p className="text-xs font-medium text-muted-foreground px-3 pb-1 uppercase tracking-wider">
              Recent Conversations
            </p>
            
            {loading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-3 rounded-xl bg-muted/20 animate-pulse">
                    <div className="h-4 bg-muted/40 rounded mb-2"></div>
                    <div className="h-3 bg-muted/30 rounded w-20"></div>
                  </div>
                ))}
              </div>
            ) : recentSessions.length > 0 ? (
              <div className="space-y-2">
                {recentSessions.map((session, index) => (
                  <div
                    key={session.date}
                    onClick={() => handleSessionClick(session)}
                    className={`p-3 rounded-xl border transition-all duration-200 cursor-pointer group ${
                      index === 0 
                        ? 'bg-gradient-to-r from-muted/40 to-muted/20 border-muted/30 hover:border-muted/50'
                        : index === 1
                        ? 'bg-gradient-to-r from-muted/30 to-muted/15 border-muted/20 hover:border-muted/40'
                        : 'bg-gradient-to-r from-muted/25 to-muted/10 border-muted/15 hover:border-muted/35'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium group-hover:text-primary transition-colors truncate">
                          {getSessionTitle(session)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {getRelativeTime(session.date)} • {session.messages.length} messages
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center">
                <MessageSquare className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No recent conversations</p>
                <p className="text-xs text-muted-foreground/70 mt-1">Start a new chat to see your history</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-muted/20 bg-gradient-to-t from-muted/10 to-transparent">
        <Button
          variant="outline"
          className="w-full justify-start hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-all duration-200 rounded-xl group"
          asChild
        >
          <Link href="/profile">
            <Settings className="mr-3 h-4 w-4 group-hover:rotate-90 transition-transform duration-300" />
            Settings
          </Link>
        </Button>
      </div>
    </div>
  );
}
