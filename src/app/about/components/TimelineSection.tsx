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
        <div className="space-y-20">
          {/* Item 1 - Planning */}
          <div className="relative flex flex-col md:flex-row items-center md:items-start">
            <div className="md:w-1/2 md:pr-16 md:text-right mb-8 md:mb-0 animate-fadeInLeft delay-200">
              <Card className="shadow-lg p-6 rounded-lg border border-border inline-block hover:shadow-xl transition-shadow bg-card/80 backdrop-blur-sm">
                <CardHeader className="p-0 pb-2">
                  <CardTitle className="text-xl font-semibold flex items-center justify-end text-foreground">
                    <span>Initial Planning</span>
                    <Lightbulb className="ml-2 h-5 w-5 text-primary" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 text-muted-foreground text-sm leading-relaxed">
                  <p className="text-xs italic mb-2">May 12, 2025</p>
                  <p>The journey began with planning and conceptualization of Juris.Ai, outlining its core features and objectives to revolutionize legal services.</p>
                </CardContent>
              </Card>
            </div>
            <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center">
              <div className="w-9 h-9 bg-primary rounded-full z-10 flex items-center justify-center shadow-lg">
                <div className="w-4 h-4 bg-background rounded-full"></div>
              </div>
            </div>
            <div className="md:w-1/2 md:pl-16 md:text-left">
              {/* Empty on right side for first item */}
            </div>
          </div>

          {/* Item 2 - Designing */}
          <div className="relative flex flex-col md:flex-row items-center md:items-start">
            <div className="md:w-1/2 md:pr-16 md:text-right mb-8 md:mb-0">
              {/* Empty on left side for second item */}
            </div>
            <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center">
              <div className="w-9 h-9 bg-primary rounded-full z-10 flex items-center justify-center shadow-lg">
                <div className="w-4 h-4 bg-background rounded-full"></div>
              </div>
            </div>
            <div className="md:w-1/2 md:pl-16 md:text-left animate-fadeInRight delay-400">
              <Card className="shadow-lg p-6 rounded-lg border border-border inline-block hover:shadow-xl transition-shadow bg-card/80 backdrop-blur-sm">
                <CardHeader className="p-0 pb-2">
                  <CardTitle className="text-xl font-semibold flex items-center text-foreground">
                    <LayoutDashboard className="mr-2 h-5 w-5 text-primary" />
                    <span>Design & Architecture</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 text-muted-foreground text-sm leading-relaxed">
                  <p className="text-xs italic mb-2">May 13, 2025</p>
                  <p>The team focused on designing the user interface and system architecture, ensuring a seamless and intuitive experience for all users.</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Item 3 - Beta Version */}
          <div className="relative flex flex-col md:flex-row items-center md:items-start">
            <div className="md:w-1/2 md:pr-16 md:text-right mb-8 md:mb-0 animate-fadeInLeft delay-600">
              <Card className="shadow-lg p-6 rounded-lg border border-border inline-block hover:shadow-xl transition-shadow bg-card/80 backdrop-blur-sm">
                <CardHeader className="p-0 pb-2">
                  <CardTitle className="text-xl font-semibold flex items-center justify-end text-foreground">
                    <span>Beta Version Release</span>
                    <Scale className="ml-2 h-5 w-5 text-primary" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 text-muted-foreground text-sm leading-relaxed">
                  <p className="text-xs italic mb-2">May 14, 2025</p>
                  <p>The first beta version of Juris.Ai was successfully created and deployed, offering core legal AI functionality for initial testing and feedback.</p>
                </CardContent>
              </Card>
            </div>
            <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center">
              <div className="w-9 h-9 bg-primary rounded-full z-10 flex items-center justify-center shadow-lg">
                <div className="w-4 h-4 bg-background rounded-full"></div>
              </div>
            </div>
            <div className="md:w-1/2 md:pl-16 md:text-left">
              {/* Empty on right side for third item */}
            </div>
          </div>

          {/* Item 4 - Present Day */}
          <div className="relative flex flex-col md:flex-row items-center md:items-start">
            <div className="md:w-1/2 md:pr-16 md:text-right mb-8 md:mb-0">
              {/* Empty on left side for fourth item */}
            </div>
            <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center">
              <div className="w-9 h-9 bg-primary rounded-full z-10 flex items-center justify-center shadow-lg animate-pulse">
                <div className="w-4 h-4 bg-background rounded-full"></div>
              </div>
            </div>
            <div className="md:w-1/2 md:pl-16 md:text-left animate-fadeInRight delay-800">
              <Card className="shadow-lg p-6 rounded-lg border border-primary/30 inline-block hover:shadow-xl transition-shadow bg-card/80 backdrop-blur-sm">
                <CardHeader className="p-0 pb-2">
                  <CardTitle className="text-xl font-semibold flex items-center text-foreground">
                    <Building className="mr-2 h-5 w-5 text-primary" />
                    <span>Continuous Improvement</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 text-muted-foreground text-sm leading-relaxed">
                  <p className="text-xs italic mb-2">May 17, 2025</p>
                  <p>Today, we continue to refine and enhance Juris.Ai with improved features, expanded legal coverage, and optimized AI capabilities based on user feedback.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;
