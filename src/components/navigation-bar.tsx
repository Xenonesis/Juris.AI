"use client";

import Link from "next/link";
import { Menu, X, User, LogOut, MessageSquare, Home, Info, Phone, Sparkles, Scale, Search, FileText, MessageCircle, Settings } from "lucide-react";
import { JurisLogo } from "./juris-logo";
import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { ThemeToggle } from "./theme-toggle";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { useAuth } from "@/components/auth/supabase-auth-provider";
import { Badge } from "./ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { createClient } from '@/lib/supabase/client';
import { SafeIcon } from "./ui/safe-icon";

type NavUser = {
  full_name?: string | null;
  email?: string | null;
  avatar_url?: string | null;
};

// Define search result types
interface SearchResult {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  type: 'page' | 'chat' | 'setting' | 'feature';
}

export function NavigationBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { user, isLoading, signOut } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
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

  // Focus search input when modal opens
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [searchOpen]);

  // Avatar helper - get initials from name or email
  function getInitials(u: any | null): string {
    if (!u) return "U";
    if (u.user_metadata?.full_name) {
      return u.user_metadata.full_name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();
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
  }

  // Build menu based on auth state
  const menuItems = user
    ? [
        { id: 'home', label: "Home", href: "/", icon: <Home className="h-4 w-4" /> },
        { id: 'chat', label: "Chat", href: "/chat", icon: <MessageSquare className="h-4 w-4" /> },
        { id: 'chat-history', label: "Chat History", href: "/chat/history", icon: <MessageCircle className="h-4 w-4" /> },
        { id: 'about', label: "About", href: "/about", icon: <Info className="h-4 w-4" /> },
        { id: 'contact', label: "Contact", href: "/collaboration", icon: <Phone className="h-4 w-4" /> },
      ]
    : [
        { id: 'landing', label: "Landing", href: "/landing", icon: <Sparkles className="h-4 w-4" /> },
        { id: 'services', label: "Services", href: "/services", icon: <Scale className="h-4 w-4" /> },
        { id: 'about-contact', label: "About & Contact", href: "/about", icon: <Info className="h-4 w-4" /> },
      ];

  // Static search data for pages and features
  const staticSearchData: SearchResult[] = [
    // Pages
    {
      id: 'home',
      title: 'Home',
      description: 'Main dashboard with legal assistant',
      href: '/',
      icon: <Home className="h-4 w-4" />,
      type: 'page'
    },
    {
      id: 'chat',
      title: 'Chat',
      description: 'AI-powered legal conversation interface',
      href: '/chat',
      icon: <MessageSquare className="h-4 w-4" />,
      type: 'page'
    },
    {
      id: 'chat-history',
      title: 'Chat History',
      description: 'View and manage your conversation history',
      href: '/chat/history',
      icon: <MessageCircle className="h-4 w-4" />,
      type: 'page'
    },
    {
      id: 'profile',
      title: 'Profile',
      description: 'Manage your account settings and preferences',
      href: '/profile',
      icon: <User className="h-4 w-4" />,
      type: 'page'
    },
    {
      id: 'about',
      title: 'About',
      description: 'Learn about Juris.AI and our mission',
      href: '/about',
      icon: <Info className="h-4 w-4" />,
      type: 'page'
    },
    {
      id: 'contact',
      title: 'Contact',
      description: 'Get in touch with our team',
      href: '/collaboration',
      icon: <Phone className="h-4 w-4" />,
      type: 'page'
    },
    {
      id: 'services',
      title: 'Services',
      description: 'Explore our legal AI services',
      href: '/services',
      icon: <Scale className="h-4 w-4" />,
      type: 'page'
    },
    {
      id: 'landing',
      title: 'Landing',
      description: 'Welcome page for new visitors',
      href: '/landing',
      icon: <Sparkles className="h-4 w-4" />,
      type: 'page'
    },
    
    // Features
    {
      id: 'legal-research',
      title: 'Legal Research',
      description: 'AI-powered legal document analysis',
      href: '/services#legal-research',
      icon: <FileText className="h-4 w-4" />,
      type: 'feature'
    },
    {
      id: 'document-analysis',
      title: 'Document Analysis',
      description: 'Analyze legal documents with AI',
      href: '/services#document-analysis',
      icon: <FileText className="h-4 w-4" />,
      type: 'feature'
    },
    {
      id: 'case-studies',
      title: 'Case Studies',
      description: 'Explore real legal case analyses',
      href: '/services#case-studies',
      icon: <FileText className="h-4 w-4" />,
      type: 'feature'
    },
    
    // Settings (if user is authenticated)
    ...(user ? [
      {
        id: 'api-keys',
        title: 'API Keys',
        description: 'Manage your AI service API keys',
        href: '/profile?tab=api-keys',
        icon: <Settings className="h-4 w-4" />,
        type: 'setting' as const
      },
      {
        id: 'preferences',
        title: 'Preferences',
        description: 'Customize your experience',
        href: '/profile?tab=preferences',
        icon: <Settings className="h-4 w-4" />,
        type: 'setting' as const
      }
    ] as SearchResult[] : [])
  ];

  // Search function
  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults(staticSearchData.slice(0, 8));
      return;
    }

    setIsSearching(true);
    
    try {
      // Filter static data based on query
      const filteredStaticResults = staticSearchData.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 6);
      
      // If user is authenticated, also search chat history
      let chatResults: SearchResult[] = [];
      if (user && query.length > 2) {
        try {
          const supabase = createClient();
          const { data, error } = await supabase
            .from('chat_messages')
            .select('*')
            .eq('user_id', user.id)
            .ilike('content', `%${query}%`)
            .order('created_at', { ascending: false })
            .limit(5);

          if (!error && data) {
            // Group messages by date and create unique results
            const uniqueSessions = new Map();
            data.forEach((message: any) => {
              const date = new Date(message.created_at).toISOString().split('T')[0];
              if (!uniqueSessions.has(date)) {
                uniqueSessions.set(date, {
                  id: `chat-${date}`,
                  title: `Chat on ${new Date(date).toLocaleDateString()}`,
                  description: message.content.substring(0, 100) + (message.content.length > 100 ? '...' : ''),
                  href: `/chat/history?date=${date}`,
                  icon: <MessageCircle className="h-4 w-4" />,
                  type: 'chat'
                });
              }
            });
            
            chatResults = Array.from(uniqueSessions.values()).slice(0, 3);
          }
        } catch (err) {
          console.error('Error searching chat history:', err);
        }
      }
      
      // Combine results
      const combinedResults = [...filteredStaticResults, ...chatResults];
      setSearchResults(combinedResults.length > 0 ? combinedResults : [{
        id: 'no-results',
        title: 'No results found',
        description: `No matches found for "${query}". Try different keywords.`,
        href: '#',
        icon: <Search className="h-4 w-4" />,
        type: 'page'
      }]);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([{
        id: 'error',
        title: 'Search Error',
        description: 'An error occurred while searching. Please try again.',
        href: '#',
        icon: <Search className="h-4 w-4" />,
        type: 'page'
      }]);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle search input change with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Initialize with default results
  useEffect(() => {
    if (searchOpen) {
      setSearchResults(staticSearchData.slice(0, 8));
    }
  }, [searchOpen]);

  const handleSearchResultClick = (href: string) => {
    setSearchOpen(false);
    router.push(href);
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full backdrop-blur-lg border-b transition-all duration-300 
        ${scrolled ? 'bg-background/90 shadow-md' : 'bg-background/70'}`}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <JurisLogo href={user ? "/" : "/landing"} />

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
                      <SafeIcon 
                        icon={item.icon} 
                        className={`transition-transform group-hover:scale-110 ${isActive ? "text-primary" : "text-muted-foreground"}`}
                      />
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
                            {user.user_metadata?.avatar_url ? (
                              <AvatarImage src={user.user_metadata.avatar_url} alt={user.user_metadata?.full_name || "Profile"} />
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
                        {user.user_metadata?.avatar_url ? (
                          <AvatarImage src={user.user_metadata.avatar_url} alt={user.user_metadata?.full_name || "Profile"} />
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
                            <SafeIcon 
                              icon={item.icon} 
                              className={`transition-all duration-200 group-hover:scale-110 ${isActive ? "text-primary" : "text-muted-foreground"}`}
                            />
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
                      ref={searchInputRef}
                      type="text"
                      placeholder="Search pages, features, chat history..."
                      className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                      ESC
                    </kbd>
                  </div>

                  <div className="max-h-96 overflow-y-auto">
                    {isSearching ? (
                      <div className="p-4 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                      </div>
                    ) : (
                      <div className="p-2">
                        {searchResults.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => handleSearchResultClick(item.href)}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary/5 transition-colors group text-left"
                          >
                            <SafeIcon 
                              icon={item.icon} 
                              className="text-muted-foreground group-hover:text-primary transition-colors"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="font-medium truncate">{item.title}</div>
                              <div className="text-xs text-muted-foreground truncate">{item.description}</div>
                            </div>
                            <Badge 
                              variant="outline" 
                              className="text-xs capitalize"
                            >
                              {item.type}
                            </Badge>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="border-t border-border/30 px-4 py-2 text-xs text-muted-foreground flex justify-between items-center">
                    <span>Use ↑↓ to navigate, ↵ to select, ESC to close</span>
                    <span>{searchResults.length} results</span>
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