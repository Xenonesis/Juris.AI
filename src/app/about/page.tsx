import React from 'react';
import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BookOpen, Scale, Sparkles, MessageSquare, User, Info, Phone, Linkedin, Briefcase } from "lucide-react"; 
import { Button } from "@/components/ui/button"; 

export const metadata: Metadata = {
  title: "About Juris.Ai",
  description: "Learn more about Juris.Ai, its mission, features, and the team behind it.",
};

const AboutPage = () => {
  const teamMembers = [
    {
      name: "Addy",
      role: "Lead Developer & AI Engineer",
      avatarUrl: "/1.jpg", // Updated avatar URL to jpg
      bio: "Addy is passionate about leveraging AI to make legal information more accessible and understandable. He leads the development of Juris.Ai, focusing on AI model integration and user experience.",
      portfolioUrl: "https://iaddy.netlify.app/",
      linkedinUrl: "https://www.linkedin.com/in/itisaddy/",
    },
    // Add more team members here if applicable
  ];

  const features = [
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

  return (
    <div className="container mx-auto px-4 py-12 md:py-20 bg-gradient-to-b from-background to-slate-50 dark:from-background dark:to-slate-900">
      <header className="text-center mb-16 md:mb-20">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent mb-4">
          About Juris.Ai
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          Juris.Ai is dedicated to revolutionizing the legal landscape by providing accessible, intelligent, and user-friendly AI-powered legal tools.
        </p>
      </header>

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

      <section className="mb-16 md:mb-20">
        <h2 className="text-3xl md:text-4xl font-semibold text-center mb-12 text-foreground">
          Meet the Team
        </h2>
        <div className="flex flex-wrap justify-center gap-10">
          {teamMembers.map((member) => (
            <Card key={member.name} className="w-full max-w-md shadow-xl rounded-xl overflow-hidden bg-card hover:bg-card/90 transition-colors duration-300 group">
              <CardHeader className="text-center pt-8 px-6 pb-2">
                <Avatar className="w-24 h-24 md:w-28 md:h-28 mx-auto mb-4 border-2 border-primary/40 dark:border-primary/30 shadow-lg group-hover:scale-105 transition-transform duration-300">
                  {member.avatarUrl && <AvatarImage src={member.avatarUrl} alt={member.name} className="object-cover" />}
                  <AvatarFallback className="text-3xl bg-primary/10 text-primary">
                    {member.name.split(" ").map((n) => n[0]).join("").toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-2xl md:text-3xl font-bold mt-0 mb-1 text-card-foreground group-hover:text-primary transition-colors">
                  {member.name}
                </CardTitle>
                <p className="text-base text-primary/90 dark:text-primary/80 font-medium mb-3">
                  {member.role}
                </p>
              </CardHeader>
              <CardContent className="text-center px-6 pt-0 pb-8">
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-6">
                  {member.bio}
                </p>
                <div className="flex justify-center gap-3">
                  {member.portfolioUrl && (
                    <a href={member.portfolioUrl} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm" className="group/button bg-transparent hover:bg-primary/10 border-muted-foreground/40 hover:border-primary/70 text-muted-foreground hover:text-primary transition-colors duration-200">
                        <Briefcase className="h-4 w-4 mr-2 transition-colors duration-200" />
                        Portfolio
                      </Button>
                    </a>
                  )}
                  {member.linkedinUrl && (
                    <a href={member.linkedinUrl} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm" className="group/button bg-transparent hover:bg-primary/10 border-muted-foreground/40 hover:border-primary/70 text-muted-foreground hover:text-primary transition-colors duration-200">
                        <Linkedin className="h-4 w-4 mr-2 transition-colors duration-200" />
                        LinkedIn
                      </Button>
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
          {teamMembers.length === 0 && (
            <p className="text-muted-foreground">Information about the team is coming soon.</p>
          )}
        </div>
      </section>

      <section className="py-10">
        <Card className="shadow-xl border-t-4 border-primary rounded-xl overflow-hidden bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl flex items-center gap-2">
              <Phone className="h-7 w-7 text-primary" />
              Contact Us
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-3 text-base md:text-lg leading-relaxed">
            <p>
              Have questions, feedback, or interested in collaborating? We&apos;d love to hear from you.
            </p>
            <p>
              Email: <a href="mailto:ititsaddy7@gmail.com" className="text-primary hover:underline font-medium">ititsaddy7@gmail.com</a>
            </p>
            {/* Add more contact methods if available, e.g., social media links */}
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default AboutPage;