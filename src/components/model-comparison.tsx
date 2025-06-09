"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { Bot, Copy, Check, Globe, ChevronDown, ChevronUp, Maximize2 } from "lucide-react";
import { cardHover } from "@/lib/motion";

interface ModelComparisonProps {
  results: {
    gpt: string | null;
    claude: string | null;
    gemini: string | null;
    mistral: string | null;
  };
  jurisdiction?: string;
}

import { localJurisdictions } from "./jurisdiction-select";

export function ModelComparison({ results, jurisdiction }: ModelComparisonProps) {
  const [activeModel, setActiveModel] = useState<"gpt" | "claude" | "gemini" | "mistral">("gpt");
  const [copied, setCopied] = useState(false);
  const [expandedModels, setExpandedModels] = useState<Record<string, boolean>>({});
  const [fullscreenModel, setFullscreenModel] = useState<string | null>(null);

  const modelInfo = {
    gpt: {
      name: "GPT-4",
      description: "OpenAI's most advanced model, excellent at complex reasoning and nuanced understanding.",
      color: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-600/20",
      icon: "🤖",
    },
    claude: {
      name: "Claude",
      description: "Anthropic's model known for balanced analysis and thoughtful explanations.",
      color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-600/20",
      icon: "🔮",
    },
    gemini: {
      name: "Gemini",
      description: "Google's model with strong reasoning capabilities and broad knowledge base.",
      color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-600/20",
      icon: "✨",
    },
    mistral: {
      name: "Mistral",
      description: "Efficiency-focused model delivering concise and accurate responses.",
      color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-600/20",
      icon: "🌟",
    },
  };

  const handleCopy = () => {
    if (!results[activeModel]) return;

    navigator.clipboard.writeText(results[activeModel] || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper function to get jurisdiction label from value
  function getJurisdictionLabel(value: string): string {
    const jurisdiction = localJurisdictions.find(j => j.value === value);
    return jurisdiction ? jurisdiction.label : value;
  }

  // Helper function to check if content needs "Read More"
  const shouldShowReadMore = (content: string) => {
    return content.length > 1000 || content.split('\n\n').length > 5;
  };

  // Helper function to toggle expansion for a specific model
  const toggleExpansion = (model: string) => {
    setExpandedModels(prev => ({
      ...prev,
      [model]: !prev[model]
    }));
  };

  // Helper function to format content with truncation
  const formatContent = (content: string, model: string) => {
    const isExpanded = expandedModels[model];
    const needsReadMore = shouldShowReadMore(content);

    if (!needsReadMore) {
      return content;
    }

    if (isExpanded) {
      return content;
    }

    // Truncate to first 800 characters or 3 paragraphs, whichever is shorter
    const paragraphs = content.split('\n\n');
    if (paragraphs.length > 3) {
      return paragraphs.slice(0, 3).join('\n\n') + '\n\n...';
    }

    if (content.length > 800) {
      return content.substring(0, 800) + '...';
    }

    return content;
  };

  return (
    <motion.div
      variants={cardHover()}
      initial="idle"
      whileHover="hover"
    >
      <Card className="overflow-hidden transition-all">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col space-y-4">
            {jurisdiction && (
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-xs py-0 px-2 bg-primary/5 flex items-center gap-1.5">
                  <Globe className="h-3 w-3" />
                  {getJurisdictionLabel(jurisdiction)} Jurisdiction
                </Badge>
              </div>
            )}
            <Tabs defaultValue={activeModel} onValueChange={(value) => setActiveModel(value as "gpt" | "claude" | "gemini" | "mistral")}>
              <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full gap-1">
                {Object.entries(results).map(
                  ([model, result], index) =>
                    result && (
                      <motion.div
                        key={model}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                      >
                        <TabsTrigger 
                          value={model}
                          className="flex items-center gap-1.5 w-full"
                        >
                          <span>{modelInfo[model as keyof typeof modelInfo].icon}</span>
                          <span className="hidden sm:inline">{modelInfo[model as keyof typeof modelInfo].name}</span>
                          <span className="sm:hidden">{modelInfo[model as keyof typeof modelInfo].name.split('-')[0]}</span>
                        </TabsTrigger>
                      </motion.div>
                    )
                )}
              </TabsList>

              <AnimatePresence mode="wait">
                {Object.entries(results).map(
                  ([model, result]) =>
                    result && activeModel === model && (
                      <TabsContent key={`tab-content-${model}`} value={model} className="mt-4 space-y-4">
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="space-y-4"
                        >
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <Badge className={`${modelInfo[model as keyof typeof modelInfo].color} flex items-center gap-1.5 py-1 px-3`}>
                              <Bot className="w-3.5 h-3.5" />
                              {modelInfo[model as keyof typeof modelInfo].name}
                            </Badge>
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Button variant="ghost" size="sm" onClick={handleCopy} disabled={copied}>
                                {copied ? (
                                  <>
                                    <Check className="w-3.5 h-3.5 mr-1.5" />
                                    Copied!
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3.5 h-3.5 mr-1.5" />
                                    Copy
                                  </>
                                )}
                              </Button>
                            </motion.div>
                          </div>
                          
                          <p className="text-xs text-muted-foreground">
                            {modelInfo[model as keyof typeof modelInfo].description}
                          </p>
                          
                          <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className={`bg-muted/50 p-3 sm:p-4 rounded-md border border-border relative ${
                              fullscreenModel === model ? 'fixed inset-4 z-50 overflow-y-auto bg-background/95 backdrop-blur-sm' : ''
                            }`}
                          >
                            {/* Fullscreen toggle button */}
                            <div className="flex justify-end mb-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setFullscreenModel(fullscreenModel === model ? null : model)}
                                className="opacity-60 hover:opacity-100 transition-opacity"
                              >
                                <Maximize2 className="h-4 w-4" />
                              </Button>
                            </div>

                            <div className={`prose prose-sm dark:prose-invert max-w-none prose-enhanced ${
                              fullscreenModel === model ? 'prose-lg' : ''
                            }`}>
                              <AnimatePresence mode="wait">
                                <motion.div
                                  key={expandedModels[model] ? 'expanded' : 'collapsed'}
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <p className="whitespace-pre-line text-sm sm:text-base leading-relaxed">
                                    {formatContent(result, model)}
                                  </p>
                                </motion.div>
                              </AnimatePresence>
                            </div>

                            {/* Read More / Show Less button */}
                            {shouldShowReadMore(result) && (
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="flex justify-center mt-4 pt-4 border-t border-border/50"
                              >
                                <Button
                                  variant="outline"
                                  onClick={() => toggleExpansion(model)}
                                  className="flex items-center gap-2 read-more-btn"
                                >
                                  {expandedModels[model] ? (
                                    <>
                                      <ChevronUp className="h-4 w-4" />
                                      Show Less
                                    </>
                                  ) : (
                                    <>
                                      <ChevronDown className="h-4 w-4" />
                                      Read More
                                    </>
                                  )}
                                </Button>
                              </motion.div>
                            )}
                          </motion.div>
                        </motion.div>
                      </TabsContent>
                    )
                )}
              </AnimatePresence>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
} 