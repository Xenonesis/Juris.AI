import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingIndicatorProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  variant?: 'light' | 'dark' | 'auto';
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  size = 'md',
  className,
  variant = 'auto'
}) => {
  const sizeClasses = {
    sm: 'w-3 h-3 border-[1.5px]',
    md: 'w-4 h-4 border-2',
    lg: 'w-5 h-5 border-2'
  };

  const variantClasses = {
    light: 'border-white/30 border-t-white',
    dark: 'border-gray-300/40 border-t-gray-100',
    auto: 'border-white/30 border-t-white dark:border-gray-300/40 dark:border-t-gray-100'
  };

  return (
    <div
      className={cn(
        'rounded-full animate-spin',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      aria-hidden="true"
      role="status"
    />
  );
};

interface LoadingTextProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'light' | 'dark' | 'auto';
}

export const LoadingText: React.FC<LoadingTextProps> = ({
  children,
  className,
  variant = 'auto'
}) => {
  const variantClasses = {
    light: 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]',
    dark: 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]',
    auto: 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] dark:drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]'
  };

  return (
    <span
      className={cn(
        'font-semibold relative z-10',
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
};

interface LoadingContentProps {
  text: string;
  indicatorSize?: 'sm' | 'md' | 'lg';
  className?: string;
  variant?: 'light' | 'dark' | 'auto';
}

export const LoadingContent: React.FC<LoadingContentProps> = ({
  text,
  indicatorSize = 'md',
  className,
  variant = 'auto'
}) => {
  return (
    <div className={cn('flex items-center gap-2 relative z-10', className)}>
      <LoadingIndicator size={indicatorSize} variant={variant} />
      <LoadingText variant={variant}>{text}</LoadingText>
    </div>
  );
};
