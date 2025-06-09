import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SupabaseAuthProvider } from "@/components/auth/supabase-auth-provider";
import { NavigationBar } from "@/components/navigation-bar";
import { PageTransition } from "@/components/page-transition";
import { Footer } from "@/components/footer";
import { ScrollToTop } from "@/components/scroll-to-top";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
                  e.filename.includes('content.js')
                )) {
                  e.preventDefault();
                  return false;
                }
              });
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
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
            </div>
          </SupabaseAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
