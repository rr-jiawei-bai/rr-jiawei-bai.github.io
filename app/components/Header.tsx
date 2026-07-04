'use client';

import Link from "next/link";
import { useEffect, useState } from "react";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/tags", label: "Tags" },
  { href: "/about", label: "About" },
];

const Header = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isTop, setIsTop] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      setIsTop(currentScrollY === 0);

      if (currentScrollY > lastScrollY) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const textColor = isTop && !isMenuOpen ? "text-white" : "text-neutral-900 dark:text-white";
  const background = isTop && !isMenuOpen ? "bg-transparent" : "bg-white/95 shadow-sm backdrop-blur dark:bg-neutral-900/95";

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${background}`}
      style={{ transform: isVisible ? "translateY(0)" : "translateY(-100%)" }}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link className={`text-lg font-bold ${textColor}`} href="/">
          JasonBai&apos;s Blog
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              className={`font-bold ${textColor} hover:text-[#0085a1]`}
              href={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          className={`flex flex-col gap-1.5 md:hidden ${textColor}`}
          aria-label="Toggle navigation"
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <span className="block h-0.5 w-6 bg-current" />
          <span className="block h-0.5 w-6 bg-current" />
          <span className="block h-0.5 w-6 bg-current" />
        </button>
      </div>

      {isMenuOpen ? (
        <div className="border-t border-neutral-200 bg-white px-6 py-4 shadow-sm dark:border-neutral-700 dark:bg-neutral-900 md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                className="font-bold hover:text-[#0085a1]"
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
};

export default Header;