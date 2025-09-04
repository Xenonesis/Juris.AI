/**
 * Optimized main landing page component
 * Refactored into smaller components with performance optimizations
 */

'use client';

import React, { memo, useEffect, lazy, Suspense } from 'react';
import { setupSectionTracking } from '@/lib/analytics';
import { SkipToContent } from './ui-components';

// Import hero section immediately (above the fold)
import { HeroSection } from './hero-section';

// Lazy load other sections for better performance
const InteractiveDemo = lazy(() => import('./interactive-demo').then(mod => ({ default: mod.InteractiveDemo })));
const HowItWorks = lazy(() => import('./how-it-works').then(mod => ({ default: mod.HowItWorks })));
const FeaturesSection = lazy(() => import('./features-section').then(mod => ({ default: mod.FeaturesSection })));
const AboutSection = lazy(() => import('./about-section').then(mod => ({ default: mod.AboutSection })));
const TestimonialsSection = lazy(() => import('./testimonials-section').then(mod => ({ default: mod.TestimonialsSection })));
const FAQSection = lazy(() => import('./faq-section').then(mod => ({ default: mod.FAQSection })));
const CTASection = lazy(() => import('./cta-section').then(mod => ({ default: mod.CTASection })));

/**
 * Loading fallback component for lazy-loaded sections
 */
const SectionLoadingFallback: React.FC = memo(() => (
  <div className="py-20 flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
  </div>
));

SectionLoadingFallback.displayName = 'SectionLoadingFallback';

const OptimizedLandingPage: React.FC = memo(() => {
  // Set up analytics tracking
  useEffect(() => {
    const cleanup = setupSectionTracking();
    return cleanup;
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SkipToContent targetId="main-content" />
      
      {/* Hero Section - Load immediately */}
      <HeroSection />

      {/* Lazy-loaded sections with Suspense boundaries */}
      <Suspense fallback={<SectionLoadingFallback />}>
        <InteractiveDemo />
      </Suspense>

      <Suspense fallback={<SectionLoadingFallback />}>
        <HowItWorks />
      </Suspense>

      <Suspense fallback={<SectionLoadingFallback />}>
        <FeaturesSection />
      </Suspense>

      <Suspense fallback={<SectionLoadingFallback />}>
        <AboutSection />
      </Suspense>

      <Suspense fallback={<SectionLoadingFallback />}>
        <TestimonialsSection />
      </Suspense>

      <Suspense fallback={<SectionLoadingFallback />}>
        <FAQSection />
      </Suspense>

      <Suspense fallback={<SectionLoadingFallback />}>
        <CTASection />
      </Suspense>
    </div>
  );
});

OptimizedLandingPage.displayName = 'OptimizedLandingPage';

export default OptimizedLandingPage;
