"use client";

import { ProfileForm } from "@/components/profile/profile-form";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  return (
    <motion.div 
      className="container py-12"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-3xl mx-auto space-y-8">
        <motion.div className="space-y-2" variants={itemVariants}>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Your Profile</h1>
          <p className="text-muted-foreground">
            Manage your account information and preferences
          </p>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <ProfileForm />
        </motion.div>
        
        <motion.div 
          className="text-center text-sm text-muted-foreground p-4 rounded-lg border bg-muted/30"
          variants={itemVariants}
        >
          <p>
            Your information is securely stored and we respect your privacy.
            We only use this information to provide you with better services.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
} 