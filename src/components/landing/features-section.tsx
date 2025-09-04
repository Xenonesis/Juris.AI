/**
 * Features section component for landing page
 * Displays the 6 main features with icons and descriptions
 */

'use client';

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { itemVariants, hoverCardVariants } from '@/lib/motion-variants';
import { features } from '@/lib/landing-data';
import { AnimatedSection, SectionHeader } from './ui-components';

const FeaturesSection: React.FC = memo(() => {
  return (
    <AnimatedSection 
      className="py-20"
      sectionName="features"
      aria-label="Powerful features of Juris.AI"
    >
      <div className="container mx-auto px-4">
        <SectionHeader 
          title="Powerful Features"
          subtitle="Discover the comprehensive suite of AI-powered tools designed specifically for legal professionals"
          highlightWords={["Features"]}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              whileHover={hoverCardVariants.hover}
            >
              <Card className="p-6 sm:p-8 h-full border-0 bg-background/50 backdrop-blur-sm hover:bg-background/80 transition-all duration-300 hover:shadow-xl group">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-foreground">{feature.title}</h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
});

FeaturesSection.displayName = 'FeaturesSection';

export { FeaturesSection };
