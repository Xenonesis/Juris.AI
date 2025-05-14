'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import supabase from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DebugPage() {
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [storageKeys, setStorageKeys] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      try {
        setLoading(true);
        
        // Get user
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        
        // Get session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        
        setUser(userData.user);
        setSession(sessionData.session);
        
        // Check localStorage for auth keys
        if (typeof window !== 'undefined') {
          try {
            const keys = [];
            for (let i = 0; i < localStorage.length; i++) {
              const key = localStorage.key(i);
              if (key && (key.includes('supabase') || key.includes('sb-'))) {
                keys.push(key);
              }
            }
            setStorageKeys(keys);
          } catch (e) {
            console.error('Error checking localStorage:', e);
          }
        }
      } catch (error: any) {
        console.error('Auth error:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    
    checkAuth();
  }, []);

  const handleRefresh = () => {
    window.location.reload();
  };
  
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    handleRefresh();
  };
  
  const handleGoToProfile = () => {
    router.push('/profile');
  };
  
  const handleGoToLogin = () => {
    router.push('/auth/login');
  };

  const handleClearStorage = () => {
    try {
      // Clear only Supabase related items
      storageKeys.forEach(key => {
        localStorage.removeItem(key);
      });
      // Reload to apply changes
      window.location.reload();
    } catch (e) {
      console.error('Error clearing storage:', e);
    }
  };
  
  const handleRefreshSession = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.refreshSession();
      if (error) throw error;
      
      setUser(data.user);
      setSession(data.session);
      window.location.reload();
    } catch (error: any) {
      console.error('Error refreshing session:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">Auth Debugging</h1>
      
      <div className="grid gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Authentication Status</CardTitle>
            <CardDescription>Current user and session information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="animate-pulse p-4 bg-muted rounded">Loading...</div>
            ) : error ? (
              <div className="p-4 bg-destructive/10 text-destructive rounded">
                Error: {error}
              </div>
            ) : (
              <>
                <div className="p-4 bg-muted rounded">
                  <h3 className="font-semibold mb-2">User</h3>
                  <pre className="text-xs overflow-auto">
                    {user ? JSON.stringify(user, null, 2) : 'Not authenticated'}
                  </pre>
                </div>
                
                <div className="p-4 bg-muted rounded">
                  <h3 className="font-semibold mb-2">Session</h3>
                  <pre className="text-xs overflow-auto">
                    {session ? JSON.stringify(session, null, 2) : 'No active session'}
                  </pre>
                </div>
                
                <div className="p-4 bg-muted rounded">
                  <h3 className="font-semibold mb-2">Storage Keys</h3>
                  {storageKeys.length > 0 ? (
                    <ul className="list-disc pl-4">
                      {storageKeys.map(key => (
                        <li key={key}>{key}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>No Supabase storage keys found</p>
                  )}
                </div>
              </>
            )}
          </CardContent>
          <CardFooter className="flex flex-wrap gap-2 justify-between">
            <Button onClick={handleRefresh} variant="outline">
              Refresh Status
            </Button>
            <div className="flex gap-2">
              <Button onClick={handleRefreshSession} variant="secondary">
                Refresh Session
              </Button>
              <Button onClick={handleClearStorage} variant="destructive">
                Clear Auth Storage
              </Button>
            </div>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Navigation Tests</CardTitle>
            <CardDescription>Test different navigation scenarios</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="p-4 bg-muted rounded">
                <h3 className="font-semibold">Test Profile Navigation</h3>
                <p className="text-sm text-muted-foreground">
                  Test whether you can access the protected profile page
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link href="/profile" className="w-full">
                  <Button className="w-full">
                    Direct Profile Link
                  </Button>
                </Link>
                
                <Link href="/debug/profile-test" className="w-full">
                  <Button variant="outline" className="w-full">
                    Profile Test Page
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-wrap gap-2 justify-between">
            {user ? (
              <>
                <Button onClick={handleGoToProfile} variant="default">
                  Go to Profile
                </Button>
                <Button onClick={handleSignOut} variant="destructive">
                  Sign Out
                </Button>
              </>
            ) : (
              <Button onClick={handleGoToLogin} variant="default">
                Sign In
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
} 