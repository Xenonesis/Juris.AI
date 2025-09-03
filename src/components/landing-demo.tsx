'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Scale, Sparkles, ArrowRight, CheckCircle } from 'lucide-react';

const LandingDemo = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-slate-50/50 to-background dark:from-background dark:via-slate-900/50 dark:to-background p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="relative inline-block mb-6">
            <div className="w-20 h-20 rounded-3xl professional-gradient flex items-center justify-center shadow-2xl animate-glow">
              <Scale className="h-10 w-10 text-white" />
            </div>
            <motion.div 
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="h-3 w-3 text-white" />
            </motion.div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent animate-gradient-shift bg-300%">
              Landing Page Demo
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8">
            Your new landing page is ready with beautiful animations and modern design!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              View Landing Page
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: "Dynamic Animations", desc: "Framer Motion powered smooth animations" },
            { title: "Responsive Design", desc: "Perfect on all devices and screen sizes" },
            { title: "Modern UI/UX", desc: "Matches your existing design system" }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Card className="p-6 h-full bg-background/50 backdrop-blur-sm hover:bg-background/80 transition-all duration-300">
                <CheckCircle className="h-8 w-8 text-green-500 mb-4" />
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandingDemo;