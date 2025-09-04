"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp } from "lucide-react";
import { Button } from "./ui/button";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  const buttonVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.8 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: "spring" as any,
        stiffness: 400,
        damping: 25
      }
    },
    exit: { 
      opacity: 0, 
      y: 20, 
      scale: 0.8,
      transition: {
        duration: 0.2
      }
    },
    hover: {
      scale: 1.1,
      boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
      transition: {
        type: "spring" as any,
        stiffness: 400,
        damping: 10
      }
    },
    tap: {
      scale: 0.9
    }
  };

  const chevronVariants = {
    hover: {
      y: [0, -3, 0],
      transition: {
        y: {
          repeat: Infinity,
          duration: 1,
          ease: "easeInOut" as any
        }
      }
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="scroll-to-top-button"
          className="fixed bottom-6 right-6 z-50"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={buttonVariants}
        >
          <motion.div
            whileHover="hover"
            whileTap="tap"
            variants={buttonVariants}
          >
            <Button
              onClick={scrollToTop}
              variant="secondary"
              size="icon"
              className="rounded-full shadow-md h-12 w-12 bg-primary text-primary-foreground hover:bg-primary/90"
              aria-label="Scroll to top"
            >
              <motion.div variants={chevronVariants}>
                <ChevronUp className="h-5 w-5" />
              </motion.div>
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 