"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ThemeToggle } from "./theme-toggle";
import { JurisdictionSelect } from "./jurisdiction-select";
import { BestModelResult } from "./best-model-result";
import { ModelComparison } from "./model-comparison";
import { ModelResults } from "./model-results";
import { CaseEstimation } from "./case-estimation";
import { CaseStudies } from "./case-studies";
import { LegalQueryInput } from "./legal-query-input";
import { Card, CardContent } from "./ui/card";
import { Separator } from "./ui/separator";
import { fadeIn, staggerContainer } from "@/lib/motion";
import { getAIResponse, getLegalAdvice, fetchRelevantCaseLaw, fetchRelevantStatutes } from "@/lib/ai-services";
import { useAuth } from "@/components/auth/supabase-auth-provider";
import { getUserApiKeys } from "@/lib/api-key-service";
import { Alert, AlertDescription } from "./ui/alert";
import { Key } from "lucide-react";
import Link from "next/link";

export function LegalAdvisor() {
  const [query, setQuery] = useState("");
  const [jurisdiction, setJurisdiction] = useState("us");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<{
    gpt: string | null;
    claude: string | null;
    gemini: string | null;
    mistral: string | null;
  }>({
    gpt: null,
    claude: null,
    gemini: null,
    mistral: null,
  });
  
  // Add model performance metrics state
  const [modelPerformances, setModelPerformances] = useState<{
    gpt?: { accuracy: number; responseTime: number; relevance: number; reasoning: number; overall: number };
    claude?: { accuracy: number; responseTime: number; relevance: number; reasoning: number; overall: number };
    gemini?: { accuracy: number; responseTime: number; relevance: number; reasoning: number; overall: number };
    mistral?: { accuracy: number; responseTime: number; relevance: number; reasoning: number; overall: number };
  }>({});
  
  const [caseStudies, setCaseStudies] = useState<Array<{
    id: number;
    title: string;
    summary: string;
  }>>([]);
  const [winPercentage, setWinPercentage] = useState<number | null>(null);
  const [missingKeysWarning, setMissingKeysWarning] = useState(false);
  
  // Authentication and API keys
  const { user } = useAuth();
  const [userApiKeys, setUserApiKeys] = useState<Record<string, string>>({});

  // Load user's API keys when component mounts
  useEffect(() => {
    const loadUserApiKeys = async () => {
      if (user) {
        try {
          const apiKeys = await getUserApiKeys(user.id);
          setUserApiKeys(apiKeys);
        } catch (error) {
          console.error('Error loading user API keys:', error);
        }
      }
    };

    loadUserApiKeys();
  }, [user]);

  // Calculate responsive time in ms given the start time and model type
  const calculateResponseTime = (startTime: number, modelType: string): number => {
    // These are just simulation - in a real integration, these would be actual response times
    const baseTime = Date.now() - startTime;
    
    // Add small variation based on model type
    switch(modelType) {
      case 'gpt': return baseTime + Math.floor(Math.random() * 100);
      case 'claude': return baseTime + Math.floor(Math.random() * 150);
      case 'gemini': return baseTime + Math.floor(Math.random() * 50);
      case 'mistral': return baseTime + Math.floor(Math.random() * 30);
      default: return baseTime;
    }
  };

  // Calculate other metrics (simulated)
  const calculateMetrics = (response: string, modelType: string): { 
    accuracy: number; 
    relevance: number; 
    reasoning: number; 
    overall: number; 
  } => {
    // In a real application, this would use more sophisticated methods to evaluate model performance
    // For now, we'll simulate based on response length and some randomness
    
    const lengthScore = Math.min(100, response.length / 20);
    const randomFactor = (Math.random() * 10) - 5; // +/- 5 points
    
    let baseAccuracy = 0;
    switch(modelType) {
      case 'gpt': baseAccuracy = 92; break;
      case 'claude': baseAccuracy = 89; break;
      case 'gemini': baseAccuracy = 87; break;
      case 'mistral': baseAccuracy = 85; break;
      default: baseAccuracy = 85;
    }
    
    const relevance = Math.min(100, Math.max(70, baseAccuracy - 5 + randomFactor));
    const reasoning = Math.min(100, Math.max(70, baseAccuracy + 2 + randomFactor));
    const accuracy = Math.min(100, Math.max(70, baseAccuracy + randomFactor));
    
    // Overall is weighted average of the other metrics
    const overall = Math.round((accuracy * 0.4) + (relevance * 0.3) + (reasoning * 0.3));
    
    return {
      accuracy: Math.round(accuracy),
      relevance: Math.round(relevance),
      reasoning: Math.round(reasoning),
      overall: Math.round(overall)
    };
  };

  async function handleQuerySubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!query.trim()) return;
    
    setIsLoading(true);
    
    // Check if user has necessary API keys
    const hasOpenAI = !!userApiKeys['openai'];
    const hasAnthropicClaude = !!userApiKeys['anthropic'];
    const hasGemini = !!userApiKeys['gemini'];
    const hasMistral = !!userApiKeys['mistral'];
    
    // Show warning if less than 2 API keys are available
    if ((!hasOpenAI && !hasAnthropicClaude) || (hasOpenAI && !hasMistral && !hasGemini && !hasAnthropicClaude)) {
      setMissingKeysWarning(true);
      // Auto-hide warning after 10 seconds
      setTimeout(() => setMissingKeysWarning(false), 10000);
    }
    
    try {
      // Start timestamps for response time measurements
      const startTimes = {
        gpt: Date.now(),
        claude: Date.now(),
        gemini: Date.now(),
        mistral: Date.now()
      };
      
      // Prepare prompt for legal query
      const legalPrompt = `Analyze the following legal question in the ${jurisdiction} jurisdiction: ${query}`;
      
      // Run all AI models in parallel
      const modelPromises = [];
      
      // OpenAI/GPT
      if (hasOpenAI) {
        modelPromises.push(
          getAIResponse(legalPrompt, 'openai', userApiKeys)
            .then(response => {
              const responseTime = calculateResponseTime(startTimes.gpt, 'gpt');
              const metrics = calculateMetrics(response, 'gpt');
              
              setResults(prev => ({ ...prev, gpt: response }));
              setModelPerformances(prev => ({ 
                ...prev, 
                gpt: { ...metrics, responseTime } 
              }));
              
              return response;
            })
            .catch(error => {
              console.error('OpenAI API error:', error);
              setResults(prev => ({ ...prev, gpt: 'Failed to get response from OpenAI.' }));
              return null;
            })
        );
      } else {
        setResults(prev => ({ ...prev, gpt: 'API key for OpenAI not provided.' }));
      }
      
      // Claude
      if (hasAnthropicClaude) {
        modelPromises.push(
          getAIResponse(legalPrompt, 'anthropic', userApiKeys)
            .then(response => {
              const responseTime = calculateResponseTime(startTimes.claude, 'claude');
              const metrics = calculateMetrics(response, 'claude');
              
              setResults(prev => ({ ...prev, claude: response }));
              setModelPerformances(prev => ({ 
                ...prev, 
                claude: { ...metrics, responseTime } 
              }));
              
              return response;
            })
            .catch(error => {
              console.error('Claude API error:', error);
              setResults(prev => ({ ...prev, claude: 'Failed to get response from Claude.' }));
              return null;
            })
        );
      } else {
        setResults(prev => ({ ...prev, claude: 'API key for Claude not provided.' }));
      }
      
      // Gemini
      if (hasGemini) {
        modelPromises.push(
          getAIResponse(legalPrompt, 'gemini', userApiKeys)
            .then(response => {
              const responseTime = calculateResponseTime(startTimes.gemini, 'gemini');
              const metrics = calculateMetrics(response, 'gemini');
              
              setResults(prev => ({ ...prev, gemini: response }));
              setModelPerformances(prev => ({ 
                ...prev, 
                gemini: { ...metrics, responseTime } 
              }));
              
              return response;
            })
            .catch(error => {
              console.error('Gemini API error:', error);
              setResults(prev => ({ ...prev, gemini: 'Failed to get response from Gemini.' }));
              return null;
            })
        );
      } else {
        setResults(prev => ({ ...prev, gemini: 'API key for Gemini not provided.' }));
      }
      
      // Mistral
      if (hasMistral) {
        modelPromises.push(
          getAIResponse(legalPrompt, 'mistral', userApiKeys)
            .then(response => {
              const responseTime = calculateResponseTime(startTimes.mistral, 'mistral');
              const metrics = calculateMetrics(response, 'mistral');
              
              setResults(prev => ({ ...prev, mistral: response }));
              setModelPerformances(prev => ({ 
                ...prev, 
                mistral: { ...metrics, responseTime } 
              }));
              
              return response;
            })
            .catch(error => {
              console.error('Mistral API error:', error);
              setResults(prev => ({ ...prev, mistral: 'Failed to get response from Mistral.' }));
              return null;
            })
        );
      } else {
        setResults(prev => ({ ...prev, mistral: 'API key for Mistral not provided.' }));
      }
      
      // Get case studies from legal APIs
      try {
        const cases = await fetchRelevantCaseLaw(query, jurisdiction);
        
        // Transform cases into case studies
        const formattedCases = cases.map((caseItem, index) => ({
          id: index + 1,
          title: `${caseItem.name} (${caseItem.decision_date})`,
          summary: caseItem.summary || `A legal case from ${caseItem.court} that established precedent relevant to your query.`
        }));
        
        setCaseStudies(formattedCases);
      } catch (error) {
        console.error('Error fetching case law:', error);
        setCaseStudies([
          { 
            id: 1, 
            title: "Similar Legal Case", 
            summary: "We couldn't retrieve specific case studies due to an error, but there are likely similar cases that could provide precedent." 
          }
        ]);
      }
      
      // Calculate win percentage based on query sentiment and jurisdiction
      // In a real application, this would be a more sophisticated analysis
      const calculateWinEstimate = () => {
        // This is a simplified simulation for demonstration purposes
        // In reality, this would use ML models trained on actual case outcomes
        
        // Base chance between 35-65%
        let baseChance = 50 + (Math.random() * 30 - 15);
        
        // Adjust based on query content (simplified simulation)
        if (query.toLowerCase().includes('evidence') || query.toLowerCase().includes('proof')) {
          baseChance += 10;
        }
        if (query.toLowerCase().includes('deadline') || query.toLowerCase().includes('statute of limitations')) {
          baseChance -= 15;
        }
        
        // Jurisdiction adjustment (simplified)
        const jurisdictionModifier = {
          'us': 0,
          'uk': -2,
          'ca': 3,
          'au': 1,
          'eu': -1
        }[jurisdiction] || 0;
        
        baseChance += jurisdictionModifier;
        
        // Cap between 5% and 95%
        return Math.min(95, Math.max(5, Math.round(baseChance)));
      };
      
      setWinPercentage(calculateWinEstimate());
      
      // Wait for all model promises to complete
      await Promise.allSettled(modelPromises);
      
    } catch (error) {
      console.error('Error processing legal query:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <motion.div 
      variants={staggerContainer()}
      initial="hidden"
      animate="show"
      className="container mx-auto px-4 py-8 max-w-6xl"
    >
      <Card className="border-none shadow-none bg-transparent">
        <CardContent className="p-0 sm:p-4">
          <motion.header 
            variants={fadeIn("down", 0.1)}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
          >
            <motion.h1 
              variants={fadeIn("right", 0.2)}
              className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
            >
              Juris.Ai
            </motion.h1>
            <motion.div 
              variants={fadeIn("left", 0.3)}
              className="flex flex-wrap items-center gap-3 sm:gap-4"
            >
              <JurisdictionSelect 
                value={jurisdiction} 
                onChange={(value) => {
                  console.log("LegalAdvisor setJurisdiction:", value);
                  setJurisdiction(value);
                }}
              />
              <ThemeToggle />
            </motion.div>
          </motion.header>

          <motion.div variants={fadeIn("up", 0.4)}>
            <LegalQueryInput 
              query={query}
              setQuery={setQuery}
              onSubmit={handleQuerySubmit}
              isLoading={isLoading}
            />
          </motion.div>
          
          {missingKeysWarning && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4"
            >
              <Alert variant="warning" className="bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-900/30 dark:border-amber-800 dark:text-amber-300">
                <Key className="h-4 w-4 mr-2" />
                <AlertDescription>
                  You're missing API keys for some AI models. For best results, add your API keys in your{' '}
                  <Link href="/profile?tab=api-keys" className="underline font-medium">
                    profile settings
                  </Link>.
                </AlertDescription>
              </Alert>
            </motion.div>
          )}

          {(results.gpt || results.claude || results.gemini || results.mistral) && (
            <motion.div 
              variants={fadeIn("up", 0.5)}
              className="mt-10 space-y-6"
            >
              <Separator className="my-8" />
              
              <Tabs defaultValue="best-result" className="w-full">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-4 gap-1">
                  <TabsTrigger value="best-result">Best Result</TabsTrigger>
                  <TabsTrigger value="all-models">All Models</TabsTrigger>
                  <TabsTrigger value="case-studies">Case Studies</TabsTrigger>
                  <TabsTrigger value="estimation">Win Estimation</TabsTrigger>
                </TabsList>
                
                <TabsContent value="best-result" className="mt-6">
                  <BestModelResult results={results} performances={modelPerformances} />
                </TabsContent>
                
                <TabsContent value="all-models" className="mt-6">
                  <Tabs defaultValue="comparison" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-4">
                      <TabsTrigger value="comparison">Text Comparison</TabsTrigger>
                      <TabsTrigger value="performance">Performance Metrics</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="comparison" className="mt-4">
                      <ModelComparison results={results} />
                    </TabsContent>
                    
                    <TabsContent value="performance" className="mt-4">
                      <ModelResults performances={modelPerformances} />
                    </TabsContent>
                  </Tabs>
                </TabsContent>
                
                <TabsContent value="case-studies" className="mt-6">
                  <CaseStudies cases={caseStudies} />
                </TabsContent>
                
                <TabsContent value="estimation" className="mt-6">
                  <CaseEstimation winPercentage={winPercentage} />
                </TabsContent>
              </Tabs>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
} 