"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const enhancedCardVariants = cva(
  "rounded-lg border bg-card text-card-foreground transition-all duration-300",
  {
    variants: {
      variant: {
        default: "shadow-sm hover:shadow-md",
        elevated: "shadow-lg hover:shadow-xl",
        glass: "bg-card/80 backdrop-blur-sm border-muted/50 shadow-xl",
        gradient: "card-gradient shadow-lg hover:shadow-xl",
        "gradient-interactive": "card-gradient-interactive cursor-pointer",
        "gradient-mesh": "gradient-bg-mesh shadow-lg hover:shadow-xl",
        interactive: "shadow-md hover:shadow-xl cursor-pointer card-hover",
      },
      padding: {
        none: "p-0",
        sm: "p-4",
        default: "p-6",
        lg: "p-8",
        xl: "p-12",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "default",
    },
  }
);

export interface EnhancedCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onDrag' | 'onDragEnd' | 'onDragStart'>,
    VariantProps<typeof enhancedCardVariants> {
  hover?: boolean;
  glow?: boolean;
}

const EnhancedCard = React.forwardRef<HTMLDivElement, EnhancedCardProps>(
  ({ className, variant, padding, hover = false, glow = false, children, ...props }, ref) => {
    const cardClasses = cn(
      enhancedCardVariants({ variant, padding }),
      {
        "hover:scale-[1.02] hover:-translate-y-1": hover,
        "hover:ring-2 hover:ring-primary/20": glow,
      },
      className
    );

    if (hover) {
      return (
        <motion.div
          ref={ref}
          className={cardClasses}
          whileHover={{ scale: 1.02, y: -4 }}
          transition={{ duration: 0.2 }}
          {...(props as any)}
        >
          {children}
        </motion.div>
      );
    }

    return (
      <div ref={ref} className={cardClasses} {...props}>
        {children}
      </div>
    );
  }
);
EnhancedCard.displayName = "EnhancedCard";

const EnhancedCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { gradient?: boolean }
>(({ className, gradient = false, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col space-y-1.5 p-6",
      {
        "bg-gradient-to-r from-gradient-primary-start/5 to-gradient-secondary-start/5 border-b border-muted/30": gradient,
      },
      className
    )}
    {...props}
  >
    {children}
  </div>
));
EnhancedCardHeader.displayName = "EnhancedCardHeader";

const EnhancedCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement> & { 
    gradient?: boolean;
    icon?: React.ReactNode;
  }
>(({ className, gradient = false, icon, children, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight flex items-center gap-3",
      {
        "gradient-text": gradient,
      },
      className
    )}
    {...props}
  >
    {icon && (
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gradient-primary-start to-gradient-secondary-start flex items-center justify-center">
        {icon}
      </div>
    )}
    {children}
  </h3>
));
EnhancedCardTitle.displayName = "EnhancedCardTitle";

const EnhancedCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
EnhancedCardDescription.displayName = "EnhancedCardDescription";

const EnhancedCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
EnhancedCardContent.displayName = "EnhancedCardContent";

const EnhancedCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { bordered?: boolean }
>(({ className, bordered = false, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center p-6 pt-0",
      {
        "border-t border-muted/30 pt-6": bordered,
      },
      className
    )}
    {...props}
  />
));
EnhancedCardFooter.displayName = "EnhancedCardFooter";

export {
  EnhancedCard,
  EnhancedCardHeader,
  EnhancedCardFooter,
  EnhancedCardTitle,
  EnhancedCardDescription,
  EnhancedCardContent,
  enhancedCardVariants,
};
