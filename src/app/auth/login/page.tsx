"use client";

import { AuthForm } from "@/components/auth/auth-form";
import { Suspense } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, User, ShieldCheck } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[calc(100vh-80px)] py-8 px-4">
      <div className="w-full max-w-md">
        <div className="text-center space-y-2 mb-8 animate-fadeIn">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <User className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Welcome to Juris.Ai
          </h1>
          <p className="text-muted-foreground">
            Sign in to access personalized legal assistance
          </p>
        </div>
        
        <div className="relative">
          <div className="absolute -top-6 -left-6 w-12 h-12 bg-primary/5 rounded-full z-0 animate-pulse" />
          <div className="absolute -bottom-6 -right-6 w-12 h-12 bg-primary/5 rounded-full z-0 animate-pulse" style={{ animationDelay: "1s" }} />
          
          <Card className="backdrop-blur-sm border border-muted/60 shadow-lg relative z-10">
            <CardHeader className="space-y-1">
              <CardTitle className="text-xl flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                Sign In
              </CardTitle>
              <CardDescription>
                Choose your preferred authentication method
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={
                <div className="flex items-center justify-center p-8">
                  <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                </div>
              }>
                <AuthForm />
              </Suspense>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <div className="flex items-center mt-2 text-sm text-muted-foreground justify-center w-full">
                <ShieldCheck className="h-4 w-4 mr-1" /> 
                Secure authentication with Supabase
              </div>
            </CardFooter>
          </Card>
        </div>
        
        <div className="mt-8 text-center animate-fadeIn" style={{ animationDelay: "300ms" }}>
          <Alert className="bg-muted/50 border border-muted/30">
            <AlertDescription className="text-xs text-muted-foreground flex items-center justify-center">
              By signing in, you agree to our{" "}
              <Link href="#" className="text-primary hover:underline mx-1">Terms of Service</Link>{" "}and{" "}
              <Link href="#" className="text-primary hover:underline mx-1">Privacy Policy</Link>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
} 