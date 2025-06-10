'use client';

import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "How accurate are the AI legal responses?",
    answer: "Our AI models are trained on extensive legal databases and achieve high accuracy rates. However, all responses should be reviewed by qualified legal professionals as they are for informational purposes only and do not constitute legal advice."
  },
  {
    question: "Which AI models do you use?",
    answer: "We integrate multiple leading AI models including GPT-4, Claude, Gemini, and Mistral AI. This allows users to compare responses and get comprehensive insights from different AI perspectives."
  },
  {
    question: "Is my data secure and confidential?",
    answer: "Yes, we take data security seriously. All communications are encrypted, and we follow industry-standard security practices. We do not store or share your legal queries or documents without your explicit consent."
  },
  {
    question: "Can I use this for actual legal cases?",
    answer: "Our services provide legal information and research assistance, but should not replace professional legal counsel. Always consult with a qualified attorney for legal advice specific to your situation."
  },
  {
    question: "What jurisdictions are supported?",
    answer: "We support over 50 jurisdictions including the US, UK, EU, Canada, Australia, India, and many others. Our AI models are trained on jurisdiction-specific legal data to provide relevant insights."
  },
  {
    question: "How does the document analysis work?",
    answer: "Upload your legal documents and our AI will analyze them for key clauses, potential issues, compliance matters, and provide summaries. The analysis includes risk assessment and recommendations."
  },
  {
    question: "Can I integrate Juris.AI with my existing tools?",
    answer: "Yes, our Enterprise plan includes API access that allows integration with your existing legal software and workflows. Contact our sales team for custom integration options."
  },
  {
    question: "What's included in the free plan?",
    answer: "The free plan includes 5 queries per day, basic AI consultation, and general jurisdiction support. It's perfect for trying out our services and occasional legal research needs."
  }
];

export const FAQSection: React.FC = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <section className="mb-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
          Frequently Asked Questions
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Get answers to common questions about our legal AI services.
        </p>
      </div>
      
      <div className="max-w-4xl mx-auto space-y-4">
        {faqData.map((faq, index) => (
          <Card key={index} className="border border-muted hover:border-primary/50 transition-all duration-500 bg-gradient-to-r from-card/80 to-card/60 backdrop-blur-sm hover:shadow-lg shadow-md">
            <CardContent className="p-0">
              <button
                className="w-full text-left p-6 flex items-center justify-between hover:bg-gradient-to-r hover:from-primary/5 hover:to-primary/10 transition-all duration-300 rounded-t-lg"
                onClick={() => toggleItem(index)}
              >
                <h3 className="text-lg font-semibold text-foreground pr-4">
                  {faq.question}
                </h3>
                {openItems.includes(index) ? (
                  <ChevronUp className="h-5 w-5 text-primary flex-shrink-0 transition-transform duration-300" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground hover:text-primary flex-shrink-0 transition-all duration-300" />
                )}
              </button>

              {openItems.includes(index) && (
                <div className="px-6 pb-6 bg-gradient-to-r from-primary/5 to-primary/10 border-t border-primary/20">
                  <p className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
