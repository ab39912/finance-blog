import Link from 'next/link';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { createClient } from '@/lib/supabase-server';
import { NewsletterForm } from '@/components/NewsletterForm';
import type { Post } from '@/lib/types';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const supabase = createClient();
  const { data } = await supabase
    .from('posts')
    .select('title, excerpt, subtitle')
    .eq('slug', params.slug)
    .eq('published', true)
    .single();
  if (!data) return { title: 'Not found' };
  return {
    title: data.title,
    description: data.excerpt || data.subtitle || '',
  };
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const supabase = createClient();
  const { data: post } = await supabase
    .from('posts')
    .select('*, category:categories(*)')
    .eq('slug', params.slug)
    .eq('published', true)
    .single();

  if (!post) notFound();
  const p = post as Post;

  const { data: more } = await supabase
    .from('posts')
    .select('id, slug, title, excerpt, published_at, category:categories(name, slug)')
    .eq('published', true)
    .neq('id', p.id)
    .order('published_at', { ascending: false })
    .limit(3);

  return (
    <article className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid md:grid-cols-12 gap-12">
        <div className="md:col-span-8 md:col-start-3">
          {/* Category line */}
          {p.category && (
            <div className="text-center mb-6">
              <Link
                href={`/category/${p.category.slug}`}
                className="label-sans text-accent hover:underline"
              >
                {p.category.name}
              </Link>
            </div>
          )}

          {/* Headline */}
          <h1 className="display-serif text-4xl md:text-6xl font-black leading-[1.0] tracking-tight text-center mb-6">
            {p.title}
          </h1>

          {p.subtitle && (
            <p className="body-serif text-xl md:text-2xl italic text-muted text-center leading-snug mb-8">
              {p.subtitle}
            </p>
          )}

          {/* Byline */}
          <div className="flex items-center justify-center gap-4 mb-10 label-sans text-muted">
            <span>By {p.author_email.split('@')[0]}</span>
            <span>·</span>
            <span>
              {p.published_at && format(new Date(p.published_at), 'MMMM d, yyyy')}
            </span>
          </div>

          <div className="border-t border-b border-ink py-1 mb-10">
            <div className="border-t border-ink/30" />
          </div>

          {/* Cover image */}
          {p.cover_image && (
            <figure className="mb-10">
              <img src={p.cover_image} alt={p.title} className="w-full" />
            </figure>
          )}

          {/* Body */}
          <div className="prose-article">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{p.content}</ReactMarkdown>
          </div>

          {/* Tags */}
          {p.tags && p.tags.length > 0 && (
            <div className="mt-10 pt-6 border-t border-ink/30">
              <div className="label-sans text-muted mb-3">Filed under</div>
              <div className="flex flex-wrap gap-2">
                {p.tags.map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1 border border-ink text-xs body-serif italic"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* End mark */}
          <div className="text-center my-12 text-2xl">◆ ◆ ◆</div>

          {/* Newsletter */}
          <div className="bg-cream border-y-2 border-ink py-8 px-8 my-12">
            <div className="label-sans text-accent mb-2">Continue Reading</div>
            <h3 className="display-serif text-2xl font-bold leading-tight mb-4">
              Get the next dispatch in your inbox.
            </h3>
            <NewsletterForm />
          </div>

          {/* More from the desk */}
          {more && more.length > 0 && (
            <section className="mt-12">
              <div className="rule-double mb-6">
                <div className="label-sans">More from the desk</div>
              </div>
              <div className="grid sm:grid-cols-3 gap-6">
                {more.map((m: any) => (
                  <Link key={m.id} href={`/post/${m.slug}`} className="group">
                    {m.category && (
                      <div className="label-sans text-accent mb-1">
                        {m.category.name}
                      </div>
                    )}
                    <h4 className="display-serif text-lg font-bold leading-tight group-hover:text-accent">
                      {m.title}
                    </h4>
                    {m.published_at && (
                      <div className="label-sans text-muted mt-2 text-[0.65rem]">
                        {format(new Date(m.published_at), 'MMM d, yyyy')}
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </article>
  );
}
