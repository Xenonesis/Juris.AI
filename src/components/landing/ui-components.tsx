/**
 * Reusable UI components for landing page
 * Common patterns and elements used across sections
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { containerVariants, itemVariants, floatingVariants } from '@/lib/motion-variants';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  sectionName?: string;
  'aria-label'?: string;
}

/**
 * Animated section wrapper with intersection observer support
 */
export const AnimatedSection: React.FC<AnimatedSectionProps> = ({ 
  children, 
  className = "", 
  sectionName,
  'aria-label': ariaLabel 
}) => {
  return (
    <motion.section
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
      data-section={sectionName}
      aria-label={ariaLabel}
    >
      {children}
    </motion.section>
  );
};

/**
 * Floating background elements for hero section
 */
export const FloatingBackgrounds: React.FC = () => {
  return (
    <div className="absolute inset-0 -z-10">
      <motion.div 
        className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"
        variants={floatingVariants}
        animate="animate"
      />
      <motion.div 
        className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-600/20 rounded-full blur-3xl"
        variants={floatingVariants}
        animate="animate"
        transition={{ delay: 2 }}
      />
      <motion.div 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-indigo-400/10 to-cyan-600/10 rounded-full blur-3xl"
        variants={floatingVariants}
        animate="animate"
        transition={{ delay: 4 }}
      />
    </div>
  );
};

interface TrustIndicatorsProps {
  indicators: Array<{
    label: string;
    color: string;
  }>;
  className?: string;
}

/**
 * Trust indicators with pulsing dots
 */
export const TrustIndicators: React.FC<TrustIndicatorsProps> = ({ indicators, className = "" }) => {
  return (
    <motion.div 
      variants={itemVariants}
      className={`flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-muted-foreground ${className}`}
    >
      {indicators.map((indicator, index) => (
        <div key={index} className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${indicator.color} animate-pulse`} />
          <span className="font-medium">{indicator.label}</span>
        </div>
      ))}
    </motion.div>
  );
};

interface SectionHeaderProps {
  title: string;
  subtitle: string;
  highlightWords?: string[];
}

/**
 * Standard section header with title and subtitle
 */
export const SectionHeader: React.FC<SectionHeaderProps> = ({ 
  title, 
  subtitle, 
  highlightWords = [] 
}) => {
  const renderTitle = () => {
    if (highlightWords.length === 0) {
      return <h2 className="text-4xl md:text-5xl font-bold mb-6">{title}</h2>;
    }

    let formattedTitle = title;
    highlightWords.forEach(word => {
      formattedTitle = formattedTitle.replace(
        word,
        `<span class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">${word}</span>`
      );
    });

    return (
      <h2 
        className="text-4xl md:text-5xl font-bold mb-6"
        dangerouslySetInnerHTML={{ __html: formattedTitle }}
      />
    );
  };

  return (
    <motion.div variants={itemVariants} className="text-center mb-16">
      {renderTitle()}
      <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
        {subtitle}
      </p>
    </motion.div>
  );
};

interface GradientBadgeProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Gradient badge for trust indicators and highlights
 */
export const GradientBadge: React.FC<GradientBadgeProps> = ({ children, className = "" }) => {
  return (
    <Badge 
      variant="secondary" 
      className={`px-6 py-3 text-sm font-medium bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20 rounded-full ${className}`}
    >
      {children}
    </Badge>
  );
};

interface SkipToContentProps {
  targetId: string;
}

/**
 * Skip to main content link for accessibility
 */
export const SkipToContent: React.FC<SkipToContentProps> = ({ targetId }) => {
  const skipToMain = () => {
    const mainContent = document.getElementById(targetId);
    if (mainContent) {
      mainContent.focus();
    }
  };

  return (
    <a
      href={`#${targetId}`}
      onClick={(e) => {
        e.preventDefault();
        skipToMain();
      }}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50 focus:outline-none focus:ring-2 focus:ring-primary/50"
    >
      Skip to main content
    </a>
  );
};
