import { ChatClientWrapper } from "@/components/chat/chat-client-wrapper";
import { ChatSidebar } from "@/components/chat/chat-sidebar";
import "./chat.css";

export default function ChatPage() {
  return (
    <div className="flex h-[100dvh] overflow-hidden bg-gradient-to-br from-background via-background to-muted/5">
      <ChatSidebar />

      <div className="flex-1 flex flex-col h-full overflow-hidden bg-gradient-to-br from-background/50 to-background">
        <ChatClientWrapper />
      </div>
    </div>
  );
}
