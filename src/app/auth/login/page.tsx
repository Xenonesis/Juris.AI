"use client";

import { AuthForm } from "@/components/auth/auth-form";
import { Suspense } from "react";
import { Scale, Sparkles, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
  return (
    <div className="relative min-h-[calc(100vh-80px)] overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-indigo-50/50 dark:from-blue-950/20 dark:via-purple-950/10 dark:to-indigo-950/20" />
      <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200/20 dark:bg-blue-800/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-200/20 dark:bg-purple-800/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
      
      <div className="container flex flex-col items-center justify-center min-h-[calc(100vh-80px)] py-8 px-4 relative z-10">
        <div className="w-full max-w-md">
          {/* Logo and Header */}
          <motion.div 
            className="text-center space-y-6 mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-2xl">
                  <Scale className="h-10 w-10 text-white" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }} />
                </div>
                <motion.div 
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="h-3 w-3 text-white" />
                </motion.div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Welcome to Juris.AI
              </h1>
              <p className="text-lg text-muted-foreground">
                AI-Powered Legal Assistant Platform
              </p>
              <p className="text-sm text-muted-foreground/80">
                Sign in to access personalized legal assistance
              </p>
            </div>
          </motion.div>
          
          {/* Auth Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Suspense fallback={
              <div className="flex items-center justify-center p-12">
                <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
              </div>
            }>
              <AuthForm />
            </Suspense>
          </motion.div>
          
          {/* Security Badge */}
          <motion.div 
            className="mt-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-muted/30 text-sm text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-green-600" />
              Secure authentication with Supabase
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
