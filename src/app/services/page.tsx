'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/supabase-auth-provider';
import {
  HeroSection,
  ServicesGrid,
  WhyChooseSection,
  PricingSection,
  ServiceComparison,
  TestimonialsSection,
  FAQSection,
  CTASection,
  LoadingSpinner
} from './components';

const ServicesPage = () => {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  // Show loading spinner while checking auth status
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // If user is logged in, they will be redirected, so we don't need to render anything
  if (user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-20 bg-gradient-to-br from-background via-slate-50/50 to-primary/5 dark:from-background dark:via-slate-900/50 dark:to-slate-900">
      <HeroSection />
      <ServicesGrid />
      <WhyChooseSection />
      <PricingSection />
      <ServiceComparison />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
    </div>
  );
};

export default ServicesPage;
