'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ModelsDropdown } from '@/components/ui/models-dropdown';

interface ChatSettingsProps {
  showSettings: boolean;
  aiProvider: 'gemini' | 'mistral' | 'openai' | 'anthropic' | 'openrouter' | 'cohere' | 'together' | 'huggingface' | 'replicate' | 'custom';
  setAiProvider: (provider: 'gemini' | 'mistral' | 'openai' | 'anthropic' | 'openrouter' | 'cohere' | 'together' | 'huggingface' | 'replicate' | 'custom') => void;
  selectedModel?: string;
  setSelectedModel?: (model: string) => void;
  legalMode: boolean;
  setLegalMode: (enabled: boolean) => void;
  showSources: boolean;
  setShowSources: (show: boolean) => void;
  jurisdiction: string;
  setJurisdiction: (jurisdiction: string) => void;
  userApiKeys?: Record<string, string>;
}

export function ChatSettings({
  showSettings,
  aiProvider,
  setAiProvider,
  selectedModel,
  setSelectedModel,
  legalMode,
  setLegalMode,
  showSources,
  setShowSources,
  jurisdiction,
  setJurisdiction,
  userApiKeys = {}
}: ChatSettingsProps) {
  return (
    <AnimatePresence>
      {showSettings && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="border-b bg-gradient-to-r from-muted/30 to-muted/20 overflow-hidden"
        >
          <div className="p-4 space-y-4">
            <div className="grid gap-4 md:grid-cols-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-2"
              >
                <Label htmlFor="ai-provider-select" className="text-sm font-medium">AI Provider</Label>
                <Select
                  value={aiProvider}
                  onValueChange={(value) => setAiProvider(value as 'gemini' | 'mistral' | 'openai' | 'anthropic' | 'openrouter' | 'cohere' | 'together' | 'huggingface' | 'replicate' | 'custom')}
                >
                  <SelectTrigger id="ai-provider-select" className="h-9 bg-background/50">
                    <SelectValue placeholder="Select AI provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="openai">OpenAI</SelectItem>
                    <SelectItem value="anthropic">Anthropic</SelectItem>
                    <SelectItem value="gemini">Google Gemini</SelectItem>
                    <SelectItem value="mistral">Mistral AI</SelectItem>
                    <SelectItem value="cohere">Cohere</SelectItem>
                    <SelectItem value="together">Together AI</SelectItem>
                    <SelectItem value="openrouter">OpenRouter</SelectItem>
                    <SelectItem value="huggingface">Hugging Face</SelectItem>
                    <SelectItem value="replicate">Replicate</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
                className="space-y-2"
              >
                <Label className="text-sm font-medium">Model</Label>
                <ModelsDropdown
                  provider={aiProvider}
                  apiKey={userApiKeys[aiProvider]}
                  value={selectedModel}
                  onValueChange={setSelectedModel}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-3"
              >
                <div className="flex items-center justify-between">
                  <Label htmlFor="legal-mode" className="text-sm font-medium">Legal Mode</Label>
                  <Switch
                    id="legal-mode"
                    checked={legalMode}
                    onCheckedChange={setLegalMode}
                  />
                </div>

                <AnimatePresence>
                  {legalMode && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center justify-between"
                    >
                      <Label htmlFor="show-sources" className="text-sm font-medium">Show Sources</Label>
                      <Switch
                        id="show-sources"
                        checked={showSources}
                        onCheckedChange={setShowSources}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              <AnimatePresence>
                {legalMode && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-2"
                  >
                    <Label htmlFor="jurisdiction-select" className="text-sm font-medium">Jurisdiction</Label>
                    <Select value={jurisdiction} onValueChange={setJurisdiction}>
                      <SelectTrigger id="jurisdiction-select" className="h-9 bg-background/50">
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
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
