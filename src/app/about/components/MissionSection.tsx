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
        <CardContent className="text-muted-foreground space-y-5 text-base md:text-lg leading-relaxed">
          <p className="text-lg md:text-xl">
            At Juris.Ai, our core mission is to <strong className="text-foreground">democratize access to legal understanding and resources</strong> through the transformative power of artificial intelligence. We recognize that navigating the complexities of the legal system can be a daunting and often prohibitive experience for many.
          </p>
          <p>
            We are driven by the conviction that everyone deserves to comprehend their rights, understand legal documents, and access preliminary legal insights without facing exorbitant costs or an overwhelming deluge of jargon. Juris.Ai is engineered to be an <strong className="text-foreground">intuitive and intelligent partner</strong>, empowering individuals, students, and legal professionals alike.
          </p>
          <p>
            Our goal is to bridge the critical gap in legal accessibility by providing sophisticated yet user-friendly tools that:
          </p>
          <ul className="list-disc list-inside space-y-2 pl-4 text-muted-foreground">
            <li><strong className="text-foreground">Simplify Complexity:</strong> Translate dense legal texts into clear, understandable language.</li>
            <li><strong className="text-foreground">Enhance Efficiency:</strong> Offer rapid analysis and insights, saving valuable time and effort.</li>
            <li><strong className="text-foreground">Promote Education:</strong> Serve as a learning resource for those seeking to understand legal concepts and case law.</li>
            <li><strong className="text-foreground">Foster Confidence:</strong> Equip users with the knowledge to approach legal matters with greater assurance.</li>
          </ul>
          <p>
            We are committed to continuously advancing our AI capabilities and expanding our offerings to ensure Juris.Ai remains a <strong className="text-foreground">reliable, ethical, and indispensable resource</strong> in the evolving legal-tech landscape.
          </p>
        </CardContent>
      </Card>
    </section>
  );
};

export default MissionSection;
