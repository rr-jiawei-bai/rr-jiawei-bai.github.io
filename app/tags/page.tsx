import Link from "next/link";
import { getAllTags } from "../../lib/posts";
import { siteConfig } from "../../lib/site";

export const metadata = {
  title: `Tags - ${siteConfig.title}`,
  description: "永远相信美好的事即将发生",
};

export default function TagsPage() {
  const tags = getAllTags();

  return (
    <main>
      <header
        className="relative flex min-h-[360px] items-center bg-cover bg-center px-6 text-white"
        style={{ backgroundImage: "url('/background.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative mx-auto w-full max-w-4xl pt-16 text-center">
          <h1 className="text-5xl font-bold">Tags</h1>
          <p className="mt-4 text-xl font-light">永远相信美好的事即将发生</p>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-12 flex flex-wrap gap-3">
          {tags.map((tag) => (
            <a
              key={tag.name}
              href={`#${encodeURIComponent(tag.name)}`}
              className="rounded border border-neutral-300 px-3 py-1 text-sm font-semibold uppercase hover:border-[#0085a1] hover:text-[#0085a1] dark:border-neutral-600"
            >
              {tag.name} ({tag.count})
            </a>
          ))}
        </div>

        <div className="space-y-12">
          {tags.map((tag) => (
            <section key={tag.name} id={tag.name} className="scroll-mt-24">
              <h2 className="mb-4 text-2xl font-bold text-[#0085a1]">
                # {tag.name}
              </h2>
              <div className="divide-y divide-neutral-200 dark:divide-neutral-700">
                {tag.posts.map((post) => (
                  <article key={post.slug} className="py-5">
                    <Link href={`/posts/${post.slug}`} className="group">
                      <h3 className="text-xl font-bold group-hover:text-[#0085a1]">
                        {post.title}
                      </h3>
                      {post.subtitle ? (
                        <p className="mt-1 text-neutral-600 dark:text-neutral-300">
                          {post.subtitle}
                        </p>
                      ) : null}
                    </Link>
                    <p className="mt-2 text-sm italic text-neutral-500">
                      Posted on {post.date}; Words: {post.words}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
