"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Heart, 
  Github, 
  Linkedin, 
  Mail, 
  Book, 
  FileText, 
  BookOpen, 
  FileSignature, 
  Search,
  Users,
  Building2,
  Briefcase,
  PhoneCall,
  HelpCircle,
  Shield,
  FileTerminal,
  Cookie,
  AlertCircle,
  Accessibility
} from "lucide-react";
import { fadeIn } from "@/lib/motion";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would send this to your API
    console.log("Subscribing email:", email);
    setSubscribed(true);
    setTimeout(() => setSubscribed(false), 3000);
    setEmail("");
  };
  
  // Updated footer links with icons
  const footerLinks = [
    {
      title: "Legal Resources",
      links: [
        { label: "Case Law Database", href: "#", icon: Book },
        { label: "Legal Documents", href: "#", icon: FileText },
        { label: "Law Dictionary", href: "#", icon: BookOpen },
        { label: "Legal Forms", href: "#", icon: FileSignature },
        { label: "Legal Research", href: "#", icon: Search },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About Us", href: "/about", icon: Users },
        { label: "Our Team", href: "#", icon: Building2 },
        { label: "Careers", href: "#", icon: Briefcase },
        { label: "Contact", href: "/collaboration", icon: PhoneCall },
        { label: "Support", href: "#", icon: HelpCircle },
      ],
    },
    {
      title: "Legal Info",
      links: [
        { label: "Privacy Policy", href: "/privacy-policy", icon: Shield },
        { label: "Terms of Service", href: "/terms-of-service", icon: FileTerminal },
        { label: "Cookie Policy", href: "#", icon: Cookie },
        { label: "Disclaimer", href: "#", icon: AlertCircle },
        { label: "Accessibility", href: "#", icon: Accessibility },
      ],
    },
  ];

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="w-full border-t bg-gradient-to-b from-background to-card/60 backdrop-blur-sm mt-12 pt-8 md:pt-12"
    >
      <div className="container mx-auto px-4 pb-6 md:pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 md:gap-8">
          {/* Brand Column */}
          <motion.div
            variants={fadeIn("right", 0.2)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="lg:col-span-4 space-y-4 md:space-y-6"
          >
            <div>
              <h3 className="text-xl md:text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Juris.Ai
              </h3>
              <p className="text-xs md:text-sm text-muted-foreground max-w-xs mt-2 md:mt-3">
                AI-powered legal assistance platform helping users navigate complex legal questions with multi-model analysis.
              </p>
            </div>
            
            {/* Newsletter Subscription - Hidden on mobile, visible on larger screens */}
            <div className="hidden md:block space-y-3">
              <h4 className="font-medium text-sm">Subscribe to our newsletter</h4>
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                <Input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-background"
                />
                <Button 
                  type="submit" 
                  variant={subscribed ? "default" : "default"}
                  className={`whitespace-nowrap transition-all ${subscribed ? "bg-green-600 hover:bg-green-700" : ""}`}
                >
                  {subscribed ? "Subscribed!" : "Subscribe"}
                </Button>
              </form>
              <p className="text-xs text-muted-foreground">
                Get the latest legal updates and news.
              </p>
            </div>
            
            {/* Compact Newsletter for Mobile */}
            <div className="md:hidden space-y-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-full flex items-center gap-2"
                      onClick={() => document.getElementById('mobile-newsletter-form')?.classList.toggle('hidden')}
                    >
                      <Mail className="h-4 w-4" />
                      <span className="text-xs">Subscribe</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Subscribe to our newsletter</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <form 
                id="mobile-newsletter-form" 
                onSubmit={handleSubscribe} 
                className="hidden space-y-2"
              >
                <Input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-background text-sm"
                />
                <Button 
                  type="submit" 
                  variant={subscribed ? "default" : "default"}
                  className={`w-full text-xs ${subscribed ? "bg-green-600 hover:bg-green-700" : ""}`}
                >
                  {subscribed ? "Subscribed!" : "Subscribe"}
                </Button>
              </form>
            </div>
            
            {/* Social Media Links */}
            <div className="space-y-2 md:space-y-3">
              <h4 className="font-medium text-xs md:text-sm">Follow Us</h4>
              <div className="flex items-center gap-3">
                {[
                  { id: 'github', icon: Github, href: "https://github.com/", label: "GitHub" },
                  { id: 'linkedin', icon: Linkedin, href: "https://linkedin.com/", label: "LinkedIn" },
                  { id: 'mail', icon: Mail, href: "mailto:ititsaddy7@gmail.com", label: "Email Us" }
                ].map(({ id, icon: Icon, href, label }) => (
                  <TooltipProvider key={id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <motion.a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.1, y: -2 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                        >
                          <Icon className="h-4 w-4 md:h-5 md:w-5" />
                        </motion.a>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{label}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Navigation Columns - Desktop View */}
          <div className="hidden md:grid lg:col-span-8 grid-cols-3 gap-8">
            {footerLinks.map((section, sectionIndex) => (
              <motion.div
                key={section.title}
                variants={fadeIn("up", 0.2 + sectionIndex * 0.1)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="space-y-4"
              >
                <h4 className="font-semibold text-base">{section.title}</h4>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <motion.li
                      key={link.label}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * linkIndex }}
                      viewport={{ once: true }}
                    >
                      <Link 
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-primary hover:underline underline-offset-4 transition-all flex items-center gap-2 group"
                      >
                        <link.icon className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                        {link.label}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
          
          {/* Mobile Navigation - Icon Grid */}
          <div className="md:hidden col-span-1 space-y-4">
            {footerLinks.map((section, sectionIndex) => (
              <motion.div
                key={section.title}
                variants={fadeIn("up", 0.2 + sectionIndex * 0.1)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="space-y-2"
              >
                <h4 className="font-semibold text-sm">{section.title}</h4>
                <div className="grid grid-cols-5 gap-2">
                  {section.links.map((link) => (
                    <TooltipProvider key={link.label}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Link 
                              href={link.href}
                              className="flex flex-col items-center justify-center text-center p-2 rounded-lg bg-card/80 hover:bg-primary/10 transition-colors"
                            >
                              <link.icon className="h-5 w-5 text-muted-foreground" />
                              <span className="text-[10px] mt-1 text-muted-foreground">
                                {link.label.split(' ')[0]}
                              </span>
                            </Link>
                          </motion.div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{link.label}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Section with Copyright */}
        <motion.div
          variants={fadeIn("up", 0.5)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row justify-between items-center gap-3 border-t mt-6 md:mt-12 pt-4 md:pt-6"
        >
          <p className="text-[10px] md:text-xs text-muted-foreground text-center sm:text-left">
            © {currentYear} Juris.Ai. All rights reserved.
          </p>
          <p className="text-[10px] md:text-xs text-muted-foreground flex items-center gap-1">
            Made with <Heart className="h-3 w-3 text-destructive" /> for a better legal experience
          </p>
        </motion.div>
      </div>
    </motion.footer>
  );
}