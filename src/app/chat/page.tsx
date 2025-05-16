import { ChatComponent } from "@/components/chat/chat-component";
import Link from "next/link";
import { MessageCircle, History, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ChatPage() {
  return (
    <div className="container max-w-6xl mx-auto py-6 md:py-12 px-4">
      <div className="flex flex-col space-y-6">
        <div className="grid gap-6 md:flex md:justify-between md:items-start">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-6 w-6 text-primary" />
              <h1 className="text-2xl md:text-3xl font-bold">Chat with Juris</h1>
            </div>
            <p className="text-muted-foreground max-w-lg">
              Get expert legal advice across multiple jurisdictions from an AI-powered legal advisor.
            </p>
            <div className="flex items-center mt-2 bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-400 rounded-lg p-3 text-sm">
              <AlertTriangle className="h-4 w-4 mr-2 flex-shrink-0" />
              <p className="text-xs md:text-sm">
                Information provided is for general purposes only and does not constitute legal advice.
              </p>
            </div>
          </div>
          <div className="flex-shrink-0">
            <Button variant="outline" className="flex items-center gap-2" asChild>
              <Link href="/chat/history">
                <History className="h-4 w-4" />
                <span>View Chat History</span>
              </Link>
            </Button>
          </div>
        </div>
        
        <div className="min-h-[calc(100vh-240px)]">
          <ChatComponent />
        </div>
      </div>
    </div>
  );
} 