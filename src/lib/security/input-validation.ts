import DOMPurify from 'isomorphic-dompurify';

/**
 * Input validation and sanitization utilities
 */

export interface ValidationResult {
  isValid: boolean;
  sanitized?: string;
  errors: string[];
}

/**
 * Sanitize HTML content to prevent XSS
 */
export function sanitizeHtml(input: string): string {
  if (typeof input !== 'string') return '';
  
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
    ALLOWED_ATTR: [],
  });
}

/**
 * Validate and sanitize legal query input
 */
export function validateLegalQuery(query: unknown): ValidationResult {
  const errors: string[] = [];
  
  // Type check
  if (typeof query !== 'string') {
    errors.push('Query must be a string');
    return { isValid: false, errors };
  }
  
  // Length validation
  if (query.length === 0) {
    errors.push('Query cannot be empty');
  }
  
  if (query.length > 5000) {
    errors.push('Query is too long (maximum 5000 characters)');
  }
  
  // Content validation
  const sanitized = sanitizeHtml(query.trim());
  
  // Check for potential injection attempts
  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /data:text\/html/i,
    /vbscript:/i,
  ];
  
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(query)) {
      errors.push('Query contains potentially malicious content');
      break;
    }
  }
  
  return {
    isValid: errors.length === 0,
    sanitized,
    errors,
  };
}

/**
 * Validate API provider
 */
export function validateProvider(provider: unknown): ValidationResult {
  const errors: string[] = [];
  const validProviders = ['mistral', 'gemini', 'openai', 'anthropic'];
  
  if (typeof provider !== 'string') {
    errors.push('Provider must be a string');
    return { isValid: false, errors };
  }
  
  if (!validProviders.includes(provider)) {
    errors.push(`Provider must be one of: ${validProviders.join(', ')}`);
  }
  
  return {
    isValid: errors.length === 0,
    sanitized: provider,
    errors,
  };
}

/**
 * Validate jurisdiction
 */
export function validateJurisdiction(jurisdiction: unknown): ValidationResult {
  const errors: string[] = [];
  const validJurisdictions = [
    'general', 'us', 'uk', 'eu', 'canada', 'australia', 'india', 'nepal', 'china'
  ];
  
  if (typeof jurisdiction !== 'string') {
    errors.push('Jurisdiction must be a string');
    return { isValid: false, errors };
  }
  
  if (!validJurisdictions.includes(jurisdiction)) {
    errors.push(`Jurisdiction must be one of: ${validJurisdictions.join(', ')}`);
  }
  
  return {
    isValid: errors.length === 0,
    sanitized: jurisdiction,
    errors,
  };
}

/**
 * Validate API key format
 */
export function validateApiKey(apiKey: unknown, provider: string): ValidationResult {
  const errors: string[] = [];
  
  if (typeof apiKey !== 'string') {
    errors.push('API key must be a string');
    return { isValid: false, errors };
  }
  
  // Basic format validation based on provider
  switch (provider) {
    case 'openai':
      if (!apiKey.startsWith('sk-')) {
        errors.push('OpenAI API key must start with "sk-"');
      }
      break;
    case 'anthropic':
      if (!apiKey.startsWith('sk-ant-')) {
        errors.push('Anthropic API key must start with "sk-ant-"');
      }
      break;
    case 'gemini':
      if (apiKey.length < 30) {
        errors.push('Gemini API key appears to be too short');
      }
      break;
    case 'mistral':
      if (apiKey.length < 20) {
        errors.push('Mistral API key appears to be too short');
      }
      break;
  }
  
  return {
    isValid: errors.length === 0,
    sanitized: apiKey,
    errors,
  };
}