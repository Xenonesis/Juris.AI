import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";

const MissionSection = () => {
  return (
    <section className="mb-16 md:mb-20">
      <Card className="shadow-xl border-t-4 border-primary rounded-xl overflow-hidden bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl flex items-center gap-3">
            <Info className="h-8 w-8 text-primary" />
            Our Mission
          </CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground space-y-6 text-base md:text-lg leading-relaxed">
          <p className="text-lg md:text-xl font-semibold text-foreground">
            Empowering everyone with accessible legal understanding.
          </p>
          <p>
            At Juris.Ai, our mission is to <strong className="text-foreground">democratize access to legal information and resources</strong> using advanced artificial intelligence. We understand that the legal landscape can be complex and intimidating, creating significant barriers for individuals and even professionals.
          </p>
          <p>
            We believe that understanding your rights and navigating legal matters shouldn&apos;t require extensive legal training or prohibitive costs. Juris.Ai is built as your <strong className="text-foreground">intelligent and intuitive legal partner</strong>, designed to make legal concepts understandable and actionable for everyone.
          </p>
          <p>
            Our commitment is to bridge the gap in legal accessibility by providing sophisticated, user-friendly tools that deliver:
          </p>
          <ul className="list-disc list-inside space-y-3 pl-4 text-muted-foreground">
            <li><strong className="text-foreground">Simplified Legal Language:</strong> Transforming complex legal documents and jargon into clear, easy-to-understand explanations.</li>
            <li><strong className="text-foreground">Efficient Insights:</strong> Providing rapid analysis and relevant information to save you time and effort.</li>
            <li><strong className="text-foreground">Educational Support:</strong> Serving as a valuable resource for learning about legal concepts, case law, and precedents.</li>
            <li><strong className="text-foreground">Increased Confidence:</strong> Equipping you with the knowledge needed to approach legal situations with greater assurance.</li>
          </ul>
          <p>
            We are dedicated to the continuous evolution of our AI capabilities and the expansion of our services, ensuring Juris.Ai remains a <strong className="text-foreground">trusted, ethical, and essential tool</strong> in the dynamic legal technology space.
          </p>
        </CardContent>
      </Card>
    </section>
  );
};

export default MissionSection;
