import { NextRequest, NextResponse } from 'next/server';
import { getLegalAdvice, fetchRelevantCaseLaw, fetchRelevantStatutes } from '@/lib/ai-services';
import { withRateLimit } from '@/lib/security/rate-limiter';
import { validateLegalQuery, validateProvider, validateJurisdiction } from '@/lib/security/input-validation';
import { createClient } from '@/lib/supabase/server';

async function handlePOST(request: NextRequest) {
  try {
    // Authentication check
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { query, provider = 'mistral', jurisdiction = 'general' } = body;

    // Input validation
    const queryValidation = validateLegalQuery(query);
    if (!queryValidation.isValid) {
      return NextResponse.json(
        { error: 'Invalid query', details: queryValidation.errors },
        { status: 400 }
      );
    }

    const providerValidation = validateProvider(provider);
    if (!providerValidation.isValid) {
      return NextResponse.json(
        { error: 'Invalid provider', details: providerValidation.errors },
        { status: 400 }
      );
    }

    const jurisdictionValidation = validateJurisdiction(jurisdiction);
    if (!jurisdictionValidation.isValid) {
      return NextResponse.json(
        { error: 'Invalid jurisdiction', details: jurisdictionValidation.errors },
        { status: 400 }
      );
    }

    // Use sanitized inputs
    const sanitizedQuery = queryValidation.sanitized!;
    const sanitizedProvider = providerValidation.sanitized! as 'mistral' | 'gemini';
    const sanitizedJurisdiction = jurisdictionValidation.sanitized!;

    // Fetch legal data in parallel with AI advice
    const [advice, caseLaw, statutes] = await Promise.all([
      getLegalAdvice(sanitizedQuery, sanitizedProvider, sanitizedJurisdiction),
      fetchRelevantCaseLaw(sanitizedQuery, sanitizedJurisdiction),
      fetchRelevantStatutes(sanitizedQuery, sanitizedJurisdiction)
    ]);

    // Return the response with all data
    return NextResponse.json({ 
      advice,
      legalData: {
        caseLaw,
        statutes
      }
    });
  } catch (error: any) {
    console.error('Error in legal advice API:', error);
    
    // Don't expose internal error details in production
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    return NextResponse.json(
      { 
        error: 'Failed to process legal advice request',
        ...(isDevelopment && { details: error.message })
      },
      { status: 500 }
    );
  }
}

// Apply rate limiting to the POST handler
export const POST = withRateLimit(handlePOST);

// Add rate limiting headers
export const config = {
  api: {
    responseLimit: '8mb',
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
}; 