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

export const metadata: Metadata = {
  title: "Juris.Ai",
  description: "Juris.Ai – AI-powered legal assistance. Fast, smart law answers from powerful AI with jurisdictional insight.",
  icons: [
    { rel: "icon", url: "/favicon.svg", type: "image/svg+xml" }
  ],
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
              // Suppress browser extension errors
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
            </div>
          </SupabaseAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
