'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, HelpCircle, ChevronDown, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

const faqData: FAQItem[] = [
  {
    id: "what-is-juris-ai",
    question: "What is Juris.Ai?",
    answer: "Juris.Ai is an AI-powered legal assistant platform that provides comprehensive legal advice, case studies, and win probability estimations by leveraging multiple AI models.",
    category: "General"
  },
  {
    id: "ai-models",
    question: "What AI models does Juris.Ai use?",
    answer: "Juris.Ai compares legal advice from multiple AI models, including GPT-4, Claude, Gemini, and Mistral.",
    category: "Technology"
  },
  {
    id: "legal-advice-substitute",
    question: "Is the advice provided by Juris.Ai a substitute for professional legal advice?",
    answer: "No, the information provided by Juris.Ai is not a substitute for professional legal advice. Always consult with a qualified attorney for your specific legal needs.",
    category: "Legal"
  },
  {
    id: "collaboration-opportunities",
    question: "How can I collaborate with Juris.Ai?",
    answer: "We are open to various collaboration opportunities, including joint ventures, research and development projects, and API integrations. Please use the contact form on this page to submit your proposal.",
    category: "Collaboration"
  },
  {
    id: "data-security",
    question: "How secure is my data with Juris.Ai?",
    answer: "We take data security very seriously. All communications are encrypted, and we follow industry-standard security practices. We do not store or share your legal queries or documents without your explicit consent.",
    category: "Security"
  },
  {
    id: "pricing",
    question: "What are the pricing options for collaboration?",
    answer: "We offer flexible pricing plans for collaboration partners. Please contact us through the form on this page to discuss custom pricing options based on your specific needs and partnership type.",
    category: "Pricing"
  },
  {
    id: "integration",
    question: "Can I integrate Juris.Ai with my existing tools?",
    answer: "Yes, our Enterprise plan includes API access that allows integration with your existing legal software and workflows. Contact our sales team for custom integration options.",
    category: "Technology"
  },
  {
    id: "support",
    question: "What kind of support is available for collaboration partners?",
    answer: "We provide dedicated support for all our collaboration partners, including technical assistance, onboarding guidance, and regular check-ins to ensure successful integration and utilization of our services.",
    category: "Support"
  }
];

const categories = [
  "All",
  "General",
  "Technology",
  "Legal",
  "Collaboration",
  "Security",
  "Pricing",
  "Support"
];

export const EnhancedFAQSection: React.FC = () => {
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredFaqs, setFilteredFaqs] = useState<FAQItem[]>(faqData);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter FAQs based on search query and category
  useEffect(() => {
    let result = faqData;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(faq => 
        faq.question.toLowerCase().includes(query) || 
        faq.answer.toLowerCase().includes(query)
      );
    }
    
    if (selectedCategory !== 'All') {
      result = result.filter(faq => faq.category === selectedCategory);
    }
    
    setFilteredFaqs(result);
  }, [searchQuery, selectedCategory]);

  const toggleFaq = (id: string) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  const clearSearch = () => {
    setSearchQuery('');
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  return (
    <section className="mt-16">
      <div className="text-center mb-12">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center mb-4"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <HelpCircle className="h-6 w-6 text-white" />
          </div>
        </motion.div>
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
        >
          Frequently Asked Questions
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg text-muted-foreground max-w-2xl mx-auto"
        >
          Find answers to common questions about collaborating with Juris.Ai
        </motion.p>
      </div>

      {/* Search and Filter Controls */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="max-w-4xl mx-auto mb-10"
      >
        <div className="relative mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              ref={searchInputRef}
              type="text"
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-12 py-6 text-base rounded-xl border-muted-foreground/20 focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            {searchQuery && (
              <button 
                onClick={clearSearch}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'bg-muted hover:bg-muted/80 text-muted-foreground'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </motion.div>

      {/* FAQ Items */}
      <div className="max-w-4xl mx-auto space-y-4">
        <AnimatePresence>
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, index) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="border border-muted hover:border-primary/50 transition-all duration-500 bg-gradient-to-r from-card/80 to-card/60 backdrop-blur-sm hover:shadow-lg shadow-md rounded-xl overflow-hidden"
              >
                <button
                  className="w-full text-left p-6 flex items-center justify-between hover:bg-gradient-to-r hover:from-primary/5 hover:to-primary/10 transition-all duration-300"
                  onClick={() => toggleFaq(faq.id)}
                  aria-expanded={openFaqId === faq.id}
                  aria-controls={`faq-content-${faq.id}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="mt-1 flex-shrink-0">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <HelpCircle className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground pr-4 flex-grow text-left">
                      {faq.question}
                    </h3>
                  </div>
                  <motion.div
                    animate={{ rotate: openFaqId === faq.id ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-shrink-0"
                  >
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {openFaqId === faq.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      id={`faq-content-${faq.id}`}
                      role="region"
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pl-20 bg-gradient-to-r from-primary/5 to-primary/10 border-t border-primary/20">
                        <p className="text-muted-foreground leading-relaxed">
                          {faq.answer}
                        </p>
                        {faq.category && (
                          <div className="mt-3">
                            <span className="inline-block px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                              {faq.category}
                            </span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-muted-foreground text-lg">
                No FAQs found matching your search criteria.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="mt-4 text-primary hover:underline"
              >
                Clear filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Contact CTA */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-16 text-center max-w-2xl mx-auto"
      >
        <Card className="p-8 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20 border-primary/10">
          <h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
          <p className="text-muted-foreground mb-6">
            Our team is ready to help you with any specific questions about collaboration opportunities.
          </p>
          <p className="text-sm text-muted-foreground">
            Reach out to us through the contact form above and we'll get back to you within 24 hours.
          </p>
        </Card>
      </motion.div>
    </section>
  );
};