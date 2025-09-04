'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  badge?: string;
  href: string;
  color: string;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  icon,
  title,
  description,
  features,
  badge,
  href,
  color
}) => {
  return (
    <Card className="group relative overflow-hidden hover:shadow-2xl transition-all duration-500 border border-primary/10 hover:border-primary/30 bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-sm hover:bg-gradient-to-br hover:from-card hover:to-card/90 hover:-translate-y-3 shadow-lg hover:shadow-primary/20">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Sparkle effect */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200">
        <Sparkles className="h-4 w-4 text-primary animate-pulse" />
      </div>

      <CardHeader className="pb-4 relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-xl ${color} transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl group-hover:rotate-3`}>
            {icon}
          </div>
          {badge && (
            <Badge variant="secondary" className="bg-gradient-to-r from-primary/20 to-primary/30 text-primary border-primary/30 shadow-sm animate-pulse">
              {badge}
            </Badge>
          )}
        </div>
        <CardTitle className="text-xl font-semibold text-card-foreground group-hover:text-primary transition-colors duration-300">
          {title}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4 relative z-10">
        <p className="text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">
          {description}
        </p>

        <div className="space-y-3">
          {features.map((feature, featureIndex) => (
            <div 
              key={featureIndex} 
              className="flex items-center text-sm transform transition-all duration-300 group-hover:translate-x-1"
              style={{ transitionDelay: `${featureIndex * 50}ms` }}
            >
              <CheckCircle className="h-4 w-4 text-primary mr-3 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-muted-foreground group-hover:text-foreground/90 transition-colors duration-300">{feature}</span>
            </div>
          ))}
        </div>

        <div className="pt-6">
          <Link href={href}>
            <Button className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-md hover:shadow-xl transition-all duration-300 group-hover:scale-105 relative overflow-hidden">
              <span className="relative z-10 flex items-center justify-center">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/40 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
