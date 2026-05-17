import { NextResponse } from 'next/server';
import slugify from 'slugify';
import { requireAdmin } from '@/lib/auth';

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

  try {
    const body = await request.json();
    const { title, subtitle, content, excerpt, category_id, tags, cover_image, published } = body;
    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required.' }, { status: 400 });
    }

    const baseSlug = slugify(title, { lower: true, strict: true });
    // Make sure the slug is unique
    let slug = baseSlug;
    let counter = 1;
    while (true) {
      const { data: existing } = await auth.supabase
        .from('posts')
        .select('id')
        .eq('slug', slug)
        .maybeSingle();
      if (!existing) break;
      counter += 1;
      slug = `${baseSlug}-${counter}`;
    }

    const { data, error } = await auth.supabase
      .from('posts')
      .insert({
        slug,
        title,
        subtitle: subtitle || null,
        content,
        excerpt: excerpt || null,
        category_id: category_id || null,
        tags: Array.isArray(tags) ? tags : [],
        cover_image: cover_image || null,
        author_email: auth.user.email!,
        published: !!published,
        published_at: published ? new Date().toISOString() : null,
      })
      .select()
      .single();

    if (error) {
      console.error(error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true, post: data });
  } catch (e: any) {
    return NextResponse.json({ error: 'Bad request.' }, { status: 400 });
  }
}
