/**
 * Analytics tracking utilities for landing page interactions
 * Supports multiple analytics providers with error handling
 */

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

/**
 * Track events with multiple analytics providers
 */
export const trackEvent = (eventName: string, properties?: Record<string, unknown>) => {
  try {
    // Google Analytics 4
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, {
        event_category: 'Landing Page',
        event_label: (properties?.label as string) || '',
        value: (properties?.value as number) || 0,
        ...properties
      });
    }

    // Console logging for development
    console.log('Analytics Event:', eventName, properties);

    // Add other analytics providers here:
    // - Mixpanel: mixpanel.track(eventName, properties);
    // - Amplitude: amplitude.getInstance().logEvent(eventName, properties);
    // - PostHog: posthog.capture(eventName, properties);
  } catch (error) {
    console.error('Analytics tracking error:', error);
  }
};

/**
 * Track button clicks with location context
 */
export const trackButtonClick = (buttonName: string, location: string) => {
  trackEvent('button_click', {
    button_name: buttonName,
    location: location,
    timestamp: new Date().toISOString()
  });
};

/**
 * Track section views with intersection observer
 */
export const trackSectionView = (sectionName: string) => {
  trackEvent('section_view', {
    section_name: sectionName,
    timestamp: new Date().toISOString()
  });
};

/**
 * Track demo interactions
 */
export const trackDemoInteraction = (action: string, query?: string) => {
  trackEvent('demo_interaction', {
    action: action,
    query: query || '',
    timestamp: new Date().toISOString()
  });
};

/**
 * Track FAQ interactions
 */
export const trackFaqInteraction = (question: string, action: 'open' | 'close') => {
  trackEvent('faq_interaction', {
    question: question,
    action: action,
    timestamp: new Date().toISOString()
  });
};

/**
 * Set up section view tracking with intersection observer
 */
export const setupSectionTracking = () => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
          const sectionName = entry.target.getAttribute('data-section');
          if (sectionName) {
            trackSectionView(sectionName);
          }
        }
      });
    },
    {
      threshold: 0.5,
      rootMargin: '-10% 0px -10% 0px'
    }
  );

  // Observe all sections
  const sections = document.querySelectorAll('[data-section]');
  sections.forEach((section) => observer.observe(section));

  return () => {
    sections.forEach((section) => observer.unobserve(section));
  };
};
