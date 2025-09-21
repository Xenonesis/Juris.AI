interface QuotaEntry {
  count: number;
  resetTime: number;
  dailyLimit: number;
}

interface QuotaConfig {
  gemini: {
    free: { limit: number; windowMs: number };
    paid: { limit: number; windowMs: number };
  };
}

// Quota tracking store (use Redis in production)
const quotaStore = new Map<string, QuotaEntry>();

// Quota configurations for different API tiers
const QUOTA_CONFIG: QuotaConfig = {
  gemini: {
    free: { limit: 50, windowMs: 24 * 60 * 60 * 1000 }, // 50 requests per day
    paid: { limit: 1500, windowMs: 60 * 1000 }, // 1500 requests per minute for paid tier
  },
};

/**
 * Check if a request can be made within quota limits
 */
export function checkQuota(
  provider: 'gemini', 
  apiKey: string,
  tier: 'free' | 'paid' = 'free'
): {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  retryAfter?: number;
} {
  const now = Date.now();
  const config = QUOTA_CONFIG[provider][tier];
  const key = `quota:${provider}:${apiKey.slice(-8)}`; // Use last 8 chars for anonymity
  
  // Clean up expired entries
  if (quotaStore.size > 1000) {
    for (const [k, v] of quotaStore.entries()) {
      if (v.resetTime < now) {
        quotaStore.delete(k);
      }
    }
  }
  
  let entry = quotaStore.get(key);
  
  if (!entry || entry.resetTime < now) {
    // Create new entry or reset expired entry
    entry = {
      count: 0,
      resetTime: now + config.windowMs,
      dailyLimit: config.limit,
    };
    quotaStore.set(key, entry);
  }
  
  const remaining = Math.max(0, entry.dailyLimit - entry.count);
  
  if (entry.count >= entry.dailyLimit) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime,
      retryAfter: Math.ceil((entry.resetTime - now) / 1000),
    };
  }
  
  return {
    allowed: true,
    remaining: remaining - 1, // Account for the current request
    resetTime: entry.resetTime,
  };
}

/**
 * Record a successful API call for quota tracking
 */
export function recordQuotaUsage(
  provider: 'gemini', 
  apiKey: string,
  tier: 'free' | 'paid' = 'free'
): void {
  const now = Date.now();
  const config = QUOTA_CONFIG[provider][tier];
  const key = `quota:${provider}:${apiKey.slice(-8)}`;
  
  let entry = quotaStore.get(key);
  
  if (!entry || entry.resetTime < now) {
    entry = {
      count: 1,
      resetTime: now + config.windowMs,
      dailyLimit: config.limit,
    };
  } else {
    entry.count++;
  }
  
  quotaStore.set(key, entry);
}

/**
 * Get current quota status for a provider
 */
export function getQuotaStatus(
  provider: 'gemini',
  apiKey: string,
  tier: 'free' | 'paid' = 'free'
): {
  used: number;
  limit: number;
  remaining: number;
  resetTime: number;
  percentUsed: number;
} {
  const now = Date.now();
  const config = QUOTA_CONFIG[provider][tier];
  const key = `quota:${provider}:${apiKey.slice(-8)}`;
  
  const entry = quotaStore.get(key);
  
  if (!entry || entry.resetTime < now) {
    return {
      used: 0,
      limit: config.limit,
      remaining: config.limit,
      resetTime: now + config.windowMs,
      percentUsed: 0,
    };
  }
  
  const remaining = Math.max(0, entry.dailyLimit - entry.count);
  const percentUsed = Math.round((entry.count / entry.dailyLimit) * 100);
  
  return {
    used: entry.count,
    limit: entry.dailyLimit,
    remaining,
    resetTime: entry.resetTime,
    percentUsed,
  };
}

/**
 * Determine if an API key is likely free tier based on usage patterns
 */
export function detectApiTier(apiKey: string): 'free' | 'paid' {
  // Simple heuristic: if we've seen more than 50 requests in a day, likely paid
  const key = `quota:gemini:${apiKey.slice(-8)}`;
  const entry = quotaStore.get(key);
  
  if (entry && entry.count > 50) {
    return 'paid';
  }
  
  return 'free'; // Default to free tier
}