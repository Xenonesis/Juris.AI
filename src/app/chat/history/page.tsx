'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import {
  MessageCircle,
  Calendar,
  User,
  Bot,
  Loader2,
  AlertCircle,
  Play,
  Trash2,
  MoreHorizontal
} from 'lucide-react';

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
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [deletingSession, setDeletingSession] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        setError(null);
        const supabase = createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError) {
          console.error('Auth error:', authError);
          setError('Failed to authenticate. Please try logging in again.');
          return;
        }

        setUser(user);

        if (user) {
          await fetchChatHistory(user.id);
        }
      } catch (err) {
        console.error('Error fetching user:', err);
        setError('An unexpected error occurred. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  const fetchChatHistory = async (userId: string) => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Database error:', error);
        setError('Failed to load chat history. Please try again.');
        return;
      }

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
      setError('An unexpected error occurred while loading chat history.');
    }
  };

  const handleContinueChat = (sessionDate: string) => {
    // Navigate to chat page with session parameter
    router.push(`/chat?session=${sessionDate}`);
  };

  const handleDeleteSession = async (sessionDate: string) => {
    if (!user) return;

    setDeletingSession(sessionDate);

    try {
      const supabase = createClient();

      // Delete all messages from this date
      const startOfDay = new Date(sessionDate);
      const endOfDay = new Date(sessionDate);
      endOfDay.setDate(endOfDay.getDate() + 1);

      const { error } = await supabase
        .from('chat_messages')
        .delete()
        .eq('user_id', user.id)
        .gte('created_at', startOfDay.toISOString())
        .lt('created_at', endOfDay.toISOString());

      if (error) {
        console.error('Error deleting session:', error);
        setError('Failed to delete chat session. Please try again.');
        return;
      }

      // Remove the session from local state
      setChatSessions(prev => prev.filter(session => session.date !== sessionDate));

    } catch (error) {
      console.error('Error deleting session:', error);
      setError('An unexpected error occurred while deleting the session.');
    } finally {
      setDeletingSession(null);
    }
  };

  if (loading) {
    return (
      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-muted/50 shadow-lg">
              <CardContent className="py-12">
                <div className="flex flex-col items-center space-y-4">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-center text-muted-foreground">Loading chat history...</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-red-200 dark:border-red-800 shadow-lg">
              <CardContent className="py-12">
                <div className="flex flex-col items-center space-y-4">
                  <AlertCircle className="h-8 w-8 text-red-500" />
                  <p className="text-center text-red-600 dark:text-red-400">{error}</p>
                  <Button
                    onClick={() => window.location.reload()}
                    variant="outline"
                    className="border-red-200 dark:border-red-800"
                  >
                    Try Again
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-muted/50 shadow-lg">
              <CardContent className="py-12">
                <div className="flex flex-col items-center space-y-4">
                  <User className="h-8 w-8 text-muted-foreground" />
                  <p className="text-center text-muted-foreground">Please log in to view your chat history.</p>
                  <Button asChild>
                    <Link href="/auth/login">Log In</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex justify-between items-center"
        >
          <div className="space-y-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              Chat History
            </h1>
            <p className="text-muted-foreground">
              Review your previous conversations with Juris AI
            </p>
          </div>
          <Button asChild className="bg-primary hover:bg-primary/90">
            <Link href="/chat">
              <MessageCircle className="h-4 w-4 mr-2" />
              New Chat
            </Link>
          </Button>
        </motion.div>

        {chatSessions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-muted/50 shadow-lg">
              <CardContent className="py-12">
                <div className="flex flex-col items-center space-y-4">
                  <MessageCircle className="h-12 w-12 text-muted-foreground/50" />
                  <div className="text-center space-y-2">
                    <p className="text-lg font-medium">No chat history found</p>
                    <p className="text-muted-foreground">Start a new conversation to see your chat history here!</p>
                  </div>
                  <Button asChild>
                    <Link href="/chat">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Start Chatting
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {chatSessions.map((session, index) => (
              <motion.div
                key={session.date}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card className="border-muted/50 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="bg-gradient-to-r from-muted/30 to-muted/10">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Calendar className="h-5 w-5 text-primary" />
                      {format(new Date(session.date), 'MMMM d, yyyy')}
                      <Badge variant="outline" className="ml-auto">
                        {session.messages.length} messages
                      </Badge>
                    </CardTitle>

                    {/* Session Actions */}
                    <div className="flex items-center gap-2 mt-3">
                      <Button
                        onClick={() => handleContinueChat(session.date)}
                        size="sm"
                        className="bg-primary hover:bg-primary/90 text-primary-foreground"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Continue Chat
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950"
                            disabled={deletingSession === session.date}
                          >
                            {deletingSession === session.date ? (
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4 mr-2" />
                            )}
                            Delete Session
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Chat Session</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this entire chat session from{' '}
                              <strong>{format(new Date(session.date), 'MMMM d, yyyy')}</strong>?
                              This will permanently remove all {session.messages.length} messages from this date.
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteSession(session.date)}
                              className="bg-red-600 hover:bg-red-700 text-white"
                            >
                              Delete Session
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {session.messages.map((message, msgIndex) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, x: message.is_user_message ? 20 : -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.05 * msgIndex }}
                          className={`flex items-start gap-3 ${message.is_user_message ? 'flex-row-reverse' : 'flex-row'}`}
                        >
                          {/* Avatar */}
                          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                            message.is_user_message
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-muted-foreground'
                          }`}>
                            {message.is_user_message ? (
                              <User className="h-4 w-4" />
                            ) : (
                              <Bot className="h-4 w-4" />
                            )}
                          </div>

                          {/* Message Content */}
                          <div className={`flex-1 max-w-[80%] ${message.is_user_message ? 'mr-4' : 'ml-4'}`}>
                            {!message.is_user_message && message.ai_name && (
                              <Badge variant="outline" className="mb-2 text-xs">
                                {message.ai_name.charAt(0).toUpperCase() + message.ai_name.slice(1)} AI
                              </Badge>
                            )}
                            <div
                              className={`rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                                message.is_user_message
                                  ? 'bg-gradient-to-br from-primary to-primary/90 text-primary-foreground'
                                  : 'bg-gradient-to-br from-muted/50 to-muted/30 border border-muted/50'
                              }`}
                            >
                              <p className="whitespace-pre-line break-words">{message.content}</p>
                              <p className={`text-xs mt-2 ${
                                message.is_user_message ? 'text-primary-foreground/70' : 'text-muted-foreground'
                              }`}>
                                {format(new Date(message.created_at), 'h:mm a')}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}