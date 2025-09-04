/**
 * How It Works section component for landing page
 * Shows the 4-step workflow process
 */

'use client';

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { ChevronRight } from 'lucide-react';
import { itemVariants } from '@/lib/motion-variants';
import { workflowSteps } from '@/lib/landing-data';
import { AnimatedSection, SectionHeader } from './ui-components';

const HowItWorks: React.FC = memo(() => {
  return (
    <AnimatedSection 
      className="py-20 bg-muted/30"
      sectionName="how-it-works"
      aria-label="How Juris.AI works - 4-step process"
    >
      <div className="container mx-auto px-4">
        <SectionHeader 
          title="How Juris.AI Works"
          subtitle="Experience the simplest way to get professional legal insights in just four easy steps"
          highlightWords={["Juris.AI"]}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {workflowSteps.map((step, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              className="relative"
            >
              <Card className="p-6 sm:p-8 h-full border-0 bg-background/80 backdrop-blur-sm hover:bg-background transition-all duration-300 hover:shadow-xl group text-center">
                <div className="relative mb-4 sm:mb-6">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                    <step.icon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold text-xs sm:text-sm">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-foreground">{step.title}</h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{step.description}</p>
              </Card>
              {index < workflowSteps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <ChevronRight className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
});

HowItWorks.displayName = 'HowItWorks';

export { HowItWorks };
