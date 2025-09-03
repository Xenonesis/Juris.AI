'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/components/auth/supabase-auth-provider';
import { AuthResponse } from '@supabase/supabase-js';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';
  const { refreshSession } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Get a new, browser-side supabase client as a fallback in case the main one has issues
  const getSupabaseClient = () => {
    try {
      // First try to use the default client
      return createClient();
    } catch (e) {
      console.error("Error using default supabase client, creating a new one:", e);
      // If that fails, create a new client using our local function
      return createClient();
    }
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!email || !password) {
      setError("Email and password are required");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      console.log('Attempting signup with email:', email);
      
      const client = getSupabaseClient();
      
      // Proceed with signup
      const { data, error }: AuthResponse = await client.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        console.error('Signup error:', error);
        // Provide more user-friendly error messages
        if (error.message.includes('Database error')) {
          setError('Account creation failed. Please try again later or contact support.');
        } else if (error.message.includes('already registered')) {
          setError('An account with this email already exists. Please sign in instead.');
        } else {
          setError(error.message || 'Failed to create account');
        }
        setLoading(false);
        return;
      }
      
      console.log('Signup response:', data);
      
      if (data?.user) {
        console.log('Signup successful, user:', data.user);
        setSuccess('Check your email for the confirmation link!');
        
        // Add a slight delay before allowing another signup attempt
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      } else {
        setError('Failed to create user account. Please try again.');
        setLoading(false);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred during signup';
      console.error('Error signing up:', err);
      
      // Handle different error types
      if (errorMessage.includes('Database error saving new user')) {
        setError('Unable to create your profile. Please try again later.');
      } else {
        setError(errorMessage);
      }
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!email || !password) {
      setError("Email and password are required");
      setLoading(false);
      return;
    }

    try {
      console.log('Attempting login with email:', email, 'Redirect to:', redirectTo);
      
      const client = getSupabaseClient();
      const { data, error }: AuthResponse = await client.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        // Provide more user-friendly error messages
        if (error.message.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please check your credentials and try again.');
        } else {
          setError(error.message || 'Login failed');
        }
        setLoading(false);
        return;
      }
      
      if (data?.user) {
        console.log('Login successful, user:', data.user.email);
        setSuccess('Login successful! Redirecting...');
        
        // Refresh the session in our auth context
        await refreshSession();
        
        // Add a small delay to allow cookies to be set before redirect
        setTimeout(() => {
          console.log('Redirecting to:', redirectTo);
          router.push(redirectTo);
          router.refresh();
        }, 500);
      } else {
        setError('Login failed. Please check your credentials.');
        setLoading(false);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Invalid email or password';
      console.error('Error signing in:', err);
      setError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto animate-fadeIn">
      <Tabs defaultValue="login" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>
        
        <TabsContent value="login">
          <Card className="border-2 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Login</CardTitle>
              <CardDescription>Enter your credentials to access your account</CardDescription>
            </CardHeader>
            <form onSubmit={handleSignIn}>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2 transition-all duration-300">
                    <label htmlFor="email" className="text-sm font-medium">Email</label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="transition-all focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div className="space-y-2 transition-all duration-300">
                    <label htmlFor="password" className="text-sm font-medium">Password</label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="transition-all focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  
                  {error && (
                    <div className="p-3 rounded-md bg-destructive/10 text-destructive flex items-center gap-2 text-sm animate-fadeIn">
                      <AlertCircle className="h-4 w-4 flex-shrink-0" />
                      <p>{error}</p>
                    </div>
                  )}
                  
                  {success && (
                    <div className="p-3 rounded-md bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 flex items-center gap-2 text-sm animate-fadeIn">
                      <CheckCircle className="h-4 w-4 flex-shrink-0" />
                      <p>{success}</p>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  type="button" 
                  variant="link" 
                  onClick={() => router.push('/auth/forgot-password')} 
                  className="px-0"
                >
                  Forgot password?
                </Button>
                <Button 
                  type="submit" 
                  className="transition-all duration-300"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-1">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Processing...</span>
                    </div>
                  ) : (
                    <span>Login</span>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        
        <TabsContent value="signup">
          <Card className="border-2 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Create an account</CardTitle>
              <CardDescription>Sign up for a new account to get started</CardDescription>
            </CardHeader>
            <form onSubmit={handleSignUp}>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2 transition-all duration-300">
                    <label htmlFor="signup-email" className="text-sm font-medium">Email</label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="transition-all focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div className="space-y-2 transition-all duration-300">
                    <label htmlFor="signup-password" className="text-sm font-medium">Password</label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="transition-all focus:ring-2 focus:ring-primary/20"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Password must be at least 6 characters long</p>
                  </div>
                  
                  {error && (
                    <div className="p-3 rounded-md bg-destructive/10 text-destructive flex items-center gap-2 text-sm animate-fadeIn">
                      <AlertCircle className="h-4 w-4 flex-shrink-0" />
                      <p>{error}</p>
                    </div>
                  )}
                  
                  {success && (
                    <div className="p-3 rounded-md bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 flex items-center gap-2 text-sm animate-fadeIn">
                      <CheckCircle className="h-4 w-4 flex-shrink-0" />
                      <p>{success}</p>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  type="submit" 
                  className="w-full transition-all duration-300"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-1">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Creating account...</span>
                    </div>
                  ) : (
                    <span>Sign Up</span>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
