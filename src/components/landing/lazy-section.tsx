/**
 * Lazy loading section component with intersection observer
 * Loads components only when they're about to enter the viewport
 */

'use client';

import React, { useState, useRef, useEffect, ReactNode } from 'react';

interface LazySectionProps {
  children: ReactNode;
  fallback?: ReactNode;
  rootMargin?: string;
  threshold?: number;
}

const LazySection: React.FC<LazySectionProps> = ({
  children,
  fallback = (
    <div className="py-20 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
    </div>
  ),
  rootMargin = '100px',
  threshold = 0.1
}) => {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          // Disconnect observer after the component is loaded
          observer.disconnect();
        }
      },
      {
        rootMargin,
        threshold
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [rootMargin, threshold]);

  return (
    <div ref={ref}>
      {isInView ? children : fallback}
    </div>
  );
};

export { LazySection };
