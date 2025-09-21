import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SupabaseAuthProvider } from "@/components/auth/supabase-auth-provider";
import { NavigationBar } from "@/components/navigation-bar";
import { PageTransition } from "@/components/page-transition";
import { Footer } from "@/components/footer";
import { ScrollToTop } from "@/components/scroll-to-top";
import { Toaster } from "@/components/ui/toaster";
import { CookieBanner } from "@/components/cookie-consent/cookie-banner";
import { CookiePreferencesButton } from "@/components/cookie-consent/cookie-preferences-button";
import { ConsentAwareAnalytics } from "@/components/analytics/consent-aware-analytics";
import { TermsAcceptanceDialog } from "@/components/auth/terms-acceptance-dialog";
import Script from "next/script";
export const metadata: Metadata = {
  title: "Juris.Ai",
  description: "Juris.Ai – AI-powered legal assistance. Fast, smart law answers from powerful AI with jurisdictional insight.",
  icons: [
    { rel: "icon", url: "/favicon.ico?v=2", type: "image/x-icon" },
    { rel: "icon", type: "image/png", sizes: "32x32", url: "/favicon-32x32.png?v=2" },
    { rel: "icon", type: "image/png", sizes: "16x16", url: "/favicon-16x16.png?v=2" },
    { rel: "apple-touch-icon", sizes: "180x180", url: "/apple-touch-icon.png?v=2" },
    { rel: "manifest", url: "/site.webmanifest?v=2" },
  ],
  other: {
    // Prevent automatic preloading of unused resources
    'preload': 'none',
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0c0c" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Suppress browser extension errors and preload warnings
              window.addEventListener('error', function(e) {
                if (e.filename && (
                  e.filename.includes('universal-blocker.js') ||
                  e.filename.includes('feedback-manager.js') ||
                  e.filename.includes('content-blocker.js') ||
                  e.filename.includes('content.js') ||
                  e.message.includes('MIME type') ||
                  e.message.includes('text/css') ||
                  e.filename.includes('target_css')
                )) {
                  e.preventDefault();
                  return false;
                }
              });

              // Suppress preload warnings more aggressively
              const originalWarn = console.warn;
              const originalError = console.error;
              
              console.warn = function(...args) {
                const message = args.join(' ');
                if (message.includes('preload') && (
                  message.includes('not used within a few seconds') ||
                  message.includes('was preloaded using link preload')
                )) {
                  return; // Skip all preload warnings
                }
                originalWarn.apply(console, args);
              };

              console.error = function(...args) {
                const message = args.join(' ');
                if (
                  message.includes('Cannot read properties of undefined') ||
                  message.includes('reading \\'icon\\'') ||
                  (message.includes('TypeError') && message.includes('icon')) ||
                  message.includes('6226.') ||
                  message.includes('.js:1')
                ) {
                  return; // Skip all icon-related errors
                }
                originalError.apply(console, args);
              };

              // Global icon safety wrapper
              window.__safeIcon = function(iconComponent, fallback = '🔧') {
                try {
                  if (!iconComponent) return fallback;
                  if (typeof iconComponent === 'string') return iconComponent;
                  if (typeof iconComponent === 'object' && iconComponent.icon) {
                    return iconComponent.icon;
                  }
                  return iconComponent;
                } catch (e) {
                  return fallback;
                }
              };
              
              // Fix CSS MIME type loading issues
              if (typeof document !== 'undefined') {
                const observer = new MutationObserver(function(mutations) {
                  mutations.forEach(function(mutation) {
                    mutation.addedNodes.forEach(function(node) {
                      if (node.tagName === 'SCRIPT' && node.src && node.src.includes('.css')) {
                        const link = document.createElement('link');
                        link.rel = 'stylesheet';
                        link.href = node.src;
                        document.head.appendChild(link);
                        node.remove();
                      }
                    });
                  });
                });
                observer.observe(document.head, { childList: true, subtree: true });
              }
            `,
          }}
        />
        
        {/* Resource optimization script */}
        <Script
          id="resource-optimization"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              // Initialize resource optimization
              (function() {
                function disableUnusedPreloads() {
                  // Monitor and remove unused preload links
                  const checkUnusedPreloads = () => {
                    const preloadLinks = document.querySelectorAll('link[rel="preload"]');
                    preloadLinks.forEach((link) => {
                      const href = link.getAttribute('href');
                      if (href) {
                        // More aggressive cleanup - remove most preloads immediately after load
                        setTimeout(() => {
                          if (link.parentNode) {
                            const isStillUsed = document.querySelector(\`script[src="\${href}"], link[href="\${href}"]:not([rel="preload"]), style[data-href="\${href}"]\`);
                            if (!isStillUsed || href.includes('chunk') || href.includes('.js')) {
                              try {
                                link.remove();
                              } catch (e) {
                                // Ignore removal errors
                              }
                            }
                          }
                        }, 2000); // Reduced to 2 seconds
                      }
                    });
                  };

                  if (document.readyState === 'loading') {
                    document.addEventListener('DOMContentLoaded', checkUnusedPreloads);
                  } else {
                    checkUnusedPreloads();
                  }

                  // Continuous monitoring
                  setInterval(checkUnusedPreloads, 10000);
                }

                // Initialize on page load
                if (document.readyState === 'loading') {
                  document.addEventListener('DOMContentLoaded', disableUnusedPreloads);
                } else {
                  disableUnusedPreloads();
                }
              })();
            `,
          }}
        />
      </head>
      <body
        className="antialiased min-h-screen flex flex-col font-sans"
        style={{
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
        }}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SupabaseAuthProvider>
            <div className="flex flex-col min-h-screen">
              <NavigationBar />
              <main className="flex-grow">
                <PageTransition>
                  {children}
                </PageTransition>
              </main>
              <Footer />
              <ScrollToTop />
              <Toaster />
              <CookieBanner />
              <CookiePreferencesButton />
              <ConsentAwareAnalytics />
              <TermsAcceptanceDialog />
            </div>
          </SupabaseAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
