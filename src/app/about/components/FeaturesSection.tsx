import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Scale, Sparkles, MessageSquare, BookOpen, User } from "lucide-react";

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
];

const FeaturesSection = () => {
  return (
    <section className="mb-16 md:mb-20">
      <h2 className="text-3xl md:text-4xl font-semibold text-center mb-12 text-foreground">
        Key Features
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature) => (
          <Card key={feature.title} className="shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 rounded-lg border bg-card/70 backdrop-blur-sm group">
            <CardHeader className="flex flex-row items-center gap-4 pb-3">
              <span className="p-2 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
                {React.cloneElement(feature.icon, { className: "h-6 w-6 text-primary group-hover:scale-110 transition-transform" })}
              </span>
              <CardTitle className="text-xl font-semibold text-foreground">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
