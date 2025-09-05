"use client";

import { useAuth } from "@/components/auth/supabase-auth-provider";

export function QuickDebug() {
  const { user, session, isLoading } = useAuth();
  
  return (
    <div className="fixed top-20 right-4 z-50 bg-black text-white p-2 text-xs rounded">
      <div>Loading: {isLoading ? "Yes" : "No"}</div>
      <div>User: {user ? user.email : "None"}</div>
      <div>Session: {session ? "Yes" : "No"}</div>
    </div>
  );
}