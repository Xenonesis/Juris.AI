/**
 * Hero section component for landing page
 * Contains logo, main heading, CTA buttons, and trust indicators
 */

'use client';

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Scale, Sparkles, ArrowRight, Star, PlayCircle } from 'lucide-react';
import Link from 'next/link';
import { containerVariants, itemVariants, rotateAnimation } from '@/lib/motion-variants';
import { trackButtonClick } from '@/lib/analytics';
import { trustIndicators } from '@/lib/landing-data';
import { FloatingBackgrounds, TrustIndicators, GradientBadge } from './ui-components';

const HeroSection: React.FC = memo(() => {
  return (
    <motion.section 
      id="main-content"
      className="relative py-20 lg:py-32 overflow-hidden"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      data-section="hero"
      tabIndex={-1}
      aria-label="Hero section - Introduction to Juris.AI"
    >
      <FloatingBackgrounds />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-6xl mx-auto">
          {/* Logo and Badge */}
          <motion.div variants={itemVariants} className="flex items-center justify-center mb-8">
            <div className="relative">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-2xl">
                <Scale className="h-12 w-12 text-white" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }} />
              </div>
              <motion.div 
                className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center"
                animate={rotateAnimation.animate}
                transition={rotateAnimation.transition}
              >
                <Sparkles className="h-4 w-4 text-white" />
              </motion.div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="mb-6">
            <GradientBadge>
              <Star className="w-4 h-4 mr-2 text-yellow-500" />
              Trusted by 50,000+ Legal Professionals Worldwide
            </GradientBadge>
          </motion.div>

          {/* Main Heading */}
          <motion.h1 
            variants={itemVariants}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold tracking-tight mb-6 sm:mb-8 px-4 sm:px-0"
          >
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
              Your AI Legal
            </span>
            <br />
            <span className="text-foreground">Research Assistant</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            variants={itemVariants}
            className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-8 sm:mb-12 px-4 sm:px-0"
          >
            Get instant, accurate legal insights powered by advanced AI. From contract analysis to case research, 
            <strong className="text-foreground"> Juris.AI</strong> delivers professional-grade legal assistance in seconds.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-12 sm:mb-16 px-4 sm:px-0"
          >
            <Link href="/auth/login" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                className="group w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 text-base sm:text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 rounded-full"
                onClick={() => trackButtonClick('Start Free Analysis', 'Hero Section')}
                aria-label="Start free legal analysis with Juris.AI"
              >
                Start Free Analysis
                <ArrowRight className="ml-2 sm:ml-3 h-4 sm:h-5 w-4 sm:w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="#demo" className="w-full sm:w-auto">
              <Button 
                variant="outline" 
                size="lg" 
                className="group w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 text-base sm:text-lg font-semibold border-2 hover:bg-muted/50 transition-all duration-300 rounded-full"
                onClick={() => trackButtonClick('Watch Demo', 'Hero Section')}
                aria-label="Watch interactive demo of Juris.AI"
              >
                <PlayCircle className="mr-2 sm:mr-3 h-4 sm:h-5 w-4 sm:w-5" />
                Watch Demo
              </Button>
            </Link>
          </motion.div>

          {/* Trust Indicators */}
          <TrustIndicators indicators={trustIndicators} className="px-4 sm:px-0" />
        </div>
      </div>
    </motion.section>
  );
});

HeroSection.displayName = 'HeroSection';

export { HeroSection };
