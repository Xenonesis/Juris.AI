"use client";

import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Info, Lightbulb, Send } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { cardHover, fadeIn } from "@/lib/motion";
import { useState, useEffect } from "react";

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
}

export function LegalQueryInput({
  query,
  setQuery,
  onSubmit,
  isLoading,
}: LegalQueryInputProps) {
  const { width } = useWindowSize();
  const isMobile = width > 0 && width < 640;
  
  const exampleQueries = [
    "I have a dispute with my landlord over security deposit",
    "What are my rights if my employer fired me without cause?",
    "Can I challenge a speeding ticket if the speed limit sign was obscured?",
  ];

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
                {exampleQueries.map((example, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Badge 
                      variant="outline" 
                      className="cursor-pointer hover:bg-accent hover:border-primary/20 transition-colors py-1.5"
                      onClick={() => setQuery(example)}
                    >
                      {example.length > 30 && isMobile
                        ? example.slice(0, 30) + '...' 
                        : example}
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
            <strong>Note:</strong> The information provided by Law Advisor is not a
            substitute for professional legal advice. Always consult with a
            qualified attorney for your specific legal needs.
          </AlertDescription>
        </Alert>
      </motion.div>
    </form>
  );
} 