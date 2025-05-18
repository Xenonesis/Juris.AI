"use client";

import { useState } from "react";
import { LegalBertModel } from "./model";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2, FileText, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function LegalBertPage() {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const model = new LegalBertModel();
      await model.initialize();
      const output = await model.analyze(text);
      setResult(JSON.stringify(output, null, 2));
      setSuccess(true);
    } catch (error) {
      console.error("Error analyzing text:", error);
      setError("Error processing text. Please try again with different input.");
      setResult("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-5xl mx-auto py-8 px-4 animate-fadeIn">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <FileText className="h-6 w-6 text-primary" />
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">InLegalBERT Analysis</h1>
        </div>
        <p className="text-muted-foreground">
          Advanced legal text analysis powered by specialized BERT language models
        </p>
      </div>
      
      <div className="transition-all duration-300">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-xl">Legal Text Analyzer</CardTitle>
            <CardDescription>Enter legal documents, clauses, or text for detailed analysis</CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="legal-text" className="text-sm font-medium">
                Enter legal text to analyze:
              </label>
              <Textarea
                id="legal-text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="min-h-[200px]"
                placeholder="Enter legal text here..."
                aria-label="Legal text to analyze"
              />
            </div>
            
            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {success && (
              <Alert className="mt-4 bg-green-50 dark:bg-green-950/30 text-green-800 dark:text-green-400 border-green-200 dark:border-green-800">
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>Analysis completed successfully</AlertDescription>
              </Alert>
            )}
          </CardContent>
          
          <CardFooter className="flex justify-between items-center border-t pt-4">
            <div>
              <Badge variant="outline" className="text-xs">
                Powered by BERT
              </Badge>
            </div>
            <Button
              onClick={handleAnalyze}
              disabled={loading || !text.trim()}
              className="gap-2"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Analyze Text"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      {result && (
        <div className="mt-8 transition-all duration-300 animate-fadeIn">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                Analysis Results
              </CardTitle>
              <CardDescription>Structured output from the InLegalBERT model</CardDescription>
            </CardHeader>
            
            <CardContent>
              <Tabs defaultValue="pretty" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="pretty">Formatted</TabsTrigger>
                  <TabsTrigger value="raw">Raw JSON</TabsTrigger>
                </TabsList>
                
                <TabsContent value="pretty" className="space-y-4">
                  <div className="bg-muted/50 p-4 rounded-lg overflow-auto max-h-[400px] font-mono text-sm">
                    {result && (
                      <pre>{result}</pre>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="raw">
                  <div className="bg-muted/50 p-4 rounded-lg overflow-auto max-h-[400px] font-mono text-sm">
                    {result}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      )}
      
      <div className="mt-8 animate-fadeIn" style={{ animationDelay: "200ms" }}>
        <Alert className="bg-muted border-muted-foreground/20">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-xs text-muted-foreground">
            InLegalBERT provides analysis based on AI language models. Results should be reviewed by legal professionals and are not a substitute for professional legal advice.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
} 