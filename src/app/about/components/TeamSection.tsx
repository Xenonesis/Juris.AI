import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Linkedin, Briefcase } from "lucide-react";

interface TeamMember {
  name: string;
  role: string;
  avatarUrl: string;
  bio: string;
  portfolioUrl?: string;
  linkedinUrl?: string;
}

const teamMembers: TeamMember[] = [
  {
    name: "Addy",
    role: "Lead Developer & AI Engineer",
    avatarUrl: "/1.jpg",
    bio: "Addy is passionate about leveraging AI to make legal information more accessible and understandable. He leads the development of Juris.Ai, focusing on AI model integration and user experience.",
    portfolioUrl: "https://iaddy.netlify.app/",
    linkedinUrl: "https://www.linkedin.com/in/itisaddy/",
  },
  // Add more team members here if applicable
];

const TeamSection = () => {
  return (
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
  );
};

export default TeamSection;
