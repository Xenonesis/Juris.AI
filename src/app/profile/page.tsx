"use client";

import { ProfileForm } from "@/components/profile/profile-form";
import { User, Shield, Bell, Download, LockKeyhole, Key } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ApiKeysForm } from "@/components/profile/api-keys-form";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

function ProfileContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    // Set active tab based on query parameter if it exists
    const tab = searchParams.get("tab");
    if (tab && ["profile", "security", "api-keys", "notifications"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  return (
    <div className="container py-8 md:py-12 max-w-5xl mx-auto px-4">
      <div className="space-y-2 mb-8">
        <div className="flex items-center gap-2">
          <User className="h-6 w-6 text-primary" />
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Your Profile</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl">
          Manage your account information, security settings, and communication preferences
        </p>
      </div>
      
      <div className="mb-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-8 w-full max-w-md grid grid-cols-4 h-auto">
            <TabsTrigger value="profile" className="flex items-center gap-1 py-2 data-[state=active]:shadow-md">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-1 py-2 data-[state=active]:shadow-md">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger value="api-keys" className="flex items-center gap-1 py-2 data-[state=active]:shadow-md">
              <Key className="h-4 w-4" />
              <span className="hidden sm:inline">API Keys</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-1 py-2 data-[state=active]:shadow-md">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <Card className="shadow-md border-muted/80">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Profile Information
                </CardTitle>
                <CardDescription>
                  Update your personal information and how it appears across services
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProfileForm />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security">
            <Card className="shadow-md border-muted/80">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LockKeyhole className="h-5 w-5 text-primary" />
                  Security Settings
                </CardTitle>
                <CardDescription>
                  Manage your account security and authentication preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Security features coming soon. You'll be able to manage passwords, 
                  two-factor authentication, and connected devices.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="api-keys">
            <Card className="shadow-md border-muted/80">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5 text-primary" />
                  AI Model API Keys
                </CardTitle>
                <CardDescription>
                  Manage your API keys for AI models used by Juris.ai to generate responses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ApiKeysForm />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card className="shadow-md border-muted/80">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>
                  Control how and when you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Notification settings coming soon. You'll be able to customize 
                  email notifications, app alerts, and more.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="mt-10">
        <Card className="bg-muted/30 border-muted/30 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Download className="h-4 w-4 text-muted-foreground" />
              Data & Privacy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Your information is securely stored and we respect your privacy.
              We only use this information to provide you with better services.
              You can request a copy of your data or delete your account at any time.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="container py-8 md:py-12 max-w-5xl mx-auto px-4">Loading profile...</div>}>
      <ProfileContent />
    </Suspense>
  );
} 