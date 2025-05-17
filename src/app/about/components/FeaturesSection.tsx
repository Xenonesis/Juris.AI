"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Scale, Sparkles, MessageSquare, BookOpen, User, FileText, Gavel } from "lucide-react";
import { motion } from "framer-motion";

interface Feature {
  icon: React.ReactElement;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: <Scale className="h-6 w-6 text-primary" />,
    title: "Legal Document Analysis",
    description: "Upload and analyze legal documents using advanced AI models. Get summaries, identify key clauses, and understand complex legal jargon.",
  },
  {
    icon: <Sparkles className="h-6 w-6 text-primary" />,
    title: "AI-Powered Legal Advice",
    description: "Ask legal questions and receive AI-generated advice and information. Our system is trained on a vast corpus of legal texts and case law.",
  },
  {
    icon: <MessageSquare className="h-6 w-6 text-primary" />,
    title: "Interactive Chat Interface",
    description: "Engage in a conversation with our AI legal assistant to explore legal topics, get explanations, and refine your queries.",
  },
  {
    icon: <BookOpen className="h-6 w-6 text-primary" />,
    title: "Case Law Search (Coming Soon)",
    description: "Search through an extensive database of case law to find relevant precedents and legal arguments.",
  },
  {
    icon: <User className="h-6 w-6 text-primary" />,
    title: "Personalized Profiles",
    description: "Create a profile to save your queries, documents, and preferences for a tailored experience.",
  },
  {
    icon: <FileText className="h-6 w-6 text-primary" />,
    title: "Contract Review",
    description: "Quickly review contracts for potential issues, missing clauses, or unfavorable terms using AI-powered analysis.",
  },
  {
    icon: <Gavel className="h-6 w-6 text-primary" />,
    title: "Legal Research Assistance",
    description: "Get help with legal research by identifying relevant statutes, regulations, and scholarly articles.",
  },
];

const FeaturesSection = () => {

  return (
    <section id="features" className="mb-16 md:mb-20">
      <h2 className="text-3xl md:text-4xl font-semibold text-center mb-12 text-foreground">
        Key Features
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 rounded-lg border border-border hover:border-primary/50 bg-card/80 backdrop-blur-sm group">
              <CardHeader className="flex flex-row items-center gap-4 pb-4">
                <span className="p-3 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
                  {React.cloneElement(feature.icon, { className: "h-6 w-6 text-primary group-hover:scale-110 transition-transform" })}
                </span>
                <CardTitle className="text-xl font-bold text-foreground">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-base leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
