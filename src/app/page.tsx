import Image from "next/image";
import Link from "next/link";
import { WordPressSubscribeCta } from "./components/wordpress-subscribe-cta";
import { getPosts, hasWordPressSite } from "@/lib/wordpress";

export const dynamic = "force-dynamic";

export default async function Home() {
  const allPosts = await getPosts(4);
  const [featuredPost, ...posts] = allPosts;
  const topics = Array.from(
    new Set(allPosts.map((post) => post.category))
  ).slice(0, 5);
  const isConnectedToWordPress = hasWordPressSite();

  return (
    <main className="min-h-screen overflow-hidden bg-[#F5EFE3] text-[#1B2D2F]">

      {/* NAV */}
      <header className="sticky top-0 z-20 border-b border-[#DDD0BF] bg-[#F5EFE3]/90 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="group flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-full bg-[#1B2D2F] text-sm font-bold text-[#F5EFE3] transition group-hover:bg-[#C05A3A]">
              B
            </span>
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.22em]">
rain dump
            </span>
          </Link>
          <div className="hidden items-center gap-8 text-sm font-medium text-[#6B5D52] sm:flex">
            <a href="#posts" className="transition hover:text-[#1B2D2F]">
              Articles
            </a>
            <a href="#topics" className="transition hover:text-[#1B2D2F]">
              Topics
            </a>
            <a href="#newsletter" className="transition hover:text-[#1B2D2F]">
              Subscribe
            </a>
            <Link
              href="/posts"
              className="rounded-full bg-[#1B2D2F] px-4 py-2 text-xs font-semibold text-[#F5EFE3] transition hover:bg-[#C05A3A]"
            >
              All essays
            </Link>
          </div>
        </nav>
      </header>

      {/* HERO */}
      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-16 lg:grid-cols-[1fr_400px] lg:items-start lg:py-24">

        {/* Left column */}
        <div className="flex flex-col gap-8">

          {/* Eyebrow */}
          <div className="flex items-center gap-2.5">
            <span className="size-1.5 animate-pulse rounded-full bg-[#C05A3A]" />
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-[#9C8B7E]">
              Yapping session with Liza Louange
            </span>
          </div>

          {/* Headline with signature wavy underline */}
         <h1 className="font-display max-w-xl text-5xl font-semibold leading-[1.08] sm:text-6xl lg:text-7xl">
  welcome to <span className="text-[#C05A3A]">whatever this is</span>
</h1>

          {/* Subtitle */}
          <p className="max-w-md text-lg leading-8 text-[#6B5D52]">
A little brainrot, a little coding, a questionable amount of yapping, 
and whatever possessed me to hit "Publish."          </p>

          {/* CTAs */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href={`/posts/${featuredPost.slug}`}
              className="rounded-full bg-[#1B2D2F] px-6 py-3 text-center text-sm font-semibold text-[#F5EFE3] transition hover:bg-[#C05A3A]"
            >
              Read the latest essay
            </Link>
            
           <a href="#newsletter"
              className="rounded-full border border-[#C9BAA8] px-6 py-3 text-center text-sm font-semibold text-[#1B2D2F] transition hover:border-[#1B2D2F]"
            >
              Get essays by email
            </a>
          </div>

          {/* Stats — horizontal byline strip */}
          <div className="flex items-center gap-6 border-t border-[#DDD0BF] pt-6">
            {[
              [String(allPosts.length).padStart(2, "0"), "essays"],
              [topics.length ? String(topics.length) : "1", "topics"],
              [isConnectedToWordPress ? "Live" : "Soon", "WP sync"],
            ].map(([value, label], i) => (
              <div key={label} className="flex items-center gap-6">
                {i > 0 && <span className="h-5 w-px bg-[#DDD0BF]" />}
                <div>
                  <p className="font-display text-2xl font-semibold text-[#1B2D2F]">
                    {value}
                  </p>
                  <p className="text-xs text-[#9C8B7E]">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Featured post card */}
        <article className="group overflow-hidden rounded-2xl border border-[#DDD0BF] bg-[#FDF9F3] shadow-[0_20px_60px_rgba(27,45,47,0.10)] transition hover:shadow-[0_28px_72px_rgba(27,45,47,0.16)]">
          <div className="relative h-64 overflow-hidden">
            <Image
              src="/blog-cover.png"
              alt="Featured essay cover"
              fill
              className="object-cover transition duration-500 group-hover:scale-105"
              priority
              sizes="(min-width: 1024px) 400px, calc(100vw - 48px)"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(27,45,47,0.05),rgba(27,45,47,0.65))]" />
            <span className="absolute left-4 top-4 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur">
              Latest essay
            </span>
          </div>
          <div className="p-6">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#C05A3A]">
              {featuredPost.category}
            </p>
            <Link href={`/posts/${featuredPost.slug}`}>
              <h2 className="font-display mt-3 text-2xl font-semibold leading-snug text-[#1B2D2F] transition group-hover:text-[#C05A3A]">
                {featuredPost.title}
              </h2>
            </Link>
            <p className="mt-3 text-sm leading-7 text-[#6B5D52]">
              {featuredPost.excerpt}
            </p>
            <div className="mt-6 flex items-center justify-between border-t border-[#EDE3D7] pt-4 text-xs text-[#9C8B7E]">
              <span>{featuredPost.date}</span>
              <Link
                href={`/posts/${featuredPost.slug}`}
                className="font-semibold text-[#1B2D2F] transition hover:text-[#C05A3A]"
              >
                Read essay →
              </Link>
            </div>
          </div>
        </article>
      </section>

      {/* CURRENT MOOD BAND */}
      <section className="border-y border-[#DDD0BF] bg-[#1B2D2F] px-6 py-4 text-[#F5EFE3]">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#E09870]">
            Current mood
          </p>
          <p className="max-w-3xl text-white/70">
            me?? idrc fr 🥱
          </p>
        </div>
      </section>

      {/* RECENT POSTS */}
      <section id="posts" className="border-b border-[#DDD0BF] bg-[#FDF9F3]">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-[#C05A3A]">
                Latest writing
              </p>
              <h2 className="font-display mt-2 text-3xl font-semibold">
                Recent essays
              </h2>
            </div>
            <Link
              href="/posts"
              className="hidden text-sm font-semibold text-[#1B2D2F] underline underline-offset-4 sm:inline"
            >
              View all →
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post.title}
                href={`/posts/${post.slug}`}
                className="group flex flex-col rounded-xl border border-[#E5D9CA] bg-[#FDF9F3] p-6 transition hover:-translate-y-1 hover:border-[#C05A3A] hover:shadow-[0_16px_40px_rgba(27,45,47,0.08)]"
              >
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-[#C05A3A]">
                  {post.category}
                </p>
                <h3 className="font-display mt-3 text-xl font-semibold leading-snug transition group-hover:text-[#C05A3A]">
                  {post.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-6 text-[#6B5D52]">
                  {post.excerpt}
                </p>
                <div className="mt-6 flex items-center justify-between border-t border-[#EDE3D7] pt-4 text-xs text-[#9C8B7E]">
                  <span>{post.date}</span>
                  <span>{post.readTime}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* TOPICS */}
      <section className="mx-auto grid max-w-6xl gap-8 px-6 py-16 lg:grid-cols-[0.86fr_1.14fr]">
        <div
          id="topics"
          className="rounded-xl border border-[#DDD0BF] bg-[#FDF9F3] p-6"
        >
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-[#C05A3A]">
            Explore
          </p>
          <h2 className="font-display mt-2 text-3xl font-semibold">
            Topics I return to
          </h2>
          <p className="mt-3 text-sm leading-6 text-[#6B5D52]">
            Categories pulled from WordPress — this map grows as the blog does.
          </p>
        </div>
        <div className="flex flex-wrap content-start gap-3">
          {topics.map((topic) => (
            <Link
              href={`/posts?topic=${encodeURIComponent(topic)}`}
              key={topic}
              className="rounded-full border border-[#C9BAA8] bg-[#FDF9F3] px-5 py-2.5 text-sm font-medium text-[#4A3F35] transition hover:border-[#1B2D2F] hover:bg-white hover:text-[#1B2D2F]"
            >
              {topic}
            </Link>
          ))}
        </div>
      </section>

      {/* NEWSLETTER */}
      <section
        id="newsletter"
        className="bg-[#1B2D2F] px-6 py-16 text-[#F5EFE3]"
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="max-w-lg">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-[#E09870]">
              Newsletter
            </p>
            <h2 className="font-display mt-3 text-3xl font-semibold leading-snug">
              New essays, straight to your inbox.
            </h2>
            <p className="mt-3 text-sm leading-7 text-white/60">
             No spam?? sike, I'm spamming y'all.            </p>
          </div>
          <WordPressSubscribeCta />
        </div>
      </section>

    </main>
  );
}