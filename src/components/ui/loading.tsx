"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Scale, Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const LoadingSpinner = React.forwardRef<HTMLDivElement, LoadingSpinnerProps>(
  ({ size = "md", className }, ref) => {
    const sizeClasses = {
      sm: "w-4 h-4",
      md: "w-6 h-6",
      lg: "w-8 h-8",
      xl: "w-12 h-12",
    };

    return (
      <div ref={ref} className={cn("flex items-center justify-center", className)}>
        <Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} />
      </div>
    );
  }
);
LoadingSpinner.displayName = "LoadingSpinner";

interface LoadingDotsProps {
  className?: string;
}

const LoadingDots = React.forwardRef<HTMLDivElement, LoadingDotsProps>(
  ({ className }, ref) => {
    return (
      <div ref={ref} className={cn("flex items-center justify-center space-x-1", className)}>
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="w-2 h-2 bg-primary rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: index * 0.2,
            }}
          />
        ))}
      </div>
    );
  }
);
LoadingDots.displayName = "LoadingDots";

interface LoadingPulseProps {
  className?: string;
}

const LoadingPulse = React.forwardRef<HTMLDivElement, LoadingPulseProps>(
  ({ className }, ref) => {
    return (
      <div ref={ref} className={cn("flex items-center justify-center", className)}>
        <motion.div
          className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-chart-2"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
          }}
        />
      </div>
    );
  }
);
LoadingPulse.displayName = "LoadingPulse";

interface LoadingSkeletonProps {
  className?: string;
  lines?: number;
}

const LoadingSkeleton = React.forwardRef<HTMLDivElement, LoadingSkeletonProps>(
  ({ className, lines = 3 }, ref) => {
    return (
      <div ref={ref} className={cn("space-y-3", className)}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={cn(
              "h-4 bg-muted rounded skeleton",
              index === 0 && "w-3/4",
              index === 1 && "w-full",
              index === 2 && "w-1/2"
            )}
          />
        ))}
      </div>
    );
  }
);
LoadingSkeleton.displayName = "LoadingSkeleton";

interface LoadingPageProps {
  title?: string;
  description?: string;
  className?: string;
}

const LoadingPage = React.forwardRef<HTMLDivElement, LoadingPageProps>(
  ({ title = "Loading...", description, className }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-background to-muted/10",
          className
        )}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-6"
        >
          <motion.div
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-chart-2 flex items-center justify-center shadow-lg mx-auto"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Scale className="h-8 w-8 text-primary-foreground" />
          </motion.div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-bold gradient-text">{title}</h2>
            {description && (
              <p className="text-muted-foreground max-w-md mx-auto">{description}</p>
            )}
          </div>
          
          <LoadingDots />
        </motion.div>
      </div>
    );
  }
);
LoadingPage.displayName = "LoadingPage";

interface LoadingCardProps {
  className?: string;
  lines?: number;
}

const LoadingCard = React.forwardRef<HTMLDivElement, LoadingCardProps>(
  ({ className, lines = 3 }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-lg border bg-card p-6 shadow-sm",
          className
        )}
      >
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-muted rounded-lg skeleton" />
            <div className="w-32 h-4 bg-muted rounded skeleton" />
          </div>
          <LoadingSkeleton lines={lines} />
        </div>
      </div>
    );
  }
);
LoadingCard.displayName = "LoadingCard";

export {
  LoadingSpinner,
  LoadingDots,
  LoadingPulse,
  LoadingSkeleton,
  LoadingPage,
  LoadingCard,
};
