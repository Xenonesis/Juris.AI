'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Settings2, Sparkles, Key } from 'lucide-react';
import { ChatComponent } from '@/components/chat/chat-component';
import { Badge } from '@/components/ui/badge';

export function ChatContainer() {
  const [shouldShowHero, setShouldShowHero] = useState(true);
  const [legalMode, setLegalMode] = useState(true);
  const [jurisdiction, setJurisdiction] = useState('general');
  const [aiProvider, setAiProvider] = useState<'gemini' | 'mistral'>('mistral');
  const [showSources, setShowSources] = useState(false);

  return (
    <div className="flex flex-col h-full">
      {/* Settings bar */}
      <div className="flex items-center justify-between gap-2 px-4 py-2 border-b">
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center gap-1">
                <Settings2 className="h-4 w-4 mr-1" />
                Settings
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <h4 className="font-medium text-sm">Chat Settings</h4>
                
                <div className="grid gap-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="legal-mode-switch" className="text-sm">Legal Advice Mode</Label>
                    <Switch 
                      id="legal-mode-switch" 
                      checked={legalMode}
                      onCheckedChange={setLegalMode}
                    />
                  </div>
                  
                  {legalMode && (
                    <>
                      <div className="grid gap-2">
                        <Label htmlFor="jurisdiction-select" className="text-sm">Jurisdiction</Label>
                        <Select 
                          value={jurisdiction} 
                          onValueChange={setJurisdiction}
                        >
                          <SelectTrigger id="jurisdiction-select">
                            <SelectValue placeholder="Select jurisdiction" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">General</SelectItem>
                            <SelectItem value="us">United States</SelectItem>
                            <SelectItem value="uk">United Kingdom</SelectItem>
                            <SelectItem value="eu">European Union</SelectItem>
                            <SelectItem value="canada">Canada</SelectItem>
                            <SelectItem value="australia">Australia</SelectItem>
                            <SelectItem value="in">India</SelectItem>
                            <SelectItem value="np">Nepal</SelectItem>
                            <SelectItem value="cn">China</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label htmlFor="show-sources-switch" className="text-sm">Show Legal Sources</Label>
                        <Switch 
                          id="show-sources-switch" 
                          checked={showSources}
                          onCheckedChange={setShowSources}
                        />
                      </div>
                    </>
                  )}
                  
                  <div className="grid gap-2">
                    <Label htmlFor="ai-provider-select" className="text-sm">AI Provider</Label>
                    <Select 
                      value={aiProvider} 
                      onValueChange={(value) => setAiProvider(value as 'gemini' | 'mistral')}
                    >
                      <SelectTrigger id="ai-provider-select">
                        <SelectValue placeholder="Select AI provider" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mistral">Mistral AI</SelectItem>
                        <SelectItem value="gemini">Google Gemini</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
          {legalMode && jurisdiction !== "general" && (
            <Badge variant="outline" className="text-xs">
              {jurisdiction === "us" ? "🇺🇸" : 
               jurisdiction === "uk" ? "🇬🇧" : 
               jurisdiction === "eu" ? "🇪🇺" :
               jurisdiction === "canada" ? "🇨🇦" :
               jurisdiction === "australia" ? "🇦🇺" :
               jurisdiction === "in" ? "🇮🇳" :
               jurisdiction === "np" ? "🇳🇵" :
               jurisdiction === "cn" ? "🇨🇳" : ""}
              {jurisdiction === "us" ? "US" : 
               jurisdiction === "uk" ? "UK" : 
               jurisdiction === "eu" ? "EU" :
               jurisdiction === "canada" ? "Canada" :
               jurisdiction === "australia" ? "Australia" :
               jurisdiction === "in" ? "India" :
               jurisdiction === "np" ? "Nepal" :
               jurisdiction === "cn" ? "China" : jurisdiction}
            </Badge>
          )}
          
          {legalMode && (
            <Badge variant="secondary" className="text-xs gap-1">
              <Sparkles className="h-3 w-3" />
              Legal Mode
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs gap-1">
            <Key className="h-3 w-3" />
            {aiProvider.charAt(0).toUpperCase() + aiProvider.slice(1)} AI
          </Badge>
        </div>
      </div>
      
      {/* Hero section (conditionally rendered) */}
      {shouldShowHero && (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <Sparkles className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-3">Juris AI Assistant</h1>
          <p className="text-muted-foreground mb-6 max-w-md">
            Get expert legal advice across multiple jurisdictions from an AI-powered legal assistant.
          </p>
          <Button 
            onClick={() => setShouldShowHero(false)}
            className="mb-2"
          >
            Start Conversation
          </Button>
          <p className="text-xs text-muted-foreground max-w-sm mt-4">
            Information provided is for general purposes only and does not constitute legal advice.
          </p>
        </div>
      )}
      
      {/* Chat component - we don't pass props directly since the original ChatComponent doesn't accept them */}
      {!shouldShowHero && (
        <div className="flex-1">
          {/* Instead of modifying ChatComponent, we'd need to wrap it and use context or global state */}
          {/* For now, we'll render the original ChatComponent which has its own state management */}
          <ChatComponent />
        </div>
      )}
    </div>
  );
}
