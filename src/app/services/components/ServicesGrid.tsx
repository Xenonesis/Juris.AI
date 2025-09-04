'use client';

import React from 'react';
import {
  MessageSquare,
  FileText,
  Search,
  Gavel,
  Brain,
  BarChart3
} from 'lucide-react';
import { ServiceCard } from './ServiceCard';

interface Service {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  badge?: string;
  href: string;
  color: string;
}

const services: Service[] = [
  {
    icon: <MessageSquare className="h-8 w-8 text-blue-700 dark:text-blue-400" />,
    title: "AI Legal Consultation",
    description: "Get instant legal advice from multiple AI models trained on comprehensive legal databases.",
    features: [
      "Multi-model AI comparison",
      "Jurisdiction-specific advice",
      "Real-time legal research",
      "Case law integration"
    ],
    badge: "Most Popular",
    href: "/",
    color: "bg-gradient-to-br from-blue-50 to-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800"
  },
  {
    icon: <FileText className="h-8 w-8 text-emerald-700 dark:text-emerald-400" />,
    title: "Document Analysis",
    description: "Upload and analyze legal documents with AI-powered insights and risk assessment.",
    features: [
      "Contract review",
      "Risk identification",
      "Clause analysis",
      "Compliance checking"
    ],
    href: "/legal-bert",
    color: "bg-gradient-to-br from-emerald-50 to-emerald-100 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800"
  },
  {
    icon: <Search className="h-8 w-8 text-violet-700 dark:text-violet-400" />,
    title: "Case Law Research",
    description: "Search through extensive legal databases to find relevant precedents and case law.",
    features: [
      "Advanced search algorithms",
      "Relevance scoring",
      "Citation analysis",
      "Historical precedents"
    ],
    href: "/",
    color: "bg-gradient-to-br from-violet-50 to-violet-100 dark:bg-violet-900/30 border border-violet-200 dark:border-violet-800"
  },
  {
    icon: <Gavel className="h-8 w-8 text-amber-700 dark:text-amber-400" />,
    title: "Legal Research Tools",
    description: "Comprehensive suite of tools for legal professionals and students.",
    features: [
      "Statute lookup",
      "Legal definitions",
      "Jurisdiction comparison",
      "Legal forms library"
    ],
    href: "/legal-bert",
    color: "bg-gradient-to-br from-amber-50 to-amber-100 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800"
  },
  {
    icon: <BarChart3 className="h-8 w-8 text-rose-700 dark:text-rose-400" />,
    title: "Case Win Estimation",
    description: "AI-powered analysis to estimate the likelihood of success in legal cases.",
    features: [
      "Statistical analysis",
      "Historical data comparison",
      "Risk assessment",
      "Strategic recommendations"
    ],
    badge: "New",
    href: "/",
    color: "bg-gradient-to-br from-rose-50 to-rose-100 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-800"
  },
  {
    icon: <Brain className="h-8 w-8 text-indigo-700 dark:text-indigo-400" />,
    title: "Multi-Model AI Comparison",
    description: "Compare responses from different AI models to get comprehensive legal insights.",
    features: [
      "GPT-4 integration",
      "Claude analysis",
      "Gemini insights",
      "Mistral AI responses"
    ],
    href: "/",
    color: "bg-gradient-to-br from-indigo-50 to-indigo-100 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800"
  }
];

export const ServicesGrid: React.FC = () => {
  return (
    <section className="mb-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <ServiceCard
            key={index}
            icon={service.icon}
            title={service.title}
            description={service.description}
            features={service.features}
            badge={service.badge}
            href={service.href}
            color={service.color}
          />
        ))}
      </div>
    </section>
  );
};
