/**
 * Static data constants for landing page sections
 * Centralized location for all landing page content
 */

import { 
  Brain, 
  Gavel, 
  MessageSquare, 
  Shield, 
  Zap, 
  Users,
  FileText,
  Target
} from 'lucide-react';

export interface Feature {
  icon: any;
  title: string;
  description: string;
}

export interface Testimonial {
  name: string;
  role: string;
  company: string;
  content: string;
  avatar: string;
}

export interface WorkflowStep {
  step: string;
  title: string;
  description: string;
  icon: any;
}

export interface FAQ {
  question: string;
  answer: string;
}

export const features: Feature[] = [
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

export const testimonials: Testimonial[] = [
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

export const workflowSteps: WorkflowStep[] = [
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

export const faqs: FAQ[] = [
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

export const demoQueries: string[] = [
  "What are the key clauses I should include in a software licensing agreement?",
  "Analyze this employment contract for potential compliance issues",
  "What are the recent changes to data privacy laws in California?",
  "Help me understand the liability implications in this commercial lease"
];

export const trustIndicators = [
  {
    label: "99.8% Accuracy",
    color: "bg-green-500"
  },
  {
    label: "Bank-Grade Security",
    color: "bg-blue-500"
  },
  {
    label: "15+ Jurisdictions",
    color: "bg-purple-500"
  }
];

export const aboutMissionPoints = [
  {
    title: "Simplified Legal Language",
    description: "Transforming complex legal documents and jargon into clear, easy-to-understand explanations.",
    color: "bg-blue-500"
  },
  {
    title: "Efficient Insights",
    description: "Providing rapid analysis and relevant information to save you time and effort.",
    color: "bg-purple-500"
  },
  {
    title: "Educational Support",
    description: "Serving as a valuable resource for learning about legal concepts, case law, and precedents.",
    color: "bg-green-500"
  },
  {
    title: "Increased Confidence",
    description: "Equipping you with the knowledge needed to approach legal situations with greater assurance.",
    color: "bg-orange-500"
  }
];

export const aboutTrustIndicators = [
  {
    label: "AI-Powered",
    color: "bg-green-500"
  },
  {
    label: "Professional Grade",
    color: "bg-blue-500"
  },
  {
    label: "Accessible",
    color: "bg-purple-500"
  }
];
