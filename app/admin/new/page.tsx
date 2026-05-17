import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase-server';
import { PostEditor } from '@/components/PostEditor';

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL?.toLowerCase();

export default async function NewPostPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/admin/login');
  if (user.email?.toLowerCase() !== ADMIN_EMAIL) redirect('/admin');

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  return <PostEditor categories={categories ?? []} />;
}
