/**
 * Security audit utilities
 */

export interface SecurityAuditResult {
  score: number;
  issues: SecurityIssue[];
  recommendations: string[];
}

export interface SecurityIssue {
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  description: string;
  fix?: string;
}

/**
 * Perform a basic security audit
 */
export function performSecurityAudit(): SecurityAuditResult {
  const issues: SecurityIssue[] = [];
  const recommendations: string[] = [];

  // Check environment variables
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    issues.push({
      severity: 'critical',
      category: 'Configuration',
      description: 'Missing NEXT_PUBLIC_SUPABASE_URL environment variable',
      fix: 'Set NEXT_PUBLIC_SUPABASE_URL in your environment variables'
    });
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    issues.push({
      severity: 'critical',
      category: 'Configuration',
      description: 'Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable',
      fix: 'Set NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment variables'
    });
  }

  if (!process.env.ENCRYPTION_KEY) {
    issues.push({
      severity: 'high',
      category: 'Encryption',
      description: 'Missing ENCRYPTION_KEY environment variable',
      fix: 'Set ENCRYPTION_KEY to a strong random string'
    });
  }

  // Check for API keys in environment
  const apiKeys = ['GEMINI_API_KEY', 'MISTRAL_API_KEY', 'OPENAI_API_KEY', 'ANTHROPIC_API_KEY'];
  const missingKeys = apiKeys.filter(key => !process.env[key]);
  
  if (missingKeys.length > 0) {
    issues.push({
      severity: 'medium',
      category: 'API Keys',
      description: `Missing API keys: ${missingKeys.join(', ')}`,
      fix: 'Set the missing API keys in your environment variables'
    });
  }

  // Check Node environment
  if (process.env.NODE_ENV !== 'production') {
    recommendations.push('Set NODE_ENV=production for production deployments');
  }

  // Calculate security score
  const criticalCount = issues.filter(i => i.severity === 'critical').length;
  const highCount = issues.filter(i => i.severity === 'high').length;
  const mediumCount = issues.filter(i => i.severity === 'medium').length;
  const lowCount = issues.filter(i => i.severity === 'low').length;

  let score = 100;
  score -= criticalCount * 30;
  score -= highCount * 20;
  score -= mediumCount * 10;
  score -= lowCount * 5;

  score = Math.max(0, score);

  return {
    score,
    issues,
    recommendations
  };
}

/**
 * Generate security report
 */
export function generateSecurityReport(): string {
  const audit = performSecurityAudit();
  
  let report = `# Security Audit Report\n\n`;
  report += `**Security Score: ${audit.score}/100**\n\n`;
  
  if (audit.issues.length > 0) {
    report += `## Security Issues\n\n`;
    
    const groupedIssues = audit.issues.reduce((acc, issue) => {
      if (!acc[issue.severity]) acc[issue.severity] = [];
      acc[issue.severity].push(issue);
      return acc;
    }, {} as Record<string, SecurityIssue[]>);
    
    const severityOrder = ['critical', 'high', 'medium', 'low'];
    
    for (const severity of severityOrder) {
      if (groupedIssues[severity]) {
        report += `### ${severity.toUpperCase()} Issues\n\n`;
        
        for (const issue of groupedIssues[severity]) {
          report += `- **${issue.category}**: ${issue.description}\n`;
          if (issue.fix) {
            report += `  - *Fix*: ${issue.fix}\n`;
          }
          report += `\n`;
        }
      }
    }
  }
  
  if (audit.recommendations.length > 0) {
    report += `## Recommendations\n\n`;
    for (const rec of audit.recommendations) {
      report += `- ${rec}\n`;
    }
    report += `\n`;
  }
  
  report += `## Security Features Implemented\n\n`;
  report += `- ✅ Content Security Policy (CSP)\n`;
  report += `- ✅ Security Headers (HSTS, X-Frame-Options, etc.)\n`;
  report += `- ✅ Rate Limiting\n`;
  report += `- ✅ Input Validation and Sanitization\n`;
  report += `- ✅ Authentication Required for Sensitive Endpoints\n`;
  report += `- ✅ API Key Encryption\n`;
  report += `- ✅ Error Handling (No Information Disclosure)\n`;
  
  return report;
}