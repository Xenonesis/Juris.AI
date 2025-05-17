import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone } from "lucide-react";

const ContactSection = () => {
  return (
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
  );
};

export default ContactSection;
