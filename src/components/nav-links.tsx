"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "/writing" },
  { href: "/about", label: "/about" },
];

export function NavLinks() {
  const pathname = usePathname();

  return (
    <>
      {links.map((link) => {
        const active =
          link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={
              active
                ? "bg-blue text-white rounded-sm px-2 py-0.5"
                : "text-faint hover:text-ink transition-colors"
            }
          >
            {link.label}
          </Link>
        );
      })}
    </>
  );
}
