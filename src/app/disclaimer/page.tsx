import React from 'react';
import { Metadata } from "next";
import { JurisLogo } from "@/components/juris-logo";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  AlertCircle, 
  User, 
  CheckCircle, 
  ShieldAlert, 
  ExternalLink, 
  Bot, 
  Users, 
  Copyright, 
  UserX, 
  Lock, 
  Server, 
  Handshake, 
  Scale, 
  Split, 
  FileText, 
  Clock, 
  Zap, 
  Database,
  Mail
} from 'lucide-react';

export const metadata: Metadata = {
  title: "Disclaimer | Juris.Ai",
  description: "Disclaimer for Juris.Ai legal assistance platform",
};

const disclaimerSections = [
  {
    id: "general-information",
    icon: AlertCircle,
    title: "General Information",
    content: (
      <>
        <p className="mb-4">
          This website and its content are provided for informational purposes only and 
          do not constitute legal advice. The information provided through Juris.Ai is 
          intended to help users understand legal concepts and is not a substitute for 
          professional legal counsel.
        </p>
        <p>
          By using this platform, you acknowledge that Juris.Ai does not form an attorney-client 
          relationship and is not responsible for any actions taken based on the information 
          provided.
        </p>
      </>
    )
  },
  {
    id: "no-attorney-client",
    icon: User,
    title: "No Attorney-Client Relationship",
    content: (
      <p>
        No attorney-client relationship is formed by using this website or its services. 
        The information provided is general in nature and may not apply to your specific 
        situation. You should always consult with a qualified attorney for advice regarding 
        your particular circumstances.
      </p>
    )
  },
  {
    id: "accuracy-information",
    icon: CheckCircle,
    title: "Accuracy of Information",
    content: (
      <p>
        While we strive to provide accurate and up-to-date information, Juris.Ai makes no 
        warranties or representations about the accuracy, completeness, or reliability of 
        the information provided. Laws change frequently, and information may become 
        outdated or incorrect.
      </p>
    )
  },
  {
    id: "limitation-liability",
    icon: ShieldAlert,
    title: "Limitation of Liability",
    content: (
      <p>
        Juris.Ai shall not be liable for any direct, indirect, incidental, consequential, 
        or punitive damages arising out of your access to or use of the website or services. 
        This includes but is not limited to damages for lost profits, data, or business 
        opportunities.
      </p>
    )
  },
  {
    id: "third-party-content",
    icon: ExternalLink,
    title: "Third-Party Content",
    content: (
      <p>
        This website may contain links to third-party websites or content. These links are 
        provided for convenience only and do not imply endorsement. We are not responsible 
        for the content or practices of third-party websites.
      </p>
    )
  },
  {
    id: "ai-limitations",
    icon: Bot,
    title: "AI Limitations",
    content: (
      <p>
        Our AI-powered legal assistance tools are designed to help users understand legal 
        concepts but may not always provide complete or accurate information. AI responses 
        should not be solely relied upon for making legal decisions.
      </p>
    )
  },
  {
    id: "user-responsibilities",
    icon: Users,
    title: "User Responsibilities",
    content: (
      <p>
        Users are responsible for verifying the accuracy of any information obtained through 
        this platform and should consult with qualified legal professionals before taking 
        any legal action. You agree to use this platform at your own risk.
      </p>
    )
  },
  {
    id: "intellectual-property",
    icon: Copyright,
    title: "Intellectual Property Rights",
    content: (
      <p>
        All content, trademarks, service marks, logos, and other intellectual property 
        displayed on this website are the property of Juris.Ai or its licensors. You may 
        not use, reproduce, distribute, or create derivative works from any content without 
        express written permission from Juris.Ai.
      </p>
    )
  },
  {
    id: "user-conduct",
    icon: UserX,
    title: "User Conduct and Prohibited Activities",
    content: (
      <p>
        You agree not to use the website for any unlawful purpose or in any way that could 
        damage, disable, overburden, or impair the website. Prohibited activities include but 
        are not limited to: unauthorized access to systems, interference with services, 
        transmission of harmful code, and any activity that violates applicable laws.
      </p>
    )
  },
  {
    id: "data-privacy",
    icon: Lock,
    title: "Data Privacy and Protection",
    content: (
      <p>
        Our collection, use, and protection of your personal information is governed by our 
        Privacy Policy. By using this website, you consent to the collection and use of 
        information in accordance with our Privacy Policy. We implement reasonable security 
        measures to protect your data, but cannot guarantee absolute security.
      </p>
    )
  },
  {
    id: "service-availability",
    icon: Server,
    title: "Service Availability and Modifications",
    content: (
      <p>
        We reserve the right to modify, suspend, or discontinue any part of our services at 
        any time without notice. We do not guarantee continuous, uninterrupted, or secure 
        access to our services. Maintenance, updates, or technical issues may cause temporary 
        unavailability.
      </p>
    )
  },
  {
    id: "indemnification",
    icon: Handshake,
    title: "Indemnification",
    content: (
      <p>
        You agree to indemnify, defend, and hold harmless Juris.Ai, its affiliates, officers, 
        directors, employees, and agents from any claims, liabilities, damages, losses, or 
        expenses arising out of your use of the website or violation of these terms.
      </p>
    )
  },
  {
    id: "governing-law",
    icon: Scale,
    title: "Governing Law and Jurisdiction",
    content: (
      <p>
        This disclaimer shall be governed by and construed in accordance with the laws of 
        [Jurisdiction], without regard to its conflict of law provisions. Any legal action 
        arising out of or relating to this disclaimer shall be exclusively brought in the 
        courts located in [Jurisdiction].
      </p>
    )
  },
  {
    id: "severability",
    icon: Split,
    title: "Severability",
    content: (
      <p>
        If any provision of this disclaimer is held to be invalid or unenforceable, the 
        remaining provisions shall continue in full force and effect. Any invalid or 
        unenforceable provision shall be deemed modified to the extent necessary to make it 
        valid and enforceable.
      </p>
    )
  },
  {
    id: "waiver",
    icon: FileText,
    title: "Waiver",
    content: (
      <p>
        Our failure to enforce any provision of this disclaimer shall not constitute a waiver 
        of that provision or any other provision. No waiver shall be effective unless made in 
        writing and signed by an authorized representative of Juris.Ai.
      </p>
    )
  },
  {
    id: "force-majeure",
    icon: Zap,
    title: "Force Majeure",
    content: (
      <p>
        Juris.Ai shall not be liable for any failure or delay in performance due to causes 
        beyond its reasonable control, including but not limited to acts of God, natural 
        disasters, wars, terrorism, government restrictions, pandemics, or other similar events.
      </p>
    )
  },
  {
    id: "entire-agreement",
    icon: FileText,
    title: "Entire Agreement",
    content: (
      <p>
        This disclaimer constitutes the entire agreement between you and Juris.Ai regarding 
        your use of the website and supersedes all prior agreements, understandings, and 
        communications, whether oral or written.
      </p>
    )
  },
  {
    id: "changes-disclaimer",
    icon: Clock,
    title: "Changes to Disclaimer",
    content: (
      <p>
        We reserve the right to modify this disclaimer at any time. Changes will be effective 
        immediately upon posting to the website. Your continued use of the website after any 
        changes constitutes acceptance of those changes.
      </p>
    )
  },
  {
    id: "professional-judgment",
    icon: User,
    title: "Professional Judgment Disclaimer",
    content: (
      <p>
        The information provided by Juris.Ai is intended to assist legal professionals and 
        individuals in understanding legal concepts. However, the ultimate responsibility for 
        legal decisions rests with the user. Legal practitioners should exercise their own 
        professional judgment when using our AI-powered tools and should not rely solely on 
        the information provided.
      </p>
    )
  },
  {
    id: "ai-hallucination",
    icon: Bot,
    title: "AI Hallucination and Accuracy Limitations",
    content: (
      <p>
        Our AI-powered legal assistance tools may occasionally generate responses that are 
        inaccurate or inconsistent with actual legal principles, even if they appear 
        authoritative. This phenomenon, known as "hallucination," is a known limitation of AI 
        systems. Users should independently verify all information provided by our platform 
        before making any legal decisions.
      </p>
    )
  },
  {
    id: "jurisdictional-limitations",
    icon: Scale,
    title: "Jurisdictional Limitations",
    content: (
      <p>
        While Juris.Ai offers legal information for multiple jurisdictions, our AI models may 
        not be fully aware of all local, state, provincial, or municipal laws that may apply 
        to your specific situation. Legal information can vary significantly between 
        jurisdictions, and jurisdiction-specific advice should always be verified with local 
        counsel who is familiar with the most current laws in your area.
      </p>
    )
  },
  {
    id: "no-warranty",
    icon: ShieldAlert,
    title: "No Warranty Disclaimer",
    content: (
      <p>
        Juris.Ai expressly disclaims all warranties of any kind, whether express or implied, 
        including but not limited to the implied warranties of merchantability, fitness for a 
        particular purpose, and non-infringement. We do not warrant that our services will 
        meet your requirements, operate uninterrupted or error-free, or that defects will be 
        corrected.
      </p>
    )
  },
  {
    id: "data-security",
    icon: Lock,
    title: "Data Security and Confidentiality Limitations",
    content: (
      <p>
        Users should exercise caution when uploading or submitting sensitive legal information, 
        including attorney-client privileged communications or highly confidential data. While 
        we implement reasonable security measures, no system can guarantee absolute security. 
        You should not upload information that you would not want to be potentially exposed 
        through security breaches or system vulnerabilities.
      </p>
    )
  },
  {
    id: "changes-law",
    icon: Clock,
    title: "Changes in Law Disclaimer",
    content: (
      <p>
        Legal information provided by Juris.Ai may not reflect the most recent changes in law, 
        court decisions, or regulatory updates. Laws are subject to frequent change, and our 
        information may become outdated. Users should verify that any legal information they 
        receive is current and applicable to their specific situation before taking any action.
      </p>
    )
  },
  {
    id: "third-party-ai",
    icon: Database,
    title: "Third-Party AI Model Limitations",
    content: (
      <p>
        Juris.Ai utilizes AI models from third-party providers including OpenAI, Anthropic, 
        Google, and Mistral. We are not responsible for the limitations, biases, changes in 
        functionality, or discontinuation of these third-party models. Our platform's 
        performance may be affected by changes to these underlying AI services that are 
        beyond our control.
      </p>
    )
  },
  {
    id: "user-generated-content",
    icon: Users,
    title: "User-Generated Content Liability",
    content: (
      <p>
        Any content, queries, documents, or information you upload or submit to Juris.Ai 
        remains your responsibility. We do not endorse, verify, or guarantee the accuracy, 
        completeness, or legality of any user-generated content. You are solely responsible 
        for ensuring that your submissions comply with applicable laws and do not infringe 
        upon the rights of others.
      </p>
    )
  },
  {
    id: "contact",
    icon: Mail,
    title: "Contact Information",
    content: (
      <p>
        If you have any questions about this disclaimer, please contact us through our{" "}
        <Link href="/collaboration" className="text-primary hover:underline">
          contact page
        </Link>.
      </p>
    )
  }
];

export default function DisclaimerPage() {
  const lastUpdated = "September 21, 2025";

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 bg-gradient-to-b from-background to-slate-50 dark:from-background dark:to-slate-900">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="h-16 w-16 mb-4">
              <JurisLogo />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent mb-4">
            Disclaimer
          </h1>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Please read this disclaimer carefully before using Juris.Ai.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Last Updated: {lastUpdated}
          </p>
        </div>

        <div className="mb-8 p-4 bg-muted/50 rounded-lg border">
          <h2 className="text-lg font-semibold mb-2">Table of Contents</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            {disclaimerSections.map((section) => (
              <li key={section.id}>
                <Link 
                  href={`#${section.id}`} 
                  className="text-primary hover:underline flex items-start"
                >
                  <span className="mr-2">•</span>
                  {section.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-6">
          {disclaimerSections.map((section) => (
            <Card 
              key={section.id} 
              id={section.id}
              className="shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out rounded-xl border bg-card/70 backdrop-blur-sm"
            >
              <CardHeader className="flex flex-row items-center gap-4 pb-4">
                <section.icon className="h-6 w-6 text-primary flex-shrink-0" />
                <CardTitle className="text-xl md:text-2xl font-semibold text-foreground">
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground space-y-3 text-base leading-relaxed pl-16 pr-6 pb-6">
                {section.content}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Button asChild size="lg">
            <Link href="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}