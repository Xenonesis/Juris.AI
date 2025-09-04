'use client';

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface FeatureHighlightProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

export const FeatureHighlight: React.FC<FeatureHighlightProps> = ({
  icon,
  title,
  description,
  color
}) => {
  return (
    <Card className="group text-center p-6 hover:shadow-xl transition-all duration-500 border border-primary/10 hover:border-primary/30 bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-sm hover:-translate-y-2">
      <CardContent className="p-0">
        <div className={`w-16 h-16 mx-auto mb-6 ${color} rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:rotate-6`}>
          {icon}
        </div>
        <h3 className="text-xl font-semibold mb-4 text-foreground group-hover:text-primary transition-colors duration-300">{title}</h3>
        <p className="text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300 leading-relaxed">
          {description}
        </p>
      </CardContent>
    </Card>
  );
};
