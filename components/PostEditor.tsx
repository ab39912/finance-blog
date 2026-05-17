'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { Category } from '@/lib/types';

type Props = {
  categories: Category[];
  initial?: {
    id?: string;
    title: string;
    subtitle: string;
    excerpt: string;
    content: string;
    category_id: string;
    tags: string;
    cover_image: string;
    published: boolean;
  };
};

const empty = {
  title: '',
  subtitle: '',
  excerpt: '',
  content: '',
  category_id: '',
  tags: '',
  cover_image: '',
  published: false,
};

export function PostEditor({ categories, initial }: Props) {
  const router = useRouter();
  const [form, setForm] = useState(initial ? { ...empty, ...initial } : empty);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const isEdit = !!initial?.id;

  function update<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function save(publish: boolean) {
    setSaving(true);
    setError('');
    const payload = {
      title: form.title,
      subtitle: form.subtitle,
      excerpt: form.excerpt,
      content: form.content,
      category_id: form.category_id || null,
      tags: form.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      cover_image: form.cover_image,
      published: publish,
    };

    const res = await fetch(
      isEdit ? `/api/posts/${initial!.id}` : '/api/posts',
      {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );
    const data = await res.json();
    setSaving(false);
    if (!res.ok) {
      setError(data.error || 'Save failed');
      return;
    }
    router.push('/admin');
    router.refresh();
  }

  async function remove() {
    if (!isEdit) return;
    if (!confirm('Delete this post permanently?')) return;
    const res = await fetch(`/api/posts/${initial!.id}`, { method: 'DELETE' });
    if (res.ok) {
      router.push('/admin');
      router.refresh();
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8 pb-4 border-b-2 border-ink">
        <h1 className="display-serif text-3xl font-bold">
          {isEdit ? 'Edit Post' : 'New Post'}
        </h1>
        <div className="flex gap-2">
          {isEdit && (
            <button
              onClick={remove}
              className="px-4 py-2 border border-ink label-sans text-accent hover:bg-accent hover:text-paper"
            >
              Delete
            </button>
          )}
          <button
            onClick={() => save(false)}
            disabled={saving}
            className="px-4 py-2 border border-ink label-sans hover:bg-cream disabled:opacity-50"
          >
            Save Draft
          </button>
          <button
            onClick={() => save(true)}
            disabled={saving || !form.title || !form.content}
            className="px-5 py-2 bg-ink text-paper label-sans hover:bg-accent disabled:opacity-50"
          >
            {form.published ? 'Update' : 'Publish'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-3 border border-accent text-accent body-serif italic">
          {error}
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label className="label-sans block mb-2">Headline</label>
          <input
            value={form.title}
            onChange={(e) => update('title', e.target.value)}
            className="w-full px-3 py-3 border border-ink display-serif text-2xl font-bold bg-paper"
            placeholder="The headline that earns the reader's eye..."
          />
        </div>

        <div>
          <label className="label-sans block mb-2">Subtitle / Deck</label>
          <input
            value={form.subtitle}
            onChange={(e) => update('subtitle', e.target.value)}
            className="w-full px-3 py-2 border border-ink body-serif italic bg-paper"
            placeholder="A line of context underneath the headline."
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label-sans block mb-2">Section</label>
            <select
              value={form.category_id}
              onChange={(e) => update('category_id', e.target.value)}
              className="w-full px-3 py-2 border border-ink body-serif bg-paper"
            >
              <option value="">— None —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label-sans block mb-2">Tags (comma-separated)</label>
            <input
              value={form.tags}
              onChange={(e) => update('tags', e.target.value)}
              className="w-full px-3 py-2 border border-ink body-serif bg-paper"
              placeholder="federal-reserve, rates, macro"
            />
          </div>
        </div>

        <div>
          <label className="label-sans block mb-2">Cover image URL (optional)</label>
          <input
            value={form.cover_image}
            onChange={(e) => update('cover_image', e.target.value)}
            className="w-full px-3 py-2 border border-ink body-serif bg-paper"
            placeholder="https://..."
          />
        </div>

        <div>
          <label className="label-sans block mb-2">Excerpt</label>
          <textarea
            value={form.excerpt}
            onChange={(e) => update('excerpt', e.target.value)}
            rows={2}
            className="w-full px-3 py-2 border border-ink body-serif bg-paper"
            placeholder="The pull-quote that runs on the front page."
          />
        </div>

        <div>
          <label className="label-sans block mb-2">
            Body (Markdown supported)
          </label>
          <textarea
            value={form.content}
            onChange={(e) => update('content', e.target.value)}
            rows={20}
            className="w-full px-4 py-3 border border-ink body-serif text-base bg-paper leading-relaxed"
            placeholder="## A subheading

The body of your piece. Markdown works: **bold**, *italic*, [links](https://...), > blockquotes, lists, and ```code```."
          />
          <p className="mt-2 text-xs body-serif italic text-muted">
            Markdown: # ## ### for headers, **bold**, *italic*, &gt; quote, - lists, [text](url), ![alt](image-url)
          </p>
        </div>
      </div>
    </div>
  );
}
