"use client";

import { useEffect, Suspense } from 'react';
import { ModernChat } from './modern-chat';
import { Loader2 } from 'lucide-react';

function ChatLoading() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading chat...</p>
      </div>
    </div>
  );
}

export function ChatClientWrapper() {
  useEffect(() => {
    document.body.classList.add('chat-page');
    return () => {
      document.body.classList.remove('chat-page');
    };
  }, []);

  return (
    <Suspense fallback={<ChatLoading />}>
      <ModernChat />
    </Suspense>
  );
}
