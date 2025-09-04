"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { JurisdictionSelect, localJurisdictions } from "@/components/jurisdiction-select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { getDefaultJurisdiction, saveDefaultJurisdiction } from "@/lib/user-preferences";
import { useToast } from "@/components/ui/use-toast";
import { Globe, MapPin, Check, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";

export function JurisdictionSettings() {
  const [defaultJurisdiction, setDefaultJurisdiction] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const savedJurisdiction = getDefaultJurisdiction();
    setDefaultJurisdiction(savedJurisdiction || "us");
  }, []);

  const handleSave = async () => {
    setIsLoading(true);
    
    // Simulate API call delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));
    
    saveDefaultJurisdiction(defaultJurisdiction);
    
    toast({
      title: "✅ Jurisdiction Updated",
      description: `Default set to ${getJurisdictionLabel(defaultJurisdiction)}`,
      duration: 3000,
    });
    
    setIsLoading(false);
  };

  const handleReset = async () => {
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setDefaultJurisdiction("us");
    saveDefaultJurisdiction("us");
    
    toast({
      title: "🔄 Jurisdiction Reset",
      description: "Default jurisdiction reset to United States",
      duration: 3000,
    });
    
    setIsLoading(false);
  };

  function getJurisdictionLabel(value: string): string {
    const jurisdiction = localJurisdictions.find(j => j.value === value);
    return jurisdiction ? jurisdiction.label : value;
  }

  const currentJurisdiction = localJurisdictions.find(j => j.value === defaultJurisdiction);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="shadow-xl border-muted/50 bg-card/80 backdrop-blur-sm overflow-hidden">
        <CardHeader className="border-b border-muted/30 bg-gradient-to-r from-muted/20 to-transparent">
          <CardTitle className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
              <Globe className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="text-xl font-semibold">Jurisdiction Settings</div>
              <CardDescription className="text-sm">
                Configure your preferred legal jurisdiction for personalized advice
              </CardDescription>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-8 space-y-6">
          {/* Current Selection Display */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-200 dark:border-emerald-800">
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <div>
                <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200">
                  Current Default Jurisdiction
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-lg font-semibold text-emerald-900 dark:text-emerald-100">
                    {currentJurisdiction?.label || "United States"}
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {defaultJurisdiction.toUpperCase()}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Jurisdiction Selector */}
          <div className="space-y-4">
            <Label htmlFor="default-jurisdiction" className="text-base font-medium">
              Select Default Jurisdiction
            </Label>
            
            <div className="space-y-4">
              <JurisdictionSelect 
                value={defaultJurisdiction} 
                onChange={setDefaultJurisdiction}
                allowSetDefault={false}
              />
              
              <div className="flex flex-wrap gap-3">
                <Button 
                  onClick={handleSave} 
                  disabled={isLoading}
                  className="gap-2 min-w-[120px]"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Check className="h-4 w-4" />
                  )}
                  Save Changes
                </Button>
                
                <Button 
                  onClick={handleReset} 
                  variant="outline" 
                  disabled={isLoading}
                  className="gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset to US
                </Button>
              </div>
            </div>
          </div>

          {/* Information Section */}
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
              <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                How This Affects Your Experience
              </h4>
              <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                <li>• Legal advice will be tailored to your selected jurisdiction</li>
                <li>• Case law and statutes will prioritize your jurisdiction</li>
                <li>• You can still change jurisdiction for individual queries</li>
                <li>• AI responses will consider local legal practices and procedures</li>
              </ul>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-muted/30 border">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-sm font-medium">Supported Jurisdictions</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {localJurisdictions.length} jurisdictions available
                </p>
              </div>
              
              <div className="p-3 rounded-lg bg-muted/30 border">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span className="text-sm font-medium">Auto-Detection</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Smart jurisdiction detection in queries
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
