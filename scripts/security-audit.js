#!/usr/bin/env node

/**
 * Security audit script for Juris.AI
 * Run with: node scripts/security-audit.js
 */

const fs = require('fs');
const path = require('path');

function checkFile(filePath, patterns) {
  if (!fs.existsSync(filePath)) {
    return { exists: false, issues: [] };
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const issues = [];

  for (const pattern of patterns) {
    if (pattern.regex.test(content)) {
      issues.push({
        severity: pattern.severity,
        description: pattern.description,
        line: content.split('\n').findIndex(line => pattern.regex.test(line)) + 1
      });
    }
  }

  return { exists: true, issues };
}

function auditSecurity() {
  console.log('🔒 Running Security Audit for Juris.AI\n');

  const issues = [];
  
  // Check for hardcoded secrets
  const secretPatterns = [
    {
      regex: /sk-[a-zA-Z0-9]{32,}/g,
      severity: 'CRITICAL',
      description: 'Potential OpenAI API key found'
    },
    {
      regex: /sk-ant-[a-zA-Z0-9-_]{32,}/g,
      severity: 'CRITICAL', 
      description: 'Potential Anthropic API key found'
    },
    {
      regex: /AIza[a-zA-Z0-9_-]{35}/g,
      severity: 'CRITICAL',
      description: 'Potential Google API key found'
    },
    {
      regex: /eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/g,
      severity: 'HIGH',
      description: 'Potential JWT token found'
    }
  ];

  // Files to check
  const filesToCheck = [
    'src/lib/ai-services.ts',
    'src/lib/supabase/client.ts',
    'src/lib/supabase/server.ts',
    'src/lib/supabase/middleware.ts',
    'src/lib/legal-apis.ts'
  ];

  for (const file of filesToCheck) {
    const result = checkFile(file, secretPatterns);
    if (result.exists && result.issues.length > 0) {
      issues.push(...result.issues.map(issue => ({ ...issue, file })));
    }
  }

  // Check environment configuration
  const envExample = '.env.example';
  if (!fs.existsSync(envExample)) {
    issues.push({
      severity: 'MEDIUM',
      description: 'Missing .env.example file',
      file: envExample
    });
  }

  // Check security headers in Next.js config
  const nextConfigResult = checkFile('next.config.js', [
    {
      regex: /Content-Security-Policy/,
      severity: 'INFO',
      description: 'CSP header found'
    },
    {
      regex: /X-Frame-Options/,
      severity: 'INFO', 
      description: 'X-Frame-Options header found'
    }
  ]);

  // Report results
  console.log('📊 Security Audit Results\n');
  
  const criticalIssues = issues.filter(i => i.severity === 'CRITICAL');
  const highIssues = issues.filter(i => i.severity === 'HIGH');
  const mediumIssues = issues.filter(i => i.severity === 'MEDIUM');
  
  if (issues.length === 0) {
    console.log('✅ No security issues found!');
  } else {

    if (criticalIssues.length > 0) {
      console.log('🚨 CRITICAL ISSUES:');
      criticalIssues.forEach(issue => {
        console.log(`   ${issue.file}:${issue.line || '?'} - ${issue.description}`);
      });
      console.log();
    }

    if (highIssues.length > 0) {
      console.log('⚠️  HIGH ISSUES:');
      highIssues.forEach(issue => {
        console.log(`   ${issue.file}:${issue.line || '?'} - ${issue.description}`);
      });
      console.log();
    }

    if (mediumIssues.length > 0) {
      console.log('📋 MEDIUM ISSUES:');
      mediumIssues.forEach(issue => {
        console.log(`   ${issue.file}:${issue.line || '?'} - ${issue.description}`);
      });
      console.log();
    }
  }

  // Security recommendations
  console.log('💡 Security Recommendations:\n');
  console.log('1. Ensure all API keys are stored in environment variables');
  console.log('2. Use HTTPS in production');
  console.log('3. Regularly rotate API keys');
  console.log('4. Monitor for suspicious activity');
  console.log('5. Keep dependencies updated');
  console.log('6. Use rate limiting on all API endpoints');
  console.log('7. Implement proper error handling');
  console.log('8. Use Content Security Policy (CSP)');

  const score = Math.max(0, 100 - (criticalIssues.length * 30) - (highIssues.length * 20) - (mediumIssues.length * 10));
  console.log(`\n🎯 Security Score: ${score}/100`);

  if (criticalIssues.length > 0) {
    process.exit(1);
  }
}

auditSecurity();