"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Trophy, TrendingUp, Clock, Brain, Globe } from "lucide-react";
import { localJurisdictions } from "./jurisdiction-select";

// Types for model performance metrics
interface ModelPerformance {
  accuracy: number;
  responseTime: number;
  relevance: number;
  reasoning: number;
  overall: number;
}

interface ModelResultsProps {
  performances: {
    gpt?: ModelPerformance;
    claude?: ModelPerformance;
    gemini?: ModelPerformance;
    mistral?: ModelPerformance;
  };
  jurisdiction?: string;
}

export function ModelResults({ performances, jurisdiction }: ModelResultsProps) {
  const [bestModel, setBestModel] = useState<string | null>(null);
  
  // Model information with names and colors
  const modelInfo = {
    gpt: {
      name: "GPT-4",
      color: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-600/20",
      badgeColor: "bg-green-500 text-white",
    },
    claude: {
      name: "Claude",
      color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-600/20",
      badgeColor: "bg-purple-500 text-white",
    },
    gemini: {
      name: "Gemini",
      color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-600/20",
      badgeColor: "bg-blue-500 text-white",
    },
    mistral: {
      name: "Mistral",
      color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-600/20",
      badgeColor: "bg-amber-500 text-white",
    },
  };

  // Automatically determine the best model based on overall score
  useEffect(() => {
    if (Object.keys(performances).length === 0) return;
    
    let highestScore = 0;
    let bestModelId: string | null = null;
    
    Object.entries(performances).forEach(([model, data]) => {
      if (data && data.overall > highestScore) {
        highestScore = data.overall;
        bestModelId = model;
      }
    });
    
    setBestModel(bestModelId);
  }, [performances]);

  // Helper function to render metric bars
  const renderMetricBar = (value: number, max: number = 100) => {
    const percentage = (value / max) * 100;
    // Using a utility function to get width class based on percentage
    const widthClass = getWidthClass(percentage);
    return (
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
        <div className={`h-2.5 rounded-full bg-primary ${widthClass}`}></div>
      </div>
    );
  };

  // Helper function to convert percentage to Tailwind width class
  const getWidthClass = (percentage: number): string => {
    // Clamping percentage between 0-100
    const clampedPercentage = Math.min(100, Math.max(0, percentage));
    
    // For precise widths, we'll use the CSS variable approach
    // This creates a class with a CSS variable that can be used in the component
    return `w-[${clampedPercentage}%]`;
  };
  
  // Helper function to get animation delay class
  const getAnimationDelayClass = (index: number): string => {
    return `[animation-delay:${index * 100}ms]`;
  };

  // Helper function to get jurisdiction label from value
  function getJurisdictionLabel(value: string): string {
    const jurisdiction = localJurisdictions.find(j => j.value === value);
    return jurisdiction ? jurisdiction.label : value;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 justify-between items-center mb-2">
        <div className="flex flex-col space-y-2">
          <h2 className="text-xl font-bold">Model Performance Comparison</h2>
          {jurisdiction && (
            <Badge variant="outline" className="text-xs py-0 px-2 bg-primary/5 flex items-center gap-1.5 w-fit">
              <Globe className="h-3 w-3" />
              {getJurisdictionLabel(jurisdiction)} Jurisdiction
            </Badge>
          )}
        </div>
        {bestModel && (
          <div className="animate-fadeIn">
            <Badge className={`${modelInfo[bestModel as keyof typeof modelInfo].badgeColor} flex items-center gap-1.5 py-1.5 px-3`}>
              <Trophy className="w-3.5 h-3.5" />
              Best Model: {modelInfo[bestModel as keyof typeof modelInfo].name}
            </Badge>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(performances).map(([model, metrics], index) => (
          <div
            key={model}
            className={`animate-fadeIn transition-transform duration-300 hover:scale-[1.02] ${getAnimationDelayClass(index)}`}
          >
            <Card className={`h-full overflow-hidden border-2 transition-all ${bestModel === model ? 'border-primary' : 'border-border'}`}>
              <CardContent className="p-4">
                <div className={`flex items-center gap-2 mb-3 ${bestModel === model ? 'font-bold' : ''}`}>
                  <span className={`px-2 py-1 rounded-md ${modelInfo[model as keyof typeof modelInfo].color}`}>
                    {modelInfo[model as keyof typeof modelInfo].name}
                  </span>
                  {bestModel === model && <Trophy className="w-4 h-4 text-yellow-500" />}
                </div>
                
                <div className="space-y-3 mt-4">
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <div className="flex items-center gap-1.5">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>Accuracy</span>
                      </div>
                      <span className="font-medium">{metrics.accuracy}%</span>
                    </div>
                    {renderMetricBar(metrics.accuracy)}
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Response Time</span>
                      </div>
                      <span className="font-medium">{metrics.responseTime}ms</span>
                    </div>
                    {renderMetricBar(100 - (metrics.responseTime / 10), 100)}
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <div className="flex items-center gap-1.5">
                        <Brain className="w-3.5 h-3.5" />
                        <span>Reasoning</span>
                      </div>
                      <span className="font-medium">{metrics.reasoning}%</span>
                    </div>
                    {renderMetricBar(metrics.reasoning)}
                  </div>
                </div>
                
                <div className="mt-4 pt-3 border-t">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Overall Score</span>
                    <span className="text-lg font-bold">{metrics.overall}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mt-1.5">
                    <div 
                      className={`h-3 rounded-full ${bestModel === model ? 'bg-primary' : 'bg-gray-500'} ${getWidthClass(metrics.overall)}`}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
} 