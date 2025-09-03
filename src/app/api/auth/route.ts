import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { withRateLimit } from '@/lib/security/rate-limiter';

async function handleGET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Auth session error:', error);
      return NextResponse.json({ user: null }, { status: 200 });
    }
    
    return NextResponse.json({ 
      user: session?.user || null 
    }, { status: 200 });
  } catch (error) {
    console.error('Auth GET error:', error);
    return NextResponse.json({ user: null }, { status: 200 });
  }
}

async function handlePOST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;
    
    if (!action || typeof action !== 'string') {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
    
    const supabase = await createClient();
    
    if (action === 'signout') {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Signout error:', error);
        return NextResponse.json({ error: 'Failed to sign out' }, { status: 500 });
      }
      
      return NextResponse.json({ success: true }, { status: 200 });
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Auth POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Apply rate limiting
export const GET = withRateLimit(handleGET);
export const POST = withRateLimit(handlePOST); 