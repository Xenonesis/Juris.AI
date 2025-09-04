'use client';

import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const CTASection: React.FC = () => {
  return (
    <section className="text-center bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 rounded-3xl p-8 md:p-12 border border-primary/20 shadow-xl shadow-primary/10">
      <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
        Ready to Transform Your Legal Work?
      </h2>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
        Join thousands of legal professionals who trust Juris.AI for their legal research and analysis needs.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/">
          <Button size="lg" className="px-8 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300">
            Start Free Trial
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
        <Link href="/about">
          <Button size="lg" variant="outline" className="px-8 border-primary/30 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300">
            Learn More
          </Button>
        </Link>
      </div>
    </section>
  );
};
