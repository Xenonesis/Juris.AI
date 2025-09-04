/**
 * Interactive demo component for landing page
 * Allows users to try sample queries and see demo responses
 */

'use client';

import React, { memo, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Send, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { itemVariants, scaleOnHover } from '@/lib/motion-variants';
import { trackDemoInteraction, trackButtonClick } from '@/lib/analytics';
import { demoQueries } from '@/lib/landing-data';
import { AnimatedSection, SectionHeader } from './ui-components';

const InteractiveDemo: React.FC = memo(() => {
  const [selectedQuery, setSelectedQuery] = useState(0);
  const [demoInput, setDemoInput] = useState('');

  const handleQuerySelect = useCallback((index: number, query: string) => {
    setSelectedQuery(index);
    setDemoInput(query);
    trackDemoInteraction('select_sample_query', query);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDemoInput(value);
    trackDemoInteraction('input_change', value);
  }, []);

  const handleInputFocus = useCallback(() => {
    trackDemoInteraction('input_focus');
  }, []);

  const handleSubmitQuery = useCallback(() => {
    trackDemoInteraction('submit_query', demoInput);
    trackButtonClick('Submit Demo Query', 'Demo Section');
  }, [demoInput]);

  return (
    <AnimatedSection 
      className="py-20 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20"
      sectionName="demo"
      aria-label="Interactive demo of Juris.AI"
    >
      <div className="container mx-auto px-4">
        <SectionHeader 
          title="Try Juris.AI Live"
          subtitle="Experience the power of AI legal analysis with our interactive demo. Ask a question or try one of our examples."
          highlightWords={["Juris.AI"]}
        />

        <div className="max-w-4xl mx-auto px-4 sm:px-0">
          <motion.div variants={itemVariants}>
            <Card className="p-4 sm:p-6 md:p-8 bg-background/80 backdrop-blur-sm border-2 border-primary/10 shadow-xl">
              {/* Demo Interface */}
              <div className="space-y-4 sm:space-y-6">
                {/* Query Input */}
                <div className="space-y-3 sm:space-y-4">
                  <label 
                    htmlFor="demo-input" 
                    className="text-sm font-medium text-muted-foreground"
                  >
                    Ask Juris.AI a legal question:
                  </label>
                  <div className="relative">
                    <input
                      id="demo-input"
                      type="text"
                      value={demoInput}
                      onChange={handleInputChange}
                      onFocus={handleInputFocus}
                      placeholder="Type your legal question here..."
                      className="w-full px-3 sm:px-4 py-3 sm:py-4 pr-10 sm:pr-12 text-base sm:text-lg border-2 border-muted rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors bg-background/50"
                      aria-describedby="demo-input-help"
                    />
                    <Button 
                      size="sm" 
                      className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 rounded-lg h-8 w-8 sm:h-auto sm:w-auto"
                      onClick={handleSubmitQuery}
                      aria-label="Submit legal question for demo analysis"
                      disabled={!demoInput.trim()}
                    >
                      <Send className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                  <p id="demo-input-help" className="text-xs text-muted-foreground">
                    This is a demo interface. Sign up for detailed analysis with citations.
                  </p>
                </div>

                {/* Sample Queries */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-muted-foreground">
                    Or try these examples:
                  </label>
                  <div 
                    className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3"
                    role="group"
                    aria-label="Sample legal questions"
                  >
                    {demoQueries.map((query, index) => (
                      <motion.button
                        key={index}
                        onClick={() => handleQuerySelect(index, query)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleQuerySelect(index, query);
                          }
                        }}
                        className={`p-3 sm:p-4 text-left text-xs sm:text-sm rounded-lg border-2 transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                          selectedQuery === index 
                            ? 'border-primary bg-primary/5 text-primary' 
                            : 'border-muted hover:border-primary/50 bg-background/50'
                        }`}
                        variants={scaleOnHover}
                        whileHover="hover"
                        whileTap="tap"
                        aria-pressed={selectedQuery === index}
                        aria-label={`Sample query: ${query}`}
                      >
                        {query}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Demo Response */}
                <div className="mt-8 p-6 bg-muted/30 rounded-xl border">
                  <div className="flex items-center gap-2 mb-4">
                    <Brain className="h-5 w-5 text-primary" />
                    <span className="font-medium">Juris.AI Analysis</span>
                    <Badge variant="secondary" className="ml-auto">Demo Mode</Badge>
                  </div>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <p>
                      <strong className="text-foreground">Key Legal Considerations:</strong> Based on your query, here are the primary legal aspects to consider...
                    </p>
                    <p>
                      <strong className="text-foreground">Relevant Statutes:</strong> The following laws and regulations apply to your situation...
                    </p>
                    <p>
                      <strong className="text-foreground">Recommended Actions:</strong> We suggest the following steps to address your legal needs...
                    </p>
                    <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                      <p className="text-blue-800 dark:text-blue-200 text-xs">
                        💡 <strong>Sign up to get detailed, jurisdiction-specific analysis with citations and actionable recommendations.</strong>
                      </p>
                    </div>
                  </div>
                </div>

                {/* CTA in Demo */}
                <div className="text-center pt-4">
                  <Link href="/auth/login">
                    <Button 
                      size="lg" 
                      className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      onClick={() => trackButtonClick('Get Full Analysis', 'Demo Section')}
                    >
                      Get Full Analysis
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </AnimatedSection>
  );
});

InteractiveDemo.displayName = 'InteractiveDemo';

export { InteractiveDemo };
