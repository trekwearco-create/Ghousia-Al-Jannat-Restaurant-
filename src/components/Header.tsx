"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { useCart } from "./CartProvider";

export function Header() {
  const { count } = useCart();
  const path = usePathname();
  if (path.startsWith("/admin")) return null;

  const links = [
    { href: "/", label: "Home" },
    { href: "/menu", label: "Menu" },
    { href: "/about", label: "About" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-[#EDE7E1] bg-[#FFFDFB]/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FF4630] text-sm font-black text-white">
            GJ
          </span>
          <span className="leading-tight">
            <span className="font-display block text-sm tracking-tight">GHOUSIA & JANNAT</span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8a8580]">
              Fast Food · Pizza · BBQ
            </span>
          </span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-bold md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={path === l.href ? "text-[#FF4630]" : "text-[#5c5750] hover:text-[#1C1B1A]"}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/cart"
          className="relative flex h-11 items-center gap-2 rounded-full bg-[#1C1B1A] px-4 text-sm font-bold text-white"
        >
          <ShoppingBag size={16} />
          Cart
          {count > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#FF4630] px-1 text-[10px]">
              {count}
            </span>
          )}
        </Link>
      </div>
      <nav className="flex gap-4 overflow-x-auto border-t border-[#F0EBE5] px-4 py-2 text-sm font-bold md:hidden">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className={path === l.href ? "text-[#FF4630]" : "text-[#5c5750]"}>
            {l.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
