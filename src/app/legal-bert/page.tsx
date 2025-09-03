"use client";

import { useState, useEffect, useRef } from "react";

let LegalBertModel: typeof import("./model").LegalBertModel | null = null;

if (typeof window !== "undefined") {
  import("./model").then((module) => {
    LegalBertModel = module.LegalBertModel;
  });
}
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
      if (!LegalBertModel) {
        throw new Error("LegalBertModel is not available");
      }
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10 py-8 px-4">
      <div className="container max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl professional-gradient flex items-center justify-center shadow-lg animate-bounce-gentle">
              <FileText className="h-8 w-8 text-white dark:text-white" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }} />
            </div>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-high-contrast text-shadow mb-4">InLegalBERT Analysis</h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Advanced legal text analysis powered by specialized BERT language models for professional-grade document processing
          </p>
          <div className="flex items-center justify-center gap-6 mt-8">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50 border">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-sm text-muted-foreground">BERT Model Ready</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50 border">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
              <span className="text-sm text-muted-foreground">Real-time Analysis</span>
            </div>
          </div>
        </div>
      
        <Card className="shadow-2xl border-muted/30 card-hover bg-card/80 backdrop-blur-sm">
          <CardHeader className="border-b border-muted/30">
            <CardTitle className="text-xl flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-chart-2 flex items-center justify-center">
                <FileText className="h-4 w-4 text-primary-foreground" />
              </div>
              Legal Text Analyzer
            </CardTitle>
            <CardDescription>Enter legal documents, clauses, or text for detailed analysis using advanced BERT models</CardDescription>
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

        <div className="mt-8 animate-fadeIn [animation-delay:200ms]">
        <Alert className="bg-muted border-muted-foreground/20">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-xs text-muted-foreground">
            InLegalBERT provides analysis based on AI language models. Results should be reviewed by legal professionals and are not a substitute for professional legal advice.
          </AlertDescription>
        </Alert>
        </div>
      </div>
    </div>
  );
}
