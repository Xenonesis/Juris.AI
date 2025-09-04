'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Eye, 
  Target, 
  Sliders, 
  Download, 
  RefreshCw, 
  AlertTriangle,
  CheckCircle,
  Info,
  Clock,
  Database
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useCookieConsent } from '@/hooks/useCookieConsent';
import { auditCookies, generateAuditSummary, exportAuditResults, CookieAuditResult } from '@/lib/security/cookie-audit';

export function CookieDashboard() {
  const { consentSettings, consentTimestamp, updateConsent } = useCookieConsent();
  const [auditResults, setAuditResults] = useState<CookieAuditResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    performAudit();
  }, []);

  const performAudit = async () => {
    setIsLoading(true);
    try {
      const results = auditCookies();
      setAuditResults(results);
    } catch (error) {
      console.error('Cookie audit failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportAudit = () => {
    const exportData = exportAuditResults(auditResults);
    const blob = new Blob([exportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cookie-audit-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const summary = generateAuditSummary(auditResults);

  const categoryIcons = {
    necessary: <Shield className="h-4 w-4" />,
    analytics: <Eye className="h-4 w-4" />,
    marketing: <Target className="h-4 w-4" />,
    preferences: <Sliders className="h-4 w-4" />,
    unknown: <AlertTriangle className="h-4 w-4" />,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Cookie Management Dashboard</h2>
          <p className="text-muted-foreground">
            Monitor and manage your cookie preferences and compliance status
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={performAudit} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh Audit
          </Button>
          <Button variant="outline" onClick={handleExportAudit}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Compliance Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Compliance Score
          </CardTitle>
          <CardDescription>
            Overall cookie compliance and security assessment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">{summary.complianceScore}%</span>
              <Badge variant={summary.complianceScore >= 80 ? 'default' : 'destructive'}>
                {summary.complianceScore >= 80 ? 'Good' : 'Needs Attention'}
              </Badge>
            </div>
            <Progress value={summary.complianceScore} className="w-full" />
            <p className="text-sm text-muted-foreground">
              Last audit: {summary.lastAuditDate.toLocaleString()}
            </p>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="cookies">Cookie Details</TabsTrigger>
          <TabsTrigger value="consent">Consent Status</TabsTrigger>
          <TabsTrigger value="issues">Issues & Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(summary.categoryCounts).map(([category, count]) => (
              <Card key={category}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    {categoryIcons[category as keyof typeof categoryIcons]}
                    <div>
                      <p className="text-sm font-medium capitalize">{category}</p>
                      <p className="text-2xl font-bold">{count}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Cookie Categories Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(summary.categoryCounts).map(([category, count]) => {
                  const percentage = (count / summary.totalCookies) * 100;
                  return (
                    <div key={category} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="capitalize">{category}</span>
                        <span>{count} ({percentage.toFixed(1)}%)</span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cookies" className="space-y-4">
          <div className="space-y-4">
            {auditResults.map((cookie, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                            {cookie.name}
                          </code>
                          <Badge variant={cookie.category === 'necessary' ? 'default' : 'secondary'}>
                            {cookie.category}
                          </Badge>
                          {cookie.isFirstParty && (
                            <Badge variant="outline">First-party</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{cookie.purpose}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>Size: {cookie.size} bytes</span>
                          <span>Domain: {cookie.domain}</span>
                          <span>Secure: {cookie.secure ? 'Yes' : 'No'}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {cookie.hasConsent ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        )}
                        {cookie.complianceIssues.length > 0 && (
                          <Badge variant="destructive">{cookie.complianceIssues.length} issues</Badge>
                        )}
                      </div>
                    </div>
                    {cookie.complianceIssues.length > 0 && (
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-xs font-medium text-destructive mb-1">Compliance Issues:</p>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          {cookie.complianceIssues.map((issue, issueIndex) => (
                            <li key={issueIndex}>• {issue}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="consent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Current Consent Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {consentSettings && (
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(consentSettings).map(([category, enabled]) => (
                    <div key={category} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        {categoryIcons[category as keyof typeof categoryIcons]}
                        <span className="capitalize font-medium">{category}</span>
                      </div>
                      <Badge variant={enabled ? 'default' : 'secondary'}>
                        {enabled ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
              {consentTimestamp && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Consent given on: {consentTimestamp.toLocaleString()}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="issues" className="space-y-4">
          {summary.issues.length > 0 && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Compliance Issues Found</AlertTitle>
              <AlertDescription>
                {summary.issues.length} issue(s) detected that may affect compliance.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            {summary.issues.map((issue, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                    <div>
                      <p className="font-medium">{issue}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {summary.recommendations.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {summary.recommendations.map((recommendation, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                        <span className="text-sm">{recommendation}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}