"use client";

import { AuthForm } from "@/components/auth/auth-form";
import { Suspense } from "react";
import { Sparkles, ShieldCheck, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { JurisLogo } from "@/components/juris-logo";

export default function LoginPage() {
  return (
    <div className="relative min-h-[calc(100vh-80px)] overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/70 via-purple-50/40 to-indigo-50/70 dark:from-blue-950/30 dark:via-purple-950/20 dark:to-indigo-950/30" />
      <div className="absolute top-10 left-5 w-40 h-40 bg-gradient-to-br from-blue-400/20 to-purple-500/20 dark:from-blue-600/20 dark:to-purple-700/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-10 right-5 w-52 h-52 bg-gradient-to-br from-purple-400/20 to-indigo-500/20 dark:from-purple-600/20 dark:to-indigo-700/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1.5s" }} />
      <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-gradient-to-br from-indigo-300/30 to-blue-400/30 dark:from-indigo-500/30 dark:to-blue-600/30 rounded-full blur-2xl animate-pulse" style={{ animationDelay: "3s" }} />
      
      <div className="container flex flex-col items-center justify-center min-h-[calc(100vh-80px)] py-8 px-4 relative z-10">
        <div className="w-full max-w-md">
          {/* Enhanced Logo and Header */}
          <motion.div
            className="text-center space-y-6 mb-8"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="flex items-center justify-center mb-6">
              <JurisLogo />
            </div>
            
            <div className="space-y-3">
              <motion.h1
                className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Welcome to Juris.AI
              </motion.h1>
              <motion.p
                className="text-lg text-muted-foreground font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                AI-Powered Legal Assistant Platform
              </motion.p>
              <motion.p
                className="text-sm text-muted-foreground/80"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Sign in to access personalized legal assistance
              </motion.p>
            </div>
          </motion.div>
          
          {/* Enhanced Auth Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur-xl -z-10"></div>
            <Suspense fallback={
              <div className="flex items-center justify-center p-12">
                <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
              </div>
            }>
              <AuthForm />
            </Suspense>
          </motion.div>
          
          {/* Enhanced Security Badge */}
          <motion.div
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/70 dark:bg-black/30 backdrop-blur-lg border border-white/50 dark:border-white/10 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="relative">
                <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                  <ShieldCheck className="h-4 w-4 text-green-600" />
                </div>
                <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-20"></div>
              </div>
              <span className="text-sm font-medium text-foreground">
                Secure authentication with Supabase
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
