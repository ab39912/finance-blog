import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase-server';
import { PostEditor } from '@/components/PostEditor';

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL?.toLowerCase();

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/admin/login');
  if (user.email?.toLowerCase() !== ADMIN_EMAIL) redirect('/admin');

  const [{ data: post }, { data: categories }] = await Promise.all([
    supabase.from('posts').select('*').eq('id', params.id).single(),
    supabase.from('categories').select('*').order('name'),
  ]);

  if (!post) notFound();

  return (
    <PostEditor
      categories={categories ?? []}
      initial={{
        id: post.id,
        title: post.title || '',
        subtitle: post.subtitle || '',
        excerpt: post.excerpt || '',
        content: post.content || '',
        category_id: post.category_id || '',
        tags: (post.tags || []).join(', '),
        cover_image: post.cover_image || '',
        published: !!post.published,
      }}
    />
  );
}
