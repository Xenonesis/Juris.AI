import { ChatClientWrapper } from "@/components/chat/chat-client-wrapper";
import Link from "next/link";
import { Plus, Settings, History, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import "./chat.css";

export default function ChatPage() {
  return (
    <div className="flex h-[100dvh] overflow-hidden bg-gradient-to-br from-background via-background to-muted/10">
      {/* Enhanced Sidebar */}
      <div className="w-[280px] border-r border-muted/30 bg-card/50 backdrop-blur-sm hidden md:flex md:flex-col shadow-lg">
        <div className="flex items-center justify-between p-6 border-b border-muted/30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg professional-gradient flex items-center justify-center">
              <Scale className="h-4 w-4 text-white dark:text-white" style={{ filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.3))' }} />
            </div>
            <h1 className="text-xl font-semibold tracking-tight text-high-contrast">Juris AI</h1>
          </div>
          <Button variant="ghost" size="icon" className="hover:bg-primary/10" asChild>
            <Link href="/chat">
              <Plus className="h-4 w-4" />
              <span className="sr-only">New chat</span>
            </Link>
          </Button>
        </div>
        <div className="flex-1 overflow-auto p-6 pt-4 custom-scrollbar">
          <div className="space-y-2">
            <Button variant="ghost" className="w-full justify-start hover:bg-primary/10 transition-colors" asChild>
              <Link href="/chat/history">
                <History className="mr-3 h-4 w-4" />
                Chat History
              </Link>
            </Button>
            <div className="pt-4">
              <p className="text-xs text-muted-foreground px-3 pb-2">Recent Conversations</p>
              <div className="space-y-1">
                <div className="p-3 rounded-lg bg-muted/30 border border-muted/50">
                  <p className="text-sm font-medium">Contract Review</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/20 border border-muted/30">
                  <p className="text-sm font-medium">Tenant Rights</p>
                  <p className="text-xs text-muted-foreground">1 day ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 border-t">
          <Button variant="outline" className="w-full justify-start" asChild>
            <Link href="/profile">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </Button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <ChatClientWrapper />
      </div>
    </div>
  );
}