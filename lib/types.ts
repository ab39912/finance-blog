export type Category = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  created_at: string;
};

export type Post = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  content: string;
  excerpt: string | null;
  category_id: string | null;
  tags: string[];
  cover_image: string | null;
  author_email: string;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  category?: Category | null;
};
