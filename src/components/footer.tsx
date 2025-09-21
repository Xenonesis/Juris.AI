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
  Accessibility,
  Scale
} from "lucide-react";
import { fadeIn } from "@/lib/motion";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { JurisLogo } from "./juris-logo";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SafeIcon } from "./ui/safe-icon";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would send this to your API
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
        { label: "Cookie Policy", href: "/cookie-policy", icon: Cookie },
        { label: "Disclaimer", href: "/disclaimer", icon: AlertCircle },
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
      className="w-full border-t border-border/60 gradient-bg-surface backdrop-blur-sm mt-12 pt-8 md:pt-12 footer-light-mode gradient-overlay-mesh"
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
            <div className="flex flex-col gap-4">
              <JurisLogo />
              <p className="text-xs md:text-sm text-muted-foreground max-w-xs font-medium">
                AI-powered legal assistance platform helping users navigate complex legal questions with multi-model analysis.
              </p>
            </div>
            
            {/* Newsletter Subscription - Hidden on mobile, visible on larger screens */}
            <div className="hidden md:block space-y-3">
              <h4 className="font-medium text-sm text-foreground">Subscribe to our newsletter</h4>
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                <Input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-background border-border/60 text-foreground placeholder:text-muted-foreground"
                />
                <Button
                  type="submit"
                  variant={subscribed ? "default" : "default"}
                  className={`whitespace-nowrap transition-all border border-primary/20 ${subscribed ? "bg-green-600 hover:bg-green-700 text-white" : "bg-primary text-primary-foreground hover:bg-primary/90"}`}
                >
                  {subscribed ? "Subscribed!" : "Subscribe"}
                </Button>
              </form>
              <p className="text-xs text-muted-foreground font-medium">
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
                      className="w-full flex items-center gap-2 border-border/60 text-foreground hover:bg-primary/10"
                      onClick={() => document.getElementById('mobile-newsletter-form')?.classList.toggle('hidden')}
                    >
                      <Mail className="h-4 w-4" />
                      <span className="text-xs font-medium">Subscribe</span>
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
                  className="bg-background text-sm border-border/60 text-foreground placeholder:text-muted-foreground"
                />
                <Button
                  type="submit"
                  variant={subscribed ? "default" : "default"}
                  className={`w-full text-xs border border-primary/20 ${subscribed ? "bg-green-600 hover:bg-green-700 text-white" : "bg-primary text-primary-foreground hover:bg-primary/90"}`}
                >
                  {subscribed ? "Subscribed!" : "Subscribe"}
                </Button>
              </form>
            </div>
            
            {/* Social Media Links */}
            <div className="space-y-2 md:space-y-3">
              <h4 className="font-medium text-xs md:text-sm text-foreground">Follow Us</h4>
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
                          className="p-2 rounded-full social-icon transition-colors"
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
                <h4 className="font-semibold text-base text-foreground">{section.title}</h4>
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
                        className="text-sm text-muted-foreground hover:text-foreground dark:hover:text-primary hover:underline underline-offset-4 transition-all flex items-center gap-2 group"
                      >
                        <SafeIcon 
                          icon={<link.icon className="h-4 w-4" />} 
                          className="text-muted-foreground group-hover:text-foreground dark:group-hover:text-primary transition-colors" 
                        />
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
                <h4 className="font-semibold text-sm text-foreground">{section.title}</h4>
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
                              className="flex flex-col items-center justify-center text-center p-2 rounded-lg mobile-nav-card transition-colors"
                            >
                              <SafeIcon 
                                icon={<link.icon className="h-5 w-5" />} 
                                className="text-foreground/70 dark:text-muted-foreground" 
                              />
                              <span className="text-[11px] mt-1 text-foreground/70 dark:text-muted-foreground font-medium">
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
          className="flex flex-col sm:flex-row justify-between items-center gap-3 border-t border-border/60 mt-6 md:mt-12 pt-4 md:pt-6"
        >
          <p className="text-xs md:text-sm text-muted-foreground text-center sm:text-left font-medium">
            © {currentYear} Juris.Ai. All rights reserved.
          </p>
          <p className="text-xs md:text-sm text-muted-foreground flex items-center gap-2 font-medium">
            Made with
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-flex items-center justify-center"
            >
              <Heart className="h-4 w-4 text-red-500 fill-current heart-icon" />
            </motion.span>
            for a better legal experience
          </p>
        </motion.div>
      </div>
    </motion.footer>
  );
}