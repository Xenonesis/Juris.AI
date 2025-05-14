"use client";

import { useState } from "react";
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

  async function handleQuerySubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!query.trim()) return;
    
    setIsLoading(true);
    
    // In a real implementation, we would call the AI models' APIs here
    // For now, let's simulate a response with a timeout
    setTimeout(() => {
      setResults({
        gpt: `GPT-4 legal advice for "${query}" in ${jurisdiction} jurisdiction: This is a simulated response. It would contain a detailed analysis of the legal situation, potential solutions, and references to applicable laws and regulations.`,
        claude: `Claude legal advice for "${query}" in ${jurisdiction} jurisdiction: This is a simulated response. It would include an assessment of the case, possible legal strategies, and relevant precedents that might apply to the situation.`,
        gemini: `Gemini legal advice for "${query}" in ${jurisdiction} jurisdiction: This is a simulated response. It would offer a comprehensive overview of the legal implications, rights and obligations, and potential courses of action.`,
        mistral: `Mistral legal advice for "${query}" in ${jurisdiction} jurisdiction: This is a simulated response. It would provide a thorough explanation of the legal framework, potential risks, and recommended next steps.`,
      });
      
      // Generate mock performance metrics for each model
      setModelPerformances({
        gpt: {
          accuracy: 92,
          responseTime: 320,
          relevance: 88,
          reasoning: 95,
          overall: 91,
        },
        claude: {
          accuracy: 88,
          responseTime: 280,
          relevance: 90,
          reasoning: 93,
          overall: 89,
        },
        gemini: {
          accuracy: 86,
          responseTime: 250,
          relevance: 85,
          reasoning: 87,
          overall: 85,
        },
        mistral: {
          accuracy: 84,
          responseTime: 180,
          relevance: 82,
          reasoning: 83,
          overall: 83,
        },
      });
      
      setCaseStudies([
        { id: 1, title: "Smith v. Jones (2020)", summary: "Similar case with favorable outcome where the plaintiff successfully argued breach of contract based on similar circumstances." },
        { id: 2, title: "Doe v. Roe (2018)", summary: "Related precedent that established key principles relevant to this type of dispute, setting important standards for similar cases." },
        { id: 3, title: "Johnson v. State (2019)", summary: "Case that addressed jurisdictional questions similar to those present in the current situation." },
      ]);
      
      setWinPercentage(Math.floor(Math.random() * 100));
      setIsLoading(false);
    }, 1500);
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
              Law Advisor
            </motion.h1>
            <motion.div 
              variants={fadeIn("left", 0.3)}
              className="flex flex-wrap items-center gap-3 sm:gap-4"
            >
              <JurisdictionSelect 
                value={jurisdiction} 
                onChange={(value) => setJurisdiction(value)} 
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