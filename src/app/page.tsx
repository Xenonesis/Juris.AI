'use client';

import { useAuth } from "@/components/auth/supabase-auth-provider";
import { LegalAdvisor } from "@/components/legal-advisor";
import { OptimizedLandingPage } from "@/components/landing";

export default function Home() {
  const { user, isLoading } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <main className="flex-1 w-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </main>
    );
  }

  // If user is authenticated, show the main app
  if (user) {
    return (
      <main className="flex-1 w-full">
        <LegalAdvisor />
      </main>
    );
  }

  // If user is not authenticated, show the landing page
  return <OptimizedLandingPage />;
}
