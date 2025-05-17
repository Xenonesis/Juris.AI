import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, LayoutDashboard, Scale, Building } from "lucide-react";
import './timeline.css';

const TimelineSection = () => {
  return (
    <section className="mb-16 md:mb-20">
      <h2 className="text-3xl md:text-4xl font-semibold text-center mb-12 text-foreground">
        Our Journey
      </h2>
      <div className="relative">
        {/* Central line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-primary/20 dark:bg-primary/10 rounded-full"></div>
        
        {/* Timeline items */}
        <div className="space-y-16">
          {/* Item 1 - Planning */}
          <div className="relative flex flex-col md:flex-row items-center md:items-start">
            <div className="md:w-1/2 md:pr-12 md:text-right mb-6 md:mb-0 animate-fadeInLeft delay-200">
              <div className="bg-card shadow-md p-6 rounded-lg border border-border inline-block hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold mb-2 flex items-center justify-end">
                  <span>Initial Planning</span>
                  <Lightbulb className="ml-2 h-5 w-5 text-primary" />
                </h3>
                <p className="text-muted-foreground">May 12, 2025</p>
                <p className="mt-3">The journey began with planning and conceptualization of Juris.Ai, outlining its core features and objectives to revolutionize legal services.</p>
              </div>
            </div>
            <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center">
              <div className="w-8 h-8 bg-primary rounded-full z-10 flex items-center justify-center shadow-lg">
                <div className="w-4 h-4 bg-background rounded-full"></div>
              </div>
            </div>
            <div className="md:w-1/2 md:pl-12 md:text-left">
              {/* Empty on right side for first item */}
            </div>
          </div>

          {/* Item 2 - Designing */}
          <div className="relative flex flex-col md:flex-row items-center md:items-start">
            <div className="md:w-1/2 md:pr-12 md:text-right mb-6 md:mb-0">
              {/* Empty on left side for second item */}
            </div>
            <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center">
              <div className="w-8 h-8 bg-primary rounded-full z-10 flex items-center justify-center shadow-lg">
                <div className="w-4 h-4 bg-background rounded-full"></div>
              </div>
            </div>
            <div className="md:w-1/2 md:pl-12 md:text-left animate-fadeInRight delay-400">
              <div className="bg-card shadow-md p-6 rounded-lg border border-border inline-block hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold mb-2 flex items-center">
                  <LayoutDashboard className="mr-2 h-5 w-5 text-primary" />
                  <span>Design & Architecture</span>
                </h3>
                <p className="text-muted-foreground">May 13, 2025</p>
                <p className="mt-3">The team focused on designing the user interface and system architecture, ensuring a seamless and intuitive experience for all users.</p>
              </div>
            </div>
          </div>

          {/* Item 3 - Beta Version */}
          <div className="relative flex flex-col md:flex-row items-center md:items-start">
            <div className="md:w-1/2 md:pr-12 md:text-right mb-6 md:mb-0 animate-fadeInLeft delay-600">
              <div className="bg-card shadow-md p-6 rounded-lg border border-border inline-block hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold mb-2 flex items-center justify-end">
                  <span>Beta Version Release</span>
                  <Scale className="ml-2 h-5 w-5 text-primary" />
                </h3>
                <p className="text-muted-foreground">May 14, 2025</p>
                <p className="mt-3">The first beta version of Juris.Ai was successfully created and deployed, offering core legal AI functionality for initial testing and feedback.</p>
              </div>
            </div>
            <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center">
              <div className="w-8 h-8 bg-primary rounded-full z-10 flex items-center justify-center shadow-lg">
                <div className="w-4 h-4 bg-background rounded-full"></div>
              </div>
            </div>
            <div className="md:w-1/2 md:pl-12 md:text-left">
              {/* Empty on right side for third item */}
            </div>
          </div>

          {/* Item 4 - Present Day */}
          <div className="relative flex flex-col md:flex-row items-center md:items-start">
            <div className="md:w-1/2 md:pr-12 md:text-right mb-6 md:mb-0">
              {/* Empty on left side for fourth item */}
            </div>
            <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center">
              <div className="w-8 h-8 bg-primary rounded-full z-10 flex items-center justify-center shadow-lg animate-pulse">
                <div className="w-4 h-4 bg-background rounded-full"></div>
              </div>
            </div>
            <div className="md:w-1/2 md:pl-12 md:text-left animate-fadeInRight delay-800">
              <div className="bg-card shadow-md p-6 rounded-lg border border-border inline-block border-primary/30 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold mb-2 flex items-center">
                  <Building className="mr-2 h-5 w-5 text-primary" />
                  <span>Continuous Improvement</span>
                </h3>
                <p className="text-muted-foreground">May 17, 2025</p>
                <p className="mt-3">Today, we continue to refine and enhance Juris.Ai with improved features, expanded legal coverage, and optimized AI capabilities based on user feedback.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;
