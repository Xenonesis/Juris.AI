import { ChatClientWrapper } from "@/components/chat/chat-client-wrapper";
import Link from "next/link";
import { Plus, Settings, History, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ChatDemoPage() {
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
            <Link href="/chat-demo">
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
        <div className="flex-1 flex flex-col">
          {/* Demo Header */}
          <div className="border-b bg-background/95 backdrop-blur-md shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20">
                  Demo Mode
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Experience the enhanced chat interface
                </span>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/auth/login">
                  Sign In for Full Access
                </Link>
              </Button>
            </div>
          </div>
          
          {/* Demo Chat Interface */}
          <DemoChatInterface />
        </div>
      </div>
    </div>
  );
}

// Demo chat interface component
function DemoChatInterface() {
  return (
    <div className="flex-1 flex flex-col">
      {/* Demo Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {/* User Message */}
          <div className="flex items-start gap-3 flex-row-reverse">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/25 flex-shrink-0">
              <svg className="h-4 w-4 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="bg-gradient-to-br from-primary to-primary/90 text-primary-foreground rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm max-w-[85%] ml-12">
              What are the key requirements for starting a business in California?
            </div>
          </div>

          {/* AI Response with Regenerate Button */}
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-muted to-muted/80 flex items-center justify-center shadow-lg shadow-muted/25 flex-shrink-0">
              <svg className="h-4 w-4 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="relative flex-1 max-w-[85%] mr-12">
              <div className="mb-2">
                <span className="text-xs bg-background/50 backdrop-blur-sm border border-muted/50 rounded px-2 py-1">
                  Mistral AI
                </span>
              </div>
              <div className="bg-gradient-to-br from-muted/50 to-muted/30 text-foreground border border-muted/50 rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm">
                <div className="whitespace-pre-wrap break-words">
                  Starting a business in California requires several key steps and requirements:

                  **1. Choose a Business Structure**
                  - LLC (Limited Liability Company)
                  - Corporation (C-Corp or S-Corp)
                  - Partnership
                  - Sole Proprietorship

                  **2. Register Your Business Name**
                  - Check name availability with California Secretary of State
                  - File Articles of Incorporation/Organization
                  - Register DBA (Doing Business As) if needed

                  **3. Obtain Required Licenses and Permits**
                  - Business license from city/county
                  - State licenses for specific industries
                  - Federal licenses if applicable

                  **4. Tax Requirements**
                  - Federal EIN (Employer Identification Number)
                  - California State Tax ID
                  - Sales tax permit if selling goods

                  **5. Compliance Requirements**
                  - Workers' compensation insurance
                  - Unemployment insurance
                  - Disability insurance
                </div>
              </div>

              {/* Demo Action Buttons */}
              <div className="flex items-center gap-1 mt-2 opacity-100">
                <button className="h-7 w-7 p-0 rounded-full bg-background/80 backdrop-blur-sm border border-muted/50 hover:bg-background hover:border-muted flex items-center justify-center">
                  <svg className="h-3 w-3 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>

                <button className="h-7 w-7 p-0 rounded-full bg-background/80 backdrop-blur-sm border border-muted/50 hover:bg-background hover:border-muted hover:text-primary flex items-center justify-center transition-colors">
                  <svg className="h-3 w-3 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>

                <button className="h-7 w-7 p-0 rounded-full bg-background/80 backdrop-blur-sm border border-muted/50 hover:bg-background hover:border-muted flex items-center justify-center">
                  <svg className="h-3 w-3 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                  </svg>
                </button>

                <button className="h-7 w-7 p-0 rounded-full bg-background/80 backdrop-blur-sm border border-muted/50 hover:bg-background hover:border-muted flex items-center justify-center">
                  <svg className="h-3 w-3 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7.5 15h2.25m8.25-9.75H16.5l-2.25 2.25L16.5 9h1.75m-8.25 6.75h2.25m8.25-9.75H16.5l-2.25 2.25L16.5 9h1.75" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Input Area */}
      <div className="sticky bottom-0 bg-gradient-to-t from-background via-background/95 to-transparent pt-4 pb-4 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden border-2 border-muted/50 rounded-2xl bg-background/50 shadow-sm">
            <div className="relative">
              <div className="resize-none border-0 shadow-none bg-transparent pr-16 pl-4 py-4 text-sm leading-relaxed placeholder:text-muted-foreground/60 min-h-[56px]">
                <span className="text-muted-foreground/60">Ask a follow-up question...</span>
              </div>
              <div className="absolute right-2 bottom-2 flex items-center gap-1">
                <button className="h-9 w-9 p-0 rounded-full bg-muted text-muted-foreground flex items-center justify-center">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between px-4 py-2 border-t bg-muted/20 opacity-60">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>Press Enter to send, Shift+Enter for new line</span>
              </div>
              <span className="text-xs text-muted-foreground">0/4000</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
