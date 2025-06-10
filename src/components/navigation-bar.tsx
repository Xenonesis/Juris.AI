"use client";

import Link from "next/link";
import { Menu, X, User, LogOut, MessageSquare, Home, Info, Phone, Sparkles, Scale, BookOpen } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
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
  const { user, isLoading, signOut } = useAuth();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  // Track scroll position for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
  };

  const menuItems = [
    { id: 'home', label: "Home", href: "/", icon: <Home className="h-4 w-4" /> },
    { id: 'about', label: "About", href: "/about", icon: <Info className="h-4 w-4" /> },
    { id: 'services', label: "Services", href: "/services", icon: <Sparkles className="h-4 w-4" /> },
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
            <Link href="/" className="flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 rounded-md group" aria-label="Go to Home">
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
              <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-primary animate-pulse opacity-70"></div>
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${isOpen ? 'opacity-100 h-auto pt-4 pb-2' : 'opacity-0 h-0'}`}
        >
          <nav>
            <ul className="flex flex-col gap-3 rounded-xl bg-background/95 shadow-lg px-3 py-2 border border-border">
              {menuItems.map((item) => {
                const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                return (
                  <li
                    key={item.id}
                    className={`border-b border-border pb-2 ${isActive ? "text-primary font-semibold" : ""}`}
                  >
                    <Link
                      href={item.href}
                      className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 px-2 py-1.5 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
                      onClick={() => setIsOpen(false)}
                      aria-current={isActive ? "page" : undefined}
                      tabIndex={0}
                    >
                      <span className={isActive ? "text-primary" : "text-muted-foreground"}>
                        {item.icon}
                      </span>
                      {item.label}
                    </Link>
                  </li>
                );
              })}
              {user && (
                <li
                  className={`border-b border-border pb-2 ${pathname === "/chat" ? "text-primary font-semibold" : ""}`}
                >
                  <Link
                    href="/chat"
                    className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 px-2 py-1.5 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
                    onClick={() => setIsOpen(false)}
                    aria-current={pathname === "/chat" ? "page" : undefined}
                    tabIndex={0}
                  >
                    <MessageSquare className="h-4 w-4" />
                    Chat
                    <Badge variant="outline" className="ml-1 py-0 h-4 text-[10px] font-normal">AI</Badge>
                  </Link>
                </li>
              )}
              {user ? (
                <>
                  <li
                    className="border-b border-border pb-2 flex items-center gap-2"
                  >
                    <Link
                      href="/profile"
                      className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 px-2 py-1.5 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-primary/70 w-full"
                      onClick={() => setIsOpen(false)}
                      aria-current={pathname === "/profile" ? "page" : undefined}
                      tabIndex={0}
                    >
                      <User className="h-4 w-4" />
                      View Profile
                    </Link>
                  </li>
                  <li className="pt-2">
                    <Button
                      size="sm"
                      className="w-full flex items-center justify-center gap-2"
                      onClick={handleSignOut}
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </Button>
                  </li>
                </>
              ) :
                <li className="pt-2">
                  <Link
                    href="/auth/login"
                    className="w-full outline-none focus-visible:ring-2 focus-visible:ring-primary/70 rounded-md"
                    onClick={() => setIsOpen(false)}
                  >
                    <Button size="sm" className="w-full flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Sign In
                    </Button>
                  </Link>
                </li>
              }
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
} 