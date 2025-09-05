'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { JurisLogo } from '@/components/juris-logo';

const AboutHeader = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center mb-20 md:mb-24"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex items-center justify-center mb-8"
      >
        <JurisLogo />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-high-contrast text-shadow mb-6"
      >
        About Juris.AI
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="text-lg md:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed"
      >
        Juris.AI is dedicated to revolutionizing the legal landscape by providing accessible, intelligent, and user-friendly AI-powered legal tools that empower individuals and professionals alike.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="flex items-center justify-center gap-6 mt-8"
      >
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-sm text-muted-foreground">AI-Powered</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
          <span className="text-sm text-muted-foreground">Professional Grade</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border">
          <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
          <span className="text-sm text-muted-foreground">Accessible</span>
        </div>
      </motion.div>
    </motion.header>
  );
};

export default AboutHeader;
