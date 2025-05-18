"use client";

import { useEffect } from 'react';
import { ModernChat } from './modern-chat';

export function ChatClientWrapper() {
  useEffect(() => {
    document.body.classList.add('chat-page');
    return () => {
      document.body.classList.remove('chat-page');
    };
  }, []);

  return <ModernChat />;
}
