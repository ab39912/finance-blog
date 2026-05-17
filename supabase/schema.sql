-- ============================================================
-- THE LEDGER — Database Schema
-- Run this entire file in Supabase SQL Editor (one time)
-- ============================================================

-- Categories table
create table if not exists categories (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  name        text not null,
  description text,
  created_at  timestamptz default now()
);

-- Posts table
create table if not exists posts (
  id           uuid primary key default gen_random_uuid(),
  slug         text unique not null,
  title        text not null,
  subtitle     text,
  content      text not null,           -- Markdown
  excerpt      text,
  category_id  uuid references categories(id) on delete set null,
  tags         text[] default '{}',
  cover_image  text,
  author_email text not null,
  published    boolean default false,
  published_at timestamptz,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

create index if not exists posts_published_idx on posts(published, published_at desc);
create index if not exists posts_category_idx on posts(category_id);
create index if not exists posts_slug_idx on posts(slug);

-- Newsletter subscribers
create table if not exists subscribers (
  id          uuid primary key default gen_random_uuid(),
  email       text unique not null,
  created_at  timestamptz default now(),
  confirmed   boolean default true
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table categories  enable row level security;
alter table posts       enable row level security;
alter table subscribers enable row level security;

-- Anyone can READ categories
drop policy if exists "categories_read" on categories;
create policy "categories_read" on categories
  for select using (true);

-- Anyone can READ published posts
drop policy if exists "posts_read_published" on posts;
create policy "posts_read_published" on posts
  for select using (published = true);

-- Authenticated admins can READ all posts (drafts included)
drop policy if exists "posts_read_admin" on posts;
create policy "posts_read_admin" on posts
  for select to authenticated using (true);

-- Only authenticated users can INSERT/UPDATE/DELETE posts
-- (We further gate on the admin email check inside the API route)
drop policy if exists "posts_write_admin" on posts;
create policy "posts_write_admin" on posts
  for all to authenticated
  using (true) with check (true);

drop policy if exists "categories_write_admin" on categories;
create policy "categories_write_admin" on categories
  for all to authenticated
  using (true) with check (true);

-- Anyone can subscribe to the newsletter
drop policy if exists "subscribers_insert" on subscribers;
create policy "subscribers_insert" on subscribers
  for insert with check (true);

-- Only admins can read subscriber list
drop policy if exists "subscribers_read_admin" on subscribers;
create policy "subscribers_read_admin" on subscribers
  for select to authenticated using (true);

-- ============================================================
-- SEED DATA — starting categories
-- ============================================================
insert into categories (slug, name, description) values
  ('markets',          'Markets',          'Equities, indices, and macro moves'),
  ('personal-finance', 'Personal Finance', 'Budgeting, saving, and household money'),
  ('crypto',           'Crypto',           'Digital assets and on-chain markets'),
  ('economy',          'Economy',          'Macro, policy, and the global economy'),
  ('investing',        'Investing',        'Strategy, theses, and portfolio thinking')
on conflict (slug) do nothing;
