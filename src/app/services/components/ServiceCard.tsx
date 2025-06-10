import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ArrowRight } from 'lucide-react';
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
    <Card className="group hover:shadow-2xl transition-all duration-500 border-t-4 border-primary/20 hover:border-primary bg-card/80 backdrop-blur-sm hover:bg-card/90 hover:-translate-y-2 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-xl ${color} transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg`}>
            {icon}
          </div>
          {badge && (
            <Badge variant="secondary" className="bg-gradient-to-r from-primary/10 to-primary/20 text-primary border-primary/20 shadow-sm">
              {badge}
            </Badge>
          )}
        </div>
        <CardTitle className="text-xl font-semibold text-card-foreground group-hover:text-primary transition-colors duration-300">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          {description}
        </p>

        <div className="space-y-2">
          {features.map((feature, featureIndex) => (
            <div key={featureIndex} className="flex items-center text-sm">
              <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
              <span className="text-muted-foreground">{feature}</span>
            </div>
          ))}
        </div>

        <div className="pt-4">
          <Link href={href}>
            <Button className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-md hover:shadow-lg transition-all duration-300 group-hover:scale-105">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
