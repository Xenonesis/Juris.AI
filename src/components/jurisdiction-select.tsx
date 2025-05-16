"use client";

import * as React from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
const localJurisdictions = [
  { value: "us", label: "United States" },
  { value: "uk", label: "United Kingdom" },
  { value: "ca", label: "Canada" },
  { value: "au", label: "Australia" },
  { value: "in", label: "India" },
  { value: "np", label: "Nepal" },
  { value: "cn", label: "China" },
  { value: "eu", label: "European Union" },
];

interface JurisdictionSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export function JurisdictionSelect({ value, onChange }: JurisdictionSelectProps) {
  return (
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
  );
}