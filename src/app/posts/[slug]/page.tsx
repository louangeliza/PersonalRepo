import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCommentUrl, getComments, getPostBySlug } from "@/lib/wordpress";

type PostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Article not found | Liza Notes" };
  return {
    title: `${post.title} | Liza Notes`,
    description: post.excerpt,
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const comments = await getComments(post.id);
  const wordpressCommentUrl = getCommentUrl(post);

  return (
    <main className="min-h-screen bg-[#F5EFE3] text-[#1B2D2F]">

      {/* NAV */}
      <header className="sticky top-0 z-20 border-b border-[#DDD0BF] bg-[#F5EFE3]/90 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="group flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-full bg-[#1B2D2F] text-sm font-bold text-[#F5EFE3] transition group-hover:bg-[#C05A3A]">
              L
            </span>
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.22em]">
              Liza Notes
            </span>
          </Link>
          <Link
            href="/posts"
            className="text-sm font-semibold text-[#6B5D52] transition hover:text-[#1B2D2F]"
          >
            ← All essays
          </Link>
        </nav>
      </header>

      <article className="mx-auto max-w-3xl px-6 pb-24 pt-14">

        {/* HEADER */}
        <header className="mb-12">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-[#C05A3A]">
            {post.category}
          </p>
          <h1 className="font-display mt-4 text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
            {post.title}
          </h1>

          {/* Meta strip */}
          <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-[#DDD0BF] pt-6 text-sm text-[#9C8B7E]">
            <span className="flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-[#C05A3A]" />
              Liza Louange
            </span>
            <span className="h-3.5 w-px bg-[#DDD0BF]" />
            <span>{post.date}</span>
            <span className="h-3.5 w-px bg-[#DDD0BF]" />
            <span>{post.readTime}</span>
          </div>
        </header>

        {/* CONTENT */}
        <div
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* FOOTER NAV */}
        <div className="mt-16 flex items-center justify-between border-t border-[#DDD0BF] pt-8">
          <Link
            href="/posts"
            className="rounded-full border border-[#C9BAA8] px-5 py-2.5 text-sm font-semibold text-[#1B2D2F] transition hover:border-[#1B2D2F]"
          >
            ← Back to essays
          </Link>
          <Link
            href="/"
            className="rounded-full bg-[#1B2D2F] px-5 py-2.5 text-sm font-semibold text-[#F5EFE3] transition hover:bg-[#C05A3A]"
          >
            Home
          </Link>
        </div>

        {/* COMMENTS */}
        <section className="mt-16 border-t border-[#DDD0BF] pt-12">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-[#C05A3A]">
            Reader notes
          </p>
          <h2 className="font-display mt-2 text-3xl font-semibold">
            Comments
          </h2>

          <div className="mt-8 space-y-4">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <article
                  key={comment.id}
                  className="rounded-xl border border-[#E5D9CA] bg-[#FDF9F3] p-6"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="grid size-8 place-items-center rounded-full bg-[#1B2D2F] text-xs font-bold text-[#F5EFE3]">
                        {comment.authorName?.[0]?.toUpperCase() ?? "?"}
                      </span>
                      <p className="text-sm font-semibold text-[#1B2D2F]">
                        {comment.authorName}
                      </p>
                    </div>
                    <p className="text-xs text-[#9C8B7E]">{comment.date}</p>
                  </div>
                  <div
                    className="blog-comment mt-4 pl-11"
                    dangerouslySetInnerHTML={{ __html: comment.content }}
                  />
                </article>
              ))
            ) : (
              <p className="rounded-xl border border-dashed border-[#C9BAA8] bg-[#FDF9F3] p-6 text-sm text-[#6B5D52]">
                No comments yet — be the first to leave a note.
              </p>
            )}
          </div>

          {/* Leave a comment */}
          {wordpressCommentUrl && (
            <div className="mt-6 rounded-xl border border-[#DDD0BF] bg-[#FDF9F3] p-6">
              <h3 className="font-display text-xl font-semibold">
                Leave a note
              </h3>
              <p className="mt-2 text-sm leading-6 text-[#6B5D52]">
                Comments are handled by WordPress — once approved they show up here automatically.
              </p>
              
              <a  href={wordpressCommentUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex rounded-full bg-[#1B2D2F] px-5 py-2.5 text-sm font-semibold text-[#F5EFE3] transition hover:bg-[#C05A3A]"
              >
                Comment on WordPress →
              </a>
            </div>
          )}
        </section>
      </article>
    </main>
  );
}
