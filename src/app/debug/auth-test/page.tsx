"use client";

import { useEffect, useState } from "react";
import { createClient, User } from "@supabase/supabase-js";

export default function AuthTestPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        // Initialize Supabase client
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
        
        if (!supabaseUrl || !supabaseKey) {
          throw new Error("Supabase credentials are not configured");
        }
        
        const supabase = createClient(supabaseUrl, supabaseKey);
        
        // Get current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw sessionError;
        }
        
        setUser(session?.user || null);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "An error occurred";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }
    
    checkAuth();
  }, []);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Authentication Test Page</h1>
      
      {loading ? (
        <div className="p-4 bg-gray-100 rounded">
          <p>Loading authentication status...</p>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-100 text-red-700 rounded">
          <p className="font-semibold">Error:</p>
          <p>{error}</p>
        </div>
      ) : user ? (
        <div className="p-4 bg-green-100 text-green-700 rounded">
          <p className="font-semibold">Authenticated as:</p>
          <pre className="mt-2 p-2 bg-white rounded overflow-auto">
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>
      ) : (
        <div className="p-4 bg-yellow-100 text-yellow-700 rounded">
          <p>Not authenticated. Please sign in.</p>
        </div>
      )}
    </div>
  );
}