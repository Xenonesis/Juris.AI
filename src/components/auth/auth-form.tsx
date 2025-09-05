'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/components/auth/supabase-auth-provider';
import { AuthResponse } from '@supabase/supabase-js';
import { CheckCircle, AlertCircle, Loader2, FileText, Shield, Lock, Mail } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';
  const { refreshSession, user, isLoading: authLoading } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  
  // Watch for authentication changes and redirect immediately
  useEffect(() => {
    if (!authLoading && user && success) {
      console.log('User authenticated via useEffect, redirecting immediately to:', redirectTo);
      window.location.href = redirectTo;
    }
  }, [user, authLoading, success, redirectTo]);

  const getSupabaseClient = () => {
    try {
      return createClient();
    } catch (e) {
      console.error("Error using default supabase client, creating a new one:", e);
      return createClient();
    }
  };

  const validateTermsAcceptance = () => {
    if (!acceptedTerms || !acceptedPrivacy) {
      setError("You must accept both Terms of Service and Privacy Policy to create an account or sign in. This is required for legal compliance and account activation.");
      return false;
    }
    return true;
  };

  const recordTermsAcceptance = async (userId: string) => {
    try {
      const response = await fetch('/api/auth/accept-terms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          acceptTerms: acceptedTerms,
          acceptPrivacy: acceptedPrivacy,
          acceptCookies: false, // Will be handled by cookie banner
        }),
      });

      if (!response.ok) {
        console.warn('Failed to record terms acceptance via API');
      }
    } catch (error) {
      console.warn('Error recording terms acceptance:', error);
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

    if (!validateTermsAcceptance()) {
      setLoading(false);
      return;
    }

    try {
      console.log('Attempting signup with email:', email);
      
      const client = getSupabaseClient();
      
      const { data, error }: AuthResponse = await client.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            accepted_terms: true,
            accepted_privacy: true,
            terms_accepted_at: new Date().toISOString(),
            privacy_accepted_at: new Date().toISOString(),
          }
        },
      });

      if (error) {
        console.error('Signup error:', error);
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
        
        // Record terms acceptance
        await recordTermsAcceptance(data.user.id);
        
        setSuccess('Account created successfully! Check your email for the confirmation link.');
        
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

    if (!validateTermsAcceptance()) {
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
        setLoading(false);
        
        try {
          await refreshSession();
          
          console.log('Redirecting to:', redirectTo);
          router.replace(redirectTo);
          router.refresh();
          
          setTimeout(() => {
            if (window.location.pathname !== redirectTo) {
              console.log('Router redirect failed, using window.location fallback');
              window.location.href = redirectTo;
            }
          }, 500);
        } catch (error) {
          console.error('Error during redirect process:', error);
          window.location.href = redirectTo;
        }
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
    <div className="w-full max-w-md mx-auto">
      <Tabs defaultValue="login" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6 bg-muted/50">
          <TabsTrigger value="login" className="data-[state=active]:bg-background">Login</TabsTrigger>
          <TabsTrigger value="signup" className="data-[state=active]:bg-background">Sign Up</TabsTrigger>
        </TabsList>
        
        <TabsContent value="login">
          <Card className="backdrop-blur-sm border border-muted/60 shadow-xl bg-background/80">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-3">
                <Lock className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
              <CardDescription>Sign in to your Juris.AI account</CardDescription>
            </CardHeader>
            <form onSubmit={handleSignIn}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-11"
                  />
                </div>
                
                {/* Terms and Privacy Acceptance */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="terms-login"
                      checked={acceptedTerms}
                      onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
                      className="mt-1"
                    />
                    <label htmlFor="terms-login" className="text-sm leading-5">
                      I agree to the{" "}
                      <Link href="/terms-of-service" className="text-blue-600 hover:underline font-medium" target="_blank">
                        Terms of Service
                      </Link>
                    </label>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="privacy-login"
                      checked={acceptedPrivacy}
                      onCheckedChange={(checked) => setAcceptedPrivacy(checked === true)}
                      className="mt-1"
                    />
                    <label htmlFor="privacy-login" className="text-sm leading-5">
                      I agree to the{" "}
                      <Link href="/privacy-policy" className="text-blue-600 hover:underline font-medium" target="_blank">
                        Privacy Policy
                      </Link>
                    </label>
                  </div>
                </div>
                
                {error && (
                  <motion.div 
                    className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 flex items-center gap-2 text-sm"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <p>{error}</p>
                  </motion.div>
                )}
                
                {success && (
                  <motion.div 
                    className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 flex items-center gap-2 text-sm"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <CheckCircle className="h-4 w-4 flex-shrink-0" />
                    <p>{success}</p>
                  </motion.div>
                )}
              </CardContent>
              <CardFooter className="flex flex-col space-y-3">
                <Button 
                  type="submit" 
                  className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  disabled={loading || !acceptedTerms || !acceptedPrivacy}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    <span>Sign In</span>
                  )}
                </Button>
                <Button 
                  type="button" 
                  variant="link" 
                  onClick={() => router.push('/auth/forgot-password')} 
                  className="text-sm"
                >
                  Forgot your password?
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        
        <TabsContent value="signup">
          <Card className="backdrop-blur-sm border border-muted/60 shadow-xl bg-background/80">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-3">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
              <CardDescription>Join Juris.AI to get started</CardDescription>
            </CardHeader>
            <form onSubmit={handleSignUp}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="signup-email" className="text-sm font-medium flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Address
                  </label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="signup-password" className="text-sm font-medium flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Password
                  </label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Create a secure password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-11"
                  />
                  <p className="text-xs text-muted-foreground">Must be at least 6 characters</p>
                </div>
                
                {/* Terms and Privacy Acceptance */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="terms-signup"
                      checked={acceptedTerms}
                      onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
                      className="mt-1"
                    />
                    <label htmlFor="terms-signup" className="text-sm leading-5">
                      I agree to the{" "}
                      <Link href="/terms-of-service" className="text-blue-600 hover:underline font-medium" target="_blank">
                        Terms of Service
                      </Link>
                    </label>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="privacy-signup"
                      checked={acceptedPrivacy}
                      onCheckedChange={(checked) => setAcceptedPrivacy(checked === true)}
                      className="mt-1"
                    />
                    <label htmlFor="privacy-signup" className="text-sm leading-5">
                      I agree to the{" "}
                      <Link href="/privacy-policy" className="text-blue-600 hover:underline font-medium" target="_blank">
                        Privacy Policy
                      </Link>
                    </label>
                  </div>
                </div>
                
                {error && (
                  <motion.div 
                    className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 flex items-center gap-2 text-sm"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <p>{error}</p>
                  </motion.div>
                )}
                
                {success && (
                  <motion.div 
                    className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 flex items-center gap-2 text-sm"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <CheckCircle className="h-4 w-4 flex-shrink-0" />
                    <p>{success}</p>
                  </motion.div>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  type="submit" 
                  className="w-full h-11 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                  disabled={loading || !acceptedTerms || !acceptedPrivacy}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Creating account...</span>
                    </div>
                  ) : (
                    <span>Create Account</span>
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
