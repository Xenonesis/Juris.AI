import { ChatComponent } from "@/components/chat/chat-component";
import Link from "next/link";

export default function ChatPage() {
  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Chat with Juris</h1>
            <p className="mt-2 text-gray-500">Get expert legal advice across multiple jurisdictions from an AI-powered legal advisor.</p>
            <p className="text-sm text-amber-600 mt-1">
              Disclaimer: Information provided is for general purposes only and does not constitute legal advice.
            </p>
          </div>
          <Link href="/chat/history" className="text-blue-500 hover:underline">View Chat History</Link>
        </div>
        <ChatComponent />
      </div>
    </div>
  );
} 