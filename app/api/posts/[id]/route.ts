import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

  try {
    const body = await request.json();
    const update: any = {
      title: body.title,
      subtitle: body.subtitle || null,
      content: body.content,
      excerpt: body.excerpt || null,
      category_id: body.category_id || null,
      tags: Array.isArray(body.tags) ? body.tags : [],
      cover_image: body.cover_image || null,
      updated_at: new Date().toISOString(),
    };
    if (typeof body.published === 'boolean') {
      update.published = body.published;
      // If we're publishing for the first time, stamp published_at
      if (body.published) {
        const { data: current } = await auth.supabase
          .from('posts')
          .select('published_at')
          .eq('id', params.id)
          .single();
        if (!current?.published_at) update.published_at = new Date().toISOString();
      }
    }

    const { error } = await auth.supabase.from('posts').update(update).eq('id', params.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Bad request.' }, { status: 400 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });
  const { error } = await auth.supabase.from('posts').delete().eq('id', params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
