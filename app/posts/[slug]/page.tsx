import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdjacentPosts, getAllPosts, getPostBySlug } from "../../../lib/posts";

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  try {
    const post = getPostBySlug(slug);
    return {
      title: `${post.title} - JasonBai's Blog`,
      description: post.excerpt,
    };
  } catch {
    return {
      title: "Post Not Found - JasonBai's Blog",
    };
  }
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let post;
  try {
    post = getPostBySlug(slug);
  } catch {
    notFound();
  }

  const { previous, next } = getAdjacentPosts(slug);

  return (
    <article>
      <header
        className="relative flex min-h-[420px] items-center bg-cover bg-center px-6 text-white"
        style={{ backgroundImage: "url('/background.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative mx-auto w-full max-w-4xl pt-16">
          <div className="mb-6 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/tags#${encodeURIComponent(tag)}`}
                className="rounded border border-white/70 px-3 py-1 text-sm font-semibold uppercase tracking-wide hover:bg-white hover:text-neutral-900"
              >
                {tag}
              </Link>
            ))}
          </div>
          <h1 className="text-4xl font-bold leading-tight md:text-5xl">{post.title}</h1>
          {post.subtitle ? (
            <p className="mt-4 text-xl font-light text-white/90 md:text-2xl">
              {post.subtitle}
            </p>
          ) : null}
          <p className="mt-6 text-sm italic text-white/85">
            Posted by {post.author ?? "JasonBai's Blog"} on {post.date}; Words:{" "}
            {post.words}
          </p>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-5xl gap-12 px-6 py-12 lg:grid-cols-[minmax(0,1fr)_220px]">
        <div>
          <div
            className="post-content"
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          />

          <nav className="mt-14 flex flex-col gap-4 border-t border-neutral-200 pt-8 dark:border-neutral-700 md:flex-row md:justify-between">
            {previous ? (
              <Link className="group max-w-sm" href={`/posts/${previous.slug}`}>
                <span className="block text-sm uppercase text-neutral-500">Previous</span>
                <span className="font-semibold group-hover:text-[#0085a1]">
                  {previous.title}
                </span>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link className="group max-w-sm text-left md:text-right" href={`/posts/${next.slug}`}>
                <span className="block text-sm uppercase text-neutral-500">Next</span>
                <span className="font-semibold group-hover:text-[#0085a1]">
                  {next.title}
                </span>
              </Link>
            ) : null}
          </nav>
        </div>

        {post.catalog && post.headings.length > 0 ? (
          <aside className="hidden border-l border-neutral-200 pl-6 text-sm text-neutral-500 dark:border-neutral-700 lg:block">
            <p className="font-semibold uppercase tracking-wide text-neutral-700 dark:text-neutral-200">
              Catalog
            </p>
            <nav className="mt-3 space-y-2">
              {post.headings.map((heading) => (
                <a
                  key={heading.id}
                  href={`#${heading.id}`}
                  className="block leading-6 hover:text-[#0085a1]"
                  style={{ paddingLeft: `${(heading.depth - 1) * 12}px` }}
                >
                  {heading.text}
                </a>
              ))}
            </nav>
          </aside>
        ) : null}
      </div>
    </article>
  );
}