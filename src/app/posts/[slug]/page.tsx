import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCommentUrl, getComments, getPostBySlug } from "@/lib/wordpress";

type PostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Article not found | Liza.dev",
    };
  }

  return {
    title: `${post.title} | Liza.dev`,
    description: post.excerpt,
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const comments = await getComments(post.id);
  const wordpressCommentUrl = getCommentUrl(post);

  return (
    <main className="min-h-screen bg-[#f8f1e7] px-6 py-10 text-[#1e1d1a]">
      <article className="mx-auto max-w-5xl">
        <Link href="/posts" className="text-sm font-semibold text-[#385052]">
          Back to articles
        </Link>

        <header className="mt-12 border-b border-[#d8cdbc] pb-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_260px] lg:items-end">
            <div>
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.24em] text-[#9a4f2f]">
                {post.category}
              </p>
              <h1 className="mt-4 max-w-4xl text-5xl font-semibold leading-tight sm:text-6xl">
                {post.title}
              </h1>
            </div>
            <div className="rounded-lg border border-[#d8cdbc] bg-[#fffaf2] p-5 text-sm text-[#5f5a50]">
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#9a4f2f]">
                Essay info
              </p>
              <div className="mt-4 space-y-3">
                <p className="flex justify-between gap-4">
                  <span>Published</span>
                  <span className="font-semibold text-[#1e1d1a]">{post.date}</span>
                </p>
                <p className="flex justify-between gap-4">
                  <span>Read time</span>
                  <span className="font-semibold text-[#1e1d1a]">{post.readTime}</span>
                </p>
              </div>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-3xl">
          <div
            className="blog-content mt-10"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>

        <section className="mx-auto mt-14 max-w-3xl border-t border-[#d8cdbc] pt-10">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.24em] text-[#9a4f2f]">
            Reader notes
          </p>
          <h2 className="mt-3 text-3xl font-semibold">Comments & reviews</h2>
          <p className="mt-4 text-sm leading-6 text-[#5f5a50]">
            Comments are powered by WordPress, so they can be moderated from the same
            dashboard where you write posts. Approved comments appear here automatically.
          </p>

          <div className="mt-8 space-y-4">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <article
                  className="rounded-lg border border-[#e2d8c9] bg-[#fffaf2] p-5 shadow-[0_12px_34px_rgba(68,52,35,0.05)]"
                  key={comment.id}
                >
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <p className="font-semibold text-[#1e1d1a]">{comment.authorName}</p>
                    <p className="text-[#756d60]">{comment.date}</p>
                  </div>
                  <div
                    className="blog-comment mt-3"
                    dangerouslySetInnerHTML={{ __html: comment.content }}
                  />
                </article>
              ))
            ) : (
              <p className="rounded-lg border border-dashed border-[#cfc3b2] bg-[#fffaf2] p-5 text-sm text-[#5f5a50]">
                No comments yet. Be the first to leave a note.
              </p>
            )}
          </div>

          <div className="mt-6 rounded-lg border border-[#d8cdbc] bg-[#fffaf2] p-5">
            <h3 className="text-xl font-semibold">Leave a comment</h3>
            <p className="mt-3 text-sm leading-6 text-[#5f5a50]">
              WordPress.com handles the actual comment form for now. Leave your note
              there, and once it is approved it will show up on this page too.
            </p>
            {wordpressCommentUrl ? (
              <a
                href={wordpressCommentUrl}
                className="mt-5 inline-flex rounded-md bg-[#243b3d] px-5 py-3 text-sm font-semibold text-[#fffaf2] transition hover:bg-[#385052]"
                target="_blank"
                rel="noreferrer"
              >
                Comment on WordPress
              </a>
            ) : null}
          </div>
        </section>
      </article>
    </main>
  );
}
