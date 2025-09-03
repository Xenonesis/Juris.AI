'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Scale,
  FileText,
  Search,
  MessageSquare,
  Brain,
  Gavel,
  BookOpen,
  Users,
  Zap,
  Shield,
  Clock,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Target,
  BarChart3
} from 'lucide-react';
import Link from 'next/link';
import { ServiceCard, PricingCard, FeatureHighlight, FAQSection, TestimonialsSection, ServiceComparison } from './components';

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

const ServicesPage = () => {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20 bg-gradient-to-br from-background via-slate-50/50 to-primary/5 dark:from-background dark:via-slate-900/50 dark:to-slate-900">
      {/* Hero Section */}
      <header className="text-center mb-16 md:mb-20">
        <div className="inline-block mb-6 bg-gradient-to-br from-primary/10 to-primary/20 p-4 rounded-2xl border border-primary/20 shadow-lg shadow-primary/10">
          <Sparkles className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent mb-6">
          Legal Services
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
          Comprehensive AI-powered legal services designed to assist lawyers, legal professionals, and individuals with their legal needs.
        </p>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-12">
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-primary mb-2">4+</div>
            <div className="text-sm text-muted-foreground">AI Models</div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-primary mb-2">50+</div>
            <div className="text-sm text-muted-foreground">Jurisdictions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-primary mb-2">24/7</div>
            <div className="text-sm text-muted-foreground">Availability</div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-primary mb-2">99%</div>
            <div className="text-sm text-muted-foreground">Accuracy</div>
          </div>
        </div>
      </header>

      {/* Services Grid */}
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

      {/* Why Choose Our Services */}
      <section className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Why Choose Juris.AI Services?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our AI-powered legal services combine cutting-edge technology with comprehensive legal knowledge.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureHighlight
            icon={<Zap className="h-8 w-8 text-blue-700 dark:text-blue-400" />}
            title="Lightning Fast"
            description="Get instant legal insights and analysis in seconds, not hours or days."
            color="bg-gradient-to-br from-blue-50 to-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 shadow-lg shadow-blue-100 dark:shadow-none"
          />

          <FeatureHighlight
            icon={<Shield className="h-8 w-8 text-emerald-700 dark:text-emerald-400" />}
            title="Secure & Private"
            description="Your legal documents and queries are protected with enterprise-grade security."
            color="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 shadow-lg shadow-emerald-100 dark:shadow-none"
          />

          <FeatureHighlight
            icon={<Target className="h-8 w-8 text-violet-700 dark:text-violet-400" />}
            title="Highly Accurate"
            description="Powered by multiple AI models trained on extensive legal databases for maximum accuracy."
            color="bg-gradient-to-br from-violet-50 to-violet-100 dark:bg-violet-900/30 border border-violet-200 dark:border-violet-800 shadow-lg shadow-violet-100 dark:shadow-none"
          />
        </div>
      </section>

      {/* Pricing Section */}
      <section className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Service Pricing
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that best fits your legal needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <PricingCard
            title="Free"
            price="$0"
            period="per month"
            features={[
              { text: "5 queries per day", included: true },
              { text: "Basic AI consultation", included: true },
              { text: "General jurisdiction support", included: true },
              { text: "Multi-model comparison", included: false },
              { text: "Document analysis", included: false }
            ]}
            buttonText="Get Started Free"
            buttonVariant="outline"
          />

          <PricingCard
            title="Professional"
            price="$29"
            period="per month"
            features={[
              { text: "Unlimited queries", included: true },
              { text: "Multi-model AI comparison", included: true },
              { text: "Document analysis", included: true },
              { text: "Case law research", included: true },
              { text: "Priority support", included: true }
            ]}
            buttonText="Start Pro Trial"
            popular={true}
          />

          <PricingCard
            title="Enterprise"
            price="Custom"
            period="pricing"
            features={[
              { text: "Everything in Pro", included: true },
              { text: "Custom AI training", included: true },
              { text: "API access", included: true },
              { text: "Dedicated support", included: true },
              { text: "White-label solution", included: true }
            ]}
            buttonText="Contact Sales"
            buttonVariant="outline"
          />
        </div>
      </section>

      {/* Service Comparison */}
      <ServiceComparison />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* FAQ Section */}
      <FAQSection />

      {/* CTA Section */}
      <section className="text-center bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 rounded-3xl p-8 md:p-12 border border-primary/20 shadow-xl shadow-primary/10">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
          Ready to Transform Your Legal Work?
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          Join thousands of legal professionals who trust Juris.AI for their legal research and analysis needs.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button size="lg" className="px-8 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300">
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="/about">
            <Button size="lg" variant="outline" className="px-8 border-primary/30 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300">
              Learn More
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
