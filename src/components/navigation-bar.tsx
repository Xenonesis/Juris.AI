"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Menu, X, User, LogOut, MessageSquare } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { ThemeToggle } from "./theme-toggle";
import { fadeIn } from "@/lib/motion";
import { useAuth } from "@/components/auth/supabase-auth-provider";

export function NavigationBar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isLoading, signOut } = useAuth();

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleSignOut = async () => {
    await signOut();
  };

  const menuVariants = {
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    },
    open: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  const menuItems = [
    { label: "Home", href: "/" },
    { label: "About", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="sticky top-0 z-50 w-full bg-background/70 backdrop-blur-md border-b"
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <motion.div 
            variants={fadeIn("right", 0.2)}
            initial="hidden"
            animate="show"
            className="flex items-center gap-2"
          >
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Law Advisor
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <motion.nav 
            variants={fadeIn("left", 0.3)}
            initial="hidden"
            animate="show"
            className="hidden md:flex items-center gap-6"
          >
            <ul className="flex items-center gap-4">
              {menuItems.map((item, index) => (
                <motion.li 
                  key={index}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Link 
                    href={item.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {item.label}
                  </Link>
                </motion.li>
              ))}
              {user && (
                <motion.li 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Link 
                    href="/chat"
                    className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Chat
                  </Link>
                </motion.li>
              )}
            </ul>
            <div className="flex items-center gap-3">
              {isLoading ? (
                <div className="h-9 w-20 rounded-md bg-muted animate-pulse" />
              ) : user ? (
                <div className="flex items-center gap-3">
                  <Link href="/profile">
                    <Button size="sm" variant="outline" className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      Profile
                    </Button>
                  </Link>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={handleSignOut}
                    className="flex items-center gap-1"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                </div>
              ) : (
                <Link href="/auth/login">
                  <Button size="sm" variant="outline">Sign In</Button>
                </Link>
              )}
              <ThemeToggle />
            </div>
          </motion.nav>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-3">
            <ThemeToggle />
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial="closed"
          animate={isOpen ? "open" : "closed"}
          variants={menuVariants}
          className="md:hidden overflow-hidden"
        >
          <nav className="pt-4 pb-2">
            <ul className="flex flex-col gap-3">
              {menuItems.map((item, index) => (
                <motion.li 
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * index }}
                  className="border-b border-border pb-2"
                >
                  <Link 
                    href={item.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                </motion.li>
              ))}
              {user && (
                <motion.li 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="border-b border-border pb-2"
                >
                  <Link 
                    href="/chat"
                    className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                    onClick={() => setIsOpen(false)}
                  >
                    <MessageSquare className="h-4 w-4" />
                    Chat
                  </Link>
                </motion.li>
              )}
              {user ? (
                <>
                  <motion.li 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="border-b border-border pb-2"
                  >
                    <Link 
                      href="/profile"
                      className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                      onClick={() => setIsOpen(false)}
                    >
                      <User className="h-4 w-4" />
                      Profile
                    </Link>
                  </motion.li>
                  <motion.li className="pt-2">
                    <Button 
                      size="sm" 
                      className="w-full flex items-center justify-center gap-1"
                      onClick={() => {
                        handleSignOut();
                        setIsOpen(false);
                      }}
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </Button>
                  </motion.li>
                </>
              ) : (
                <motion.li className="pt-2">
                  <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                    <Button size="sm" className="w-full">Sign In</Button>
                  </Link>
                </motion.li>
              )}
            </ul>
          </nav>
        </motion.div>
      </div>
    </motion.header>
  );
} 