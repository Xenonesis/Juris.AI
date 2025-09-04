/**
 * About section component for landing page
 * Contains mission statement and trust indicators
 */

'use client';

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Info } from 'lucide-react';
import { itemVariants } from '@/lib/motion-variants';
import { aboutMissionPoints, aboutTrustIndicators } from '@/lib/landing-data';
import { AnimatedSection, SectionHeader, TrustIndicators } from './ui-components';

const AboutSection: React.FC = memo(() => {
  return (
    <AnimatedSection 
      className="py-20 bg-gradient-to-br from-blue-50/30 to-purple-50/30 dark:from-blue-950/10 dark:to-purple-950/10"
      sectionName="about"
      aria-label="About Juris.AI"
    >
      <div className="container mx-auto px-4">
        <SectionHeader 
          title="About Juris.AI"
          subtitle="Revolutionizing the legal landscape with accessible, intelligent, and user-friendly AI-powered tools"
          highlightWords={["Juris.AI"]}
        />

        {/* Mission */}
        <motion.div variants={itemVariants} className="max-w-5xl mx-auto mb-16">
          <Card className="p-8 border-0 bg-background/80 backdrop-blur-sm shadow-xl">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                <Info className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">Our Mission</h3>
                <p className="text-lg md:text-xl font-semibold text-foreground mb-4">
                  Empowering everyone with accessible legal understanding.
                </p>
              </div>
            </div>
            
            <div className="space-y-4 text-muted-foreground text-base md:text-lg leading-relaxed">
              <p>
                At Juris.AI, our mission is to <strong className="text-foreground">democratize access to legal information and resources</strong> using advanced artificial intelligence. We understand that the legal landscape can be complex and intimidating, creating significant barriers for individuals and even professionals.
              </p>
              <p>
                We believe that understanding your rights and navigating legal matters shouldn&apos;t require extensive legal training or prohibitive costs. Juris.AI is built as your <strong className="text-foreground">intelligent and intuitive legal partner</strong>, designed to make legal concepts understandable and actionable for everyone.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                {aboutMissionPoints.map((point, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${point.color}`}></div>
                      <strong className="text-foreground">{point.title}</strong>
                    </div>
                    <p className="text-sm text-muted-foreground ml-5">
                      {point.description}
                    </p>
                  </div>
                ))}
              </div>
              
              <p className="mt-6">
                We are dedicated to the continuous evolution of our AI capabilities and the expansion of our services, ensuring Juris.AI remains a <strong className="text-foreground">trusted, ethical, and essential tool</strong> in the dynamic legal technology space.
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-8 mb-12">
          {aboutTrustIndicators.map((indicator, index) => (
            <div key={index} className="flex items-center gap-3 px-6 py-3 rounded-full bg-background/60 backdrop-blur-sm border border-primary/20">
              <div className={`w-3 h-3 rounded-full ${indicator.color} animate-pulse`}></div>
              <span className="text-sm font-medium text-foreground">{indicator.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </AnimatedSection>
  );
});

AboutSection.displayName = 'AboutSection';

export { AboutSection };
