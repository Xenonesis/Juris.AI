"use client";

import { Scale } from "lucide-react";

export default function LogoTest() {
  return (
    <div className="min-h-screen p-8 bg-background">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-center">Logo Visibility Test</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Light Background Test */}
          <div className="p-6 bg-white rounded-lg border">
            <h2 className="text-lg font-semibold mb-4 text-gray-900">Light Background</h2>
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-2xl professional-gradient flex items-center justify-center shadow-lg">
                <Scale className="h-8 w-8 text-white" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))' }} />
              </div>
            </div>
          </div>

          {/* Gray Background Test */}
          <div className="p-6 bg-gray-100 rounded-lg border">
            <h2 className="text-lg font-semibold mb-4 text-gray-900">Gray Background</h2>
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-2xl professional-gradient flex items-center justify-center shadow-lg">
                <Scale className="h-8 w-8 text-white" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))' }} />
              </div>
            </div>
          </div>

          {/* Dark Background Test */}
          <div className="p-6 bg-gray-900 rounded-lg border">
            <h2 className="text-lg font-semibold mb-4 text-white">Dark Background</h2>
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-2xl professional-gradient flex items-center justify-center shadow-lg">
                <Scale className="h-8 w-8 text-white" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))' }} />
              </div>
            </div>
          </div>

          {/* Navigation Bar Style Test */}
          <div className="p-6 bg-background rounded-lg border">
            <h2 className="text-lg font-semibold mb-4">Navigation Style</h2>
            <div className="flex justify-center">
              <div className="relative w-9 h-9 flex items-center justify-center rounded-xl professional-gradient shadow-lg">
                <Scale className="h-5 w-5 text-white" style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.4))' }} />
              </div>
            </div>
          </div>

          {/* Large Logo Test */}
          <div className="p-6 bg-muted rounded-lg border">
            <h2 className="text-lg font-semibold mb-4">Large Logo</h2>
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-2xl professional-gradient flex items-center justify-center shadow-lg">
                <Scale className="h-10 w-10 text-white" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))' }} />
              </div>
            </div>
          </div>

          {/* Gradient Background Test */}
          <div className="p-6 gradient-bg-mesh rounded-lg border">
            <h2 className="text-lg font-semibold mb-4">Mesh Background</h2>
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-2xl professional-gradient flex items-center justify-center shadow-lg">
                <Scale className="h-8 w-8 text-white" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Color Information */}
        <div className="mt-12 p-6 bg-card rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Professional Gradient Colors</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-2">Light Mode:</h3>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>Start: #2563EB (Strong Blue)</li>
                <li>25%: #1D4ED8 (Deeper Blue)</li>
                <li>50%: #1E40AF (Rich Blue)</li>
                <li>75%: #1E3A8A (Dark Blue)</li>
                <li>End: #2563EB (Strong Blue)</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2">Dark Mode:</h3>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>Start: #60A5FA (Lighter Blue)</li>
                <li>25%: #3B82F6 (Standard Blue)</li>
                <li>50%: #2563EB (Professional Blue)</li>
                <li>75%: #1D4ED8 (Deeper Blue)</li>
                <li>End: #60A5FA (Lighter Blue)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* CSS Rules Applied */}
        <div className="mt-8 p-6 bg-card rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Applied CSS Rules</h2>
          <div className="text-sm space-y-2 text-muted-foreground font-mono">
            <p>.professional-gradient svg &#123; color: white !important; &#125;</p>
            <p>.professional-gradient [data-lucide="scale"] &#123; color: white !important; stroke: white !important; &#125;</p>
            <p>filter: drop-shadow(0 1px 2px rgba(0,0,0,0.5));</p>
          </div>
        </div>
      </div>
    </div>
  );
}
