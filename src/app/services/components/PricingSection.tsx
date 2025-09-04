'use client';

import React from 'react';
import { PricingCard } from './PricingCard';

export const PricingSection: React.FC = () => {
  return (
    <section className="mb-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
          Service Pricing
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Choose the plan that best fits your legal needs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <PricingCard
          title="Free"
          price="$0"
          period="per month"
          features={[
            { text: "5 queries per day", included: true },
            { text: "Basic AI consultation", included: true },
            { text: "General jurisdiction support", included: true },
            { text: "Multi-model comparison", included: false },
            { text: "Document analysis", included: false }
          ]}
          buttonText="Get Started Free"
          buttonVariant="outline"
        />

        <PricingCard
          title="Professional"
          price="$29"
          period="per month"
          features={[
            { text: "Unlimited queries", included: true },
            { text: "Multi-model AI comparison", included: true },
            { text: "Document analysis", included: true },
            { text: "Case law research", included: true },
            { text: "Priority support", included: true }
          ]}
          buttonText="Start Pro Trial"
          popular={true}
        />

        <PricingCard
          title="Enterprise"
          price="Custom"
          period="pricing"
          features={[
            { text: "Everything in Pro", included: true },
            { text: "Custom AI training", included: true },
            { text: "API access", included: true },
            { text: "Dedicated support", included: true },
            { text: "White-label solution", included: true }
          ]}
          buttonText="Contact Sales"
          buttonVariant="outline"
        />
      </div>
    </section>
  );
};
