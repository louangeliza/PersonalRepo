import Link from "next/link";
import { getPosts } from "@/lib/wordpress";

export const metadata = {
  title: "Articles | Liza.dev",
  description: "Latest articles from Liza.dev.",
};

export const dynamic = "force-dynamic";

export default async function PostsPage() {
  const posts = await getPosts(12);

  return (
    <main className="min-h-screen bg-[#f8f1e7] px-6 py-10 text-[#1e1d1a]">
      <div className="mx-auto max-w-5xl">
        <Link href="/" className="text-sm font-semibold text-[#385052]">
          Back home
        </Link>

        <header className="mt-12 grid gap-8 border-b border-[#d8cdbc] pb-10 md:grid-cols-[1fr_0.72fr] md:items-end">
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.24em] text-[#9a4f2f]">
              Archive
            </p>
            <h1 className="mt-3 text-5xl font-semibold leading-tight sm:text-6xl">
              All writing
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#5f5a50]">
              Essays pulled from WordPress, arranged for reading instead of scrolling.
            </p>
          </div>
          <div className="rounded-lg border border-[#d8cdbc] bg-[#fffaf2] p-5">
            <p className="text-3xl font-semibold">{String(posts.length).padStart(2, "0")}</p>
            <p className="mt-1 text-sm text-[#6e675b]">published pieces in the archive</p>
          </div>
        </header>

        <section className="mt-12 grid gap-5">
          {posts.map((post, index) => (
            <Link
              key={post.id}
              href={`/posts/${post.slug}`}
              className="group grid gap-6 rounded-lg border border-[#e2d8c9] bg-[#fffaf2] p-6 transition hover:-translate-y-1 hover:border-[#b76645] hover:bg-white hover:shadow-[0_18px_48px_rgba(68,52,35,0.1)] md:grid-cols-[80px_1fr]"
            >
              <div className="font-mono text-3xl font-semibold text-[#b76645]">
                {String(index + 1).padStart(2, "0")}
              </div>
              <div>
                <div className="mb-4 flex flex-wrap items-center gap-3 text-xs font-medium text-[#756d60]">
                  <span>{post.category}</span>
                  <span>{post.date}</span>
                  <span>{post.readTime}</span>
                </div>
                <h2 className="text-2xl font-semibold leading-snug transition group-hover:text-[#9a4f2f]">
                  {post.title}
                </h2>
                <p className="mt-4 max-w-3xl text-sm leading-6 text-[#625c51]">
                  {post.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
