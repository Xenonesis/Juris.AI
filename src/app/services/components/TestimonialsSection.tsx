import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from 'lucide-react';

interface Testimonial {
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    name: "Sarah Johnson",
    role: "Senior Partner",
    company: "Johnson & Associates",
    content: "Juris.AI has revolutionized our legal research process. The multi-model AI comparison gives us comprehensive insights that would take hours to compile manually.",
    rating: 5
  },
  {
    name: "Michael Chen",
    role: "Legal Counsel",
    company: "TechCorp Inc.",
    content: "The document analysis feature has saved us countless hours in contract review. The AI identifies potential issues we might have missed.",
    rating: 5
  },
  {
    name: "Emily Rodriguez",
    role: "Law Student",
    company: "Harvard Law School",
    content: "As a law student, Juris.AI has been invaluable for my research. The case law search and jurisdiction-specific advice are incredibly helpful.",
    rating: 5
  }
];

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="mb-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
          What Our Users Say
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Trusted by legal professionals, students, and organizations worldwide.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <Card key={index} className="border border-muted hover:border-primary/50 transition-all duration-500 bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm hover:shadow-xl hover:-translate-y-2 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <Quote className="h-8 w-8 text-primary/40 mr-2" />
                <div className="flex">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-amber-500 dark:text-amber-400 fill-current" />
                  ))}
                </div>
              </div>

              <p className="text-muted-foreground leading-relaxed mb-6 italic">
                "{testimonial.content}"
              </p>

              <div className="border-t border-muted pt-4">
                <div className="font-semibold text-foreground">{testimonial.name}</div>
                <div className="text-sm text-muted-foreground">
                  {testimonial.role} at {testimonial.company}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
