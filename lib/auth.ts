import { createClient } from './supabase-server';

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL?.toLowerCase();

export async function requireAdmin() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, status: 401, message: 'Not authenticated' } as const;
  if (!ADMIN_EMAIL || user.email?.toLowerCase() !== ADMIN_EMAIL) {
    return { ok: false, status: 403, message: 'Not authorized' } as const;
  }
  return { ok: true, user, supabase } as const;
}
