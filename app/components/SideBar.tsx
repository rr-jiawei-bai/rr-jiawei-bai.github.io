import { getFeaturedTags } from "../../lib/posts";
import AboutMe from "./AboutMe";
import FeaturedTags from "./FeaturedTags";
import Friends from "./Friends";

const SideBar = () => {
  const tags = getFeaturedTags();

  return (
    <aside className="space-y-8 border-t border-neutral-200 pt-8 text-neutral-800 dark:border-neutral-700 dark:text-neutral-100 lg:w-64 lg:border-t-0 lg:pt-0">
      <FeaturedTags tags={tags} />
      <AboutMe />
      <Friends />
    </aside>
  );
};

export default SideBar;