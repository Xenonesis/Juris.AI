// Performance monitoring utilities for Juris.AI
import React from 'react';

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  type: 'timing' | 'counter' | 'gauge';
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private timers: Map<string, number> = new Map();

  // Start a timer for measuring operation duration
  startTimer(name: string): void {
    this.timers.set(name, performance.now());
  }

  // End a timer and record the duration
  endTimer(name: string): number {
    const startTime = this.timers.get(name);
    if (!startTime) {
      console.warn(`Timer '${name}' was not started`);
      return 0;
    }

    const duration = performance.now() - startTime;
    this.timers.delete(name);
    
    this.recordMetric({
      name,
      value: duration,
      timestamp: Date.now(),
      type: 'timing'
    });

    return duration;
  }

  // Record a custom metric
  recordMetric(metric: PerformanceMetric): void {
    this.metrics.push(metric);
    
    // Keep only last 1000 metrics to prevent memory issues
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-1000);
    }
  }

  // Record a counter metric (incremental values)
  recordCounter(name: string, value: number = 1): void {
    this.recordMetric({
      name,
      value,
      timestamp: Date.now(),
      type: 'counter'
    });
  }

  // Record a gauge metric (current state values)
  recordGauge(name: string, value: number): void {
    this.recordMetric({
      name,
      value,
      timestamp: Date.now(),
      type: 'gauge'
    });
  }

  // Get metrics by name
  getMetrics(name?: string): PerformanceMetric[] {
    if (!name) return this.metrics;
    return this.metrics.filter(m => m.name === name);
  }

  // Get average value for timing metrics
  getAverageTime(name: string): number {
    const timingMetrics = this.metrics.filter(m => m.name === name && m.type === 'timing');
    if (timingMetrics.length === 0) return 0;
    
    const sum = timingMetrics.reduce((acc, m) => acc + m.value, 0);
    return sum / timingMetrics.length;
  }

  // Get performance summary
  getSummary(): Record<string, any> {
    const summary: Record<string, any> = {};
    
    // Group metrics by name
    const groupedMetrics = this.metrics.reduce((acc, metric) => {
      if (!acc[metric.name]) acc[metric.name] = [];
      acc[metric.name].push(metric);
      return acc;
    }, {} as Record<string, PerformanceMetric[]>);

    // Calculate statistics for each metric
    Object.entries(groupedMetrics).forEach(([name, metrics]) => {
      const values = metrics.map(m => m.value);
      const type = metrics[0].type;
      
      summary[name] = {
        type,
        count: metrics.length,
        latest: values[values.length - 1],
        ...(type === 'timing' && {
          average: values.reduce((a, b) => a + b, 0) / values.length,
          min: Math.min(...values),
          max: Math.max(...values)
        })
      };
    });

    return summary;
  }

  // Clear all metrics
  clear(): void {
    this.metrics = [];
    this.timers.clear();
  }

  // Export metrics for analysis
  exportMetrics(): string {
    return JSON.stringify({
      timestamp: Date.now(),
      metrics: this.metrics,
      summary: this.getSummary()
    }, null, 2);
  }
}

// Create singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Utility functions for common measurements
export const measureAsync = async <T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> => {
  performanceMonitor.startTimer(name);
  try {
    const result = await fn();
    performanceMonitor.endTimer(name);
    return result;
  } catch (error) {
    performanceMonitor.endTimer(name);
    performanceMonitor.recordCounter(`${name}_error`);
    throw error;
  }
};

export const measureSync = <T>(
  name: string,
  fn: () => T
): T => {
  performanceMonitor.startTimer(name);
  try {
    const result = fn();
    performanceMonitor.endTimer(name);
    return result;
  } catch (error) {
    performanceMonitor.endTimer(name);
    performanceMonitor.recordCounter(`${name}_error`);
    throw error;
  }
};

// Web Vitals monitoring (if available)
export const initWebVitalsMonitoring = () => {
  if (typeof window === 'undefined') return;

  // Monitor Largest Contentful Paint (LCP)
  if ('PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'largest-contentful-paint') {
            performanceMonitor.recordGauge('lcp', entry.startTime);
          }
          if (entry.entryType === 'first-input') {
            performanceMonitor.recordGauge('fid', (entry as any).processingStart - entry.startTime);
          }
        });
      });

      observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input'] });
    } catch (error) {
      console.warn('Performance Observer not supported:', error);
    }
  }

  // Monitor Cumulative Layout Shift (CLS)
  let clsValue = 0;
  if ('PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
            performanceMonitor.recordGauge('cls', clsValue);
          }
        }
      });

      observer.observe({ entryTypes: ['layout-shift'] });
    } catch (error) {
      console.warn('Layout Shift Observer not supported:', error);
    }
  }
};

// Cache performance monitoring
export const monitorCachePerformance = (cacheInstance: any) => {
  const originalGet = cacheInstance.get;
  const originalSet = cacheInstance.set;

  cacheInstance.get = function(key: string) {
    const result = originalGet.call(this, key);
    performanceMonitor.recordCounter(result ? 'cache_hit' : 'cache_miss');
    return result;
  };

  cacheInstance.set = function(key: string, value: any, ttl?: number) {
    performanceMonitor.recordCounter('cache_set');
    return originalSet.call(this, key, value, ttl);
  };
};

// Component render monitoring
export const withPerformanceMonitoring = <P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
) => {
  return (props: P) => {
    const startTime = performance.now();
    
    React.useEffect(() => {
      const renderTime = performance.now() - startTime;
      performanceMonitor.recordMetric({
        name: `component_render_${componentName}`,
        value: renderTime,
        timestamp: Date.now(),
        type: 'timing'
      });
    });

    return React.createElement(Component, props);
  };
};
