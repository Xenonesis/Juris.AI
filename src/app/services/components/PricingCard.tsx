'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from 'lucide-react';

interface PricingFeature {
  text: string;
  included: boolean;
}

interface PricingCardProps {
  title: string;
  price: string;
  period: string;
  features: PricingFeature[];
  buttonText: string;
  buttonVariant?: "default" | "outline";
  popular?: boolean;
  onButtonClick?: () => void;
}

export const PricingCard: React.FC<PricingCardProps> = ({
  title,
  price,
  period,
  features,
  buttonText,
  buttonVariant = "default",
  popular = false,
  onButtonClick
}) => {
  return (
    <Card className={`relative border-2 transition-all duration-500 hover:-translate-y-2 ${
      popular
        ? 'border-primary shadow-2xl scale-105 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5'
        : 'border-muted hover:border-primary/50 hover:shadow-xl bg-gradient-to-br from-background to-muted/20'
    }`}>
      {popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-4 py-1 shadow-lg">Most Popular</Badge>
        </div>
      )}
      <CardHeader className="text-center pb-8">
        <CardTitle className="text-2xl font-bold text-foreground">{title}</CardTitle>
        <div className={`text-4xl font-bold mt-4 ${popular ? 'text-primary' : 'text-primary'}`}>{price}</div>
        <p className="text-muted-foreground">{period}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center">
              <CheckCircle className={`h-5 w-5 mr-3 ${
                feature.included ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground/30'
              }`} />
              <span className={`text-sm ${
                feature.included ? 'text-foreground' : 'text-muted-foreground/50'
              }`}>
                {feature.text}
              </span>
            </div>
          ))}
        </div>
        <Button
          className={`w-full mt-6 transition-all duration-300 ${
            popular
              ? 'bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl'
              : buttonVariant === 'outline'
                ? 'border-primary/30 hover:border-primary/50 hover:bg-primary/5'
                : 'bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70'
          }`}
          variant={buttonVariant}
          onClick={onButtonClick}
        >
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  );
};
