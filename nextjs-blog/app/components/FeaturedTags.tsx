import Link from "next/link";

type FeaturedTag = {
  name: string;
  count: number;
};

const FeaturedTags = ({ tags }: { tags: FeaturedTag[] }) => {
  return (
    <section>
      <h5 className="mb-4 text-sm font-bold uppercase tracking-wide">
        <Link href="/tags" className="hover:text-[#0085a1]">
          Featured Tags
        </Link>
      </h5>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Link
            key={tag.name}
            href={`/tags#${encodeURIComponent(tag.name)}`}
            className="rounded border border-neutral-300 px-2 py-1 text-xs font-semibold uppercase text-neutral-600 hover:border-[#0085a1] hover:text-[#0085a1] dark:border-neutral-600 dark:text-neutral-300"
          >
            {tag.name} ({tag.count})
          </Link>
        ))}
      </div>
    </section>
  );
};

export default FeaturedTags;