"use client";

import { useState, useEffect, useCallback, useMemo, Suspense } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ThemeToggle } from "./theme-toggle";
import { JurisdictionSelect, localJurisdictions } from "./jurisdiction-select";
import { LegalQueryInput } from "./legal-query-input";
import { Card, CardContent } from "./ui/card";
import { Separator } from "./ui/separator";
import { fadeIn, staggerContainer } from "@/lib/motion";
import { getDefaultJurisdiction } from "@/lib/user-preferences";
import { useAuth } from "@/components/auth/supabase-auth-provider";
import { getUserApiKeys } from "@/lib/api-key-service";
import { Alert, AlertDescription } from "./ui/alert";
import { QuotaStatusDisplay } from "./ui/quota-status";
import { Key, Scale } from "lucide-react";
import Link from "next/link";
import { useAIModels } from "@/hooks/use-ai-models";
import { useWinEstimation } from "@/hooks/use-win-estimation";
import { useCaseStudies } from "@/hooks/use-case-studies";
import { WARNING_AUTO_HIDE_DELAY, ANIMATION_DELAYS } from "@/lib/constants";
import {
  LazyBestModelResult,
  LazyModelComparison,
  LazyModelResults,
  LazyCaseEstimation,
  LazyCaseStudies
} from "./lazy-components";
import { LoadingFallback, TabLoadingFallback } from "./loading-fallback";
import { ModelPerformanceDashboard } from "./real-performance-dashboard";

export function LegalAdvisor() {
  const [query, setQuery] = useState("");
  const [jurisdiction, setJurisdiction] = useState(""); // Will be set from default or fallback to "us"
  const [winPercentage, setWinPercentage] = useState<number | null>(null);
  const [missingKeysWarning, setMissingKeysWarning] = useState(false);

  // Authentication and API keys
  const { user } = useAuth();
  const [userApiKeys, setUserApiKeys] = useState<Record<string, string>>({});

  // Custom hooks
  const { results, modelPerformances, isLoading, availableModels, queryModels, resetResults } = useAIModels(userApiKeys);
  const { calculateWinEstimate } = useWinEstimation();
  const { caseStudies, fetchCaseStudies, resetCaseStudies } = useCaseStudies();

  // Load default jurisdiction when component mounts
  useEffect(() => {
    const defaultJurisdiction = getDefaultJurisdiction();
    setJurisdiction(defaultJurisdiction || "us"); // Fallback to US if no default is set
  }, []);
  
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

  // Memoize missing keys check
  const hasSufficientKeys = useMemo(() => {
    const { hasOpenAI, hasAnthropicClaude, hasGemini, hasMistral } = availableModels;
    return (hasOpenAI && hasAnthropicClaude) ||
           (hasOpenAI && (hasMistral || hasGemini)) ||
           (hasAnthropicClaude && (hasMistral || hasGemini));
  }, [availableModels]);

  // Auto-hide warning timer
  useEffect(() => {
    if (missingKeysWarning) {
      const timer = setTimeout(() => setMissingKeysWarning(false), WARNING_AUTO_HIDE_DELAY);
      return () => clearTimeout(timer);
    }
  }, [missingKeysWarning]);

  const handleQuerySubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!query.trim()) return;

    // Show warning if insufficient API keys
    if (!hasSufficientKeys) {
      setMissingKeysWarning(true);
    }

    // Reset previous results
    resetResults();
    resetCaseStudies();
    setWinPercentage(null);

    try {
      // Prepare prompt for legal query with jurisdiction emphasis
      const jurisdictionLabel = localJurisdictions.find(
        (j: { value: string; label: string }) => j.value === jurisdiction
      )?.label || jurisdiction;

      const legalPrompt = `You are a legal expert specializing in ${jurisdictionLabel} law.

Analyze the following legal question specifically for the ${jurisdictionLabel} jurisdiction. Your analysis must focus on ${jurisdictionLabel} legal principles, statutes, and case law. Do not apply legal concepts from other jurisdictions unless explicitly comparing them.

Question: ${query}

Provide a detailed analysis based strictly on ${jurisdictionLabel} legal framework.`;

      // Query all AI models in parallel
      await queryModels(legalPrompt);

      // Fetch case studies with real AI analysis
      await fetchCaseStudies(query, jurisdiction, userApiKeys);

      // Calculate win percentage using real AI analysis
      const winEstimate = await calculateWinEstimate(query, jurisdiction, userApiKeys, caseStudies);
      setWinPercentage(winEstimate);

    } catch (error) {
      console.error('Error processing legal query:', error);
    }
  }, [query, jurisdiction, hasSufficientKeys, resetResults, resetCaseStudies, queryModels, fetchCaseStudies, calculateWinEstimate, userApiKeys, caseStudies]);

  return (
    <motion.div
      variants={staggerContainer()}
      initial="hidden"
      animate="show"
      className="min-h-screen gradient-bg-mesh py-8 px-4"
    >
      <div className="container mx-auto max-w-6xl">
        {/* Enhanced Hero Section */}
        <motion.div
          variants={fadeIn("down", 0.1)}
          className="text-center mb-12"
        >
          <motion.div
            variants={fadeIn("up", 0.2)}
            className="flex items-center justify-center mb-6"
          >
            <div className="w-16 h-16 rounded-2xl professional-gradient flex items-center justify-center shadow-lg animate-bounce-gentle">
              <Scale className="h-8 w-8 text-white" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))' }} />
            </div>
          </motion.div>
          <motion.h1
            variants={fadeIn("up", ANIMATION_DELAYS.HERO_TITLE)}
            className="text-4xl md:text-6xl font-bold mb-6 text-high-contrast text-shadow"
          >
            Juris.AI Legal Assistant
          </motion.h1>
          <motion.p
            variants={fadeIn("up", ANIMATION_DELAYS.HERO_SUBTITLE)}
            className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8"
          >
            Get comprehensive legal advice powered by multiple AI models. Compare insights, explore case studies, and estimate your chances of success with professional-grade analysis.
          </motion.p>

          <motion.div
            variants={fadeIn("up", ANIMATION_DELAYS.HERO_CONTROLS)}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50 border">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-sm text-muted-foreground">AI Models Ready</span>
            </div>
            <JurisdictionSelect
              value={jurisdiction}
              onChange={(value) => {
                setJurisdiction(value);
              }}
            />
            <ThemeToggle />
          </motion.div>
        </motion.div>

        <Card className="shadow-2xl border-muted/30 card-hover bg-card/50 backdrop-blur-sm">
          <CardContent className="p-8 md:p-12">

          <motion.div variants={fadeIn("up", ANIMATION_DELAYS.QUERY_INPUT)}>
            <LegalQueryInput
              query={query}
              setQuery={setQuery}
              onSubmit={handleQuerySubmit}
              isLoading={isLoading}
              jurisdiction={jurisdiction}
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
                You&apos;re missing API keys for some AI models. For best results, add your API keys in your{" "}
                <Link href="/profile?tab=api-keys" className="underline font-medium">
                  profile settings
                </Link>.
              </AlertDescription>
              </Alert>
            </motion.div>
          )}

          {userApiKeys.gemini && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="mt-4"
            >
              <QuotaStatusDisplay apiKeys={userApiKeys} />
            </motion.div>
          )}

          {(results.gpt || results.claude || results.gemini || results.mistral || results.chutes) && (
            <motion.div
              variants={fadeIn("up", ANIMATION_DELAYS.RESULTS)}
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
                  <Suspense fallback={<LoadingFallback />}>
                    <LazyBestModelResult
                      results={results}
                      performances={modelPerformances}
                      jurisdiction={jurisdiction}
                    />
                  </Suspense>
                </TabsContent>

                <TabsContent value="all-models" className="mt-6">
                  <Tabs defaultValue="comparison" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-4">
                      <TabsTrigger value="comparison">Text Comparison</TabsTrigger>
                      <TabsTrigger value="performance">Performance Metrics</TabsTrigger>
                    </TabsList>

                    <TabsContent value="comparison" className="mt-4">
                      <Suspense fallback={<LoadingFallback />}>
                        <LazyModelComparison
                          results={results}
                          jurisdiction={jurisdiction}
                        />
                      </Suspense>
                    </TabsContent>

                    <TabsContent value="performance" className="mt-4">
                      <Suspense fallback={<LoadingFallback />}>
                        <div className="space-y-6">
                          <ModelPerformanceDashboard 
                            performances={modelPerformances} 
                            modelResults={results} 
                          />
                          <LazyModelResults
                            performances={modelPerformances}
                            jurisdiction={jurisdiction}
                          />
                        </div>
                      </Suspense>
                    </TabsContent>
                  </Tabs>
                </TabsContent>

                <TabsContent value="case-studies" className="mt-6">
                  <Suspense fallback={<LoadingFallback />}>
                    <LazyCaseStudies
                      cases={caseStudies}
                      selectedJurisdiction={localJurisdictions.find((j: {value: string; label: string}) => j.value === jurisdiction)?.label || jurisdiction}
                    />
                  </Suspense>
                </TabsContent>

                <TabsContent value="estimation" className="mt-6">
                  <Suspense fallback={<LoadingFallback />}>
                    <LazyCaseEstimation winPercentage={winPercentage} jurisdiction={jurisdiction} />
                  </Suspense>
                </TabsContent>
              </Tabs>
            </motion.div>
          )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}