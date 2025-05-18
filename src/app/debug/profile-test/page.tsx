'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/components/auth/supabase-auth-provider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ProfileTestPage() {
  const { user, isLoading, refreshSession } = useAuth();
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  
  useEffect(() => {
    if (!isLoading) {
      setMessage(`Auth status: ${user ? 'Authenticated' : 'Not authenticated'}`);
    }
  }, [user, isLoading]);
  
  const handleTestProfileClick = async () => {
    setMessage('Testing profile navigation...');
    try {
      // Force refresh the auth session before navigating
      await refreshSession();
      router.push('/profile');
    } catch (error) {
      console.error('Error navigating to profile:', error);
      setMessage('Error navigating to profile');
    }
  };
  
  return (
    <div className="container py-8">
      <Card>
        <CardHeader>
          <CardTitle>Profile Link Test</CardTitle>
          <CardDescription>
            Test the navigation between pages and authentication state
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-md">
              <h3 className="font-medium">Current Auth Status</h3>
              {isLoading ? (
                <p>Loading auth status...</p>
              ) : (
                <p>{user ? `Logged in as: ${user.email}` : 'Not logged in'}</p>
              )}
            </div>
            
            {message && (
              <div className="p-4 bg-secondary rounded-md">
                <p>{message}</p>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="flex gap-2">
            <Button onClick={handleTestProfileClick} disabled={isLoading}>
              Test Profile Navigation
            </Button>
            <Link href="/profile">
              <Button variant="outline">Direct Profile Link</Button>
            </Link>
          </div>
          <Button onClick={() => refreshSession()} variant="outline">
            Refresh Auth
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 