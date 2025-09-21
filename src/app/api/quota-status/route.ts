import { NextRequest, NextResponse } from 'next/server';
import { getQuotaStatus } from '@/lib/quota-manager';
import { getUserApiKeys } from '@/lib/api-key-service';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
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
    const { providers } = body;

    if (!Array.isArray(providers)) {
      return NextResponse.json(
        { error: 'Providers must be an array' },
        { status: 400 }
      );
    }

    // Get user's API keys
    const userApiKeys = await getUserApiKeys(user.id);
    const quotas = [];

    // Check quota for each requested provider
    for (const provider of providers) {
      if (provider === 'gemini' && userApiKeys.gemini) {
        const status = getQuotaStatus('gemini', userApiKeys.gemini);
        quotas.push({
          provider: 'gemini',
          ...status
        });
      }
    }

    return NextResponse.json({ quotas });
  } catch (error) {
    console.error('Error fetching quota status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quota status' },
      { status: 500 }
    );
  }
}