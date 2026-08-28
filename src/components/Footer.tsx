"use client";

import { usePathname } from "next/navigation";
import { RESTAURANT } from "@/lib/seed";

export function Footer() {
  const path = usePathname();
  if (path.startsWith("/admin")) return null;

  return (
    <footer className="mt-16 border-t border-[#EDE7E1] bg-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-3">
        <div>
          <div className="font-display text-lg">GHOUSIA FAST FOODS</div>
          <p className="mt-2 text-sm font-medium text-[#5c5750]">{RESTAURANT.shortName}</p>
        </div>
        <div className="text-sm font-medium text-[#5c5750]">
          <div className="font-bold text-[#1C1B1A]">Visit us</div>
          <p className="mt-1">{RESTAURANT.address}</p>
          <p className="mt-1">{RESTAURANT.hours}</p>
        </div>
        <div className="text-sm font-medium text-[#5c5750]">
          <div className="font-bold text-[#1C1B1A]">Order by phone</div>
          {RESTAURANT.phones.map((p) => (
            <a key={p} href={`tel:${p}`} className="mt-1 block hover:text-[#FF4630]">
              {p}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
