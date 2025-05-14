"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { ExternalLink, FileText, Gavel, FileSearch } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface CaseStudiesProps {
  cases: Array<{
    id: number;
    title: string;
    summary: string;
  }>;
}

export function CaseStudies({ cases }: CaseStudiesProps) {
  if (!cases.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gavel className="h-5 w-5" />
            Relevant Case Studies
          </CardTitle>
          <CardDescription>
            Submit a legal query to see relevant case law and precedents
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-40">
          <p className="text-muted-foreground">No relevant case studies found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gavel className="h-5 w-5" />
          Relevant Case Studies
        </CardTitle>
        <CardDescription>
          Legal precedents and similar cases relevant to your situation
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          {cases.map((caseItem) => (
            <CaseStudyCard key={caseItem.id} caseItem={caseItem} />
          ))}
        </div>
        
        <div className="bg-primary/5 rounded-md border border-primary/10 p-4 text-xs">
          <div className="flex gap-2 items-start">
            <FileSearch className="h-4 w-4 mt-0.5 text-primary" />
            <div>
              <p className="font-medium mb-1">How case studies are selected</p>
              <p className="text-muted-foreground">
                Cases are chosen based on similarity to your situation, relevance to your jurisdiction, 
                and precedential value. The AI analyzes thousands of cases to find those with the most 
                similar fact patterns, legal issues, and outcomes.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function CaseStudyCard({ caseItem }: { caseItem: { id: number; title: string; summary: string } }) {
  // Demo data for a more comprehensive display
  const jurisdiction = ["US Supreme Court", "California Supreme Court", "New York Court of Appeals"][caseItem.id % 3];
  const year = caseItem.title.match(/\((\d{4})\)/) ? caseItem.title.match(/\((\d{4})\)/)?.[1] : "N/A";
  const relevance = ["High", "Medium", "Very High"][caseItem.id % 3];
  
  return (
    <div className="bg-muted/50 rounded-lg border p-4 space-y-3">
      <div className="flex justify-between items-start gap-2">
        <div className="space-y-1">
          <h4 className="font-medium text-lg flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            {caseItem.title}
          </h4>
          <div className="flex gap-2 flex-wrap">
            <Badge variant="outline">{jurisdiction}</Badge>
            <Badge variant="outline">{year}</Badge>
            <Badge variant="secondary" className="bg-primary/10 text-primary border-none">
              Relevance: {relevance}
            </Badge>
          </div>
        </div>
      </div>
      
      <p className="text-sm text-muted-foreground">
        {caseItem.summary}
      </p>
      
      <div className="flex justify-end">
        <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
          View case details
          <ExternalLink className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
} 