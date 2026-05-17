'use client';

import { useState } from 'react';

export function NewsletterForm({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      setStatus('success');
      setMessage('Welcome aboard. Check your inbox.');
      setEmail('');
    } catch (err: any) {
      setStatus('error');
      setMessage(err.message || 'Something went wrong.');
    }
  }

  return (
    <form onSubmit={onSubmit} className={compact ? '' : 'max-w-md'}>
      {!compact && (
        <p className="body-serif text-sm text-muted mb-3 italic">
          A weekly dispatch. No fluff. Unsubscribe anytime.
        </p>
      )}
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="flex-1 px-3 py-2 bg-paper border border-ink text-sm body-serif"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="px-5 py-2 bg-ink text-paper label-sans hover:bg-accent disabled:opacity-60"
        >
          {status === 'loading' ? '...' : 'Subscribe'}
        </button>
      </div>
      {message && (
        <p className={`mt-2 text-xs body-serif ${status === 'error' ? 'text-accent' : 'text-muted'}`}>
          {message}
        </p>
      )}
    </form>
  );
}
