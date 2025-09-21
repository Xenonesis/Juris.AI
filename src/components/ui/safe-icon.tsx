/**
 * Safe icon wrapper to prevent undefined icon errors
 */
import React from 'react';
import { Search } from 'lucide-react';

interface SafeIconProps {
  icon?: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
}

export function SafeIcon({ 
  icon, 
  fallback = <Search className="h-4 w-4" />, 
  className 
}: SafeIconProps) {
  if (!icon) {
    return <span className={className}>{fallback}</span>;
  }

  // Check if icon is a valid React element
  if (React.isValidElement(icon)) {
    return <span className={className}>{icon}</span>;
  }

  // If icon is not valid, return fallback
  return <span className={className}>{fallback}</span>;
}

export default SafeIcon;