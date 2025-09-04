"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Zap, 
  Brain, 
  Shield, 
  Palette, 
  Volume2, 
  VolumeX,
  Eye,
  EyeOff,
  Smartphone,
  Monitor
} from "lucide-react";
import { motion } from "framer-motion";

export function QuickSettings() {
  const [settings, setSettings] = useState({
    aiAssistance: true,
    smartSuggestions: true,
    soundEffects: false,
    compactMode: false,
    highContrast: false,
    mobileOptimized: true,
    autoSave: true,
    betaFeatures: false
  });

  const updateSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const settingsGroups = [
    {
      title: "AI & Intelligence",
      icon: <Brain className="h-4 w-4" />,
      items: [
        {
          key: "aiAssistance" as const,
          label: "Enhanced AI Assistance",
          description: "Get smarter suggestions and contextual help",
          icon: <Zap className="h-4 w-4 text-yellow-500" />
        },
        {
          key: "smartSuggestions" as const,
          label: "Smart Query Suggestions",
          description: "AI-powered query completion and suggestions",
          icon: <Brain className="h-4 w-4 text-purple-500" />
        }
      ]
    },
    {
      title: "Interface & Experience",
      icon: <Palette className="h-4 w-4" />,
      items: [
        {
          key: "soundEffects" as const,
          label: "Sound Effects",
          description: "Audio feedback for interactions",
          icon: settings.soundEffects ? <Volume2 className="h-4 w-4 text-blue-500" /> : <VolumeX className="h-4 w-4 text-gray-400" />
        },
        {
          key: "compactMode" as const,
          label: "Compact Mode",
          description: "Denser layout for more content",
          icon: <Monitor className="h-4 w-4 text-green-500" />
        },
        {
          key: "highContrast" as const,
          label: "High Contrast",
          description: "Enhanced visibility and accessibility",
          icon: settings.highContrast ? <Eye className="h-4 w-4 text-orange-500" /> : <EyeOff className="h-4 w-4 text-gray-400" />
        }
      ]
    },
    {
      title: "Performance & Data",
      icon: <Shield className="h-4 w-4" />,
      items: [
        {
          key: "mobileOptimized" as const,
          label: "Mobile Optimization",
          description: "Optimized performance for mobile devices",
          icon: <Smartphone className="h-4 w-4 text-indigo-500" />
        },
        {
          key: "autoSave" as const,
          label: "Auto-Save",
          description: "Automatically save your work and preferences",
          icon: <Shield className="h-4 w-4 text-emerald-500" />
        }
      ]
    }
  ];

  return (
    <Card className="shadow-xl border-muted/50 bg-card/80 backdrop-blur-sm overflow-hidden">
      <CardHeader className="border-b border-muted/30 bg-gradient-to-r from-muted/20 to-transparent">
        <CardTitle className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="text-xl font-semibold">Quick Settings</div>
            <p className="text-sm text-muted-foreground font-normal">
              Customize your Juris.AI experience with these quick toggles
            </p>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        {settingsGroups.map((group, groupIndex) => (
          <motion.div
            key={group.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: groupIndex * 0.1 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2">
              {group.icon}
              <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                {group.title}
              </h4>
            </div>
            
            <div className="space-y-3">
              {group.items.map((item, itemIndex) => (
                <motion.div
                  key={item.key}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (groupIndex * 0.1) + (itemIndex * 0.05) }}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start gap-3 flex-1">
                    <div className="mt-0.5">
                      {item.icon}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Label 
                          htmlFor={item.key} 
                          className="text-sm font-medium cursor-pointer"
                        >
                          {item.label}
                        </Label>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  
                  <Switch
                    id={item.key}
                    checked={settings[item.key]}
                    onCheckedChange={() => updateSetting(item.key)}
                  />
                </motion.div>
              ))}
            </div>
            
            {groupIndex < settingsGroups.length - 1 && (
              <Separator className="my-4" />
            )}
          </motion.div>
        ))}
        
        {/* Beta Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-4 rounded-xl bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 border border-orange-200 dark:border-orange-800"
        >
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Label className="text-sm font-medium">Beta Features</Label>
                <Badge variant="outline" className="text-xs">
                  Experimental
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Enable experimental features and early access to new capabilities
              </p>
            </div>
            <Switch
              checked={settings.betaFeatures}
              onCheckedChange={() => updateSetting('betaFeatures')}
            />
          </div>
        </motion.div>
        
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 pt-4">
          <Button variant="outline" size="sm" className="gap-2">
            <Shield className="h-4 w-4" />
            Reset to Defaults
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Zap className="h-4 w-4" />
            Import Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
