import Link from 'next/link';
import { format } from 'date-fns';
import { createClient } from '@/lib/supabase-server';
import { NewsletterForm } from '@/components/NewsletterForm';
import type { Post } from '@/lib/types';

export const revalidate = 60;

export default async function HomePage() {
  const supabase = createClient();

  const { data: posts } = await supabase
    .from('posts')
    .select('*, category:categories(*)')
    .eq('published', true)
    .order('published_at', { ascending: false })
    .limit(13);

  const list = (posts ?? []) as Post[];
  const lead = list[0];
  const aboveFold = list.slice(1, 4);
  const belowFold = list.slice(4, 10);
  const briefs = list.slice(10);

  if (!lead) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 text-center">
        <h2 className="display-serif text-4xl mb-4">The press is warm. The page is blank.</h2>
        <p className="body-serif text-muted mb-8 italic">
          Sign in to the Editor's Desk and publish the first edition.
        </p>
        <Link
          href="/admin/login"
          className="inline-block px-6 py-3 bg-ink text-paper label-sans"
        >
          Editor's Desk
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Lead story */}
      <article className="grid md:grid-cols-12 gap-8 pb-10 mb-10 border-b-2 border-ink">
        <div className="md:col-span-8">
          {lead.category && (
            <Link
              href={`/category/${lead.category.slug}`}
              className="label-sans text-accent hover:underline"
            >
              {lead.category.name}
            </Link>
          )}
          <Link href={`/post/${lead.slug}`}>
            <h2 className="display-serif text-5xl md:text-7xl font-black leading-[0.95] tracking-tight mt-3 mb-4 hover:text-accent">
              {lead.title}
            </h2>
          </Link>
          {lead.subtitle && (
            <p className="body-serif text-xl md:text-2xl italic text-muted leading-snug mb-5">
              {lead.subtitle}
            </p>
          )}
          {lead.excerpt && (
            <p className="body-serif text-lg leading-relaxed mb-4">{lead.excerpt}</p>
          )}
          <div className="label-sans text-muted">
            By {lead.author_email.split('@')[0]} ·{' '}
            {lead.published_at && format(new Date(lead.published_at), 'MMM d, yyyy')}
          </div>
        </div>
        <aside className="md:col-span-4 md:border-l md:border-ink/30 md:pl-8">
          <div className="label-sans pb-2 mb-4 border-b border-ink">Above the Fold</div>
          <div className="space-y-5">
            {aboveFold.map((p) => (
              <PostBrief key={p.id} post={p} />
            ))}
            {aboveFold.length === 0 && (
              <p className="body-serif italic text-muted text-sm">
                More stories will appear as they're published.
              </p>
            )}
          </div>
        </aside>
      </article>

      {/* Newsletter strip */}
      <section className="bg-cream border-y-2 border-ink py-8 px-8 mb-12 grid md:grid-cols-2 gap-6 items-center">
        <div>
          <div className="label-sans text-accent mb-2">Subscribe</div>
          <h3 className="display-serif text-3xl font-bold leading-tight">
            The week in markets, in your inbox.
          </h3>
        </div>
        <NewsletterForm />
      </section>

      {/* Below the fold — three columns */}
      {belowFold.length > 0 && (
        <section className="grid md:grid-cols-3 gap-8 pb-10 mb-10 border-b border-ink/30">
          {belowFold.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
        </section>
      )}

      {/* In Brief */}
      {briefs.length > 0 && (
        <section className="grid md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <div className="rule-double">
              <div className="label-sans text-accent">In Brief</div>
            </div>
            <p className="body-serif italic text-sm text-muted mt-3">
              Shorter takes from across the desk.
            </p>
          </div>
          <ul className="md:col-span-3 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {briefs.map((p) => (
              <li key={p.id} className="border-l border-ink/30 pl-4">
                <PostBrief post={p} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function PostBrief({ post }: { post: Post }) {
  return (
    <div>
      {post.category && (
        <div className="label-sans text-accent mb-1">{post.category.name}</div>
      )}
      <Link href={`/post/${post.slug}`}>
        <h4 className="display-serif text-lg font-bold leading-snug hover:text-accent">
          {post.title}
        </h4>
      </Link>
      {post.published_at && (
        <div className="label-sans text-muted mt-1 text-[0.65rem]">
          {format(new Date(post.published_at), 'MMM d')}
        </div>
      )}
    </div>
  );
}

function PostCard({ post }: { post: Post }) {
  return (
    <article>
      {post.category && (
        <Link
          href={`/category/${post.category.slug}`}
          className="label-sans text-accent hover:underline"
        >
          {post.category.name}
        </Link>
      )}
      <Link href={`/post/${post.slug}`}>
        <h3 className="display-serif text-2xl font-bold leading-tight mt-2 mb-3 hover:text-accent">
          {post.title}
        </h3>
      </Link>
      {post.excerpt && (
        <p className="body-serif text-base leading-relaxed text-ink/85 mb-3">
          {post.excerpt}
        </p>
      )}
      <div className="label-sans text-muted">
        {post.published_at && format(new Date(post.published_at), 'MMM d, yyyy')}
      </div>
    </article>
  );
}
