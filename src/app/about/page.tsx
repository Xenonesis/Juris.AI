import React from 'react';
import { Metadata } from "next";
import Link from 'next/link';
import AboutHeader from './components/AboutHeader';
import MissionSection from './components/MissionSection';
import FeaturesSection from './components/FeaturesSection';
import TeamSection from './components/TeamSection';
import ContactSection from './components/ContactSection';
import ValueSection from './components/ValueSection';
import TimelineSection from './components/TimelineSection';
import StatisticsSection from './components/StatisticsSection';
import PartnersSection from './components/PartnersSection';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: "About Juris.Ai",
  description: "Learn more about Juris.Ai, its mission, features, and the team behind it.",
};

const AboutPage = () => {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24 bg-gradient-to-b from-background to-slate-50 dark:from-background dark:to-slate-900">
      <AboutHeader />
      <MissionSection />
      <ValueSection />
      <StatisticsSection />
      <FeaturesSection />
      <TimelineSection />
      <PartnersSection />
      <TeamSection />
      {/* Documentation Section Link */}
      <section className="text-center my-16 md:my-20">
        <h2 className="text-3xl md:text-4xl font-semibold mb-8 text-foreground">
          Explore Our Project Documentation
        </h2>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Dive deeper into the technical details, architecture, and setup of Juris.Ai by visiting our comprehensive documentation page.
        </p>
        <Link href="/docs" passHref>
          <Button size="lg" className="group">
            Go to Documentation
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </section>
      <ContactSection />
    </div>
  );
};

export default AboutPage;