'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, X, Zap, Clock, Users } from 'lucide-react';

interface ComparisonFeature {
  feature: string;
  free: boolean | string;
  pro: boolean | string;
  enterprise: boolean | string;
}

const comparisonFeatures: ComparisonFeature[] = [
  {
    feature: "Daily Queries",
    free: "5 per day",
    pro: "Unlimited",
    enterprise: "Unlimited"
  },
  {
    feature: "AI Models Access",
    free: "Basic (1 model)",
    pro: "All 4 models",
    enterprise: "All 4 models + Custom"
  },
  {
    feature: "Document Analysis",
    free: false,
    pro: true,
    enterprise: true
  },
  {
    feature: "Case Law Research",
    free: "Limited",
    pro: "Full access",
    enterprise: "Full access + API"
  },
  {
    feature: "Jurisdiction Support",
    free: "General",
    pro: "50+ jurisdictions",
    enterprise: "All + Custom"
  },
  {
    feature: "Win Estimation",
    free: false,
    pro: true,
    enterprise: true
  },
  {
    feature: "Priority Support",
    free: false,
    pro: true,
    enterprise: "Dedicated"
  },
  {
    feature: "API Access",
    free: false,
    pro: false,
    enterprise: true
  },
  {
    feature: "Custom Training",
    free: false,
    pro: false,
    enterprise: true
  }
];

const renderFeatureValue = (value: boolean | string) => {
  if (typeof value === 'boolean') {
    return value ? (
      <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
    ) : (
      <X className="h-5 w-5 text-muted-foreground/30 mx-auto" />
    );
  }
  return <span className="text-sm text-center">{value}</span>;
};

export const ServiceComparison: React.FC = () => {
  return (
    <section className="mb-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
          Service Comparison
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Compare features across our different service tiers to find the perfect fit.
        </p>
      </div>
      
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/30">
                <tr>
                  <th className="text-left p-4 font-semibold text-foreground">Features</th>
                  <th className="text-center p-4 font-semibold text-foreground">
                    <div className="flex flex-col items-center">
                      <span>Free</span>
                      <span className="text-2xl font-bold text-primary mt-1">$0</span>
                    </div>
                  </th>
                  <th className="text-center p-4 font-semibold text-foreground bg-primary/10">
                    <div className="flex flex-col items-center">
                      <span>Professional</span>
                      <span className="text-2xl font-bold text-primary mt-1">$29</span>
                    </div>
                  </th>
                  <th className="text-center p-4 font-semibold text-foreground">
                    <div className="flex flex-col items-center">
                      <span>Enterprise</span>
                      <span className="text-2xl font-bold text-primary mt-1">Custom</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((item, index) => (
                  <tr key={index} className={`border-t border-muted ${index % 2 === 0 ? 'bg-muted/10' : ''}`}>
                    <td className="p-4 font-medium text-foreground">{item.feature}</td>
                    <td className="p-4 text-center">{renderFeatureValue(item.free)}</td>
                    <td className="p-4 text-center bg-primary/5">{renderFeatureValue(item.pro)}</td>
                    <td className="p-4 text-center">{renderFeatureValue(item.enterprise)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 shadow-lg shadow-blue-100 dark:shadow-none hover:shadow-xl transition-all duration-300">
          <Zap className="h-8 w-8 text-blue-700 dark:text-blue-400 mx-auto mb-3" />
          <div className="text-2xl font-bold text-blue-700 dark:text-blue-400 mb-2">Instant</div>
          <div className="text-sm text-muted-foreground">Response Time</div>
        </div>

        <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:bg-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800 shadow-lg shadow-emerald-100 dark:shadow-none hover:shadow-xl transition-all duration-300">
          <Clock className="h-8 w-8 text-emerald-700 dark:text-emerald-400 mx-auto mb-3" />
          <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 mb-2">24/7</div>
          <div className="text-sm text-muted-foreground">Availability</div>
        </div>

        <div className="text-center p-6 bg-gradient-to-br from-violet-50 to-violet-100 dark:bg-violet-900/20 rounded-xl border border-violet-200 dark:border-violet-800 shadow-lg shadow-violet-100 dark:shadow-none hover:shadow-xl transition-all duration-300">
          <Users className="h-8 w-8 text-violet-700 dark:text-violet-400 mx-auto mb-3" />
          <div className="text-2xl font-bold text-violet-700 dark:text-violet-400 mb-2">10K+</div>
          <div className="text-sm text-muted-foreground">Active Users</div>
        </div>
      </div>
    </section>
  );
};
