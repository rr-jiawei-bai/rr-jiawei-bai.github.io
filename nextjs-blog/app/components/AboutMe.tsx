import Link from "next/link";
import { siteConfig } from "../../lib/site";

const AboutMe = () => {
  return (
    <section>
      <h5 className="mb-4 text-sm font-bold uppercase tracking-wide">
        <Link href="/about" className="hover:text-[#0085a1]">
          About Me
        </Link>
      </h5>
      <div className="space-y-3 text-sm leading-6 text-neutral-600 dark:text-neutral-300">
        <p>{siteConfig.sidebarAboutDescription}</p>
      </div>
    </section>
  );
};

export default AboutMe;