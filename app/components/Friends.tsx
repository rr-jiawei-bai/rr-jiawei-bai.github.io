import { siteConfig } from "../../lib/site";

const Friends = () => {
  return (
    <section>
      <h5 className="mb-4 text-sm font-bold uppercase tracking-wide">Friends</h5>
      <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
        {siteConfig.friends.map((friend) => (
          <li key={friend.href}>
            <a
              href={friend.href}
              target="_blank"
              rel="noreferrer"
              className="text-neutral-600 hover:text-[#0085a1] dark:text-neutral-300"
            >
              {friend.title}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Friends;