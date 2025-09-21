/**
 * Resource optimization utilities to prevent preload warnings
 */

export function disableUnusedPreloads() {
  if (typeof window === 'undefined') return;

  // Simple approach: monitor and clean up unused preload links
  const cleanupUnusedPreloads = () => {
    const preloadLinks = document.querySelectorAll('link[rel="preload"]');
    preloadLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (href) {
        // Check if resource is actually being used
        const isUsed = document.querySelector(`script[src="${href}"], link[href="${href}"]:not([rel="preload"]), style[data-href="${href}"]`);
        if (!isUsed) {
          // Schedule removal of unused preload
          setTimeout(() => {
            if (link.parentNode && !document.querySelector(`script[src="${href}"], link[href="${href}"]:not([rel="preload"])`)) {
              link.remove();
            }
          }, 5000);
        }
      }
    });
  };

  // Run cleanup after page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', cleanupUnusedPreloads);
  } else {
    cleanupUnusedPreloads();
  }

  // Continuous monitoring
  setInterval(cleanupUnusedPreloads, 10000);
}

export function optimizeIconLoading() {
  if (typeof window === 'undefined') return;

  // Lazy load icon fonts only when needed
  let iconsLoaded = false;
  
  const loadIcons = () => {
    if (iconsLoaded) return;
    iconsLoaded = true;
    
    // Create intersection observer to load icons when they come into view
    const iconObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const element = entry.target;
          // Trigger icon rendering if needed
          if (element.hasAttribute('data-lazy-icon')) {
            element.removeAttribute('data-lazy-icon');
          }
        }
      });
    });

    // Observe all icon elements
    document.querySelectorAll('[data-lazy-icon]').forEach((el) => {
      iconObserver.observe(el);
    });
  };

  // Load icons on first interaction or after delay
  const events = ['mousedown', 'touchstart', 'keydown', 'scroll'];
  const loadOnInteraction = () => {
    loadIcons();
    events.forEach((event) => {
      document.removeEventListener(event, loadOnInteraction);
    });
  };

  events.forEach((event) => {
    document.addEventListener(event, loadOnInteraction, { passive: true });
  });

  // Fallback: load after 3 seconds
  setTimeout(loadIcons, 3000);
}

export function preventPreloadWarnings() {
  if (typeof window === 'undefined') return;

  // Override console.warn to filter out preload warnings
  const originalWarn = console.warn;
  console.warn = (...args: any[]) => {
    const message = args.join(' ');
    if (
      message.includes('preload') && 
      message.includes('not used within a few seconds')
    ) {
      return; // Skip preload warnings
    }
    originalWarn.apply(console, args);
  };

  // Monitor and clean up unused preload links
  setInterval(() => {
    const preloadLinks = document.querySelectorAll('link[rel="preload"]');
    preloadLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (href) {
        // Check if resource is actually being used
        const isUsed = document.querySelector(`script[src="${href}"], link[href="${href}"]:not([rel="preload"])`);
        if (!isUsed) {
          // Remove unused preload after 10 seconds
          link.remove();
        }
      }
    });
  }, 5000);
}