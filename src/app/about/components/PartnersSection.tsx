import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Building, Scale, Briefcase, Users } from 'lucide-react';

const PartnersSection = () => {
  return (
    <section className="mb-16 md:mb-20">
      <h2 className="text-3xl md:text-4xl font-semibold text-center mb-6 text-foreground">
        Partners & Collaborators
      </h2>
      <p className="text-center text-muted-foreground max-w-3xl mx-auto mb-12">
        We work with leading institutions in the legal and technology sectors to ensure the highest standards of accuracy and innovation.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Partner Category 1 */}
        <Card className="shadow-lg hover:shadow-xl transition-all duration-300 group border border-border hover:border-primary/50 bg-card/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <GraduationCap className="h-6 w-6 text-primary" />
              </div>
              <div>
                <Badge variant="outline" className="mb-2 bg-primary/5 text-primary border-primary/30">Academic Partners</Badge>
                <CardTitle className="text-xl font-semibold text-foreground">Legal Research Institutions</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm leading-relaxed">
            <p className="mb-4">
              We collaborate with leading law schools and research institutions to refine our legal AI models and ensure they reflect current legal scholarship.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center text-sm">
                <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
                Harvard Law School Legal Innovation Center
              </li>
              <li className="flex items-center text-sm">
                <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
                Stanford Center for Legal Informatics
              </li>
              <li className="flex items-center text-sm">
                <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
                Oxford University Legal AI Research Group
              </li>
            </ul>
          </CardContent>
        </Card>
        
        {/* Partner Category 2 */}
        <Card className="shadow-lg hover:shadow-xl transition-all duration-300 group border border-border hover:border-primary/50 bg-card/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Scale className="h-6 w-6 text-primary" />
              </div>
              <div>
                <Badge variant="outline" className="mb-2 bg-primary/5 text-primary border-primary/30">Legal Partners</Badge>
                <CardTitle className="text-xl font-semibold text-foreground">Law Firms & Associations</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm leading-relaxed">
            <p className="mb-4">
              Our partnerships with law firms and legal associations help us validate our AI responses and provide real-world legal insights.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center text-sm">
                <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
                Global Legal Association Network
              </li>
              <li className="flex items-center text-sm">
                <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
                Access to Justice Foundation
              </li>
              <li className="flex items-center text-sm">
                <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
                International Legal Technology Association
              </li>
            </ul>
          </CardContent>
        </Card>
        
        {/* Partner Category 3 */}
        <Card className="shadow-lg hover:shadow-xl transition-all duration-300 group border border-border hover:border-primary/50 bg-card/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Building className="h-6 w-6 text-primary" />
              </div>
              <div>
                <Badge variant="outline" className="mb-2 bg-primary/5 text-primary border-primary/30">Technical Partners</Badge>
                <CardTitle className="text-xl font-semibold text-foreground">Technology & AI Companies</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm leading-relaxed">
            <p className="mb-4">
              We work with leading technology and AI companies to leverage cutting-edge innovations in machine learning and natural language processing.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center text-sm">
                <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
                Advanced Natural Language Processing Institute
              </li>
              <li className="flex items-center text-sm">
                <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
                Cloud Services for Legal Technology
              </li>
              <li className="flex items-center text-sm">
                <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
                AI Ethics Research Consortium
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
      
      {/* Additional Partner Types */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Partner Category 4 */}
        <Card className="shadow-lg hover:shadow-xl transition-all duration-300 group border border-border hover:border-primary/50 bg-card/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-primary/10 mr-3">
                <Briefcase className="h-6 w-6 text-primary" />
              </div>
              <div>
                <Badge variant="outline" className="mb-2 bg-primary/5 text-primary border-primary/30">Government Relations</Badge>
                <CardTitle className="text-xl font-semibold text-foreground">Regulatory & Compliance Partners</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm leading-relaxed">
            <p className="mb-4">
              We engage with regulatory bodies and compliance experts to ensure our legal AI adheres to all applicable laws and regulations.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center text-sm">
                <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
                Data Protection Advisory Council
              </li>
              <li className="flex items-center text-sm">
                <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
                Legal Services Regulatory Board
              </li>
            </ul>
          </CardContent>
        </Card>
        
        {/* Partner Category 5 */}
        <Card className="shadow-lg hover:shadow-xl transition-all duration-300 group border border-border hover:border-primary/50 bg-card/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-primary/10 mr-3">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <Badge variant="outline" className="mb-2 bg-primary/5 text-primary border-primary/30">Community Partners</Badge>
                <CardTitle className="text-xl font-semibold text-foreground">Public Interest & Access to Justice</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm leading-relaxed">
            <p className="mb-4">
              We partner with organizations dedicated to expanding access to legal resources for underserved communities.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center text-sm">
                <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
                Pro Bono Legal Services Network
              </li>
              <li className="flex items-center text-sm">
                <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
                Legal Empowerment Foundation
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-16 text-center">
        <p className="text-muted-foreground italic">
          Interested in partnering with Juris.Ai? <a href="mailto:ititsaddy7@gmail.com" className="text-primary hover:underline font-medium">Contact us</a> to explore collaboration opportunities.
        </p>
      </div>
    </section>
  );
};

export default PartnersSection;
