'use client';

import React from 'react';
import { Zap, Shield, Target } from 'lucide-react';
import { FeatureHighlight } from './FeatureHighlight';

export const WhyChooseSection: React.FC = () => {
  return (
    <section className="mb-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
          Why Choose Juris.AI Services?
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Our AI-powered legal services combine cutting-edge technology with comprehensive legal knowledge.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <FeatureHighlight
          icon={<Zap className="h-8 w-8 text-blue-700 dark:text-blue-400" />}
          title="Lightning Fast"
          description="Get instant legal insights and analysis in seconds, not hours or days."
          color="bg-gradient-to-br from-blue-50 to-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 shadow-lg shadow-blue-100 dark:shadow-none"
        />

        <FeatureHighlight
          icon={<Shield className="h-8 w-8 text-emerald-700 dark:text-emerald-400" />}
          title="Secure & Private"
          description="Your legal documents and queries are protected with enterprise-grade security."
          color="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 shadow-lg shadow-emerald-100 dark:shadow-none"
        />

        <FeatureHighlight
          icon={<Target className="h-8 w-8 text-violet-700 dark:text-violet-400" />}
          title="Highly Accurate"
          description="Powered by multiple AI models trained on extensive legal databases for maximum accuracy."
          color="bg-gradient-to-br from-violet-50 to-violet-100 dark:bg-violet-900/30 border border-violet-200 dark:border-violet-800 shadow-lg shadow-violet-100 dark:shadow-none"
        />
      </div>
    </section>
  );
};
