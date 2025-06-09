// AI Model Configuration
export const AI_MODELS = {
  GPT: {
    name: 'gpt',
    displayName: 'GPT-4',
    baseAccuracy: 92,
    provider: 'openai' as const,
  },
  CLAUDE: {
    name: 'claude',
    displayName: 'Claude',
    baseAccuracy: 89,
    provider: 'anthropic' as const,
  },
  GEMINI: {
    name: 'gemini',
    displayName: 'Gemini',
    baseAccuracy: 87,
    provider: 'gemini' as const,
  },
  MISTRAL: {
    name: 'mistral',
    displayName: 'Mistral',
    baseAccuracy: 85,
    provider: 'mistral' as const,
  },
} as const;

// Jurisdiction Configuration
export const JURISDICTION_BASE_RANGES = {
  'us': { min: 40, max: 70 },
  'uk': { min: 35, max: 65 },
  'ca': { min: 45, max: 75 },
  'au': { min: 40, max: 70 },
  'in': { min: 30, max: 80 },
  'np': { min: 25, max: 65 },
  'cn': { min: 50, max: 70 },
  'eu': { min: 45, max: 65 },
} as const;

export const JURISDICTION_QUERY_WEIGHTS = {
  'us': { evidence: 12, deadline: -18 },
  'uk': { evidence: 10, deadline: -15 },
  'ca': { evidence: 15, deadline: -12 },
  'au': { evidence: 12, deadline: -15 },
  'in': { evidence: 18, deadline: -10 },
  'np': { evidence: 20, deadline: -8 },
  'cn': { evidence: 8, deadline: -20 },
  'eu': { evidence: 10, deadline: -12 },
} as const;

// Performance Metrics
export const PERFORMANCE_METRICS = {
  ACCURACY_WEIGHT: 0.4,
  RELEVANCE_WEIGHT: 0.3,
  REASONING_WEIGHT: 0.3,
  MIN_SCORE: 70,
  MAX_SCORE: 100,
  RANDOM_FACTOR_RANGE: 5,
} as const;

// UI Constants
export const ANIMATION_DELAYS = {
  HERO_TITLE: 0.3,
  HERO_SUBTITLE: 0.4,
  HERO_CONTROLS: 0.5,
  QUERY_INPUT: 0.4,
  RESULTS: 0.5,
} as const;

export const WARNING_AUTO_HIDE_DELAY = 10000;

// Type definitions
export type AIModelName = keyof typeof AI_MODELS;
export type JurisdictionCode = keyof typeof JURISDICTION_BASE_RANGES;
export type AIProvider = typeof AI_MODELS[AIModelName]['provider'];
