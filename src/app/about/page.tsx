import React from 'react';
import { Metadata } from "next";
import AboutHeader from './components/AboutHeader';
import MissionSection from './components/MissionSection';
import FeaturesSection from './components/FeaturesSection';
import TeamSection from './components/TeamSection';
import ContactSection from './components/ContactSection';
import ValueSection from './components/ValueSection';
import TimelineSection from './components/TimelineSection';
import StatisticsSection from './components/StatisticsSection';
import PartnersSection from './components/PartnersSection';
import DocumentationSection from './components/DocumentationSection';

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
      <DocumentationSection />
      <ContactSection />
    </div>
  );
};

export default AboutPage;