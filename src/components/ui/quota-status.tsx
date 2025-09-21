import React, { useState, useEffect } from 'react';
import { AlertTriangle, Clock, TrendingUp, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface QuotaStatus {
  used: number;
  limit: number;
  remaining: number;
  resetTime: number;
  percentUsed: number;
  provider: string;
}

interface QuotaStatusDisplayProps {
  apiKeys: Record<string, string>;
  className?: string;
}

export function QuotaStatusDisplay({ apiKeys, className = '' }: QuotaStatusDisplayProps) {
  const [quotaStatuses, setQuotaStatuses] = useState<QuotaStatus[]>([]);

  // Fetch quota status for all providers
  const fetchQuotaStatus = React.useCallback(async () => {
    if (!apiKeys.gemini) return;
    
    try {
      // Call an API endpoint to get quota status
      const response = await fetch('/api/quota-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ providers: ['gemini'] })
      });
      
      if (response.ok) {
        const data = await response.json();
        setQuotaStatuses(data.quotas || []);
      }
    } catch (error) {
      console.error('Failed to fetch quota status:', error);
    }
  }, [apiKeys.gemini]);

  useEffect(() => {
    fetchQuotaStatus();
    // Refresh every 5 minutes
    const interval = setInterval(fetchQuotaStatus, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchQuotaStatus]);

  // Format time remaining
  const formatTimeRemaining = (resetTime: number) => {
    const now = Date.now();
    const remaining = Math.max(0, resetTime - now);
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m`;
    }
    return 'Soon';
  };

  // Get alert variant based on usage percentage
  const getAlertVariant = (percentUsed: number) => {
    if (percentUsed >= 90) return 'destructive';
    if (percentUsed >= 75) return 'warning';
    return 'default';
  };

  if (!apiKeys.gemini || quotaStatuses.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {quotaStatuses.map((status) => (
        <Alert 
          key={status.provider} 
          variant={getAlertVariant(status.percentUsed)}
          className="relative"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                {status.percentUsed >= 90 ? (
                  <AlertTriangle className="h-4 w-4" />
                ) : (
                  <TrendingUp className="h-4 w-4" />
                )}
                <span className="font-medium">
                  {status.provider.charAt(0).toUpperCase() + status.provider.slice(1)} API Quota
                </span>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 opacity-70" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Free tier allows {status.limit} requests per day</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant={status.percentUsed >= 90 ? 'destructive' : 'secondary'}>
                {status.used}/{status.limit}
              </Badge>
              {status.percentUsed >= 75 && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>Resets in {formatTimeRemaining(status.resetTime)}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Usage: {status.percentUsed}%</span>
              <span>{status.remaining} requests remaining</span>
            </div>
            <Progress 
              value={status.percentUsed} 
              className="h-2"
            />
          </div>
          
          {status.percentUsed >= 90 && (
            <AlertDescription className="mt-3 text-sm">
              <strong>Quota almost exhausted!</strong> Consider switching to another AI model or adding your own API key.
            </AlertDescription>
          )}
          
          {status.percentUsed >= 100 && (
            <AlertDescription className="mt-3 text-sm">
              <strong>Quota exceeded!</strong> Switch to Mistral, OpenAI, or Claude for continued service.
            </AlertDescription>
          )}
        </Alert>
      ))}
    </div>
  );
}