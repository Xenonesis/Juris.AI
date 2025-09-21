/**
 * Real Model Performance Dashboard
 * Displays actual performance metrics based on real AI responses
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Clock, Brain, Target, Award, BarChart3 } from 'lucide-react';

interface RealPerformanceMetrics {
  accuracy: number;
  responseTime: number;
  relevance: number;
  reasoning: number;
  overall: number;
  wordCount: number;
  sentenceComplexity: number;
  legalTermDensity: number;
  citationCount: number;
  structureScore: number;
}

interface ModelPerformanceDashboardProps {
  performances: Record<string, RealPerformanceMetrics>;
  modelResults: Record<string, string | null>;
}

export function ModelPerformanceDashboard({ performances, modelResults }: ModelPerformanceDashboardProps) {
  const models = Object.keys(performances);
  
  if (models.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground text-center">
            No performance data available. Submit a query to see real model comparisons.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Calculate rankings
  const rankings = {
    fastest: models.reduce((fastest, model) => 
      performances[model].responseTime < performances[fastest].responseTime ? model : fastest
    ),
    mostAccurate: models.reduce((accurate, model) => 
      performances[model].accuracy > performances[accurate].accuracy ? model : accurate
    ),
    bestReasoning: models.reduce((reasoning, model) => 
      performances[model].reasoning > performances[reasoning].reasoning ? model : reasoning
    ),
    mostRelevant: models.reduce((relevant, model) => 
      performances[model].relevance > performances[relevant].relevance ? model : relevant
    ),
    mostLegalTerms: models.reduce((legal, model) => 
      performances[model].legalTermDensity > performances[legal].legalTermDensity ? model : legal
    ),
    mostCitations: models.reduce((citations, model) => 
      performances[model].citationCount > performances[citations].citationCount ? model : citations
    )
  };

  const getModelDisplayName = (model: string): string => {
    const displayNames: Record<string, string> = {
      'gpt': 'GPT-4',
      'claude': 'Claude',
      'gemini': 'Gemini',
      'mistral': 'Mistral',
      'chutes': 'Chutes AI'
    };
    return displayNames[model] || model;
  };

  const getModelColor = (model: string): string => {
    const colors: Record<string, string> = {
      'gpt': 'bg-green-500',
      'claude': 'bg-purple-500',
      'gemini': 'bg-blue-500',
      'mistral': 'bg-amber-500',
      'chutes': 'bg-cyan-500'
    };
    return colors[model] || 'bg-gray-500';
  };

  return (
    <div className="space-y-6">
      {/* Performance Rankings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Performance Rankings (Based on Actual Responses)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Fastest Response
              </h4>
              <Badge className={`${getModelColor(rankings.fastest)} text-white`}>
                {getModelDisplayName(rankings.fastest)} - {performances[rankings.fastest].responseTime}ms
              </Badge>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <Target className="h-4 w-4" />
                Most Accurate
              </h4>
              <Badge className={`${getModelColor(rankings.mostAccurate)} text-white`}>
                {getModelDisplayName(rankings.mostAccurate)} - {performances[rankings.mostAccurate].accuracy}%
              </Badge>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <Brain className="h-4 w-4" />
                Best Reasoning
              </h4>
              <Badge className={`${getModelColor(rankings.bestReasoning)} text-white`}>
                {getModelDisplayName(rankings.bestReasoning)} - {performances[rankings.bestReasoning].reasoning}%
              </Badge>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Most Relevant
              </h4>
              <Badge className={`${getModelColor(rankings.mostRelevant)} text-white`}>
                {getModelDisplayName(rankings.mostRelevant)} - {performances[rankings.mostRelevant].relevance}%
              </Badge>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Most Legal Terms
              </h4>
              <Badge className={`${getModelColor(rankings.mostLegalTerms)} text-white`}>
                {getModelDisplayName(rankings.mostLegalTerms)} - {performances[rankings.mostLegalTerms].legalTermDensity}%
              </Badge>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <Award className="h-4 w-4" />
                Most Citations
              </h4>
              <Badge className={`${getModelColor(rankings.mostCitations)} text-white`}>
                {getModelDisplayName(rankings.mostCitations)} - {performances[rankings.mostCitations].citationCount}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Metrics Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Performance Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {models.map((model) => {
              const metrics = performances[model];
              const result = modelResults[model];
              
              return (
                <div key={model} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">{getModelDisplayName(model)}</h3>
                    <Badge variant="outline" className="text-sm">
                      Overall Score: {metrics.overall}%
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Target className="h-3 w-3" />
                        <span>Accuracy: {metrics.accuracy}%</span>
                      </div>
                      <Progress value={metrics.accuracy} className="h-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <TrendingUp className="h-3 w-3" />
                        <span>Relevance: {metrics.relevance}%</span>
                      </div>
                      <Progress value={metrics.relevance} className="h-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Brain className="h-3 w-3" />
                        <span>Reasoning: {metrics.reasoning}%</span>
                      </div>
                      <Progress value={metrics.reasoning} className="h-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-3 w-3" />
                        <span>Speed: {metrics.responseTime}ms</span>
                      </div>
                      <Progress value={Math.max(0, 100 - (metrics.responseTime / 50))} className="h-2" />
                    </div>
                  </div>
                  
                  {/* Advanced Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2 border-t">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{metrics.wordCount}</div>
                      <div className="text-xs text-muted-foreground">Words</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{metrics.legalTermDensity}%</div>
                      <div className="text-xs text-muted-foreground">Legal Terms</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{metrics.citationCount}</div>
                      <div className="text-xs text-muted-foreground">Citations</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{metrics.structureScore}%</div>
                      <div className="text-xs text-muted-foreground">Structure</div>
                    </div>
                  </div>
                  
                  {/* Response Quality Summary */}
                  {result && (
                    <div className="bg-muted/50 p-3 rounded-md">
                      <h4 className="font-medium mb-2">Response Quality Analysis:</h4>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>• Response length: {metrics.wordCount} words</p>
                        <p>• Legal terminology usage: {metrics.legalTermDensity}% density</p>
                        <p>• Structure quality: {metrics.structureScore}% (includes headers, citations, conclusions)</p>
                        <p>• Response time: {metrics.responseTime}ms</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}