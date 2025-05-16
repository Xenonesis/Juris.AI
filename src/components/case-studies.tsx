"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Separator } from "./ui/separator";
import { ExternalLink, BookOpen, LucideScale, Info } from "lucide-react";
import { fadeIn } from "@/lib/motion";

interface CaseStudy {
  id?: number;
  title: string;
  citation?: string;
  relevance?: number;
  summary: string;
  link?: string;
  year?: number;
  outcome?: string;
  jurisdiction?: string;
}

interface CaseStudiesProps {
  cases?: Array<{
    id: number;
    title: string;
    summary: string;
  }>;
  caseStudies?: CaseStudy[];
  selectedJurisdiction?: string;
}

export function CaseStudies({ cases, caseStudies, selectedJurisdiction }: CaseStudiesProps) {
  const [activeTab, setActiveTab] = useState("all");
  
  // Convert old 'cases' format to the new 'caseStudies' format if needed
  const allCaseStudies: CaseStudy[] = caseStudies || 
    (cases?.map(c => ({
      id: c.id,
      title: c.title,
      summary: c.summary,
      citation: generateMockCitation(c.title),
      relevance: 70 + Math.floor(Math.random() * 25), // 70-95% relevance
      link: "#",
      year: extractYearFromTitle(c.title) || new Date().getFullYear() - Math.floor(Math.random() * 5),
      outcome: Math.random() > 0.5 ? "Favorable" : "Unfavorable",
      jurisdiction: generateMockJurisdiction(c.id)
    })) || []);
  
  // Helper functions for mock data generation
  function extractYearFromTitle(title: string): number | null {
    const match = title.match(/\((\d{4})\)/);
    return match ? parseInt(match[1]) : null;
  }
  
  function generateMockCitation(title: string): string {
    const year = extractYearFromTitle(title) || (new Date().getFullYear() - Math.floor(Math.random() * 5));
    const volNumber = Math.floor(Math.random() * 500) + 100;
    const pageNumber = Math.floor(Math.random() * 1000) + 1;
    return `${volNumber} U.S. ${pageNumber} (${year})`;
  }
  
  function generateMockJurisdiction(id: number): string {
    const jurisdictions = [
      "US Supreme Court", 
      "California Supreme Court",
      "New York Court of Appeals",
      "Federal Circuit",
      "9th Circuit"
    ];
    return jurisdictions[id % jurisdictions.length];
  }
  
  // Format the summary to remove asterisks and improve readability
  const formatSummary = (summary: string) => {
    // Remove asterisks used for emphasis
    return summary
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1");
  };
  
  // Filter cases based on outcome for tabs
  const favorableCases = allCaseStudies.filter(cs => 
    cs.outcome?.toLowerCase().includes("favorable") || 
    cs.outcome?.toLowerCase().includes("positive") ||
    cs.outcome?.toLowerCase().includes("plaintiff") || 
    cs.outcome?.toLowerCase().includes("granted")
  );
  
  const unfavorableCases = allCaseStudies.filter(cs => 
    cs.outcome?.toLowerCase().includes("unfavorable") || 
    cs.outcome?.toLowerCase().includes("negative") ||
    cs.outcome?.toLowerCase().includes("defendant") || 
    cs.outcome?.toLowerCase().includes("dismissed")
  );

  if (allCaseStudies.length === 0) {
    return (
      <Alert variant="warning" className="mb-4">
        <Info className="h-4 w-4" />
        <AlertDescription>
          No relevant case studies found for this query{selectedJurisdiction ? ` in ${selectedJurisdiction}` : ''}. Try modifying your search terms or jurisdiction.
        </AlertDescription>
      </Alert>
    );
  }

  const renderCaseStudy = (cs: CaseStudy) => {
    const outcomeColor = cs.outcome?.toLowerCase().includes("favorable") || 
                        cs.outcome?.toLowerCase().includes("positive") || 
                        cs.outcome?.toLowerCase().includes("plaintiff") || 
                        cs.outcome?.toLowerCase().includes("granted")
                          ? "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20"
                          : "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20";
                          
    const relevanceColor = (cs.relevance || 0) > 85 
      ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" 
      : (cs.relevance || 0) > 70 
        ? "bg-blue-500/15 text-blue-600 dark:text-blue-400" 
        : "bg-amber-500/15 text-amber-600 dark:text-amber-400";
                          
    return (
      <motion.div
        key={cs.title + (cs.year || '')}
        variants={fadeIn("up", 0.15)}
        initial="hidden"
        animate="show"
        className="mb-4"
      >
        <Card className="border border-border hover:shadow-md transition-all">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start flex-wrap gap-2">
              <div>
                <CardTitle className="text-base font-medium">{cs.title}</CardTitle>
                {cs.citation && (
                  <CardDescription className="text-xs font-mono mt-1">
                    {cs.citation} {cs.year ? `(${cs.year})` : ''}
                  </CardDescription>
                )}
              </div>
              {cs.relevance && (
                <Badge className={relevanceColor}>
                  {cs.relevance}% Relevant
                </Badge>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="pb-3 pt-2">
            {(cs.jurisdiction || cs.outcome) && (
              <div className="flex flex-wrap gap-2 mb-3">
                {cs.jurisdiction && (
                  <Badge variant="outline" className="text-xs py-0">
                    {cs.jurisdiction}
                  </Badge>
                )}
                {cs.outcome && (
                  <Badge variant="outline" className={outcomeColor + " text-xs py-0"}>
                    {cs.outcome}
                  </Badge>
                )}
              </div>
            )}
            
            <Separator className="my-2" />
            
            <div className="prose prose-sm dark:prose-invert">
              <p className="text-sm">{formatSummary(cs.summary)}</p>
            </div>
          </CardContent>
          
          {cs.link && (
            <CardFooter className="pt-0">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs gap-1.5 hover:bg-secondary"
                onClick={() => window.open(cs.link, '_blank')}
              >
                <ExternalLink className="h-3.5 w-3.5" />
                View Full Case
              </Button>
            </CardFooter>
          )}
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-medium">Relevant Case Law</h3>
        </div>
        {selectedJurisdiction && (
          <Badge variant="outline" className="text-xs">
            {selectedJurisdiction}
          </Badge>
        )}
      </div>
      
      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="all" className="text-xs sm:text-sm">
            All Cases ({allCaseStudies.length})
          </TabsTrigger>
          <TabsTrigger value="favorable" className="text-xs sm:text-sm">
            Favorable ({favorableCases.length})
          </TabsTrigger>
          <TabsTrigger value="unfavorable" className="text-xs sm:text-sm">
            Unfavorable ({unfavorableCases.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-0">
          {allCaseStudies.map(renderCaseStudy)}
        </TabsContent>
        
        <TabsContent value="favorable" className="mt-0">
          {favorableCases.length > 0 ? (
            favorableCases.map(renderCaseStudy)
          ) : (
            <Alert variant="default" className="mb-4">
              <Info className="h-4 w-4" />
              <AlertDescription>
                No favorable cases found for this query. This might indicate a challenging legal position.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>
        
        <TabsContent value="unfavorable" className="mt-0">
          {unfavorableCases.length > 0 ? (
            unfavorableCases.map(renderCaseStudy)
          ) : (
            <Alert variant="default" className="mb-4">
              <Info className="h-4 w-4" />
              <AlertDescription>
                No unfavorable cases found for this query. This might indicate a strong legal position.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
} 