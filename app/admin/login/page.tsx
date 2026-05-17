'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase-browser';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/admin` },
    });
    if (error) {
      setStatus('error');
      setMessage(error.message);
    } else {
      setStatus('sent');
      setMessage('Check your inbox for a sign-in link.');
    }
  }

  return (
    <div className="max-w-md mx-auto px-6 py-20">
      <div className="text-center mb-10">
        <div className="label-sans text-muted mb-2">Editor's Desk</div>
        <h1 className="display-serif text-5xl font-black">Sign In</h1>
        <p className="body-serif italic text-muted mt-3">
          A magic link will be sent to your email.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="editor@example.com"
          className="w-full px-4 py-3 border border-ink bg-paper body-serif"
        />
        <button
          type="submit"
          disabled={status === 'sending'}
          className="w-full py-3 bg-ink text-paper label-sans hover:bg-accent disabled:opacity-60"
        >
          {status === 'sending' ? 'Sending...' : 'Send Magic Link'}
        </button>
      </form>

      {message && (
        <p className={`mt-4 text-center body-serif italic ${status === 'error' ? 'text-accent' : 'text-muted'}`}>
          {message}
        </p>
      )}

      <p className="mt-10 text-center label-sans text-muted text-[0.65rem]">
        Only the admin email configured in your environment can publish posts.
      </p>
    </div>
  );
}
