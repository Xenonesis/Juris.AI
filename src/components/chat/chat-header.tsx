'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCcw, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatHeaderProps {
  messages: any[];
  aiProvider: string;
  showSettings: boolean;
  onNewChat: () => void;
  onToggleSettings: () => void;
}

export function ChatHeader({ 
  messages, 
  aiProvider, 
  showSettings, 
  onNewChat, 
  onToggleSettings 
}: ChatHeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur-md shadow-sm"
    >
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className="hover:bg-primary/10 hover:border-primary/30 transition-all duration-200"
            onClick={onNewChat}
          >
            <RefreshCcw className="h-4 w-4 mr-2" />
            New Chat
          </Button>

          {messages.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                {aiProvider.charAt(0).toUpperCase() + aiProvider.slice(1)} AI
              </Badge>
            </motion.div>
          )}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleSettings}
          className={cn(
            "flex items-center gap-2 hover:bg-muted/50 transition-all duration-200",
            showSettings && "bg-muted/50"
          )}
        >
          Settings
          <motion.div
            animate={{ rotate: showSettings ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="h-3 w-3" />
          </motion.div>
        </Button>
      </div>
    </motion.header>
  );
}
