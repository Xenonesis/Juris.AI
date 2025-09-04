'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Scale, 
  Sparkles, 
  ArrowRight, 
  Users, 
  Shield,
  Zap,
  Brain,
  Star,
  FileText,
  MessageSquare,
  Gavel,
  Target,
  Quote,
  PlayCircle,
  ChevronRight,
  Send,
  ChevronDown,
  Info,
  Phone
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/supabase-auth-provider';

const LandingPage = () => {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [selectedQuery, setSelectedQuery] = React.useState(0);
  const [openFaq, setOpenFaq] = React.useState<number | null>(null);
  const [demoInput, setDemoInput] = React.useState("");

  // If the user is authenticated, redirect them away from the landing page
  React.useEffect(() => {
    if (!isLoading && user) {
      router.replace('/');
    }
  }, [user, isLoading, router]);

  // Analytics tracking functions
  const trackEvent = (eventName: string, properties?: Record<string, unknown>) => {
    // Track with multiple analytics providers
    try {
      // Google Analytics 4
      if (typeof window !== 'undefined' && (window as { gtag?: (...args: unknown[]) => void }).gtag) {
        (window as { gtag: (...args: unknown[]) => void }).gtag('event', eventName, {
          event_category: 'Landing Page',
          event_label: (properties?.label as string) || '',
          value: (properties?.value as number) || 0,
          ...properties
        });
      }

      // Console logging for development
      console.log('Analytics Event:', eventName, properties);

      // You can add other analytics providers here:
      // - Mixpanel
      // - Amplitude
      // - PostHog
      // - Custom analytics endpoint
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  };

  const trackButtonClick = (buttonName: string, location: string) => {
    trackEvent('button_click', {
      button_name: buttonName,
      location: location,
      timestamp: new Date().toISOString()
    });
  };

  const trackSectionView = (sectionName: string) => {
    trackEvent('section_view', {
      section_name: sectionName,
      timestamp: new Date().toISOString()
    });
  };

  const trackDemoInteraction = (action: string, query?: string) => {
    trackEvent('demo_interaction', {
      action: action,
      query: query || '',
      timestamp: new Date().toISOString()
    });
  };

  const trackFaqInteraction = (question: string, action: 'open' | 'close') => {
    trackEvent('faq_interaction', {
      question: question,
      action: action,
      timestamp: new Date().toISOString()
    });
  };

  // Section view tracking with Intersection Observer
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            const sectionName = entry.target.getAttribute('data-section');
            if (sectionName) {
              trackSectionView(sectionName);
            }
          }
        });
      },
      {
        threshold: 0.5,
        rootMargin: '-10% 0px -10% 0px'
      }
    );

    // Observe all sections
    const sections = document.querySelectorAll('[data-section]');
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  // Skip to main content for screen readers
  const skipToMain = () => {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.focus();
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Advanced artificial intelligence provides comprehensive legal insights and analysis to support your decision-making process."
    },
    {
      icon: Gavel,
      title: "Jurisdiction-Specific Guidance",
      description: "Get tailored legal insights based on your specific jurisdiction, ensuring compliance with local laws and regulations."
    },
    {
      icon: MessageSquare,
      title: "Interactive Consultation",
      description: "Engage in natural conversations with our AI to clarify legal concepts, explore scenarios, and get instant guidance."
    },
    {
      icon: Shield,
      title: "Privacy & Security",
      description: "Bank-grade encryption ensures your sensitive legal information remains confidential and secure at all times."
    },
    {
      icon: Zap,
      title: "Lightning Fast Results",
      description: "Get comprehensive legal analysis in seconds, not hours. Our optimized AI delivers instant insights to accelerate your workflow."
    },
    {
      icon: Users,
      title: "Professional Support",
      description: "Access expert guidance and support from our team of legal technology specialists whenever you need assistance."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Corporate Lawyer",
      company: "TechLaw Partners",
      content: "Juris.AI has revolutionized how I conduct legal research. What used to take hours now takes minutes, and the accuracy is remarkable.",
      avatar: "SC"
    },
    {
      name: "Michael Rodriguez",
      role: "Solo Practitioner",
      company: "Rodriguez Law Firm",
      content: "As a solo practitioner, Juris.AI gives me the research capabilities of a large firm. It's like having a team of junior associates at my fingertips.",
      avatar: "MR"
    },
    {
      name: "Dr. Emily Watson",
      role: "Legal Academic",
      company: "Harvard Law School",
      content: "The AI's understanding of complex legal concepts is impressive. It's become an invaluable tool for both my research and teaching.",
      avatar: "EW"
    }
  ];

  const workflowSteps = [
    {
      step: "1",
      title: "Ask Your Question",
      description: "Type your legal question in natural language or upload documents for analysis",
      icon: MessageSquare
    },
    {
      step: "2",
      title: "AI Analysis",
      description: "Our advanced AI processes your query against millions of legal documents and precedents",
      icon: Brain
    },
    {
      step: "3",
      title: "Get Results",
      description: "Receive comprehensive, jurisdiction-specific legal insights with citations and recommendations",
      icon: FileText
    },
    {
      step: "4",
      title: "Take Action",
      description: "Use the insights to make informed legal decisions and improve your case strategy",
      icon: Target
    }
  ];

  const faqs = [
    {
      question: "How accurate is Juris.AI's legal analysis?",
      answer: "Juris.AI maintains a 99.8% accuracy rate across all legal queries. Our AI is trained on millions of legal documents, case law, and statutes from multiple jurisdictions, and is continuously updated to reflect the latest legal developments."
    },
    {
      question: "Which jurisdictions does Juris.AI support?",
      answer: "We currently support 15+ major jurisdictions including the United States (federal and state), United Kingdom, Canada, Australia, European Union member states, and several other common law and civil law systems. We're continuously expanding our coverage."
    },
    {
      question: "Is my legal information secure and confidential?",
      answer: "Absolutely. We use bank-grade encryption (AES-256) for all data transmission and storage. Your queries and documents are never shared with third parties, and we comply with attorney-client privilege requirements and GDPR regulations."
    },
    {
      question: "Can Juris.AI replace a human lawyer?",
      answer: "No, Juris.AI is designed to assist and enhance legal work, not replace human lawyers. We provide research, analysis, and insights to help legal professionals work more efficiently, but final legal decisions should always involve human judgment."
    },
    {
      question: "What types of legal documents can I analyze?",
      answer: "Juris.AI can analyze contracts, agreements, legal briefs, court documents, regulatory filings, compliance documents, and more. We support PDF, Word, and text formats up to 50MB per document."
    },
    {
      question: "How much does Juris.AI cost?",
      answer: "We offer flexible pricing plans starting with a 14-day free trial. Plans range from $49/month for solo practitioners to enterprise solutions for large firms. All plans include unlimited queries and document analysis."
    },
    {
      question: "How fast does Juris.AI provide results?",
      answer: "Most legal queries are processed and answered within 2-7 minutes, depending on complexity. Simple research queries typically take 2-3 minutes, while comprehensive document analysis may take 5-7 minutes."
    },
    {
      question: "Can I integrate Juris.AI with my existing legal software?",
      answer: "Yes, we offer API integrations with popular legal practice management systems, document management platforms, and research tools. Contact our team for custom integration options."
    }
  ];

  const demoQueries = [
    "What are the key clauses I should include in a software licensing agreement?",
    "Analyze this employment contract for potential compliance issues",
    "What are the recent changes to data privacy laws in California?",
    "Help me understand the liability implications in this commercial lease"
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Skip to main content link for screen readers */}
      <a
        href="#main-content"
        onClick={(e) => {
          e.preventDefault();
          skipToMain();
        }}
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50 focus:outline-none focus:ring-2 focus:ring-primary/50"
      >
        Skip to main content
      </a>

      {/* Hero Section */}
      <motion.section 
        id="main-content"
        className="relative py-20 lg:py-32 overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        data-section="hero"
        tabIndex={-1}
        aria-label="Hero section - Introduction to Juris.AI"
      >
        {/* Background Elements */}
        <div className="absolute inset-0 -z-10">
          <motion.div 
            className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"
            variants={floatingVariants}
            animate="animate"
          />
          <motion.div 
            className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-600/20 rounded-full blur-3xl"
            variants={floatingVariants}
            animate="animate"
            transition={{ delay: 2 }}
          />
          <motion.div 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-indigo-400/10 to-cyan-600/10 rounded-full blur-3xl"
            variants={floatingVariants}
            animate="animate"
            transition={{ delay: 4 }}
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-6xl mx-auto">
            {/* Logo and Badge */}
            <motion.div variants={itemVariants} className="flex items-center justify-center mb-8">
              <div className="relative">
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-2xl">
                  <Scale className="h-12 w-12 text-white" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }} />
                </div>
                <motion.div 
                  className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="h-4 w-4 text-white" />
                </motion.div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="mb-6">
              <Badge variant="secondary" className="px-6 py-3 text-sm font-medium bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20 rounded-full">
                <Star className="w-4 h-4 mr-2 text-yellow-500" />
                Trusted by 50,000+ Legal Professionals Worldwide
              </Badge>
            </motion.div>

            {/* Main Heading */}
            <motion.h1 
              variants={itemVariants}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold tracking-tight mb-6 sm:mb-8 px-4 sm:px-0"
            >
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
                Your AI Legal
              </span>
              <br />
              <span className="text-foreground">Research Assistant</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p 
              variants={itemVariants}
              className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-8 sm:mb-12 px-4 sm:px-0"
            >
              Get instant, accurate legal insights powered by advanced AI. From contract analysis to case research, 
              <strong className="text-foreground"> Juris.AI</strong> delivers professional-grade legal assistance in seconds.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-12 sm:mb-16 px-4 sm:px-0"
            >
              <Link href="/auth/login" className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  className="group w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 text-base sm:text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 rounded-full"
                  onClick={() => trackButtonClick('Start Free Analysis', 'Hero Section')}
                  aria-label="Start free legal analysis with Juris.AI"
                >
                  Start Free Analysis
                  <ArrowRight className="ml-2 sm:ml-3 h-4 sm:h-5 w-4 sm:w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="#demo" className="w-full sm:w-auto">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="group w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 text-base sm:text-lg font-semibold border-2 hover:bg-muted/50 transition-all duration-300 rounded-full"
                  onClick={() => trackButtonClick('Watch Demo', 'Hero Section')}
                  aria-label="Watch interactive demo of Juris.AI"
                >
                  <PlayCircle className="mr-2 sm:mr-3 h-4 sm:h-5 w-4 sm:w-5" />
                  Watch Demo
                </Button>
              </Link>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-muted-foreground px-4 sm:px-0"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="font-medium">99.8% Accuracy</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                <span className="font-medium">Bank-Grade Security</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
                <span className="font-medium">15+ Jurisdictions</span>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Interactive Demo Section */}
      <motion.section 
        id="demo"
        className="py-20 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        data-section="demo"
        aria-label="Interactive demo of Juris.AI"
      >
        <div className="container mx-auto px-4">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Try <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Juris.AI</span> Live
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Experience the power of AI legal analysis with our interactive demo. Ask a question or try one of our examples.
            </p>
          </motion.div>

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
                        onChange={(e) => {
                          setDemoInput(e.target.value);
                          trackDemoInteraction('input_change', e.target.value);
                        }}
                        onFocus={() => trackDemoInteraction('input_focus')}
                        placeholder="Type your legal question here..."
                        className="w-full px-3 sm:px-4 py-3 sm:py-4 pr-10 sm:pr-12 text-base sm:text-lg border-2 border-muted rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors bg-background/50"
                        aria-describedby="demo-input-help"
                      />
                      <Button 
                        size="sm" 
                        className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 rounded-lg h-8 w-8 sm:h-auto sm:w-auto"
                        onClick={() => {
                          trackDemoInteraction('submit_query', demoInput);
                          trackButtonClick('Submit Demo Query', 'Demo Section');
                        }}
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
                          onClick={() => {
                            setSelectedQuery(index);
                            setDemoInput(query);
                            trackDemoInteraction('select_sample_query', query);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              setSelectedQuery(index);
                              setDemoInput(query);
                              trackDemoInteraction('select_sample_query', query);
                            }
                          }}
                          className={`p-3 sm:p-4 text-left text-xs sm:text-sm rounded-lg border-2 transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                            selectedQuery === index 
                              ? 'border-primary bg-primary/5 text-primary' 
                              : 'border-muted hover:border-primary/50 bg-background/50'
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
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
                      <Button size="lg" className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
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
      </motion.section>

      {/* How It Works Section */}
      <motion.section 
        className="py-20 bg-muted/30"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        <div className="container mx-auto px-4">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              How <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Juris.AI</span> Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Experience the simplest way to get professional legal insights in just four easy steps
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {workflowSteps.map((step, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                className="relative"
              >
                <Card className="p-6 sm:p-8 h-full border-0 bg-background/80 backdrop-blur-sm hover:bg-background transition-all duration-300 hover:shadow-xl group text-center">
                  <div className="relative mb-4 sm:mb-6">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                      <step.icon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold text-xs sm:text-sm">
                      {step.step}
                    </div>
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-foreground">{step.title}</h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{step.description}</p>
                </Card>
                {index < workflowSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ChevronRight className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>


      {/* Features Section */}
      <motion.section 
        className="py-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        <div className="container mx-auto px-4">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Powerful <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Features</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover the comprehensive suite of AI-powered tools designed specifically for legal professionals
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <Card className="p-6 sm:p-8 h-full border-0 bg-background/50 backdrop-blur-sm hover:bg-background/80 transition-all duration-300 hover:shadow-xl group">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-foreground">{feature.title}</h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* About Section */}
      <motion.section 
        className="py-20 bg-gradient-to-br from-blue-50/30 to-purple-50/30 dark:from-blue-950/10 dark:to-purple-950/10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        data-section="about"
        aria-label="About Juris.AI"
      >
        <div className="container mx-auto px-4">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              About <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Juris.AI</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Revolutionizing the legal landscape with accessible, intelligent, and user-friendly AI-powered tools
            </p>
          </motion.div>

          {/* Mission */}
          <motion.div variants={itemVariants} className="max-w-5xl mx-auto mb-16">
            <Card className="p-8 border-0 bg-background/80 backdrop-blur-sm shadow-xl">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <Info className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">Our Mission</h3>
                  <p className="text-lg md:text-xl font-semibold text-foreground mb-4">
                    Empowering everyone with accessible legal understanding.
                  </p>
                </div>
              </div>
              
              <div className="space-y-4 text-muted-foreground text-base md:text-lg leading-relaxed">
                <p>
                  At Juris.AI, our mission is to <strong className="text-foreground">democratize access to legal information and resources</strong> using advanced artificial intelligence. We understand that the legal landscape can be complex and intimidating, creating significant barriers for individuals and even professionals.
                </p>
                <p>
                  We believe that understanding your rights and navigating legal matters shouldn&apos;t require extensive legal training or prohibitive costs. Juris.AI is built as your <strong className="text-foreground">intelligent and intuitive legal partner</strong>, designed to make legal concepts understandable and actionable for everyone.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <strong className="text-foreground">Simplified Legal Language</strong>
                    </div>
                    <p className="text-sm text-muted-foreground ml-5">
                      Transforming complex legal documents and jargon into clear, easy-to-understand explanations.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                      <strong className="text-foreground">Efficient Insights</strong>
                    </div>
                    <p className="text-sm text-muted-foreground ml-5">
                      Providing rapid analysis and relevant information to save you time and effort.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <strong className="text-foreground">Educational Support</strong>
                    </div>
                    <p className="text-sm text-muted-foreground ml-5">
                      Serving as a valuable resource for learning about legal concepts, case law, and precedents.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                      <strong className="text-foreground">Increased Confidence</strong>
                    </div>
                    <p className="text-sm text-muted-foreground ml-5">
                      Equipping you with the knowledge needed to approach legal situations with greater assurance.
                    </p>
                  </div>
                </div>
                
                <p className="mt-6">
                  We are dedicated to the continuous evolution of our AI capabilities and the expansion of our services, ensuring Juris.AI remains a <strong className="text-foreground">trusted, ethical, and essential tool</strong> in the dynamic legal technology space.
                </p>
              </div>
            </Card>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-8 mb-12">
            <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-background/60 backdrop-blur-sm border border-primary/20">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-sm font-medium text-foreground">AI-Powered</span>
            </div>
            <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-background/60 backdrop-blur-sm border border-primary/20">
              <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></div>
              <span className="text-sm font-medium text-foreground">Professional Grade</span>
            </div>
            <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-background/60 backdrop-blur-sm border border-primary/20">
              <div className="w-3 h-3 rounded-full bg-purple-500 animate-pulse"></div>
              <span className="text-sm font-medium text-foreground">Accessible</span>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Testimonials Section */}
      <motion.section 
        className="py-20 bg-muted/30"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        <div className="container mx-auto px-4">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              What Legal <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Professionals</span> Say
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Real feedback from lawyers, firms, and legal academics who use Juris.AI daily
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <Card className="p-6 sm:p-8 h-full border-0 bg-background/80 backdrop-blur-sm hover:bg-background transition-all duration-300 hover:shadow-xl">
                  <Quote className="h-6 w-6 sm:h-8 sm:w-8 text-primary mb-3 sm:mb-4" />
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4 sm:mb-6 italic">
                    &ldquo;{testimonial.content}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm sm:text-base">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-foreground text-sm sm:text-base">{testimonial.name}</div>
                      <div className="text-xs sm:text-sm text-muted-foreground">{testimonial.role}</div>
                      <div className="text-xs text-muted-foreground">{testimonial.company}</div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* FAQ Section */}
      <motion.section 
        className="py-20 bg-muted/30"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        <div className="container mx-auto px-4">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Frequently Asked <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Questions</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Get answers to common questions about Juris.AI&apos;s capabilities, security, and pricing
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto px-4 sm:px-0">
            <div className="space-y-3 sm:space-y-4">
              {faqs.map((faq, index) => (
                <motion.div 
                  key={index}
                  variants={itemVariants}
                  className="border border-muted rounded-xl overflow-hidden bg-background/50 backdrop-blur-sm"
                >
                  <button
                    onClick={() => {
                      const newState = openFaq === index ? null : index;
                      setOpenFaq(newState);
                      trackFaqInteraction(faq.question, newState === index ? 'open' : 'close');
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        const newState = openFaq === index ? null : index;
                        setOpenFaq(newState);
                        trackFaqInteraction(faq.question, newState === index ? 'open' : 'close');
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
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="py-20 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-indigo-600/10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        <div className="container mx-auto px-4 text-center">
          <motion.div variants={itemVariants}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
              Ready to Transform Your <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Legal Practice?</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 sm:mb-12 leading-relaxed">
              Join 50,000+ legal professionals who trust Juris.AI for accurate, fast, and reliable legal analysis. 
              Start your free trial today and experience the future of legal research.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
              <Link href="/auth/login" className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  className="group w-full sm:w-auto px-8 sm:px-10 md:px-12 py-4 sm:py-5 md:py-6 text-lg sm:text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 rounded-full"
                  onClick={() => trackButtonClick('Start Free Trial', 'Final CTA Section')}
                  aria-label="Start your free trial - no credit card required"
                >
                  Start Free Trial
                  <Zap className="ml-2 sm:ml-3 h-5 w-5 sm:h-6 sm:w-6 transition-transform group-hover:scale-110" />
                </Button>
              </Link>
              <Link href="/services" className="w-full sm:w-auto">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full sm:w-auto px-8 sm:px-10 md:px-12 py-4 sm:py-5 md:py-6 text-lg sm:text-xl font-semibold border-2 hover:bg-muted/50 transition-all duration-300 rounded-full"
                  onClick={() => trackButtonClick('Explore Features', 'Final CTA Section')}
                  aria-label="Explore all Juris.AI features and capabilities"
                >
                  Explore Features
                </Button>
              </Link>
            </div>
            <div className="mt-6 sm:mt-8 text-xs sm:text-sm text-muted-foreground">
              No credit card required • 14-day free trial • Cancel anytime
            </div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default LandingPage;