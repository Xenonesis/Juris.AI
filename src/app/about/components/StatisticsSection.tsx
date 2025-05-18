import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, BookOpen } from "lucide-react";

const StatisticsSection = () => {
  return (
    <section className="mb-16 md:mb-20">
      <h2 className="text-3xl md:text-4xl font-semibold text-center mb-12 text-foreground">
        Juris.Ai by the Numbers
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Stat 1 */}
        <Card className="text-center shadow-lg hover:shadow-xl transition-all duration-300 border border-border bg-card/80 backdrop-blur-sm group">
          <CardContent className="p-8">
            <div className="p-4 rounded-full bg-primary/10 w-20 h-20 mx-auto mb-4 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <BarChart3 className="h-8 w-8 text-primary" />
            </div>
            <div className="text-4xl font-bold text-foreground mb-2 group-hover:scale-105 transition-transform origin-center">
              10,000+
            </div>
            <p className="text-muted-foreground text-sm">Legal Queries Processed Daily</p>
          </CardContent>
        </Card>
        
        {/* Stat 2 */}
        <Card className="text-center shadow-lg hover:shadow-xl transition-all duration-300 border border-border bg-card/80 backdrop-blur-sm group">
          <CardContent className="p-8">
            <div className="p-4 rounded-full bg-primary/10 w-20 h-20 mx-auto mb-4 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
            <div className="text-4xl font-bold text-foreground mb-2 group-hover:scale-105 transition-transform origin-center">
              50+
            </div>
            <p className="text-muted-foreground text-sm">Legal Domains Covered</p>
          </CardContent>
        </Card>
        
        {/* Stat 3 */}
        <Card className="text-center shadow-lg hover:shadow-xl transition-all duration-300 border border-border bg-card/80 backdrop-blur-sm group">
          <CardContent className="p-8">
            <div className="p-4 rounded-full bg-primary/10 w-20 h-20 mx-auto mb-4 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
                <path d="M8.5 8.5v.01" />
                <path d="M16 15.5v.01" />
                <path d="M12 12v.01" />
                <path d="M11 17v.01" />
                <path d="M7 14v.01" />
              </svg>
            </div>
            <div className="text-4xl font-bold text-foreground mb-2 group-hover:scale-105 transition-transform origin-center">
              20+
            </div>
            <p className="text-muted-foreground text-sm">Jurisdictions Supported</p>
          </CardContent>
        </Card>
        
        {/* Stat 4 */}
        <Card className="text-center shadow-lg hover:shadow-xl transition-all duration-300 border border-border bg-card/80 backdrop-blur-sm group">
          <CardContent className="p-8">
            <div className="p-4 rounded-full bg-primary/10 w-20 h-20 mx-auto mb-4 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div className="text-4xl font-bold text-foreground mb-2 group-hover:scale-105 transition-transform origin-center">
              25,000+
            </div>
            <p className="text-muted-foreground text-sm">Registered Users</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-12 text-center">
        <p className="text-muted-foreground text-sm italic">
          *Data as of May 2025
        </p>
      </div>
    </section>
  );
};

export default StatisticsSection;
