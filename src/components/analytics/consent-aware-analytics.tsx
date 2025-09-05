'use client';

import { useEffect } from 'react';
import { useAnalyticsConsent } from '@/hooks/useCookieConsent';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
    fbq?: (...args: unknown[]) => void;
  }
}

interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

export function ConsentAwareAnalytics() {
  const hasAnalyticsConsent = useAnalyticsConsent();

  useEffect(() => {
    if (hasAnalyticsConsent) {
      initializeAnalytics();
    } else {
      disableAnalytics();
    }
  }, [hasAnalyticsConsent]);

  return null; // This component doesn't render anything
}

function initializeAnalytics() {
  // Initialize Google Analytics
  if (process.env.NEXT_PUBLIC_GA_ID && !window.gtag) {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer?.push(arguments);
    };

    window.gtag('js', new Date());
    window.gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
      anonymize_ip: true,
      cookie_flags: 'secure;samesite=lax',
    });
  }

  // Initialize Facebook Pixel
  if (process.env.NEXT_PUBLIC_FB_PIXEL_ID && !window.fbq) {
    const script = document.createElement('script');
    script.innerHTML = `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
    `;
    document.head.appendChild(script);

    (window as any).fbq('init', process.env.NEXT_PUBLIC_FB_PIXEL_ID);
    (window as any).fbq('track', 'PageView');
  }
}

function disableAnalytics() {
  // Disable Google Analytics
  if (window.gtag) {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_ID || '', {
      send_page_view: false,
    });
  }

  // Clear analytics cookies
  const analyticsCookies = [
    '_ga',
    '_ga_*',
    '_gid',
    '_gat',
    '_fbp',
    '_fbc',
  ];

  analyticsCookies.forEach(cookieName => {
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  });
}

// Analytics utility functions
export const analytics = {
  // Track page view
  pageView: (url: string) => {
    if (window.gtag) {
      window.gtag('config', process.env.NEXT_PUBLIC_GA_ID || '', {
        page_path: url,
      });
    }
  },

  // Track custom event
  event: ({ action, category, label, value }: AnalyticsEvent) => {
    if (window.gtag) {
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
      });
    }
  },

  // Track legal query
  trackLegalQuery: (query: string, jurisdiction: string) => {
    analytics.event({
      action: 'legal_query',
      category: 'engagement',
      label: jurisdiction,
    });
  },

  // Track document upload
  trackDocumentUpload: (fileType: string, fileSize: number) => {
    analytics.event({
      action: 'document_upload',
      category: 'engagement',
      label: fileType,
      value: fileSize,
    });
  },

  // Track user registration
  trackRegistration: (method: string) => {
    if (window.gtag) {
      window.gtag('event', 'sign_up', {
        method: method,
      });
    }
    if (window.fbq) {
      window.fbq('track', 'CompleteRegistration');
    }
  },

  // Track subscription
  trackSubscription: (plan: string, value: number) => {
    if (window.gtag) {
      window.gtag('event', 'purchase', {
        transaction_id: Date.now().toString(),
        value: value,
        currency: 'USD',
        items: [{
          item_id: plan,
          item_name: `Juris.AI ${plan} Plan`,
          category: 'subscription',
          quantity: 1,
          price: value,
        }],
      });
    }
    if (window.fbq) {
      window.fbq('track', 'Purchase', {
        value: value,
        currency: 'USD',
      });
    }
  },
};