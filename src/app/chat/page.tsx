import { ChatClientWrapper } from "@/components/chat/chat-client-wrapper";
import Link from "next/link";
import { Plus, Settings, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import "./chat.css";

export default function ChatPage() {
  return (
    <div className="flex h-[100dvh] overflow-hidden bg-muted/20 dark:bg-background">
      {/* Sidebar */}
      <div className="w-[260px] border-r bg-muted/10 dark:bg-muted/5 hidden md:flex md:flex-col">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-semibold tracking-tight">Juris AI</h1>
          <Button variant="ghost" size="icon" asChild>
            <Link href="/chat">
              <Plus className="h-4 w-4" />
              <span className="sr-only">New chat</span>
            </Link>
          </Button>
        </div>
        <div className="flex-1 overflow-auto p-4 pt-0">
          <div className="space-y-1">
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/chat/history">
                <History className="mr-2 h-4 w-4" />
                Chat History
              </Link>
            </Button>
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