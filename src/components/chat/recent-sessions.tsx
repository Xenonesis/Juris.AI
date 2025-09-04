'use client';

import Link from "next/link";
import { History, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

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

interface RecentSessionsProps {
  loading: boolean;
  recentSessions: ChatSession[];
  onSessionClick: (session: ChatSession) => void;
}

export function RecentSessions({ loading, recentSessions, onSessionClick }: RecentSessionsProps) {
  const getSessionTitle = (session: ChatSession) => {
    const firstUserMessage = session.messages
      .filter(msg => msg.is_user_message === true)
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())[0];

    if (firstUserMessage) {
      const title = firstUserMessage.content
        .replace(/[#*`]/g, '')
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
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }
    }
  };

  return (
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
                  onClick={() => onSessionClick(session)}
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
  );
}
