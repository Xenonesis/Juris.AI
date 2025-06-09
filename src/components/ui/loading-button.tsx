import React from 'react';
import { Button } from './button';
import { LoadingContent } from './loading-indicator';
import { cn } from '@/lib/utils';

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({
    isLoading = false,
    loadingText = 'Loading...',
    children,
    className,
    disabled,
    variant = 'default',
    size = 'default',
    ...props
  }, ref) => {
    return (
      <Button
        ref={ref}
        disabled={disabled || isLoading}
        variant={variant}
        size={size}
        className={cn(
          // Base styles
          'relative transition-all duration-300 overflow-hidden',
          // Normal state - ensure text is visible
          !isLoading && 'btn-gradient-normal',
          // Force visible loading styles
          isLoading && 'force-visible-loading',
          className
        )}
        {...props}
      >
        {isLoading ? (
          <div className="flex items-center gap-2 relative z-50">
            {/* Spinner with forced white color */}
            <div
              className="w-4 h-4 border-2 rounded-full animate-spin force-visible-spinner"
              aria-hidden="true"
            />
            {/* Text with forced white color and strong shadow */}
            <span className="force-visible-text">
              {loadingText}
            </span>
          </div>
        ) : (
          children
        )}

        {/* Solid background overlay to ensure visibility */}
        {isLoading && (
          <div className="force-visible-overlay" />
        )}
      </Button>
    );
  }
);

LoadingButton.displayName = 'LoadingButton';
