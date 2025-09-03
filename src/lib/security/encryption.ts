/**
 * Encryption utilities for sensitive data
 */

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default-key-change-in-production';

/**
 * Simple encryption for API keys (use proper encryption in production)
 */
export function encryptApiKey(apiKey: string): string {
  if (!apiKey) return '';
  
  try {
    // Simple XOR encryption (replace with proper encryption like AES in production)
    const key = ENCRYPTION_KEY;
    let encrypted = '';
    
    for (let i = 0; i < apiKey.length; i++) {
      const keyChar = key.charCodeAt(i % key.length);
      const apiKeyChar = apiKey.charCodeAt(i);
      encrypted += String.fromCharCode(apiKeyChar ^ keyChar);
    }
    
    return Buffer.from(encrypted).toString('base64');
  } catch (error) {
    console.error('Encryption error:', error);
    return '';
  }
}

/**
 * Decrypt API keys
 */
export function decryptApiKey(encryptedApiKey: string): string {
  if (!encryptedApiKey) return '';
  
  try {
    const key = ENCRYPTION_KEY;
    const encrypted = Buffer.from(encryptedApiKey, 'base64').toString();
    let decrypted = '';
    
    for (let i = 0; i < encrypted.length; i++) {
      const keyChar = key.charCodeAt(i % key.length);
      const encryptedChar = encrypted.charCodeAt(i);
      decrypted += String.fromCharCode(encryptedChar ^ keyChar);
    }
    
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    return '';
  }
}

/**
 * Mask API key for display purposes
 */
export function maskApiKey(apiKey: string): string {
  if (!apiKey || apiKey.length < 8) return '***';
  
  const start = apiKey.substring(0, 4);
  const end = apiKey.substring(apiKey.length - 4);
  const middle = '*'.repeat(Math.max(4, apiKey.length - 8));
  
  return `${start}${middle}${end}`;
}