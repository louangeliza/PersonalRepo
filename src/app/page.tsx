import Image from "next/image";
import Link from "next/link";
import { NewsletterForm } from "./components/newsletter-form";
import { getPosts, hasWordPressSite } from "@/lib/wordpress";

export const dynamic = "force-dynamic";

export default async function Home() {
  const allPosts = await getPosts(4);
  const [featuredPost, ...posts] = allPosts;
  const topics = Array.from(new Set(allPosts.map((post) => post.category))).slice(0, 5);
  const isConnectedToWordPress = hasWordPressSite();

  return (
    <main className="min-h-screen overflow-hidden bg-[#f8f1e7] text-[#1e1d1a]">
      <header className="sticky top-0 z-20 border-b border-[#ded5c7] bg-[#f8f1e7]/88 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-full bg-[#243b3d] text-sm font-bold text-[#fffaf2]">
              L
            </span>
            <span className="font-mono text-sm font-semibold uppercase tracking-[0.18em]">
              Liza Notes
            </span>
          </Link>
          <div className="hidden items-center gap-8 text-sm font-medium text-[#5f5a50] sm:flex">
            <a href="#posts" className="transition hover:text-[#1e1d1a]">
              Articles
            </a>
            <a href="#topics" className="transition hover:text-[#1e1d1a]">
              Topics
            </a>
            <a href="#newsletter" className="transition hover:text-[#1e1d1a]">
              Subscribe
            </a>
            <Link
              href="/posts"
              className="rounded-full bg-[#1e1d1a] px-4 py-2 text-[#fffaf2] transition hover:bg-[#385052]"
            >
              Read
            </Link>
          </div>
        </nav>
      </header>

      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-12 lg:grid-cols-[1.04fr_0.96fr] lg:py-20">
        <div className="flex flex-col justify-between gap-12">
          <div className="max-w-3xl">
            <div className="mb-6 flex w-fit items-center gap-2 rounded-full border border-[#d8cdbc] bg-[#fffaf2] px-3 py-2 text-xs font-semibold text-[#5f5a50]">
              <span className="size-2 rounded-full bg-[#b76645]" />
              Writing from the messy middle of building things
            </div>
            <h1 className="max-w-4xl text-5xl font-semibold leading-[0.98] text-[#171613] sm:text-6xl lg:text-7xl">
              Code, chaos, tiny wins, and essays that actually breathe.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#5f5a50]">
              A personal blog about frontend engineering, learning in public, creative
              stubbornness, and the strange emotional weather of making software.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={`/posts/${featuredPost.slug}`}
                className="rounded-md bg-[#243b3d] px-5 py-3 text-center text-sm font-semibold text-[#fffaf2] transition hover:bg-[#385052]"
              >
                Start with the latest essay
              </Link>
              <a
                href="#newsletter"
                className="rounded-md border border-[#cfc3b2] bg-[#fffaf2] px-5 py-3 text-center text-sm font-semibold text-[#385052] transition hover:border-[#385052]"
              >
                Get new notes by email
              </a>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              [String(allPosts.length).padStart(2, "0"), "Essays live"],
              [topics.length ? String(topics.length).padStart(2, "0") : "01", "Writing lanes"],
              [isConnectedToWordPress ? "Live" : "Soon", "WordPress sync"],
            ].map(([value, label]) => (
              <div
                key={label}
                className="rounded-lg border border-[#d8cdbc] bg-[#fffaf2] p-4 shadow-[0_12px_34px_rgba(68,52,35,0.06)]"
              >
                <p className="text-3xl font-semibold">{value}</p>
                <p className="mt-1 text-sm text-[#6e675b]">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <article className="overflow-hidden rounded-lg border border-[#d8cdbc] bg-[#fffaf2] shadow-[0_24px_80px_rgba(68,52,35,0.12)]">
          <div className="relative h-72 overflow-hidden text-[#fffaf2]">
            <Image
              src="/blog-cover.png"
              alt="Editorial illustration of a writing desk, notes, and a code window"
              fill
              className="object-cover"
              priority
              sizes="(min-width: 1024px) 448px, calc(100vw - 48px)"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(30,29,26,0.12),rgba(30,29,26,0.72))]" />
            <div className="relative flex h-full flex-col justify-between p-6">
              <span className="w-fit rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur">
                Latest from WordPress
              </span>
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.2em] opacity-80">
                  {featuredPost.category}
                </p>
                <Link href={`/posts/${featuredPost.slug}`}>
                  <h2 className="mt-3 max-w-md text-3xl font-semibold leading-tight transition hover:text-[#f0b08d]">
                    {featuredPost.title}
                  </h2>
                </Link>
              </div>
            </div>
          </div>
          <div className="p-6">
            <p className="text-base leading-7 text-[#5f5a50]">{featuredPost.excerpt}</p>
            <div className="mt-8 flex items-center justify-between text-sm text-[#756d60]">
              <span>{featuredPost.date}</span>
              <Link href={`/posts/${featuredPost.slug}`} className="font-semibold text-[#385052]">
                Read essay
              </Link>
            </div>
          </div>
        </article>
      </section>

      <section className="border-y border-[#ded5c7] bg-[#243b3d] px-6 py-4 text-[#fffaf2]">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono uppercase tracking-[0.2em] text-[#f0b08d]">
            Current mood
          </p>
          <p className="max-w-3xl text-white/78">
            Shipping imperfectly, writing honestly, and keeping receipts for every lesson
            learned the hard way.
          </p>
        </div>
      </section>

      <section id="posts" className="border-b border-[#ded5c7] bg-[#fffaf2]">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="mb-8 flex items-end justify-between gap-6">
            <div>
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.24em] text-[#9a4f2f]">
                Latest writing
              </p>
              <h2 className="mt-3 text-3xl font-semibold">Recent articles</h2>
            </div>
            <Link href="/posts" className="hidden text-sm font-semibold text-[#385052] sm:inline">
              View all posts
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {posts.map((post, index) => (
              <Link
                key={post.title}
                href={`/posts/${post.slug}`}
                className="group rounded-lg border border-[#e2d8c9] bg-white p-5 transition hover:-translate-y-1 hover:border-[#b76645] hover:shadow-[0_18px_48px_rgba(68,52,35,0.1)]"
              >
                <div className="mb-8 flex items-center justify-between text-xs font-medium text-[#756d60]">
                  <span>{post.category}</span>
                  <span className="rounded-full bg-[#f8f1e7] px-2 py-1 font-mono">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="text-xl font-semibold leading-snug transition group-hover:text-[#9a4f2f]">
                  {post.title}
                </h3>
                <p className="mt-4 text-sm leading-6 text-[#625c51]">{post.excerpt}</p>
                <div className="mt-8 flex items-center justify-between text-sm text-[#8d8375]">
                  <span>{post.date}</span>
                  <span>{post.readTime}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-6 py-14 lg:grid-cols-[0.86fr_1.14fr]">
        <div id="topics" className="rounded-lg border border-[#d8cdbc] bg-[#fffaf2] p-6">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.24em] text-[#9a4f2f]">
            Explore
          </p>
          <h2 className="mt-3 text-3xl font-semibold">Topics I return to</h2>
          <p className="mt-4 text-sm leading-6 text-[#5f5a50]">
            The categories come from WordPress, so this little map changes as the blog
            grows.
          </p>
        </div>
        <div className="flex flex-wrap content-start gap-3">
          {topics.map((topic) => (
            <Link
              href={`/posts?topic=${encodeURIComponent(topic)}`}
              key={topic}
              className="rounded-full border border-[#cfc3b2] bg-[#fffaf2] px-5 py-3 text-sm font-medium text-[#4f4a42] transition hover:border-[#385052] hover:bg-white hover:text-[#1e1d1a]"
            >
              {topic}
            </Link>
          ))}
        </div>
      </section>
<section id="newsletter" className="bg-[#243b3d] px-6 py-14 text-[#fffaf2]">
  <div className="mx-auto flex max-w-6xl flex-col gap-8 md:flex-row md:items-end md:justify-between">
    <div>
      <p className="font-mono text-xs font-semibold uppercase tracking-[0.24em] text-[#f0b08d]">
        Newsletter
      </p>
      <h2 className="mt-3 max-w-2xl text-3xl font-semibold">
        Get new essays when they are published.
      </h2>
    </div>
    <NewsletterForm />
  </div>
</section>
    </main>
  );
}
