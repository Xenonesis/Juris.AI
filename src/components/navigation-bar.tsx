"use client";

import Link from "next/link";
import { Menu, X, User, LogOut, MessageSquare, Home, Info, Phone, Sparkles, Scale, BookOpen, Search, Command } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { ThemeToggle } from "./theme-toggle";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { useAuth } from "@/components/auth/supabase-auth-provider";
import { Badge } from "./ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

type NavUser = {
  full_name?: string | null;
  email?: string | null;
  avatar_url?: string | null;
};

export function NavigationBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { user, isLoading, signOut } = useAuth();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  // Track scroll position for navbar styling and keyboard shortcuts
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Command/Ctrl + K to open search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
      // Escape to close modals
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setIsOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Avatar helper - get initials from name or email
  function getInitials(u: NavUser | null): string {
    if (!u) return "U";
    if (u.full_name) {
      return u.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
    }
    if (u.email) {
      return u.email.slice(0, 2).toUpperCase();
    }
    return "U";
  }

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleSearch = () => setSearchOpen(!searchOpen);

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
  };

  const menuItems = [
    { id: 'home', label: "Home", href: user ? "/" : "/landing", icon: <Home className="h-4 w-4" /> },
    ...(user ? [{ id: 'landing', label: "Landing", href: "/landing", icon: <Sparkles className="h-4 w-4" /> }] : []),
    { id: 'about', label: "About", href: "/about", icon: <Info className="h-4 w-4" /> },
    { id: 'services', label: "Services", href: "/services", icon: <Scale className="h-4 w-4" /> },
    { id: 'legal-tools', label: "Legal Tools", href: "/legal-bert", icon: <Scale className="h-4 w-4" /> },
    { id: 'contact', label: "Contact", href: "/collaboration", icon: <Phone className="h-4 w-4" /> },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full backdrop-blur-lg border-b transition-all duration-300 
        ${scrolled ? 'bg-background/90 shadow-md' : 'bg-background/70'}`}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div
            className="flex items-center gap-2"
          >
            <Link href={user ? "/" : "/landing"} className="flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 rounded-md group" aria-label="Go to Home">
              <div className="relative w-9 h-9 flex items-center justify-center rounded-xl professional-gradient group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <Scale className="h-5 w-5 text-white" style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.4))' }} />
                <div className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <span className="text-xl md:text-2xl font-bold text-high-contrast group-hover:scale-105 transition-transform duration-300">
                Juris.AI
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav 
            className="hidden md:flex items-center gap-6"
          >
            <ul className="flex items-center gap-4">
              {menuItems.map((item) => {
                const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                return (
                  <li
                    key={item.id}
                    className="relative"
                  >
                    <Link
                      href={item.href}
                      className={`text-muted-foreground hover:text-primary transition-colors px-2 py-1.5 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-primary/60 flex items-center gap-1.5 group
                        ${isActive ? "text-primary font-medium" : ""}`}
                      aria-current={isActive ? "page" : undefined}
                      tabIndex={0}
                    >
                      <span className={`transition-transform group-hover:scale-110 ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                        {item.icon}
                      </span>
                      <span className="relative z-10">{item.label}</span>
                      <span
                        className={`absolute bottom-0 left-0 h-0.5 w-full bg-primary/80 origin-left transition-transform duration-200 ease-out rounded
                        ${isActive ? "scale-x-100" : "scale-x-0"} group-hover:scale-x-100`}
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                );
              })}
              {user && (
                <li
                  className="relative"
                >
                  <Link
                    href="/chat"
                    className={`text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 px-2 py-1.5 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-primary/60 group
                      ${pathname === "/chat" ? "text-primary font-medium" : ""}`}
                    aria-current={pathname === "/chat" ? "page" : undefined}
                    tabIndex={0}
                  >
                    <span className={`transition-transform group-hover:scale-110 ${pathname === "/chat" ? "text-primary" : "text-muted-foreground"}`}>
                      <MessageSquare className="h-4 w-4" />
                    </span>
                    Chat
                    <Badge variant="outline" className="ml-1 py-0 h-4 text-[10px] font-normal">AI</Badge>
                  </Link>
                </li>
              )}
            </ul>
            <div className="flex items-center gap-3">
              {/* Search Button */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={toggleSearch}
                      className="hidden lg:flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Search className="h-4 w-4" />
                      <span className="text-sm">Search</span>
                      <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                        <span className="text-xs">⌘</span>K
                      </kbd>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Search (⌘K)</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {isLoading ? (
                <div className="h-9 w-24 rounded-md bg-muted animate-pulse" />
              ) : user ? (
                <div className="flex items-center gap-3">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link href="/profile" className="flex items-center gap-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 rounded-md">
                          <Avatar className="h-8 w-8 border border-primary/30 shadow-sm transition-transform group-hover:scale-105">
                            {user.avatar_url ? (
                              <AvatarImage src={user.avatar_url} alt={user.full_name || "Profile"} />
                            ) : (
                              <AvatarFallback className="font-semibold bg-primary/10 text-primary">{getInitials(user)}</AvatarFallback>
                            )}
                          </Avatar>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p>View profile</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleSignOut}
                    className="flex items-center gap-1"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden sm:inline">Logout</span>
                  </Button>
                </div>
              ) : (
                <Link href="/auth/login" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 rounded-md">
                  <Button size="sm" variant="default" className="gap-1">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">Sign In</span>
                  </Button>
                </Link>
              )}
              <ThemeToggle />
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-3">
            {/* Mobile Search Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSearch}
              aria-label="Search"
              className="text-muted-foreground hover:text-primary"
            >
              <Search className="h-5 w-5" />
            </Button>

            {user && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href="/profile">
                      <Avatar className="h-8 w-8 border border-primary/30 shadow-sm">
                        {user.avatar_url ? (
                          <AvatarImage src={user.avatar_url} alt={user.full_name || "Profile"} />
                        ) : (
                          <AvatarFallback className="font-semibold bg-primary/10 text-primary">{getInitials(user)}</AvatarFallback>
                        )}
                      </Avatar>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>View profile</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              aria-label="Toggle menu"
              className="relative"
            >
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </motion.div>
            </Button>
          </div>
        </div>

        {/* Enhanced Mobile Menu with Animation */}
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
                onClick={() => setIsOpen(false)}
              />

              {/* Mobile Menu */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="md:hidden absolute top-full left-0 right-0 z-50 mt-2 mx-4"
              >
                <nav className="rounded-xl bg-background/95 backdrop-blur-lg shadow-xl border border-border/50 overflow-hidden">
                  <div className="flex flex-col">
                    {menuItems.map((item, index) => {
                      const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                      return (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1, duration: 0.3 }}
                          className={`border-b border-border/30 last:border-b-0 ${isActive ? "bg-primary/5" : ""}`}
                        >
                          <Link
                            href={item.href}
                            className="text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all duration-200 flex items-center gap-3 px-4 py-3 group"
                            onClick={() => setIsOpen(false)}
                            aria-current={isActive ? "page" : undefined}
                          >
                            <span className={`transition-all duration-200 group-hover:scale-110 ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                              {item.icon}
                            </span>
                            <span className={`font-medium ${isActive ? "text-primary" : ""}`}>
                              {item.label}
                            </span>
                            {isActive && (
                              <motion.div
                                layoutId="mobile-active-indicator"
                                className="ml-auto w-2 h-2 rounded-full bg-primary"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                              />
                            )}
                          </Link>
                        </motion.div>
                      );
                    })}
                    {user && (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: menuItems.length * 0.1, duration: 0.3 }}
                        className={`border-b border-border/30 ${pathname === "/chat" ? "bg-primary/5" : ""}`}
                      >
                        <Link
                          href="/chat"
                          className="text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all duration-200 flex items-center gap-3 px-4 py-3 group"
                          onClick={() => setIsOpen(false)}
                          aria-current={pathname === "/chat" ? "page" : undefined}
                        >
                          <MessageSquare className={`h-4 w-4 transition-all duration-200 group-hover:scale-110 ${pathname === "/chat" ? "text-primary" : "text-muted-foreground"}`} />
                          <span className={`font-medium ${pathname === "/chat" ? "text-primary" : ""}`}>
                            Chat
                          </span>
                          <Badge variant="outline" className="ml-auto py-0 h-4 text-[10px] font-normal">AI</Badge>
                          {pathname === "/chat" && (
                            <motion.div
                              layoutId="mobile-active-indicator"
                              className="w-2 h-2 rounded-full bg-primary"
                              transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                          )}
                        </Link>
                      </motion.div>
                    )}

                    {/* User Actions Section */}
                    <div className="border-t border-border/30 bg-muted/20">
                      {user ? (
                        <>
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: (menuItems.length + 1) * 0.1, duration: 0.3 }}
                          >
                            <Link
                              href="/profile"
                              className="text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all duration-200 flex items-center gap-3 px-4 py-3 group"
                              onClick={() => setIsOpen(false)}
                              aria-current={pathname === "/profile" ? "page" : undefined}
                            >
                              <User className="h-4 w-4 transition-all duration-200 group-hover:scale-110" />
                              <span className="font-medium">View Profile</span>
                            </Link>
                          </motion.div>
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: (menuItems.length + 2) * 0.1, duration: 0.3 }}
                            className="p-4"
                          >
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-full flex items-center justify-center gap-2 hover:bg-destructive hover:text-destructive-foreground transition-colors"
                              onClick={handleSignOut}
                            >
                              <LogOut className="h-4 w-4" />
                              Logout
                            </Button>
                          </motion.div>
                        </>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: (menuItems.length + 1) * 0.1, duration: 0.3 }}
                          className="p-4"
                        >
                          <Link
                            href="/auth/login"
                            onClick={() => setIsOpen(false)}
                          >
                            <Button size="sm" className="w-full flex items-center gap-2">
                              <User className="h-4 w-4" />
                              Sign In
                            </Button>
                          </Link>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </nav>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Search Command Palette */}
        <AnimatePresence>
          {searchOpen && (
            <>
              {/* Search Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                onClick={() => setSearchOpen(false)}
              />

              {/* Search Modal */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="fixed top-[20%] left-1/2 transform -translate-x-1/2 w-full max-w-2xl mx-4 z-50"
              >
                <div className="bg-background/95 backdrop-blur-lg rounded-xl shadow-2xl border border-border/50 overflow-hidden">
                  <div className="flex items-center gap-3 px-4 py-3 border-b border-border/30">
                    <Search className="h-5 w-5 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search pages, features, and more..."
                      className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
                      autoFocus
                    />
                    <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                      ESC
                    </kbd>
                  </div>

                  <div className="max-h-96 overflow-y-auto">
                    <div className="p-2">
                      <div className="text-xs font-medium text-muted-foreground px-2 py-1 mb-2">Quick Actions</div>
                      {menuItems.map((item) => (
                        <Link
                          key={item.id}
                          href={item.href}
                          onClick={() => setSearchOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary/5 transition-colors group"
                        >
                          <span className="text-muted-foreground group-hover:text-primary transition-colors">
                            {item.icon}
                          </span>
                          <span className="font-medium">{item.label}</span>
                        </Link>
                      ))}

                      {user && (
                        <>
                          <div className="text-xs font-medium text-muted-foreground px-2 py-1 mb-2 mt-4">User Actions</div>
                          <Link
                            href="/chat"
                            onClick={() => setSearchOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary/5 transition-colors group"
                          >
                            <MessageSquare className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                            <span className="font-medium">Chat with AI</span>
                            <Badge variant="outline" className="ml-auto py-0 h-4 text-[10px] font-normal">AI</Badge>
                          </Link>
                          <Link
                            href="/profile"
                            onClick={() => setSearchOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary/5 transition-colors group"
                          >
                            <User className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                            <span className="font-medium">View Profile</span>
                          </Link>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-border/30 px-4 py-2 text-xs text-muted-foreground">
                    Use ↑↓ to navigate, ↵ to select, ESC to close
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}