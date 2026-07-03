import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import { toString } from "mdast-util-to-string";

const postsDirectory = path.join(process.cwd(), "posts");

export type Post = {
  slug: string;
  title: string;
  subtitle?: string;
  excerpt: string;
  date: string;
  rawDate: string;
  words: number;
  author?: string;
  headerImage?: string;
  tags: string[];
  catalog: boolean;
};

export type PostDetail = Post & {
  contentHtml: string;
  headings: PostHeading[];
};

export type PostHeading = {
  id: string;
  text: string;
  depth: number;
};

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

function formatDate(date: string | Date) {
  return dateFormatter.format(new Date(date));
}

function normalizeTags(tags: unknown): string[] {
  return Array.isArray(tags) ? tags.map((tag) => String(tag)).filter(Boolean) : [];
}

function markdownToPlainText(markdown: string) {
  return toString(remark().parse(markdown)).trim();
}

function makeHeadingId(text: string, usedIds: Set<string>) {
  const base =
    text
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\p{Letter}\p{Number}\-_]+/gu, "") || "section";
  let id = base;
  let index = 2;

  while (usedIds.has(id)) {
    id = `${base}-${index}`;
    index += 1;
  }

  usedIds.add(id);
  return id;
}

export function markdownToHtml(markdown: string) {
  const tree = remark().parse(markdown);
  const headings: PostHeading[] = [];
  const usedIds = new Set<string>();

  function visit(node: unknown) {
    if (!node || typeof node !== "object") {
      return;
    }

    const current = node as {
      type?: string;
      depth?: number;
      children?: unknown[];
      data?: { hProperties?: Record<string, string> };
    };

    if (current.type === "heading" && current.depth && current.depth <= 3) {
      const text = toString(current).trim();
      const id = makeHeadingId(text, usedIds);

      current.data = {
        ...current.data,
        hProperties: {
          ...current.data?.hProperties,
          id,
        },
      };

      headings.push({ id, text, depth: current.depth });
    }

    current.children?.forEach(visit);
  }

  visit(tree);

  return {
    html: remark().use(html).stringify(tree),
    headings,
  };
}

function getPostFileNames() {
  return fs.readdirSync(postsDirectory).filter((fileName) => fileName.endsWith(".md"));
}

function readPost(fileName: string): Post & { content: string } {
  const slug = fileName.replace(/\.md$/, "");
  const fullPath = path.join(postsDirectory, fileName);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);
  const plain = markdownToPlainText(content);
  const rawDate = new Date(data.date).toISOString();

  return {
    slug,
    title: data.title ?? slug,
    subtitle: data.subtitle,
    excerpt: data.excerpt ?? plain.slice(0, 200),
    date: formatDate(rawDate),
    rawDate,
    words: plain.length,
    author: data.author,
    headerImage: data["header-img"],
    tags: normalizeTags(data.tags),
    catalog: Boolean(data.catalog),
    content,
  };
}

export function getAllPosts(): Post[] {
  return getPostFileNames()
    .map(readPost)
    .map(({ content, ...post }) => post)
    .sort((a, b) => Date.parse(b.rawDate) - Date.parse(a.rawDate));
}

export function getPostBySlug(slug: string): PostDetail {
  const decodedSlug = decodeURIComponent(slug);
  const post = readPost(`${decodedSlug}.md`);
  const rendered = markdownToHtml(post.content);

  return {
    ...post,
    contentHtml: rendered.html,
    headings: rendered.headings,
  };
}

export function getAdjacentPosts(slug: string) {
  const posts = getAllPosts();
  const index = posts.findIndex((post) => post.slug === decodeURIComponent(slug));

  return {
    previous: index > 0 ? posts[index - 1] : undefined,
    next: index >= 0 && index < posts.length - 1 ? posts[index + 1] : undefined,
  };
}

export function getAllTags() {
  const tagMap = new Map<string, Post[]>();

  getAllPosts().forEach((post) => {
    post.tags.forEach((tag) => {
      const posts = tagMap.get(tag) ?? [];
      posts.push(post);
      tagMap.set(tag, posts);
    });
  });

  return Array.from(tagMap.entries())
    .map(([name, posts]) => ({ name, posts, count: posts.length }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function getFeaturedTags() {
  return getAllTags().filter((tag) => tag.count > 0);
}