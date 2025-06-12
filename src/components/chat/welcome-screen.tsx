'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Bot, Scale, FileText, Users, Globe, Sparkles, ArrowRight 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface WelcomeScreenProps {
  onExampleClick?: (question: string) => void;
  aiProvider?: string;
  legalMode?: boolean;
  jurisdiction?: string;
}

const exampleQuestions = [
  {
    category: "Business Law",
    icon: <FileText className="h-4 w-4" />,
    questions: [
      "What are the requirements for starting a business in California?",
      "How do I protect my intellectual property when launching a startup?",
      "What are the key differences between LLC and Corporation structures?"
    ]
  },
  {
    category: "Copyright & IP",
    icon: <Globe className="h-4 w-4" />,
    questions: [
      "Explain copyright law in the EU for digital content creators.",
      "How long does copyright protection last for written works?",
      "What constitutes fair use in copyright law?"
    ]
  },
  {
    category: "Tenant Rights",
    icon: <Users className="h-4 w-4" />,
    questions: [
      "What are my rights as a tenant in New York City?",
      "Can my landlord increase rent without notice?",
      "What should I do if my landlord refuses to make repairs?"
    ]
  }
];

export function WelcomeScreen({
  onExampleClick,
  aiProvider = "mistral",
  legalMode = true,
  jurisdiction = "general"
}: WelcomeScreenProps) {
  return (
    <div className="h-full flex flex-col items-center justify-center p-8 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center space-y-6"
      >
        {/* Hero Section */}
        <div className="space-y-4">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
            className="relative"
          >
            <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/25">
              <Scale className="h-10 w-10 text-primary-foreground" />
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute -top-2 -right-2"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-2"
          >
            <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              Welcome to Juris AI
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Your intelligent legal assistant powered by advanced AI. Get expert guidance across multiple jurisdictions.
            </p>
          </motion.div>

          {/* Status Badges */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center gap-2 flex-wrap"
          >
            <Badge variant="outline" className="bg-background/50 backdrop-blur-sm">
              <Bot className="h-3 w-3 mr-1" />
              {aiProvider.charAt(0).toUpperCase() + aiProvider.slice(1)} AI
            </Badge>
            {legalMode && (
              <Badge variant="outline" className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20">
                <Scale className="h-3 w-3 mr-1" />
                Legal Mode Active
              </Badge>
            )}
            {jurisdiction !== 'general' && (
              <Badge variant="outline" className="bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20">
                <Globe className="h-3 w-3 mr-1" />
                {jurisdiction.toUpperCase()} Jurisdiction
              </Badge>
            )}
          </motion.div>
        </div>

        {/* Example Questions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="w-full max-w-4xl space-y-6"
        >
          <h2 className="text-xl font-semibold text-center">
            Get started with these example questions
          </h2>
          
          <div className="grid gap-6 md:grid-cols-3">
            {exampleQuestions.map((category, categoryIndex) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + categoryIndex * 0.1 }}
              >
                <Card className="p-4 h-full hover:shadow-lg transition-all duration-300 border-muted/50 hover:border-primary/30 bg-gradient-to-br from-background to-muted/20">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-primary">
                      {category.icon}
                      {category.category}
                    </div>
                    
                    <div className="space-y-2">
                      {category.questions.map((question, questionIndex) => (
                        <Button
                          key={questionIndex}
                          variant="ghost"
                          className={cn(
                            "w-full text-left justify-start h-auto p-3 text-sm",
                            "hover:bg-primary/5 hover:text-primary transition-all duration-200",
                            "border border-transparent hover:border-primary/20 rounded-lg"
                          )}
                          onClick={() => onExampleClick?.(question)}
                        >
                          <div className="flex items-start gap-2 w-full">
                            <ArrowRight className="h-3 w-3 mt-0.5 flex-shrink-0 opacity-60" />
                            <span className="text-left leading-relaxed">{question}</span>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="pt-8 border-t border-muted/30"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="space-y-2">
              <div className="w-10 h-10 mx-auto rounded-lg bg-primary/10 flex items-center justify-center">
                <Scale className="h-5 w-5 text-primary" />
              </div>
              <div className="text-xs text-muted-foreground">
                <div className="font-medium">Multi-Jurisdiction</div>
                <div>Global legal coverage</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="w-10 h-10 mx-auto rounded-lg bg-primary/10 flex items-center justify-center">
                <Bot className="h-5 w-5 text-primary" />
              </div>
              <div className="text-xs text-muted-foreground">
                <div className="font-medium">AI-Powered</div>
                <div>Advanced reasoning</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="w-10 h-10 mx-auto rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div className="text-xs text-muted-foreground">
                <div className="font-medium">Legal Sources</div>
                <div>Cited references</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="w-10 h-10 mx-auto rounded-lg bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div className="text-xs text-muted-foreground">
                <div className="font-medium">Real-time</div>
                <div>Instant responses</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="pt-6"
        >
          <p className="text-xs text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            <strong>Disclaimer:</strong> Information provided is for general purposes only and does not constitute legal advice. 
            Always consult with a qualified attorney for specific legal matters.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
