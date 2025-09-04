/**
 * FAQ section component for landing page
 * Contains expandable questions and contact information
 */

'use client';

import React, { memo, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronDown, Phone, Send } from 'lucide-react';
import Link from 'next/link';
import { itemVariants } from '@/lib/motion-variants';
import { trackFaqInteraction, trackButtonClick } from '@/lib/analytics';
import { faqs } from '@/lib/landing-data';
import { AnimatedSection, SectionHeader } from './ui-components';

const FAQSection: React.FC = memo(() => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleFaqToggle = useCallback((index: number, question: string) => {
    const newState = openFaq === index ? null : index;
    setOpenFaq(newState);
    trackFaqInteraction(question, newState === index ? 'open' : 'close');
  }, [openFaq]);

  return (
    <AnimatedSection 
      className="py-20 bg-muted/30"
      sectionName="faq"
      aria-label="Frequently asked questions about Juris.AI"
    >
      <div className="container mx-auto px-4">
        <SectionHeader 
          title="Frequently Asked Questions"
          subtitle="Get answers to common questions about Juris.AI's capabilities, security, and pricing"
          highlightWords={["Questions"]}
        />

        <div className="max-w-4xl mx-auto px-4 sm:px-0">
          <div className="space-y-3 sm:space-y-4">
            {faqs.map((faq, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                className="border border-muted rounded-xl overflow-hidden bg-background/50 backdrop-blur-sm"
              >
                <button
                  onClick={() => handleFaqToggle(index, faq.question)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleFaqToggle(index, faq.question);
                    }
                  }}
                  className="w-full px-4 sm:px-6 py-4 sm:py-5 text-left flex items-center justify-between hover:bg-muted/30 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-muted/30"
                  aria-expanded={openFaq === index}
                  aria-controls={`faq-answer-${index}`}
                  id={`faq-question-${index}`}
                >
                  <span className="font-semibold text-foreground pr-3 sm:pr-4 text-sm sm:text-base leading-tight">{faq.question}</span>
                  <motion.div
                    animate={{ rotate: openFaq === index ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    aria-hidden="true"
                  >
                    <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0" />
                  </motion.div>
                </button>
                <motion.div
                  initial={false}
                  animate={{ 
                    height: openFaq === index ? "auto" : 0,
                    opacity: openFaq === index ? 1 : 0
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                  id={`faq-answer-${index}`}
                  role="region"
                  aria-labelledby={`faq-question-${index}`}
                >
                  <div className="px-4 sm:px-6 pb-4 sm:pb-5 text-muted-foreground leading-relaxed text-sm sm:text-base">
                    {faq.answer}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* Contact Section */}
          <motion.div variants={itemVariants} className="mt-12 text-center">
            <Card className="p-8 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20 border-primary/10">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Phone className="h-6 w-6 text-white" />
                </div>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4">Contact Us</h3>
              <p className="text-base text-muted-foreground mb-6 max-w-2xl mx-auto">
                Have questions, feedback, or interested in collaborating? We&apos;d love to hear from you and help you get the most out of Juris.AI.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span className="text-sm font-medium">Email:</span>
                  <a href="mailto:ititsaddy7@gmail.com" className="text-primary hover:underline font-medium text-sm">
                    ititsaddy7@gmail.com
                  </a>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-sm font-medium">Response Time:</span>
                  <span className="text-sm text-muted-foreground">Within 24 hours</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="mailto:ititsaddy7@gmail.com" className="w-full sm:w-auto">
                  <Button
                    className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600"
                    onClick={() => trackButtonClick('Email Contact', 'Contact Section')}
                    aria-label="Send us an email"
                  >
                    Send Email
                    <Send className="ml-2 h-4 w-4" />
                  </Button>
                </a>
                <Link href="/collaboration" className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto px-6 py-3"
                    onClick={() => trackButtonClick('Collaboration Form', 'Contact Section')}
                    aria-label="Access collaboration form"
                  >
                    Collaboration Form
                  </Button>
                </Link>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </AnimatedSection>
  );
});

FAQSection.displayName = 'FAQSection';

export { FAQSection };
