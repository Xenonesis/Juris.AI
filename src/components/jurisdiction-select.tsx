"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Star, StarOff } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { saveDefaultJurisdiction, getDefaultJurisdiction } from "@/lib/user-preferences";
import { useToast } from "@/components/ui/use-toast";

// Export jurisdictions so they can be used in other components
export const localJurisdictions = [
  { value: "us", label: "United States" },
  { value: "uk", label: "United Kingdom" },
  { value: "ca", label: "Canada" },
  { value: "au", label: "Australia" },
  { value: "in", label: "India" },
  { value: "np", label: "Nepal" },
  { value: "cn", label: "China" },
  { value: "eu", label: "European Union" },
];

export function getJurisdictionLabel(value: string): string {
  const jurisdiction = localJurisdictions.find(j => j.value === value);
  return jurisdiction ? jurisdiction.label : value;
}

interface JurisdictionSelectProps {
  value: string;
  onChange: (value: string) => void;
  allowSetDefault?: boolean;
}

export function JurisdictionSelect({ value, onChange, allowSetDefault = true }: JurisdictionSelectProps) {
  const [isDefault, setIsDefault] = useState(false);
  const { toast } = useToast();
  
  // Check if current jurisdiction is the default one
  useEffect(() => {
    const defaultJurisdiction = getDefaultJurisdiction();
    setIsDefault(value === defaultJurisdiction);
  }, [value]);
  
  // Set current jurisdiction as default
  const handleSetDefault = () => {
    saveDefaultJurisdiction(value);
    setIsDefault(true);
    
    toast({
      title: "Default jurisdiction set",
      description: `${getJurisdictionLabel(value)} is now your default jurisdiction`,
      duration: 3000,
    });
  };
  
  // Remove default jurisdiction setting
  const handleRemoveDefault = () => {
    saveDefaultJurisdiction("");
    setIsDefault(false);
    
    toast({
      title: "Default jurisdiction removed",
      description: "No default jurisdiction is set",
      duration: 3000,
    });
  };
  
  return (
    <div className="flex items-center gap-2">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select jurisdiction..." />
        </SelectTrigger>
        <SelectContent>
          {localJurisdictions.map((jurisdiction) => (
            <SelectItem key={jurisdiction.value} value={jurisdiction.value}>
              {jurisdiction.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {allowSetDefault && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={isDefault ? handleRemoveDefault : handleSetDefault}
              >
                {isDefault ? (
                  <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                ) : (
                  <StarOff className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {isDefault ? "Remove as default jurisdiction" : "Set as default jurisdiction"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
}