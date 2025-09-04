'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <header className="text-center mb-16 md:mb-20">
      <div className="inline-block mb-6 bg-gradient-to-br from-primary/10 to-primary/20 p-4 rounded-2xl border border-primary/20 shadow-lg shadow-primary/10">
        <Sparkles className="h-12 w-12 text-primary" />
      </div>
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent mb-6">
        Legal Services
      </h1>
      <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
        Comprehensive AI-powered legal services designed to assist lawyers, legal professionals, and individuals with their legal needs.
      </p>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-12">
        <div className="text-center">
          <div className="text-2xl md:text-3xl font-bold text-primary mb-2">4+</div>
          <div className="text-sm text-muted-foreground">AI Models</div>
        </div>
        <div className="text-center">
          <div className="text-2xl md:text-3xl font-bold text-primary mb-2">50+</div>
          <div className="text-sm text-muted-foreground">Jurisdictions</div>
        </div>
        <div className="text-center">
          <div className="text-2xl md:text-3xl font-bold text-primary mb-2">24/7</div>
          <div className="text-sm text-muted-foreground">Availability</div>
        </div>
        <div className="text-center">
          <div className="text-2xl md:text-3xl font-bold text-primary mb-2">99%</div>
          <div className="text-sm text-muted-foreground">Accuracy</div>
        </div>
      </div>
    </header>
  );
};
