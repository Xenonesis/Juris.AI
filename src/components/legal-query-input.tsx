"use client";

import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Info, Lightbulb, Send } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { cardHover } from "@/lib/motion";
import { useState, useEffect, useMemo } from "react";

// Custom hook for window width
function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });
  
  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    
    // Add event listener
    window.addEventListener("resize", handleResize);
    
    // Call handler right away so state gets updated with initial window size
    handleResize();
    
    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures effect runs only on mount and unmount
  
  return windowSize;
}

interface LegalQueryInputProps {
  query: string;
  setQuery: (query: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  jurisdiction?: string;
}

export function LegalQueryInput({
  query,
  setQuery,
  onSubmit,
  isLoading,
  jurisdiction = 'us',
}: LegalQueryInputProps) {
  const { width } = useWindowSize();
  const isMobile = width > 0 && width < 640;
  
  // Jurisdiction-specific suggestions for fallback
  const localSuggestions = useMemo<Record<string, Array<{id: string, text: string}>>>(() => ({
    'us': [
      { id: 'us-bankruptcy', text: "How do I file for bankruptcy protection?" },
      { id: 'us-will', text: "What are the requirements for a valid will?" },
      { id: 'us-discrimination', text: "Can I sue my employer for discrimination?" },
    ],
    'uk': [
      { id: 'uk-tenant', text: "What are my rights as a tenant in the UK?" },
      { id: 'uk-parking', text: "How do I appeal a parking fine in London?" },
      { id: 'uk-divorce', text: "What is the process for divorce in England?" },
    ],
    'ca': [
      { id: 'ca-leave', text: "How does parental leave work in Canada?" },
      { id: 'ca-traffic', text: "What are my rights in a traffic stop?" },
      { id: 'ca-will', text: "How do I contest a will in Canada?" },
    ],
    'au': [
      { id: 'au-defamation', text: "What are the defamation laws in Australia?" },
      { id: 'au-dismissal', text: "How do I fight an unfair dismissal?" },
      { id: 'au-tenant', text: "What are my rights as a tenant in Sydney?" },
    ],
    'in': [
      { id: 'in-rti', text: "How do I file an RTI application?" },
      { id: 'in-property', text: "What are the steps to fight a property dispute?" },
      { id: 'in-bail', text: "How does the bail process work in India?" },
    ],
    'np': [
      { id: 'np-inheritance', text: "What are property inheritance laws in Nepal?" },
      { id: 'np-company', text: "How do I register a company in Nepal?" },
      { id: 'np-labor', text: "What are labor laws for foreign employment?" },
    ],
    'cn': [
      { id: 'cn-business', text: "What are the business registration requirements?" },
      { id: 'cn-ip', text: "How do intellectual property rights work in China?" },
      { id: 'cn-labor', text: "What is the process for labor dispute resolution?" },
    ],
    'eu': [
      { id: 'eu-gdpr', text: "What are my GDPR rights as a consumer?" },
      { id: 'eu-consumer', text: "How do EU consumer protection laws work?" },
      { id: 'eu-employment', text: "What should I know about EU employment contracts?" },
    ]
  }), []);
  
  const defaultSuggestions = useMemo(() => [
    { id: 'tenant', text: "What are my tenant rights regarding property repairs?" },
    { id: 'inheritance', text: "How do I contest a will in probate court?" },
    { id: 'contract', text: "Can I void a contract signed under false pretenses?" },
  ], []);
  
  // State for the suggestions
  const initialSuggestions = useMemo(() => localSuggestions[jurisdiction] || defaultSuggestions, [jurisdiction, localSuggestions, defaultSuggestions]);
  const [suggestions, setSuggestions] = useState(initialSuggestions);
  const [suggestionsSource, setSuggestionsSource] = useState<'user' | 'server' | 'default'>('default');

  // Effect to update suggestions when jurisdiction changes
  useEffect(() => {
    // Just use the local suggestions based on jurisdiction
    if (localSuggestions[jurisdiction]) {
      setSuggestions(localSuggestions[jurisdiction]);
      setSuggestionsSource('server'); // Mark as server-sourced to show the icon
    } else {
      setSuggestions(defaultSuggestions);
      setSuggestionsSource('default');
    }
  }, [jurisdiction, localSuggestions, defaultSuggestions]); // Include all dependencies
  
  return (
    <form onSubmit={onSubmit} className="w-full">
      <motion.div
        variants={cardHover()}
        initial="idle"
        whileHover="hover"
      >
        <Card className="bg-card border shadow-md transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
              Describe your legal situation
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[280px] sm:max-w-80">
                    <p>Provide details about your legal question or situation. The more specific you are, the more accurate the advice will be.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
              <Textarea
                id="legal-query"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="E.g., I have a dispute with my landlord over security deposit..."
                className="min-h-[120px] sm:min-h-[160px] resize-none focus:ring-primary"
                disabled={isLoading}
              />
              
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-muted-foreground flex items-center gap-1 mr-1">
                  <Lightbulb className="h-4 w-4" /> Try:
                </span>
                {suggestionsSource !== 'default' && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge variant="outline" className="text-xs px-1 py-0 border-muted-foreground/30 cursor-help">
                          {suggestionsSource === 'user' ? '👤' : '🔥'}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">
                          {suggestionsSource === 'user' ? 'Based on your history' : 'Popular queries'}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                {suggestions.map((example, index) => (
                  <motion.div
                    key={example.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Badge 
                      variant="outline" 
                      className={`cursor-pointer hover:bg-accent hover:border-primary/20 transition-colors py-1.5 ${example.id.startsWith('loading') ? 'opacity-50' : ''}`}
                      onClick={() => example.id.startsWith('loading') ? null : setQuery(example.text)}
                    >
                      {example.text.length > 30 && isMobile
                        ? example.text.slice(0, 30) + '...' 
                        : example.text}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col sm:flex-row gap-3 justify-between pt-4 border-t">
            <p className="text-xs text-muted-foreground max-w-xs">
              Our AI will analyze your query using multiple legal models to provide comprehensive advice.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                type="submit" 
                disabled={isLoading || !query.trim()}
                className="gap-2 w-full sm:w-auto"
              >
                {isLoading ? "Analyzing..." : "Get Legal Advice"}
                {!isLoading && <Send className="h-4 w-4" />}
              </Button>
            </motion.div>
          </CardFooter>
        </Card>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Alert className="mt-4 bg-muted border-muted-foreground/20">
          <AlertDescription className="text-xs text-muted-foreground">
            <strong>Note:</strong> The information provided by Juris.Ai is not a
            substitute for professional legal advice. Always consult with a
            qualified attorney for your specific legal needs.
          </AlertDescription>
        </Alert>
      </motion.div>
    </form>
  );
} 