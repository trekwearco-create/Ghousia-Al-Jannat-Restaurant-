import type { ReactNode } from "react";
import { MapPin, Phone, Clock } from "lucide-react";
import { RESTAURANT } from "@/lib/seed";

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-display text-4xl md:text-5xl">ABOUT US</h1>
      <p className="mt-4 text-sm font-medium leading-relaxed text-[#5c5750]">
        Ghousia Fast Foods & Al Jannat (Jannat Fast Food Pizza & Bar B.Q) serves Buffer Zone, North Karachi with
        broast, BBQ, rolls, burgers, karahi and family combo deals. Order online for pickup or delivery — or call us
        the old way.
      </p>
      <div className="mt-8 space-y-4">
        <Row icon={<MapPin size={18} />} label="Location" value={RESTAURANT.address} />
        <Row icon={<Phone size={18} />} label="Phone" value={RESTAURANT.phones.join(" · ")} />
        <Row icon={<Clock size={18} />} label="Hours" value={RESTAURANT.hours} />
      </div>
      <div className="mt-8 overflow-hidden rounded-3xl border border-[#EDE7E1]">
        <iframe
          title="Restaurant location"
          className="h-72 w-full"
          loading="lazy"
          src="https://maps.google.com/maps?q=Buffer%20Zone%20North%20Karachi%2015-A/3&t=&z=15&ie=UTF8&iwloc=&output=embed"
        />
      </div>
    </main>
  );
}

function Row({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 rounded-3xl border border-[#EDE7E1] bg-white p-5">
      <div className="text-[#FF4630]">{icon}</div>
      <div>
        <div className="text-[11px] font-bold uppercase tracking-wider text-[#8a8580]">{label}</div>
        <div className="mt-1 text-sm font-semibold">{value}</div>
      </div>
    </div>
  );
}
