import { NextResponse } from 'next/server';
import supabase from '@/lib/supabase';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = cookies();
  
  const { data: { session } } = await supabase.auth.getSession();
  
  return NextResponse.json({ 
    user: session?.user || null 
  }, { status: 200 });
}

export async function POST(request: Request) {
  const { action } = await request.json();
  
  if (action === 'signout') {
    await supabase.auth.signOut();
    return NextResponse.json({ success: true }, { status: 200 });
  }
  
  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
} 