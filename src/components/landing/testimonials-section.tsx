/**
 * Testimonials section component for landing page
 * Displays customer testimonials from legal professionals
 */

'use client';

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Quote } from 'lucide-react';
import { itemVariants, hoverCardVariants } from '@/lib/motion-variants';
import { testimonials } from '@/lib/landing-data';
import { AnimatedSection, SectionHeader } from './ui-components';

const TestimonialsSection: React.FC = memo(() => {
  return (
    <AnimatedSection 
      className="py-20 bg-muted/30"
      sectionName="testimonials"
      aria-label="What legal professionals say about Juris.AI"
    >
      <div className="container mx-auto px-4">
        <SectionHeader 
          title="What Legal Professionals Say"
          subtitle="Real feedback from lawyers, firms, and legal academics who use Juris.AI daily"
          highlightWords={["Professionals"]}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              whileHover={hoverCardVariants.hover}
            >
              <Card className="p-6 sm:p-8 h-full border-0 bg-background/80 backdrop-blur-sm hover:bg-background transition-all duration-300 hover:shadow-xl">
                <Quote className="h-6 w-6 sm:h-8 sm:w-8 text-primary mb-3 sm:mb-4" />
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4 sm:mb-6 italic">
                  &ldquo;{testimonial.content}&rdquo;
                </p>
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm sm:text-base">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground text-sm sm:text-base">{testimonial.name}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">{testimonial.role}</div>
                    <div className="text-xs text-muted-foreground">{testimonial.company}</div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
});

TestimonialsSection.displayName = 'TestimonialsSection';

export { TestimonialsSection };
