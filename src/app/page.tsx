import type { ReactNode } from "react";
import Link from "next/link";
import { RESTAURANT } from "@/lib/seed";
import { MapPin, Phone, Clock } from "lucide-react";

const featured = [
  { name: "Zinger Burger with Fries", price: 270, emoji: "🍔", cat: "Best seller" },
  { name: "Chicken Tikka Leg", price: 360, emoji: "🍗", cat: "Bar B.Q" },
  { name: "Chicken Broast Half", price: 900, emoji: "🔥", cat: "Broast" },
  { name: "Deal 1", price: 500, emoji: "🎟️", cat: "Combo" },
];

export default function HomePage() {
  return (
    <main>
      <section className="relative overflow-hidden bg-[#1C1B1A] text-white">
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#FF4630]/30 blur-3xl" />
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#FF4630]">Buffer Zone · North Karachi</p>
            <h1 className="font-display mt-3 text-4xl leading-[0.95] md:text-6xl">
              HOT BBQ.
              <br />
              CRISPY BROAST.
              <br />
              <span className="text-[#FF4630]">ORDER NOW.</span>
            </h1>
            <p className="mt-5 max-w-md text-sm font-medium text-[#c4bdb4]">
              Ghousia Fast Foods & Al Jannat — rolls, zinger, karahi and 28 combo deals. Pickup or delivery. Guest
              checkout, no login.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/menu" className="rounded-full bg-[#FF4630] px-6 py-3 text-sm font-bold text-white">
                View menu
              </Link>
              <Link href="/cart" className="rounded-full border border-white/20 px-6 py-3 text-sm font-bold">
                Open cart
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {featured.map((f) => (
              <div key={f.name} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <div className="text-3xl">{f.emoji}</div>
                <div className="mt-3 text-[10px] font-bold uppercase tracking-wider text-[#FF4630]">{f.cat}</div>
                <div className="mt-1 text-sm font-bold">{f.name}</div>
                <div className="ticket-price mt-2 text-lg font-bold">Rs {f.price}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-4 py-10 md:grid-cols-3">
        <Info icon={<MapPin size={18} />} title="Address" text={RESTAURANT.address} />
        <Info icon={<Phone size={18} />} title="Call / WhatsApp" text={RESTAURANT.phones.join(" · ")} />
        <Info icon={<Clock size={18} />} title="Hours" text={RESTAURANT.hours} />
      </section>
    </main>
  );
}

function Info({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <div className="rounded-3xl border border-[#EDE7E1] bg-white p-5">
      <div className="flex items-center gap-2 text-[#FF4630]">{icon}</div>
      <div className="mt-2 text-xs font-bold uppercase tracking-wider text-[#8a8580]">{title}</div>
      <div className="mt-1 text-sm font-semibold">{text}</div>
    </div>
  );
}
