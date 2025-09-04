'use client';

import { useChatSidebar } from '@/hooks/useChatSidebar';
import { SidebarHeader } from './sidebar-header';
import { RecentSessions } from './recent-sessions';
import { SidebarFooter } from './sidebar-footer';

export function ChatSidebar() {
  const { user, recentSessions, loading, handleSessionClick } = useChatSidebar();

  return (
    <div className="w-[280px] border-r border-muted/20 bg-gradient-to-b from-card/80 to-card/60 backdrop-blur-md hidden md:flex md:flex-col shadow-xl">
      <SidebarHeader />
      
      <RecentSessions
        loading={loading}
        recentSessions={recentSessions}
        onSessionClick={handleSessionClick}
      />

      <SidebarFooter />
    </div>
  );
}
