"use client";

import { ProfileForm } from "@/components/profile/profile-form";
import { JurisdictionSettings } from "@/components/profile/jurisdiction-settings";
import { QuickSettings } from "@/components/profile/quick-settings";
import { User, Shield, Bell, Download, Key, LockKeyhole, Globe, Settings, Activity, Sparkles, ChevronRight, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ApiKeysForm } from "@/components/profile/api-keys-form";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import "./profile.css";

function ProfileContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("profile");
  const { theme, setTheme } = useTheme();
  const [syncWithSystem, setSyncWithSystem] = useState(theme === "system");
  const [lastNonSystemTheme, setLastNonSystemTheme] = useState<string | undefined>(
    theme && theme !== "system" ? theme : "light" 
  );

  useEffect(() => {
    setSyncWithSystem(theme === "system");
    if (theme && theme !== "system") {
      setLastNonSystemTheme(theme);
    }
  }, [theme]);

  const handleSyncToggle = (checked: boolean) => {
    if (checked) {
      if (theme && theme !== "system") {
        setLastNonSystemTheme(theme);
      }
      setTheme("system");
    } else {
      setTheme(lastNonSystemTheme || "light");
    }
  };

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && ["profile", "security", "api-keys", "notifications", "jurisdictions", "quick-settings"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const tabContent = {
    hidden: { opacity: 0, x: 20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0, 
      x: -20,
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10 py-8 md:py-12"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="container max-w-6xl mx-auto px-4">
        {/* Enhanced Header Section */}
        <motion.div className="space-y-6 mb-12" variants={itemVariants}>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-start gap-6">
              <motion.div 
                className="w-16 h-16 rounded-3xl bg-gradient-to-br from-primary via-chart-2 to-chart-3 flex items-center justify-center shadow-xl"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <User className="h-8 w-8 text-primary-foreground" />
              </motion.div>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                    Profile Settings
                  </h1>
                  <Badge variant="secondary" className="hidden sm:flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    Pro
                  </Badge>
                </div>
                <p className="text-lg text-muted-foreground max-w-2xl">
                  Customize your Juris.AI experience with personalized settings and preferences
                </p>
              </div>
            </div>
            
            {/* Quick Actions */}
            <motion.div 
              className="flex flex-wrap gap-3"
              variants={itemVariants}
            >
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Export Data
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Activity className="h-4 w-4" />
                Usage Stats
              </Button>
            </motion.div>
          </div>
          
          {/* Status Indicators */}
          <motion.div 
            className="flex flex-wrap items-center gap-4"
            variants={itemVariants}
          >
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-sm font-medium text-green-700 dark:text-green-300">Account Active</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Secure Connection</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800">
              <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
              <span className="text-sm font-medium text-purple-700 dark:text-purple-300">AI Models Ready</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Enhanced Tabs Section */}
        <motion.div variants={itemVariants}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-8 w-full max-w-3xl grid grid-cols-6 h-auto p-1 bg-muted/50 backdrop-blur-sm">
              <TabsTrigger 
                value="profile" 
                className="flex flex-col items-center gap-1 py-3 px-2 data-[state=active]:shadow-lg data-[state=active]:bg-background transition-all duration-200"
              >
                <User className="h-4 w-4" />
                <span className="text-xs font-medium">Profile</span>
              </TabsTrigger>
              <TabsTrigger 
                value="security" 
                className="flex flex-col items-center gap-1 py-3 px-2 data-[state=active]:shadow-lg data-[state=active]:bg-background transition-all duration-200"
              >
                <Shield className="h-4 w-4" />
                <span className="text-xs font-medium">Security</span>
              </TabsTrigger>
              <TabsTrigger 
                value="api-keys" 
                className="flex flex-col items-center gap-1 py-3 px-2 data-[state=active]:shadow-lg data-[state=active]:bg-background transition-all duration-200"
              >
                <Key className="h-4 w-4" />
                <span className="text-xs font-medium">API Keys</span>
              </TabsTrigger>
              <TabsTrigger 
                value="jurisdictions" 
                className="flex flex-col items-center gap-1 py-3 px-2 data-[state=active]:shadow-lg data-[state=active]:bg-background transition-all duration-200"
              >
                <Globe className="h-4 w-4" />
                <span className="text-xs font-medium">Jurisdictions</span>
              </TabsTrigger>
              <TabsTrigger 
                value="quick-settings" 
                className="flex flex-col items-center gap-1 py-3 px-2 data-[state=active]:shadow-lg data-[state=active]:bg-background transition-all duration-200"
              >
                <Zap className="h-4 w-4" />
                <span className="text-xs font-medium">Quick</span>
              </TabsTrigger>
              <TabsTrigger 
                value="notifications" 
                className="flex flex-col items-center gap-1 py-3 px-2 data-[state=active]:shadow-lg data-[state=active]:bg-background transition-all duration-200"
              >
                <Bell className="h-4 w-4" />
                <span className="text-xs font-medium">Notifications</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" key="profile">
              <motion.div
                variants={tabContent}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <Card className="shadow-xl border-muted/50 bg-card/80 backdrop-blur-sm overflow-hidden">
                  <CardHeader className="border-b border-muted/30 bg-gradient-to-r from-muted/20 to-transparent">
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-chart-2 flex items-center justify-center shadow-lg">
                        <User className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <div>
                        <div className="text-xl font-semibold">Profile Information</div>
                        <CardDescription className="text-sm">
                          Update your personal information and how it appears across services
                        </CardDescription>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    <ProfileForm />
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
              
              <TabsContent value="security" key="security">
                <motion.div
                  variants={tabContent}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <Card className="shadow-xl border-muted/50 bg-card/80 backdrop-blur-sm overflow-hidden">
                    <CardHeader className="border-b border-muted/30 bg-gradient-to-r from-muted/20 to-transparent">
                      <CardTitle className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
                          <LockKeyhole className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <div className="text-xl font-semibold">Security Settings</div>
                          <CardDescription className="text-sm">
                            Manage your account security and authentication preferences
                          </CardDescription>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border">
                          <div className="space-y-1">
                            <Label htmlFor="sync-theme" className="text-sm font-medium">
                              Sync with system theme
                            </Label>
                            <p className="text-xs text-muted-foreground">
                              Automatically switch between dark and light mode based on your system preferences
                            </p>
                          </div>
                          <Switch
                            id="sync-theme"
                            checked={syncWithSystem}
                            onCheckedChange={handleSyncToggle}
                          />
                        </div>
                        
                        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
                          <div className="flex items-start gap-3">
                            <Settings className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                            <div className="space-y-1">
                              <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                                Enhanced Security Features Coming Soon
                              </p>
                              <p className="text-xs text-amber-700 dark:text-amber-300">
                                Two-factor authentication, session management, and advanced security controls will be available in the next update.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
              
              <TabsContent value="api-keys" key="api-keys">
                <motion.div
                  variants={tabContent}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <Card className="shadow-xl border-muted/50 bg-card/80 backdrop-blur-sm overflow-hidden">
                    <CardHeader className="border-b border-muted/30 bg-gradient-to-r from-muted/20 to-transparent">
                      <CardTitle className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                          <Key className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <div className="text-xl font-semibold">AI Model API Keys</div>
                          <CardDescription className="text-sm">
                            Manage your API keys for AI models used by Juris.AI to generate responses
                          </CardDescription>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                      <ApiKeysForm />
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
              
              <TabsContent value="jurisdictions" key="jurisdictions">
                <motion.div
                  variants={tabContent}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <JurisdictionSettings />
                </motion.div>
              </TabsContent>
              
              <TabsContent value="quick-settings" key="quick-settings">
                <motion.div
                  variants={tabContent}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <QuickSettings />
                </motion.div>
              </TabsContent>
              
              <TabsContent value="notifications" key="notifications">
                <motion.div
                  variants={tabContent}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <Card className="shadow-xl border-muted/50 bg-card/80 backdrop-blur-sm overflow-hidden">
                    <CardHeader className="border-b border-muted/30 bg-gradient-to-r from-muted/20 to-transparent">
                      <CardTitle className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
                          <Bell className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <div className="text-xl font-semibold">Notification Preferences</div>
                          <CardDescription className="text-sm">
                            Control how and when you receive notifications from Juris.AI
                          </CardDescription>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                      <div className="space-y-6">
                        <div className="grid gap-4">
                          <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border">
                            <div className="space-y-1">
                              <Label className="text-sm font-medium">Email Notifications</Label>
                              <p className="text-xs text-muted-foreground">Receive updates about your account and new features</p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                          
                          <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border">
                            <div className="space-y-1">
                              <Label className="text-sm font-medium">Chat Summaries</Label>
                              <p className="text-xs text-muted-foreground">Weekly summaries of your legal research activities</p>
                            </div>
                            <Switch />
                          </div>
                          
                          <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border">
                            <div className="space-y-1">
                              <Label className="text-sm font-medium">Security Alerts</Label>
                              <p className="text-xs text-muted-foreground">Important security notifications and login alerts</p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                        </div>
                        
                        <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                          <div className="flex items-start gap-3">
                            <Bell className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                            <div className="space-y-1">
                              <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                                Advanced Notification Settings
                              </p>
                              <p className="text-xs text-blue-700 dark:text-blue-300">
                                Granular notification controls, custom schedules, and integration with external services coming soon.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
          </Tabs>
        </motion.div>
        
        {/* Enhanced Footer Section */}
        <motion.div className="mt-12" variants={itemVariants}>
          <Card className="bg-gradient-to-r from-muted/30 via-muted/20 to-transparent border-muted/30 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                  <Download className="h-4 w-4 text-white" />
                </div>
                Data & Privacy
                <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your information is securely stored with enterprise-grade encryption. We respect your privacy and only use this information to provide you with better legal research services.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-xs">GDPR Compliant</Badge>
                <Badge variant="outline" className="text-xs">SOC 2 Type II</Badge>
                <Badge variant="outline" className="text-xs">ISO 27001</Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={
      <div className="container py-8 md:py-12 max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto"></div>
            <p className="text-muted-foreground">Loading your profile...</p>
          </div>
        </div>
      </div>
    }>
      <ProfileContent />
    </Suspense>
  );
}
