import { aboutMarkdown, siteConfig } from "../../lib/site";
import { markdownToHtml } from "../../lib/posts";

export const metadata = {
  title: `About - ${siteConfig.title}`,
  description: "Stay hungry, stay foolish.",
};

export default function AboutPage() {
  const about = markdownToHtml(aboutMarkdown);

  return (
    <main>
      <header
        className="relative flex min-h-[360px] items-center bg-cover bg-center px-6 text-white"
        style={{ backgroundImage: "url('/background.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative mx-auto w-full max-w-4xl pt-16 text-center">
          <h1 className="text-5xl font-bold">About</h1>
          <p className="mt-4 text-xl font-light">Stay hungry, stay foolish.</p>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-6 py-12">
        <div
          className="post-content"
          dangerouslySetInnerHTML={{ __html: about.html }}
        />
      </div>
    </main>
  );
}
