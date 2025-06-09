"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const enhancedButtonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-lg hover:shadow-xl",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground shadow-sm hover:shadow-md",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm hover:shadow-md",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        gradient: "btn-gradient text-primary-foreground shadow-lg hover:shadow-xl",
        "gradient-secondary": "btn-gradient-secondary text-primary-foreground shadow-lg hover:shadow-xl",
        "gradient-subtle": "btn-gradient-subtle text-foreground shadow-sm hover:shadow-md",
        "gradient-animated": "gradient-animated text-primary-foreground shadow-lg hover:shadow-xl",
        success: "bg-success text-success-foreground hover:bg-success/90 shadow-lg hover:shadow-xl",
        warning: "bg-warning text-warning-foreground hover:bg-warning/90 shadow-lg hover:shadow-xl",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        xl: "h-12 rounded-lg px-10 text-base",
        icon: "h-10 w-10",
      },
      animation: {
        none: "",
        hover: "hover:scale-105 active:scale-95",
        bounce: "hover:animate-bounce-gentle",
        glow: "hover:animate-glow",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      animation: "hover",
    },
  }
);

export interface EnhancedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof enhancedButtonVariants> {
  asChild?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

const EnhancedButton = React.forwardRef<HTMLButtonElement, EnhancedButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    animation, 
    asChild = false, 
    loading = false,
    icon,
    iconPosition = "left",
    children,
    disabled,
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : "button";
    
    const buttonContent = (
      <>
        {loading && (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
        )}
        {icon && iconPosition === "left" && !loading && (
          <span className="mr-2">{icon}</span>
        )}
        {children}
        {icon && iconPosition === "right" && !loading && (
          <span className="ml-2">{icon}</span>
        )}
      </>
    );

    if (animation === "none" || asChild) {
      return (
        <Comp
          className={cn(enhancedButtonVariants({ variant, size, animation, className }))}
          ref={ref}
          disabled={disabled || loading}
          {...props}
        >
          {buttonContent}
        </Comp>
      );
    }

    return (
      <motion.div
        whileHover={animation === "hover" ? { scale: 1.05 } : undefined}
        whileTap={animation === "hover" ? { scale: 0.95 } : undefined}
        className="inline-block"
      >
        <Comp
          className={cn(enhancedButtonVariants({ variant, size, animation, className }))}
          ref={ref}
          disabled={disabled || loading}
          {...props}
        >
          {buttonContent}
        </Comp>
      </motion.div>
    );
  }
);
EnhancedButton.displayName = "EnhancedButton";

export { EnhancedButton, enhancedButtonVariants };
