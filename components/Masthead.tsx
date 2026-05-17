import Link from 'next/link';
import { createClient } from '@/lib/supabase-server';

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'The Ledger';

export async function Masthead() {
  const supabase = createClient();
  const { data: categories } = await supabase
    .from('categories')
    .select('slug, name')
    .order('name');

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="relative z-10 border-b-4 border-double border-ink bg-paper">
      {/* Top bar */}
      <div className="border-b border-ink/30">
        <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between text-[0.7rem] label-sans">
          <span className="text-muted">{today}</span>
          <span className="text-muted hidden sm:inline">Vol. I · No. 1</span>
          <Link href="/admin/login" className="text-muted hover:text-ink">
            Editor's Desk
          </Link>
        </div>
      </div>

      {/* Title */}
      <div className="max-w-7xl mx-auto px-6 py-8 text-center">
        <div className="label-sans text-muted mb-2">An Independent Journal of Finance</div>
        <Link href="/" className="inline-block">
          <h1 className="display-serif text-6xl md:text-8xl font-black tracking-tight leading-none">
            {SITE_NAME}
          </h1>
        </Link>
        <div className="mt-3 text-sm italic text-muted body-serif">
          "Capital, candidly considered."
        </div>
      </div>

      {/* Section nav */}
      <nav className="border-t border-b border-ink">
        <div className="max-w-7xl mx-auto px-6">
          <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 py-3 label-sans">
            <li>
              <Link href="/" className="hover:text-accent">
                Front Page
              </Link>
            </li>
            {categories?.map((c) => (
              <li key={c.slug}>
                <Link href={`/category/${c.slug}`} className="hover:text-accent">
                  {c.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/about" className="hover:text-accent">
                About
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
