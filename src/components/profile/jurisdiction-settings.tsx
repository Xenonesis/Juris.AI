"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { JurisdictionSelect, localJurisdictions } from "@/components/jurisdiction-select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { getDefaultJurisdiction, saveDefaultJurisdiction } from "@/lib/user-preferences";
import { useToast } from "@/components/ui/use-toast";
import { Globe } from "lucide-react";

export function JurisdictionSettings() {
  const [defaultJurisdiction, setDefaultJurisdiction] = useState("");
  const { toast } = useToast();

  // Load default jurisdiction when component mounts
  useEffect(() => {
    const savedJurisdiction = getDefaultJurisdiction();
    setDefaultJurisdiction(savedJurisdiction || "us"); // Fallback to US if not set
  }, []);

  // Save default jurisdiction
  const handleSave = () => {
    saveDefaultJurisdiction(defaultJurisdiction);
    
    toast({
      title: "Default jurisdiction saved",
      description: `Your default jurisdiction has been set to ${getJurisdictionLabel(defaultJurisdiction)}`,
      duration: 3000,
    });
  };

  // Reset to default (US)
  const handleReset = () => {
    setDefaultJurisdiction("us");
    saveDefaultJurisdiction("us");
    
    toast({
      title: "Default jurisdiction reset",
      description: "Your default jurisdiction has been reset to United States",
      duration: 3000,
    });
  };

  // Helper function to get jurisdiction label from value
  function getJurisdictionLabel(value: string): string {
    const jurisdiction = localJurisdictions.find(j => j.value === value);
    return jurisdiction ? jurisdiction.label : value;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-primary" />
          Default Jurisdiction
        </CardTitle>
        <CardDescription>
          Set your preferred jurisdiction for legal advice and case analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="default-jurisdiction">Default Jurisdiction</Label>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <JurisdictionSelect 
              value={defaultJurisdiction} 
              onChange={setDefaultJurisdiction}
              allowSetDefault={false}
            />
            <div className="flex gap-2">
              <Button onClick={handleSave} size="sm">
                Save Preference
              </Button>
              <Button onClick={handleReset} variant="outline" size="sm">
                Reset to Default
              </Button>
            </div>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground mt-4">
          This jurisdiction will be automatically selected when you open Juris.AI. 
          You can always change the jurisdiction for individual queries.
        </p>
      </CardContent>
    </Card>
  );
}
