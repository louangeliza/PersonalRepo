import { cache } from "react";

export type BlogPost = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  readTime: string;
  link: string;
};
function decodeEntities(str: string): string {
  return str
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8216;/g, "'")
    .replace(/&#8217;/g, "'")
    .replace(/&#8211;/g, "–")
    .replace(/&#8212;/g, "—")
    .replace(/&hellip;/g, "…")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));
}
export type BlogComment = {
  id: number;
  authorName: string;
  content: string;
  date: string;
};

const fallbackPosts: BlogPost[] = [
  {
    id: 1,
    slug: "building-humane-software-in-public",
    title: "Building humane software in public",
    excerpt:
      "Notes on shipping small, learning loudly, and turning a developer portfolio into a living body of work.",
    content:
      "<p>This sample essay is here while WordPress is not connected yet. Once you add your WordPress site URL, real posts will appear here automatically.</p>",
    category: "Engineering",
    date: "Jun 19, 2026",
    readTime: "6 min read",
    link: "#",
  },
  {
    id: 2,
    slug: "rebuilding-my-portfolio-with-nextjs",
    title: "What I learned rebuilding my portfolio with Next.js",
    excerpt:
      "A practical breakdown of app routing, styling choices, and the little details that make a personal site feel finished.",
    content:
      "<p>Mock content for the article page. This will be replaced by WordPress content after the CMS is connected.</p>",
    category: "Next.js",
    date: "Jun 12",
    readTime: "8 min",
    link: "#",
  },
  {
    id: 3,
    slug: "designing-a-blog-system-before-the-cms-exists",
    title: "Designing a blog system before the CMS exists",
    excerpt:
      "How to structure mock content today so WordPress can become the source of truth tomorrow.",
    content:
      "<p>Mock content for the article page. This gives the frontend a complete reading experience before the CMS is wired in.</p>",
    category: "CMS",
    date: "Jun 5",
    readTime: "5 min",
    link: "#",
  },
  {
    id: 4,
    slug: "the-case-for-quieter-developer-portfolios",
    title: "The case for quieter developer portfolios",
    excerpt:
      "A portfolio can show taste without shouting. Here is how I think about restraint, rhythm, and proof.",
    content:
      "<p>Mock content for the article page. Replace this by publishing posts in WordPress.</p>",
    category: "Design",
    date: "May 28",
    readTime: "4 min",
    link: "#",
  },
];

type WordPressRendered = {
  rendered?: string;
};

type WordPressTerm = {
  name?: string;
};

type WordPressPost = {
  id: number;
  slug: string;
  link: string;
  date: string;
  title?: WordPressRendered;
  excerpt?: WordPressRendered;
  content?: WordPressRendered;
  _embedded?: {
    "wp:term"?: WordPressTerm[][];
  };
};

type WordPressDotComPost = {
  ID: number;
  URL: string;
  categories?: Record<string, { name?: string }>;
  content?: string;
  date: string;
  excerpt?: string;
  slug: string;
  title?: string;
};

type WordPressDotComPostsResponse = {
  posts?: WordPressDotComPost[];
};

type WordPressDotComComment = {
  ID: number;
  author?: {
    name?: string;
  };
  content?: string;
  date: string;
};

type WordPressDotComCommentsResponse = {
  comments?: WordPressDotComComment[];
};

export function hasWordPressSite() {
  return Boolean(getWordPressSiteUrl());
}

export const getPosts = cache(async function getPosts(limit = 4): Promise<BlogPost[]> {
  const siteUrl = getWordPressSiteUrl();

  if (!siteUrl) {
    return fallbackPosts.slice(0, limit);
  }

  try {
    if (isWordPressDotComSite(siteUrl)) {
      const posts = await fetchWordPressDotComPosts(limit);
      return posts.map(normalizeWordPressDotComPost);
    }

    const posts = await fetchWordPress<WordPressPost[]>(
      `${siteUrl}/wp-json/wp/v2/posts?_embed=1&per_page=${limit}`,
    );

    return posts.map(normalizePost);
  } catch (error) {
    console.error("Failed to load WordPress posts", error);
    return fallbackPosts.slice(0, limit);
  }
});

export const getPostBySlug = cache(async function getPostBySlug(
  slug: string,
): Promise<BlogPost | null> {
  const siteUrl = getWordPressSiteUrl();

  if (!siteUrl) {
    return fallbackPosts.find((post) => post.slug === slug) ?? null;
  }

  try {
    if (isWordPressDotComSite(siteUrl)) {
      const posts = await fetchWordPressDotComPosts(10);
      const post = posts.find((item) => item.slug === slug);
      return post ? normalizeWordPressDotComPost(post) : null;
    }

    const posts = await fetchWordPress<WordPressPost[]>(
      `${siteUrl}/wp-json/wp/v2/posts?slug=${encodeURIComponent(slug)}&_embed=1`,
    );

    return posts[0] ? normalizePost(posts[0]) : null;
  } catch (error) {
    console.error("Failed to load WordPress post", error);
    return fallbackPosts.find((post) => post.slug === slug) ?? null;
  }
});

export async function getTopics() {
  const posts = await getPosts(12);
  const categories = posts.map((post) => post.category).filter(Boolean);
  return Array.from(new Set(categories)).slice(0, 5);
}

export const getComments = cache(async function getComments(
  postId: number,
): Promise<BlogComment[]> {
  const siteUrl = getWordPressSiteUrl();

  if (!siteUrl) {
    return [];
  }

  try {
    if (isWordPressDotComSite(siteUrl)) {
      const comments = await fetchWordPressDotComComments(postId);
      return comments.map(normalizeWordPressDotComComment);
    }

    return [];
  } catch (error) {
    console.warn("Failed to load WordPress comments", error);
    return [];
  }
});

export function getCommentUrl(post: BlogPost) {
  if (!post.link || post.link === "#") {
    return "";
  }

  return `${post.link.replace(/#.*$/, "")}#respond`;
}

export function getWordPressSiteOrigin() {
  return getWordPressSiteUrl();
}

function getWordPressSiteUrl() {
  const siteUrl = process.env.WORDPRESS_SITE_URL?.trim();

  if (!siteUrl) {
    return "";
  }

  return siteUrl.replace(/\/$/, "");
}

async function fetchWordPress<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    cache: "no-store",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`WordPress request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

async function fetchWordPressDotComPosts(limit: number) {
  const siteUrl = getWordPressSiteUrl();
  const siteHost = new URL(siteUrl).hostname;
  const response = await fetchWordPress<WordPressDotComPostsResponse>(
    `https://public-api.wordpress.com/rest/v1.1/sites/${siteHost}/posts/?number=${limit}`,
  );

  return response.posts ?? [];
}

async function fetchWordPressDotComComments(postId: number) {
  const siteUrl = getWordPressSiteUrl();
  const siteHost = new URL(siteUrl).hostname;
  const response = await fetchWordPress<WordPressDotComCommentsResponse>(
    `https://public-api.wordpress.com/rest/v1.1/sites/${siteHost}/posts/${postId}/replies/?number=20`,
  );

  return response.comments ?? [];
}

function normalizePost(post: WordPressPost): BlogPost {
  const title = decodeHtml(stripTags(post.title?.rendered ?? "Untitled"));
  const excerpt = decodeHtml(stripTags(post.excerpt?.rendered ?? ""));
  const content = post.content?.rendered ?? "";
  const category = post._embedded?.["wp:term"]?.[0]?.[0]?.name ?? "Article";

  return {
    id: post.id,
    slug: post.slug,
    title,
    excerpt,
    content,
    category,
    date: formatDate(post.date),
    readTime: getReadTime(content || excerpt),
    link: post.link,
  };
}

function normalizeWordPressDotComPost(post: WordPressDotComPost): BlogPost {
  const categories = Object.values(post.categories ?? {});
  const category = categories[0]?.name ?? "Article";
  const content = post.content ?? "";
  const excerpt = decodeHtml(stripTags(post.excerpt ?? ""));

  return {
    id: post.ID,
    slug: post.slug,
    title: decodeHtml(stripTags(post.title ?? "Untitled")),
    excerpt,
    content,
    category,
    date: formatDate(post.date),
    readTime: getReadTime(content || excerpt),
    link: post.URL,
  };
}

function normalizeWordPressDotComComment(comment: WordPressDotComComment): BlogComment {
  return {
    id: comment.ID,
    authorName: comment.author?.name ?? "Reader",
    content: comment.content ?? "",
    date: formatDate(comment.date),
  };
}

function isWordPressDotComSite(siteUrl: string) {
  return new URL(siteUrl).hostname.endsWith(".wordpress.com");
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function getReadTime(content: string) {
  const words = stripTags(content).split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 220));
  return `${minutes} min read`;
}

function stripTags(value: string) {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function decodeHtml(value: string) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#039;", "'")
    .replaceAll("&apos;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}
