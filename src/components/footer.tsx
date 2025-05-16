"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Heart, Github, Linkedin, Mail } from "lucide-react";
import { fadeIn } from "@/lib/motion";

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  const footerLinks = [
    {
      title: "Legal Resources",
      links: [
        { label: "Case Law Database", href: "#" },
        { label: "Legal Documents", href: "#" },
        { label: "Law Dictionary", href: "#" },
        { label: "Legal Forms", href: "#" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About Us", href: "#" },
        { label: "Our Team", href: "#" },
        { label: "Careers", href: "#" },
        { label: "Contact", href: "#" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Blog", href: "#" },
        { label: "FAQ", href: "#" },
        { label: "Privacy Policy", href: "#" },
        { label: "Terms of Service", href: "#" },
      ],
    },
  ];

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="w-full border-t bg-card mt-12"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <motion.div
            variants={fadeIn("right", 0.2)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Juris.Ai
            </h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              AI-powered legal assistance platform helping users navigate complex legal questions with multi-model analysis.
            </p>
            <div className="flex items-center gap-4 pt-2">
              {[
                { id: 'github', icon: Github },
                { id: 'linkedin', icon: Linkedin },
                { id: 'mail', icon: Mail }
              ].map(({ id, icon: Icon }) => (
                <motion.a
                  key={id}
                  href="#"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Icon className="h-5 w-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {footerLinks.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              variants={fadeIn("up", 0.2 + sectionIndex * 0.1)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="space-y-4"
            >
              <h4 className="font-medium">{section.title}</h4>
              <ul className="space-y-2">
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
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div
          variants={fadeIn("up", 0.5)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row justify-between items-center gap-4 border-t mt-8 pt-6"
        >
          <p className="text-xs text-muted-foreground">
            © {currentYear} Juris.Ai. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            Made with <Heart className="h-3 w-3 text-destructive" /> for a better legal experience
          </p>
        </motion.div>
      </div>
    </motion.footer>
  );
} 