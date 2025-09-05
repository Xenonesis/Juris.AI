
# Terms Acceptance System Deployment Checklist

## Pre-deployment
- [ ] Run database migration: `sql/fix_terms_acceptance_schema.sql`
- [ ] Verify environment variables are set
- [ ] Test authentication flow in staging
- [ ] Verify all TypeScript compiles without errors

## Database Setup
```sql
-- Run this in your Supabase SQL editor or psql
\i sql/fix_terms_acceptance_schema.sql
```

## Testing Steps
1. **New User Flow**:
   - Go to `/auth/login`
   - Try to sign up without checking terms boxes (should fail)
   - Check boxes and sign up (should succeed)
   - Verify database records are created

2. **Existing User Flow**:
   - Sign in with existing account
   - Dialog should appear if terms not accepted
   - Test both accept and decline flows

3. **API Testing**:
   - Test `GET /api/auth/accept-terms` for status
   - Test `POST /api/auth/accept-terms` for acceptance

## Verification Commands
```bash
# Check TypeScript
npm run build

# Check for missing files
node scripts/test-terms-system.js

# Test API endpoints (requires running server)
curl -X GET http://localhost:3000/api/auth/accept-terms
```

## Rollback Plan
If issues occur:
1. Revert middleware changes
2. Disable terms checking temporarily
3. Fix issues and redeploy

## Monitoring
- Monitor authentication errors
- Check terms acceptance rates
- Verify no users are blocked from accessing the app
