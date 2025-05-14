import { Variants } from "framer-motion";

// Fade in animation
export const fadeIn = (direction: string = "up", delay: number = 0): Variants => {
  let yOffset = 0;
  let xOffset = 0;
  
  if (direction === "up") yOffset = 40;
  else if (direction === "down") yOffset = -40;
  else if (direction === "left") xOffset = 40;
  else if (direction === "right") xOffset = -40;
  
  return {
    hidden: {
      y: yOffset,
      x: xOffset,
      opacity: 0,
    },
    show: {
      y: 0,
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        duration: 0.5,
        delay: delay || 0,
        damping: 12,
      },
    },
  };
};

// Stagger container for animating children
export const staggerContainer = (): Variants => {
  return {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };
};

// Card hover animation
export const cardHover = (): Variants => {
  return {
    idle: { scale: 1 },
    hover: { 
      scale: 1.02,
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 17 
      }
    },
  };
};

// Pulse animation
export const pulse = (): Variants => {
  return {
    initial: { scale: 1, opacity: 1 },
    animate: {
      scale: [1, 1.05, 1],
      opacity: [1, 0.85, 1],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };
};

// Slide transition
export const slideVariants = (direction: number): Variants => {
  return {
    hidden: {
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 30,
        stiffness: 200,
      },
    },
    exit: {
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
      transition: {
        type: "spring",
        damping: 30,
        stiffness: 200,
      },
    },
  };
};

// Fade and slide up animation with perspective
export const fadeInPerspective = (): Variants => {
  return {
    hidden: {
      opacity: 0,
      y: 40,
      rotateX: 10,
      transformPerspective: 500,
    },
    show: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 100,
      },
    },
  };
};

// Float animation for elements that should appear to be floating
export const floatAnimation = (): Variants => {
  return {
    initial: { y: 0 },
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };
};

// Bounce animation for buttons and interactive elements
export const bounce = (): Variants => {
  return {
    initial: { scale: 1 },
    animate: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 0.5,
        ease: "easeInOut",
      },
    },
  };
};

// Shimmer effect for loading states or highlighting
export const shimmer = (): Variants => {
  return {
    hidden: { backgroundPosition: "200% 0" },
    show: {
      backgroundPosition: "-200% 0",
      transition: {
        repeat: Infinity,
        duration: 1.5,
        ease: "linear",
      },
    },
  };
};

// Staggered list item animation
export const listItem = (): Variants => {
  return {
    hidden: { opacity: 0, x: -20 },
    show: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  };
};

// Accordion or expand/collapse animation
export const accordionAnimation = (): Variants => {
  return {
    closed: {
      height: 0,
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    open: {
      height: "auto",
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeInOut",
      },
    },
  };
}; 