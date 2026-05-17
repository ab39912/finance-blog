import Link from 'next/link';
import { createClient } from '@/lib/supabase-server';

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL?.toLowerCase();
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'The Ledger';

export const metadata = {
  title: "Editor's Desk",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const isAdmin =
    user?.email?.toLowerCase() === ADMIN_EMAIL && !!ADMIN_EMAIL;

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <header className="bg-ink text-paper border-b-4 border-accent">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="flex items-center gap-3 group">
              <span className="display-serif text-2xl font-bold group-hover:text-accent">
                {SITE_NAME}
              </span>
              <span className="label-sans text-paper/60 border-l border-paper/30 pl-3">
                Editor's Desk
              </span>
            </Link>
            {isAdmin && (
              <nav className="hidden md:flex items-center gap-5 label-sans">
                <Link href="/admin" className="hover:text-accent">
                  Dashboard
                </Link>
                <Link href="/admin/new" className="hover:text-accent">
                  + New Post
                </Link>
              </nav>
            )}
          </div>

          <div className="flex items-center gap-4 label-sans">
            <Link
              href="/"
              target="_blank"
              className="text-paper/70 hover:text-paper"
            >
              ↗ View Site
            </Link>
            {isAdmin && (
              <>
                <span className="hidden sm:inline text-paper/50 border-l border-paper/30 pl-4">
                  {user!.email}
                </span>
                <form action="/api/auth/signout" method="POST">
                  <button
                    type="submit"
                    className="px-3 py-1 border border-paper/40 hover:bg-accent hover:border-accent"
                  >
                    Sign Out
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </header>

      {isAdmin && (
        <nav className="md:hidden bg-ink/95 text-paper border-b border-paper/20">
          <div className="max-w-6xl mx-auto px-6 py-2 flex gap-5 label-sans">
            <Link href="/admin" className="hover:text-accent">
              Dashboard
            </Link>
            <Link href="/admin/new" className="hover:text-accent">
              + New Post
            </Link>
          </div>
        </nav>
      )}

      <main className="flex-1 relative z-10">{children}</main>

      <footer className="border-t border-ink/20 bg-cream py-4">
        <div className="max-w-6xl mx-auto px-6 text-center label-sans text-muted text-[0.65rem]">
          Editor's Desk · {SITE_NAME} · Not visible to readers
        </div>
      </footer>
    </div>
  );
}