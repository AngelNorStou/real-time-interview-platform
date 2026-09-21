"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLink({
  href,
  icon,
  children,
}: {
  href: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const active = href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition-all sm:px-4 ${
        active
          ? "bg-cyan-400/15 text-cyan-300 ring-1 ring-cyan-400/25"
          : "text-slate-300 hover:bg-white/5 hover:text-white"
      }`}
    >
      {icon && <span className="hidden sm:block">{icon}</span>}
      {children}
    </Link>
  );
}
