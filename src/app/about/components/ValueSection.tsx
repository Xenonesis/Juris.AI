import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, BarChart3, BookOpen, BrainCircuit, Clock, Scale, Shield, Users } from "lucide-react";

const ValueSection = () => {
  return (
    <section className="mb-16 md:mb-20">
      <h2 className="text-3xl md:text-4xl font-semibold text-center mb-6 text-foreground">
        Our Core Values
      </h2>
      <p className="text-center text-muted-foreground max-w-3xl mx-auto mb-12">
        At Juris.Ai, our work is guided by a set of core values that define who we are and how we approach legal AI innovation.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Value 1 */}
        <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 border-border hover:border-primary/30">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary/40"></div>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Scale className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl">Accuracy & Integrity</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p>We are committed to providing accurate, reliable legal information. We prioritize truth and integrity in our AI responses and constantly validate our models against authoritative legal sources.</p>
          </CardContent>
        </Card>
        
        {/* Value 2 */}
        <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 border-border hover:border-primary/30">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary/40"></div>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl">Accessibility</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p>We believe legal information should be accessible to everyone. We strive to make complex legal concepts understandable and ensure our platform is user-friendly for people from all backgrounds.</p>
          </CardContent>
        </Card>
        
        {/* Value 3 */}
        <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 border-border hover:border-primary/30">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary/40"></div>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <BrainCircuit className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl">Innovation</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p>We continuously push the boundaries of what's possible with legal AI. We embrace new technologies and methodologies to enhance our services and provide cutting-edge solutions to legal challenges.</p>
          </CardContent>
        </Card>
        
        {/* Value 4 */}
        <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 border-border hover:border-primary/30">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary/40"></div>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl">Responsiveness</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p>We understand that legal matters often require timely attention. Our AI is designed to provide quick, relevant responses to legal queries, helping users save valuable time in their legal research.</p>
          </CardContent>
        </Card>
        
        {/* Value 5 */}
        <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 border-border hover:border-primary/30">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary/40"></div>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl">Privacy & Security</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p>We respect user privacy and maintain the highest standards of data security. We are transparent about how we handle data and ensure that all interactions with our platform are secure and confidential.</p>
          </CardContent>
        </Card>
        
        {/* Value 6 */}
        <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 border-border hover:border-primary/30">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary/40"></div>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl">Educational Impact</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p>Beyond providing answers, we aim to educate. We design our responses to help users understand the legal principles behind our advice, empowering them with knowledge for future situations.</p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ValueSection;
