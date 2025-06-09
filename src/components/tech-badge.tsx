import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Code2, Database, Lightbulb } from 'lucide-react';

// Simplified Tech Stack Logo Components
const NextJsLogo = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
    <path d="M12 2L12 22M2 12L22 12" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
    <text x="12" y="16" textAnchor="middle" fontSize="8" fill="currentColor">N</text>
  </svg>
);

const TypeScriptLogo = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <rect x="2" y="2" width="20" height="20" rx="3" stroke="currentColor" strokeWidth="2" fill="none"/>
    <text x="12" y="16" textAnchor="middle" fontSize="10" fill="currentColor" fontWeight="bold">TS</text>
  </svg>
);

const TailwindLogo = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 6c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.31.74 1.91 1.35.98 1 2.12 2.15 4.59 2.15 2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.31-.74-1.91-1.35C15.61 7.15 14.47 6 12 6zM7 12c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.31.74 1.91 1.35.98 1 2.12 2.15 4.59 2.15 2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.31-.74-1.91-1.35C10.61 13.15 9.47 12 7 12z"/>
  </svg>
);

const SupabaseLogo = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M21.8 13.6H12V2.4c0-.4-.5-.6-.8-.3L2.2 13.1c-.2.2-.1.5.2.5H12v11.2c0 .4.5.6.8.3l9-11c.2-.2.1-.5-.2-.5z"/>
  </svg>
);

const AILogo = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="12" r="3"/>
    <circle cx="6" cy="6" r="1.5" fillOpacity="0.6"/>
    <circle cx="18" cy="6" r="1.5" fillOpacity="0.6"/>
    <circle cx="6" cy="18" r="1.5" fillOpacity="0.6"/>
    <circle cx="18" cy="18" r="1.5" fillOpacity="0.6"/>
    <path d="M9 9l6 6M15 9l-6 6" stroke="currentColor" strokeWidth="1" opacity="0.4"/>
  </svg>
);

// Tech Badge Component with enhanced styling and hover effects
export const TechBadge = ({
  icon: Icon,
  logo: Logo,
  children,
  className = "",
  color = "primary"
}: {
  icon: React.ComponentType<{ className?: string }>,
  logo?: React.ComponentType<{ className?: string }>,
  children: React.ReactNode,
  className?: string,
  color?: string
}) => {
  const IconComponent = Logo || Icon;

  // Color variants for different technologies
  const colorClasses = {
    primary: "bg-primary/5 border-primary/20 hover:bg-primary/10 hover:border-primary/30 text-primary",
    nextjs: "bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300 text-slate-700 dark:bg-slate-800/50 dark:border-slate-700 dark:hover:bg-slate-800 dark:text-slate-300",
    typescript: "bg-blue-50 border-blue-200 hover:bg-blue-100 hover:border-blue-300 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800 dark:hover:bg-blue-900/30 dark:text-blue-400",
    tailwind: "bg-cyan-50 border-cyan-200 hover:bg-cyan-100 hover:border-cyan-300 text-cyan-700 dark:bg-cyan-900/20 dark:border-cyan-800 dark:hover:bg-cyan-900/30 dark:text-cyan-400",
    supabase: "bg-green-50 border-green-200 hover:bg-green-100 hover:border-green-300 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:hover:bg-green-900/30 dark:text-green-400",
    ai: "bg-purple-50 border-purple-200 hover:bg-purple-100 hover:border-purple-300 text-purple-700 dark:bg-purple-900/20 dark:border-purple-800 dark:hover:bg-purple-900/30 dark:text-purple-400"
  };

  const selectedColor = colorClasses[color as keyof typeof colorClasses] || colorClasses.primary;

  return (
    <Badge
      variant="outline"
      className={`px-3 py-1.5 text-sm transition-all duration-200 hover:scale-105 cursor-default ${selectedColor} ${className}`}
    >
      <IconComponent className="h-3.5 w-3.5 mr-1.5 transition-transform duration-200 hover:rotate-12" />
      <span className="font-medium">{children}</span>
    </Badge>
  );
};

// Pre-configured tech badges for easy use with custom colors
export const NextJsBadge = () => (
  <TechBadge icon={Code2} logo={NextJsLogo} color="nextjs">
    Next.js
  </TechBadge>
);

export const TypeScriptBadge = () => (
  <TechBadge icon={Code2} logo={TypeScriptLogo} color="typescript">
    TypeScript
  </TechBadge>
);

export const TailwindBadge = () => (
  <TechBadge icon={Code2} logo={TailwindLogo} color="tailwind">
    Tailwind CSS
  </TechBadge>
);

export const SupabaseBadge = () => (
  <TechBadge icon={Database} logo={SupabaseLogo} color="supabase">
    Supabase
  </TechBadge>
);

export const AIBadge = () => (
  <TechBadge icon={Lightbulb} logo={AILogo} color="ai">
    AI Integration
  </TechBadge>
);
