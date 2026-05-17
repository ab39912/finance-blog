import Link from 'next/link';
import { redirect } from 'next/navigation';
import { format } from 'date-fns';
import { createClient } from '@/lib/supabase-server';

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL?.toLowerCase();

export default async function AdminPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/admin/login');
  if (user.email?.toLowerCase() !== ADMIN_EMAIL) {
    return (
      <div className="max-w-md mx-auto px-6 py-20 text-center">
        <h1 className="display-serif text-3xl font-bold mb-4">Not authorized</h1>
        <p className="body-serif italic text-muted mb-6">
          You're signed in as {user.email}, but this isn't the admin email.
        </p>
        <p className="body-serif text-sm text-muted">
          Update <code>NEXT_PUBLIC_ADMIN_EMAIL</code> in your environment to grant
          this account editor access.
        </p>
      </div>
    );
  }

  const { data: posts } = await supabase
    .from('posts')
    .select('id, slug, title, published, published_at, updated_at, created_at')
    .order('updated_at', { ascending: false });

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="flex items-end justify-between mb-10 pb-6 border-b-2 border-ink">
        <div>
          <div className="label-sans text-muted mb-2">Editor's Desk</div>
          <h1 className="display-serif text-5xl font-black">Newsroom</h1>
        </div>
        <Link
          href="/admin/new"
          className="px-5 py-3 bg-ink text-paper label-sans hover:bg-accent"
        >
          + New Post
        </Link>
      </div>

      {!posts || posts.length === 0 ? (
        <p className="body-serif italic text-center py-20 text-muted">
          No drafts on file. Begin the first edition.
        </p>
      ) : (
        <table className="w-full body-serif">
          <thead>
            <tr className="border-b border-ink label-sans text-left">
              <th className="py-3">Title</th>
              <th className="py-3 w-32">Status</th>
              <th className="py-3 w-40">Updated</th>
              <th className="py-3 w-32"></th>
            </tr>
          </thead>
          <tbody>
            {posts.map((p) => (
              <tr key={p.id} className="border-b border-ink/20">
                <td className="py-4 pr-4">
                  <Link href={`/admin/edit/${p.id}`} className="hover:text-accent font-medium">
                    {p.title}
                  </Link>
                </td>
                <td className="py-4">
                  {p.published ? (
                    <span className="label-sans text-accent">Published</span>
                  ) : (
                    <span className="label-sans text-muted">Draft</span>
                  )}
                </td>
                <td className="py-4 label-sans text-muted">
                  {format(new Date(p.updated_at), 'MMM d, yyyy')}
                </td>
                <td className="py-4 text-right">
                  {p.published && (
                    <Link
                      href={`/post/${p.slug}`}
                      className="label-sans text-muted hover:text-ink mr-4"
                    >
                      View
                    </Link>
                  )}
                  <Link
                    href={`/admin/edit/${p.id}`}
                    className="label-sans hover:text-accent"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
