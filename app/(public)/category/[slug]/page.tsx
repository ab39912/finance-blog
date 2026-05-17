import Link from 'next/link';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { createClient } from '@/lib/supabase-server';
import type { Post } from '@/lib/types';

export const revalidate = 60;

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const supabase = createClient();
  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', params.slug)
    .single();

  if (!category) notFound();

  const { data: posts } = await supabase
    .from('posts')
    .select('*, category:categories(*)')
    .eq('category_id', category.id)
    .eq('published', true)
    .order('published_at', { ascending: false });

  const list = (posts ?? []) as Post[];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <header className="text-center pb-10 mb-10 border-b-2 border-ink">
        <div className="label-sans text-muted mb-3">Section</div>
        <h1 className="display-serif text-6xl md:text-8xl font-black tracking-tight leading-none">
          {category.name}
        </h1>
        {category.description && (
          <p className="body-serif text-lg italic text-muted mt-4">
            {category.description}
          </p>
        )}
      </header>

      {list.length === 0 ? (
        <p className="body-serif italic text-center text-muted py-20">
          No stories filed in this section yet.
        </p>
      ) : (
        <div className="grid md:grid-cols-3 gap-10">
          {list.map((p) => (
            <article key={p.id} className="border-t-2 border-ink pt-4">
              <Link href={`/post/${p.slug}`}>
                <h3 className="display-serif text-2xl font-bold leading-tight mb-2 hover:text-accent">
                  {p.title}
                </h3>
              </Link>
              {p.subtitle && (
                <p className="body-serif italic text-base text-muted mb-3 leading-snug">
                  {p.subtitle}
                </p>
              )}
              {p.excerpt && (
                <p className="body-serif text-base leading-relaxed mb-3">
                  {p.excerpt}
                </p>
              )}
              <div className="label-sans text-muted">
                {p.published_at && format(new Date(p.published_at), 'MMM d, yyyy')}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
