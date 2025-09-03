'use client';

import { useAuth } from "@/components/auth/supabase-auth-provider";
import { LegalAdvisor } from "@/components/legal-advisor";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If user is not authenticated, redirect to landing page
    if (!isLoading && !user) {
      router.push('/landing');
    }
  }, [user, isLoading, router]);

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

  // This will briefly show while redirecting to landing
  return (
    <main className="flex-1 w-full flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </main>
  );
}
