import { ChatClientWrapper } from "@/components/chat/chat-client-wrapper";
import Link from "next/link";
import { Plus, Settings, History, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import "./chat.css";

export default function ChatPage() {
  return (
    <div className="flex h-[100dvh] overflow-hidden bg-gradient-to-br from-background via-background to-muted/5">
      {/* Enhanced Sidebar */}
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
              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-gradient-to-r from-muted/40 to-muted/20 border border-muted/30 hover:border-muted/50 transition-all duration-200 cursor-pointer group">
                  <p className="text-sm font-medium group-hover:text-primary transition-colors">Contract Review</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-r from-muted/30 to-muted/15 border border-muted/20 hover:border-muted/40 transition-all duration-200 cursor-pointer group">
                  <p className="text-sm font-medium group-hover:text-primary transition-colors">Tenant Rights</p>
                  <p className="text-xs text-muted-foreground">1 day ago</p>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-r from-muted/25 to-muted/10 border border-muted/15 hover:border-muted/35 transition-all duration-200 cursor-pointer group">
                  <p className="text-sm font-medium group-hover:text-primary transition-colors">Business Formation</p>
                  <p className="text-xs text-muted-foreground">3 days ago</p>
                </div>
              </div>
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

      {/* Enhanced Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-gradient-to-br from-background/50 to-background">
        <ChatClientWrapper />
      </div>
    </div>
  );
}