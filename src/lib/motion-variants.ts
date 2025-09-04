/**
 * Motion animation variants and utilities for landing page components
 * Provides consistent animation patterns across all sections
 */

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as any }
  }
};

export const floatingVariants = {
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut" as any
    }
  }
};

export const hoverCardVariants = {
  hover: { 
    y: -5, 
    transition: { duration: 0.2 } 
  }
};

export const scaleOnHover = {
  hover: { 
    scale: 1.02,
    transition: { duration: 0.2 }
  },
  tap: { 
    scale: 0.98,
    transition: { duration: 0.1 }
  }
};

export const rotateAnimation = {
  animate: { 
    rotate: 360 
  },
  transition: { 
    duration: 8, 
    repeat: Infinity, 
    ease: "linear" as any
  }
};

export const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as any }
  }
};
