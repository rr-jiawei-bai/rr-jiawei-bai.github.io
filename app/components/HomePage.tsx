import { getAllPosts, type Post } from "../../lib/posts";
import HeroBanner from "./HeroBanner";
import SideBar from "./SideBar";

const PostCard = ({ post }: { post: Post }) => {
  return (
    <article className="py-8 px-1">
      <a href={`/posts/${post.slug}`} className="hover:text-[#0085a1]">
        <div className="text-2xl mb-2 font-bold">{post.title}</div>
        {post.subtitle ? <div className="text-lg mb-2">{post.subtitle}</div> : null}
        <p className="mb-2">{post.excerpt}...</p>
      </a>
      <p className="italic font-light text-neutral-600 dark:text-neutral-400">
        Posted on {post.date}; Words: {post.words}
      </p>
    </article>
  );
};

const RecentPosts = ({ posts }: { posts: Post[] }) => {
  return (
    <div className="min-w-0 flex-1 text-neutral-800 dark:text-neutral-200 divide-y divide-neutral-200 dark:divide-neutral-700">
      {posts.map((post) => (
        <PostCard key={post.slug} post={post} />
      ))}
    </div>
  );
};

export default async function HomePage() {
  const posts = getAllPosts();

  return (
    <div>
      <HeroBanner />
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-12 md:px-10 lg:flex-row lg:py-16">
        <RecentPosts posts={posts} />
        <SideBar />
      </div>
    </div>
  );
}
