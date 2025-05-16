import React from 'react';
import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileCheck, Briefcase, UserCircle, Copyright, AlertTriangle, FileEdit, Mail, LucideIcon } from 'lucide-react';

export const metadata: Metadata = {
  title: "Terms of Service - Juris.Ai",
  description: "Read the Terms of Service for using Juris.Ai.",
};

interface TermSection {
  icon: LucideIcon;
  title: string;
  content: React.ReactNode;
}

const termsSections: TermSection[] = [
  {
    icon: FileCheck,
    title: "Acceptance of Terms",
    content: (
      <p>
        By accessing or using Juris.Ai (the &quot;Service&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you disagree with any part of the terms, then you may not access the Service.
      </p>
    ),
  },
  {
    icon: Briefcase,
    title: "Use of Service",
    content: (
      <>
        <p>
          Juris.Ai provides AI-powered legal information and document analysis. The information provided by the Service is for general informational purposes only, and does not constitute legal advice. You should consult with a qualified legal professional for advice regarding your specific situation.
        </p>
        <p>
          You agree not to use the Service for any unlawful purpose or in any way that could damage, disable, overburden, or impair the Service.
        </p>
      </>
    ),
  },
  {
    icon: UserCircle,
    title: "User Accounts",
    content: (
      <p>
        To access certain features of the Service, you may be required to create an account. You are responsible for safeguarding your account information and for any activities or actions under your account.
      </p>
    ),
  },
  {
    icon: Copyright,
    title: "Intellectual Property",
    content: (
      <p>
        The Service and its original content, features, and functionality are and will remain the exclusive property of Juris.Ai and its licensors.
      </p>
    ),
  },
  {
    icon: AlertTriangle,
    title: "Limitation of Liability",
    content: (
      <p>
        In no event shall Juris.Ai, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
      </p>
    ),
  },
  {
    icon: FileEdit,
    title: "Changes to Terms",
    content: (
      <p>
        We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will provide at least 30 days&apos; notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
      </p>
    ),
  },
  {
    icon: Mail,
    title: "Contact Us",
    content: (
      <>
        <p>
          If you have any questions about these Terms, please contact us at <a href="mailto:ititsaddy7@gmail.com" className="text-primary hover:underline">ititsaddy7@gmail.com</a>.
        </p>
        <p>Last updated: May 17, 2025</p>
      </>
    ),
  },
];

const TermsOfServicePage = () => {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20 bg-gradient-to-b from-background to-slate-50 dark:from-background dark:to-slate-900">
      <header className="text-center mb-12 md:mb-16">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent mb-4">
          Terms of Service
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          Please read these Terms of Service carefully before using Juris.Ai.
        </p>
      </header>

      <div className="space-y-8">
        {termsSections.map((section, index) => (
          <Card key={index} className="shadow-xl border-t-4 border-primary rounded-xl overflow-hidden bg-card/80 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
            <CardHeader className="flex flex-row items-center space-x-4 p-6">
              <section.icon className="h-8 w-8 text-primary" />
              <CardTitle className="text-2xl md:text-3xl font-semibold text-card-foreground">{section.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground space-y-4 text-base md:text-lg leading-relaxed p-6 pt-0">
              {section.content}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TermsOfServicePage;
