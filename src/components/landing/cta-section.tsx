/**
 * Final call-to-action section component for landing page
 * Contains the main conversion buttons at the end of the page
 */

'use client';

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';
import Link from 'next/link';
import { itemVariants } from '@/lib/motion-variants';
import { trackButtonClick } from '@/lib/analytics';
import { AnimatedSection } from './ui-components';

const CTASection: React.FC = memo(() => {
  return (
    <AnimatedSection 
      className="py-20 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-indigo-600/10"
      sectionName="final-cta"
      aria-label="Ready to transform your legal practice - final call to action"
    >
      <div className="container mx-auto px-4 text-center">
        <motion.div variants={itemVariants}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
            Ready to Transform Your <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Legal Practice?</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 sm:mb-12 leading-relaxed">
            Join 50,000+ legal professionals who trust Juris.AI for accurate, fast, and reliable legal analysis. 
            Start your free trial today and experience the future of legal research.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
            <Link href="/auth/login" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                className="group w-full sm:w-auto px-8 sm:px-10 md:px-12 py-4 sm:py-5 md:py-6 text-lg sm:text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 rounded-full"
                onClick={() => trackButtonClick('Start Free Trial', 'Final CTA Section')}
                aria-label="Start your free trial - no credit card required"
              >
                Start Free Trial
                <Zap className="ml-2 sm:ml-3 h-5 w-5 sm:h-6 sm:w-6 transition-transform group-hover:scale-110" />
              </Button>
            </Link>
            <Link href="/services" className="w-full sm:w-auto">
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full sm:w-auto px-8 sm:px-10 md:px-12 py-4 sm:py-5 md:py-6 text-lg sm:text-xl font-semibold border-2 hover:bg-muted/50 transition-all duration-300 rounded-full"
                onClick={() => trackButtonClick('Explore Features', 'Final CTA Section')}
                aria-label="Explore all Juris.AI features and capabilities"
              >
                Explore Features
              </Button>
            </Link>
          </div>
          <div className="mt-6 sm:mt-8 text-xs sm:text-sm text-muted-foreground">
            No credit card required • 14-day free trial • Cancel anytime
          </div>
        </motion.div>
      </div>
    </AnimatedSection>
  );
});

CTASection.displayName = 'CTASection';

export { CTASection };
