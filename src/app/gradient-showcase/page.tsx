"use client";

import { motion } from "framer-motion";
import { EnhancedCard, EnhancedCardHeader, EnhancedCardTitle, EnhancedCardContent } from "@/components/ui/enhanced-card";
import { EnhancedButton } from "@/components/ui/enhanced-button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Palette, Sparkles, Zap, Heart, Star, Wand2 } from "lucide-react";

export default function GradientShowcase() {
  return (
    <div className="min-h-screen gradient-bg-mesh py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 rounded-2xl professional-gradient flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Palette className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-text-vibrant">
            Enhanced Gradient System
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Discover the new enhanced gradient system with improved color harmony, accessibility, and modern aesthetics.
          </p>
        </motion.div>

        {/* Gradient Text Examples */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-12"
        >
          <EnhancedCard variant="gradient" className="p-8">
            <EnhancedCardHeader>
              <EnhancedCardTitle icon={<Sparkles className="h-5 w-5 text-white" />}>
                Text Gradients
              </EnhancedCardTitle>
            </EnhancedCardHeader>
            <EnhancedCardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold gradient-text mb-2">Standard Gradient</h3>
                  <p className="text-sm text-muted-foreground">Classic gradient text</p>
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-bold gradient-text-vibrant mb-2">Vibrant Gradient</h3>
                  <p className="text-sm text-muted-foreground">Multi-color vibrant</p>
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-bold gradient-text-subtle mb-2">Subtle Gradient</h3>
                  <p className="text-sm text-muted-foreground">Gentle transition</p>
                </div>
              </div>
              <Separator />
              <div className="text-center">
                <h2 className="text-3xl font-bold gradient-text-glow mb-2">Glowing Text Effect</h2>
                <p className="text-sm text-muted-foreground">Text with glow effect</p>
              </div>
            </EnhancedCardContent>
          </EnhancedCard>
        </motion.div>

        {/* Button Gradients */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <EnhancedCard variant="gradient-interactive" className="p-8">
            <EnhancedCardHeader>
              <EnhancedCardTitle icon={<Zap className="h-5 w-5 text-white" />}>
                Button Gradients
              </EnhancedCardTitle>
            </EnhancedCardHeader>
            <EnhancedCardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <EnhancedButton variant="gradient" size="lg" className="w-full">
                  Primary Gradient
                </EnhancedButton>
                <EnhancedButton variant="gradient-secondary" size="lg" className="w-full">
                  Secondary Gradient
                </EnhancedButton>
                <EnhancedButton variant="gradient-subtle" size="lg" className="w-full">
                  Subtle Gradient
                </EnhancedButton>
                <EnhancedButton variant="gradient-animated" size="lg" className="w-full">
                  Animated Gradient
                </EnhancedButton>
              </div>
            </EnhancedCardContent>
          </EnhancedCard>
        </motion.div>

        {/* Card Gradients */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <EnhancedCard variant="gradient" hover className="p-6">
              <div className="text-center">
                <div className="w-12 h-12 rounded-xl gradient-bg-primary flex items-center justify-center mx-auto mb-4">
                  <Star className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Standard Card</h3>
                <p className="text-sm text-muted-foreground">Enhanced card with gradient background</p>
              </div>
            </EnhancedCard>

            <EnhancedCard variant="gradient-interactive" hover className="p-6">
              <div className="text-center">
                <div className="w-12 h-12 rounded-xl gradient-bg-secondary flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Interactive Card</h3>
                <p className="text-sm text-muted-foreground">Hover for enhanced gradient effect</p>
              </div>
            </EnhancedCard>

            <EnhancedCard variant="gradient-mesh" hover className="p-6">
              <div className="text-center">
                <div className="w-12 h-12 rounded-xl professional-gradient flex items-center justify-center mx-auto mb-4">
                  <Wand2 className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Mesh Gradient</h3>
                <p className="text-sm text-muted-foreground">Modern mesh gradient background</p>
              </div>
            </EnhancedCard>
          </div>
        </motion.div>

        {/* Animated Gradients */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-12"
        >
          <EnhancedCard className="p-8 gradient-overlay-primary">
            <EnhancedCardHeader>
              <EnhancedCardTitle>Animated Effects</EnhancedCardTitle>
            </EnhancedCardHeader>
            <EnhancedCardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="text-center">
                  <div className="w-24 h-24 rounded-2xl gradient-animated flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Shifting Gradient</h3>
                  <p className="text-sm text-muted-foreground">Continuously shifting colors</p>
                </div>
                <div className="text-center">
                  <div className="w-24 h-24 rounded-2xl gradient-bg-primary gradient-pulse flex items-center justify-center mx-auto mb-4">
                    <Heart className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Pulsing Effect</h3>
                  <p className="text-sm text-muted-foreground">Gentle pulsing animation</p>
                </div>
              </div>
            </EnhancedCardContent>
          </EnhancedCard>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <EnhancedCard className="p-8">
            <EnhancedCardHeader>
              <EnhancedCardTitle>Enhanced Features</EnhancedCardTitle>
            </EnhancedCardHeader>
            <EnhancedCardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Badge variant="secondary" className="p-3 text-center">
                  OKLCH Color Space
                </Badge>
                <Badge variant="secondary" className="p-3 text-center">
                  WCAG AA Compliant
                </Badge>
                <Badge variant="secondary" className="p-3 text-center">
                  Reduced Motion Support
                </Badge>
                <Badge variant="secondary" className="p-3 text-center">
                  High Contrast Mode
                </Badge>
              </div>
            </EnhancedCardContent>
          </EnhancedCard>
        </motion.div>
      </div>
    </div>
  );
}
