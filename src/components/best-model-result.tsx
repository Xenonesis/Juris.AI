"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Trophy, Bot, Copy, Check } from "lucide-react";
import { Button } from "./ui/button";
import { fadeIn, cardHover } from "@/lib/motion";

interface ModelPerformance {
  accuracy: number;
  responseTime: number;
  relevance: number;
  reasoning: number;
  overall: number;
}

interface BestModelResultProps {
  results: {
    gpt: string | null;
    claude: string | null;
    gemini: string | null;
    mistral: string | null;
  };
  performances: {
    gpt?: ModelPerformance;
    claude?: ModelPerformance;
    gemini?: ModelPerformance;
    mistral?: ModelPerformance;
  };
}

export function BestModelResult({ results, performances }: BestModelResultProps) {
  const [bestModel, setBestModel] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  
  // Model information with names, colors, and descriptions
  const modelInfo = {
    gpt: {
      name: "GPT-4",
      description: "OpenAI's most advanced model, excellent at complex reasoning and nuanced understanding.",
      color: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-600/20",
      badgeColor: "bg-green-500 text-white",
      icon: "🤖",
    },
    claude: {
      name: "Claude",
      description: "Anthropic's model known for balanced analysis and thoughtful explanations.",
      color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-600/20",
      badgeColor: "bg-purple-500 text-white",
      icon: "🔮",
    },
    gemini: {
      name: "Gemini",
      description: "Google's model with strong reasoning capabilities and broad knowledge base.",
      color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-600/20",
      badgeColor: "bg-blue-500 text-white",
      icon: "✨",
    },
    mistral: {
      name: "Mistral",
      description: "Efficiency-focused model delivering concise and accurate responses.",
      color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-600/20",
      badgeColor: "bg-amber-500 text-white",
      icon: "🌟",
    },
  };

  // Determine the best model based on overall performance score
  useEffect(() => {
    if (Object.keys(performances).length === 0) return;
    
    let highestScore = 0;
    let bestModelId: string | null = null;
    
    Object.entries(performances).forEach(([model, data]) => {
      if (data && data.overall > highestScore && results[model as keyof typeof results]) {
        highestScore = data.overall;
        bestModelId = model;
      }
    });
    
    setBestModel(bestModelId);
  }, [performances, results]);

  const handleCopy = () => {
    if (!bestModel || !results[bestModel as keyof typeof results]) return;
    
    navigator.clipboard.writeText(results[bestModel as keyof typeof results] || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!bestModel) {
    return <div className="p-6 text-center">No results available</div>;
  }

  return (
    <motion.div
      variants={cardHover()}
      initial="idle"
      whileHover="hover"
    >
      <Card className="overflow-hidden transition-all border-2 border-primary">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
              <div className="flex items-center gap-2">
                <Badge className={`${modelInfo[bestModel as keyof typeof modelInfo].badgeColor} flex items-center gap-1.5 py-1.5 px-3`}>
                  <Trophy className="w-3.5 h-3.5 mr-1" />
                  Best Model: {modelInfo[bestModel as keyof typeof modelInfo].name}
                </Badge>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-sm"
                >
                  <span className="font-medium">
                    Score: {performances[bestModel as keyof typeof performances]?.overall}%
                  </span>
                </motion.div>
              </div>
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
            
            <div className="flex items-center gap-2 my-2">
              <span className="text-xl">{modelInfo[bestModel as keyof typeof modelInfo].icon}</span>
              <p className="text-sm text-muted-foreground">
                {modelInfo[bestModel as keyof typeof modelInfo].description}
              </p>
            </div>
            
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-muted/50 p-4 rounded-md border border-border"
            >
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <p className="whitespace-pre-line text-sm sm:text-base mb-0">
                  {results[bestModel as keyof typeof results]}
                </p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xs text-muted-foreground mt-3"
            >
              <p>
                This response was automatically selected as the best result after comparing all models on accuracy, response time, and reasoning quality.
              </p>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
} 