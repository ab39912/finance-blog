# The Ledger — A Financial Blog

A serious, editorial-style financial blog built with **Next.js 14** and **Supabase**. WSJ-inspired design, real database, real auth, deploy-ready for Vercel.

## What's included

- **Front-page newspaper layout** — lead story, above-the-fold sidebar, three-column section, "In Brief" rail
- **Article pages** with drop caps, pull quotes, and editorial typography (Playfair Display + Libre Caslon Text)
- **Categories** — Markets, Personal Finance, Crypto, Economy, Investing (editable in Supabase)
- **Newsletter signup** — captures emails to your `subscribers` table
- **Admin dashboard** at `/admin` — write, edit, publish, and delete posts in Markdown
- **Magic-link auth** — only the email you configure can publish

## Setup (15 minutes)

### 1. Install dependencies

```bash
cd finance-blog
npm install
```

### 2. Create a Supabase project

1. Go to https://supabase.com → New project (free tier is fine)
2. Once it's ready, open the **SQL Editor**
3. Open `supabase/schema.sql` from this repo, paste the entire file, and run it
4. Go to **Project Settings → API** and copy:
   - `Project URL` → this is `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → this is `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. Configure environment variables

```bash
cp .env.example .env.local
```

Then edit `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
NEXT_PUBLIC_ADMIN_EMAIL=you@example.com
NEXT_PUBLIC_SITE_NAME=The Ledger
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> **`NEXT_PUBLIC_ADMIN_EMAIL` matters.** Only this email can publish posts. Anyone can sign in via magic link, but the dashboard rejects everyone else.

### 4. Configure Supabase auth

In your Supabase project: **Authentication → URL Configuration**

- Set **Site URL** to `http://localhost:3000` (and later, your production URL)
- Add your production URL to **Redirect URLs** when you deploy

### 5. Run it

```bash
npm run dev
```

Open http://localhost:3000.

To write your first post:
1. Go to http://localhost:3000/admin/login
2. Enter the same email you set as `NEXT_PUBLIC_ADMIN_EMAIL`
3. Check your inbox, click the magic link
4. You're now in `/admin` — click **+ New Post**

## Deploy to Vercel

1. Push this folder to a GitHub repo
2. Go to https://vercel.com → Import Project → select your repo
3. Add the same env vars from `.env.local` in Vercel's Environment Variables panel
4. Set `NEXT_PUBLIC_SITE_URL` to your real production URL (e.g. `https://yoursite.vercel.app`)
5. In Supabase, go back to **Authentication → URL Configuration** and add the production URL to both Site URL and Redirect URLs
6. Deploy

That's it. Your blog is live.

## Project structure

```
finance-blog/
├── app/
│   ├── page.tsx                 # Front page
│   ├── post/[slug]/page.tsx     # Single post
│   ├── category/[slug]/page.tsx # Section page
│   ├── about/page.tsx
│   ├── admin/
│   │   ├── page.tsx             # Dashboard
│   │   ├── login/page.tsx       # Magic-link sign-in
│   │   ├── new/page.tsx         # New post
│   │   └── edit/[id]/page.tsx   # Edit post
│   ├── api/
│   │   ├── posts/route.ts       # POST a new post
│   │   ├── posts/[id]/route.ts  # PATCH / DELETE
│   │   └── newsletter/route.ts  # Newsletter signup
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── Masthead.tsx
│   ├── Footer.tsx
│   ├── NewsletterForm.tsx
│   └── PostEditor.tsx
├── lib/
│   ├── auth.ts                  # Admin gate
│   ├── supabase-browser.ts
│   ├── supabase-server.ts
│   └── types.ts
├── supabase/
│   └── schema.sql               # Run once in Supabase SQL editor
├── middleware.ts
├── tailwind.config.js
├── next.config.js
├── tsconfig.json
└── package.json
```

## Adding more categories

Just insert a new row in the `categories` table from the Supabase Table Editor. It will show up in the masthead and footer automatically.

## Notes on what we did NOT build (per your selections)

You opted out of comments. If you change your mind later, drop me a line — adding a `comments` table with moderation and threading is a 30-minute add-on.

## Tech

- **Next.js 14** (App Router, Server Components)
- **Supabase** (Postgres + Auth + Row Level Security)
- **Tailwind CSS** with a custom editorial type system
- **react-markdown** + **remark-gfm** for post content
- **date-fns** for editorial date formatting

## License

Yours. Use it, change it, ship it.
