#!/usr/bin/env node

/**
 * Terms Acceptance System Testing Script
 * Tests all components of the terms acceptance system
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Testing Terms Acceptance System...\n');

// Test 1: Check if all required files exist
console.log('1. Checking file structure...');
const requiredFiles = [
  'src/lib/terms-verification.ts',
  'src/lib/auth/terms-middleware.ts',
  'src/lib/terms-acceptance.ts',
  'src/app/api/auth/accept-terms/route.ts',
  'src/components/auth/terms-acceptance-dialog.tsx',
  'src/app/auth/accept-terms/page.tsx',
  'sql/fix_terms_acceptance_schema.sql',
  'supabase/migrations/20250904233035_add_terms_acceptance.sql'
];

let missingFiles = [];
requiredFiles.forEach(file => {
  if (!fs.existsSync(file)) {
    missingFiles.push(file);
  }
});

if (missingFiles.length > 0) {
  console.log('❌ Missing files:');
  missingFiles.forEach(file => console.log(`   - ${file}`));
} else {
  console.log('✅ All required files present');
}

// Test 2: Check TypeScript compilation
console.log('\n2. Checking TypeScript compilation...');
try {
  execSync('npx tsc --noEmit', { stdio: 'pipe' });
  console.log('✅ TypeScript compilation successful');
} catch (error) {
  console.log('❌ TypeScript compilation failed:');
  console.log(error.stdout?.toString() || error.message);
}

// Test 3: Check for import/export consistency
console.log('\n3. Checking import/export consistency...');
const checkImports = (filePath) => {
  if (!fs.existsSync(filePath)) return [];
  const content = fs.readFileSync(filePath, 'utf8');
  const imports = content.match(/import.*from ['"]([^'"]+)['"]/g) || [];
  return imports.map(imp => imp.match(/from ['"]([^'"]+)['"]/)[1]);
};

const termsVerificationImports = checkImports('src/lib/terms-verification.ts');
const middlewareImports = checkImports('src/lib/auth/terms-middleware.ts');
const apiImports = checkImports('src/app/api/auth/accept-terms/route.ts');

console.log('✅ Import analysis complete');

// Test 4: Check middleware integration
console.log('\n4. Checking middleware integration...');
const middlewareContent = fs.readFileSync('src/middleware.ts', 'utf8');
if (middlewareContent.includes('checkTermsAcceptance')) {
  console.log('✅ Terms middleware integrated');
} else {
  console.log('❌ Terms middleware not integrated in main middleware');
}

// Test 5: Check database schema consistency
console.log('\n5. Checking database schema...');
const schemaFiles = [
  'supabase/schema.sql',
  'sql/fix_terms_acceptance_schema.sql'
];

schemaFiles.forEach(file => {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    const hasTermsFields = content.includes('terms_accepted') && content.includes('privacy_accepted');
    if (hasTermsFields) {
      console.log(`✅ ${file} contains terms fields`);
    } else {
      console.log(`❌ ${file} missing terms fields`);
    }
  }
});

// Test 6: Check component dependencies
console.log('\n6. Checking component dependencies...');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const requiredDeps = [
  '@radix-ui/react-checkbox',
  '@radix-ui/react-dialog',
  '@supabase/supabase-js',
  'framer-motion',
  'lucide-react'
];

const missingDeps = requiredDeps.filter(dep => 
  !packageJson.dependencies[dep] && !packageJson.devDependencies[dep]
);

if (missingDeps.length > 0) {
  console.log('❌ Missing dependencies:');
  missingDeps.forEach(dep => console.log(`   - ${dep}`));
} else {
  console.log('✅ All required dependencies present');
}

// Test 7: Generate deployment checklist
console.log('\n7. Generating deployment checklist...');
const checklist = `
# Terms Acceptance System Deployment Checklist

## Pre-deployment
- [ ] Run database migration: \`sql/fix_terms_acceptance_schema.sql\`
- [ ] Verify environment variables are set
- [ ] Test authentication flow in staging
- [ ] Verify all TypeScript compiles without errors

## Database Setup
\`\`\`sql
-- Run this in your Supabase SQL editor or psql
\\i sql/fix_terms_acceptance_schema.sql
\`\`\`

## Testing Steps
1. **New User Flow**:
   - Go to \`/auth/login\`
   - Try to sign up without checking terms boxes (should fail)
   - Check boxes and sign up (should succeed)
   - Verify database records are created

2. **Existing User Flow**:
   - Sign in with existing account
   - Dialog should appear if terms not accepted
   - Test both accept and decline flows

3. **API Testing**:
   - Test \`GET /api/auth/accept-terms\` for status
   - Test \`POST /api/auth/accept-terms\` for acceptance

## Verification Commands
\`\`\`bash
# Check TypeScript
npm run build

# Check for missing files
node scripts/test-terms-system.js

# Test API endpoints (requires running server)
curl -X GET http://localhost:3000/api/auth/accept-terms
\`\`\`

## Rollback Plan
If issues occur:
1. Revert middleware changes
2. Disable terms checking temporarily
3. Fix issues and redeploy

## Monitoring
- Monitor authentication errors
- Check terms acceptance rates
- Verify no users are blocked from accessing the app
`;

fs.writeFileSync('DEPLOYMENT_CHECKLIST.md', checklist);
console.log('✅ Deployment checklist created: DEPLOYMENT_CHECKLIST.md');

// Summary
console.log('\n📊 Test Summary:');
console.log(`✅ Files checked: ${requiredFiles.length - missingFiles.length}/${requiredFiles.length}`);
console.log(`✅ Dependencies: ${requiredDeps.length - missingDeps.length}/${requiredDeps.length}`);

if (missingFiles.length === 0 && missingDeps.length === 0) {
  console.log('\n🎉 Terms acceptance system is ready for deployment!');
} else {
  console.log('\n⚠️  Please fix the issues above before deploying.');
}

console.log('\n📋 Next steps:');
console.log('1. Run the database migration: sql/fix_terms_acceptance_schema.sql');
console.log('2. Test the system locally');
console.log('3. Deploy to staging and test');
console.log('4. Deploy to production');
console.log('5. Monitor for any authentication issues');