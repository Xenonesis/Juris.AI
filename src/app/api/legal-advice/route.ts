import { NextResponse } from 'next/server';
import { getLegalAdvice, fetchRelevantCaseLaw, fetchRelevantStatutes } from '@/lib/ai-services';

export async function POST(request: Request) {
  try {
    const { query, provider = 'mistral', jurisdiction = 'general' } = await request.json();

    // Validation
    if (!query || typeof query !== 'string' || query.trim() === '') {
      return NextResponse.json(
        { error: 'A valid legal query is required' },
        { status: 400 }
      );
    }

    // Provider validation
    if (provider !== 'mistral' && provider !== 'gemini') {
      return NextResponse.json(
        { error: 'Provider must be either "mistral" or "gemini"' },
        { status: 400 }
      );
    }

    // Fetch legal data in parallel with AI advice
    const [advice, caseLaw, statutes] = await Promise.all([
      getLegalAdvice(query, provider as 'mistral' | 'gemini', jurisdiction),
      fetchRelevantCaseLaw(query, jurisdiction),
      fetchRelevantStatutes(query, jurisdiction)
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
    return NextResponse.json(
      { error: 'Failed to process legal advice request', details: error.message },
      { status: 500 }
    );
  }
}

// Add rate limiting headers
export const config = {
  api: {
    responseLimit: '8mb',
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
}; 