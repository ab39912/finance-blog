import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'A valid email is required.' }, { status: 400 });
    }

    const supabase = createClient();
    const { error } = await supabase
      .from('subscribers')
      .insert({ email: email.toLowerCase().trim() });

    if (error) {
      // Already subscribed? Return success — no need to leak that detail.
      if (error.code === '23505') {
        return NextResponse.json({ ok: true, alreadySubscribed: true });
      }
      console.error(error);
      return NextResponse.json({ error: 'Could not subscribe.' }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: 'Bad request.' }, { status: 400 });
  }
}
