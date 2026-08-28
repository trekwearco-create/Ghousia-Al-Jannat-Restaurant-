"use client";

import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/components/CartProvider";
import type { Category, Deal, MenuItem } from "@/lib/seed";

export default function MenuPage() {
  const { add } = useCart();
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [active, setActive] = useState("all");
  const [toast, setToast] = useState("");

  useEffect(() => {
    Promise.all([fetch("/api/categories").then((r) => r.json()), fetch("/api/menu").then((r) => r.json()), fetch("/api/deals").then((r) => r.json())]).then(
      ([c, m, d]) => {
        setCategories(c);
        setItems(m);
        setDeals(d);
      }
    );
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 1600);
    return () => clearTimeout(t);
  }, [toast]);

  const ping = (name: string) => setToast(`${name} added to cart`);

  const visible = useMemo(() => {
    if (active === "all") return items;
    if (active === "deals") return [];
    return items.filter((i) => i.categoryId === active);
  }, [active, items]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="font-display text-3xl md:text-5xl">THE MENU</h1>
      <p className="mt-2 text-sm font-medium text-[#8a8580]">Ticket-style prices in PKR. Tap to add.</p>

      <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
        <Chip on={active === "all"} onClick={() => setActive("all")}>
          All
        </Chip>
        <Chip on={active === "deals"} onClick={() => setActive("deals")}>
          Combo Deals
        </Chip>
        {categories.map((c) => (
          <Chip key={c.id} on={active === c.id} onClick={() => setActive(c.id)}>
            {c.name}
          </Chip>
        ))}
      </div>

      {(active === "all" || active === "deals") && (
        <section className="mt-8">
          <h2 className="font-display text-xl">Combo Deals</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {deals.map((d) => (
              <article key={d.id} className="rounded-3xl border border-[#EDE7E1] bg-white p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#FF4630]">Combo</div>
                    <h3 className="mt-1 font-black">{d.title}</h3>
                    <p className="mt-1 text-xs font-medium text-[#5c5750]">{d.description}</p>
                  </div>
                  <div className="ticket-price shrink-0 text-lg font-bold">Rs {d.price}</div>
                </div>
                <button
                  className="mt-4 w-full rounded-full bg-[#1C1B1A] py-2.5 text-sm font-bold text-white"
                  onClick={() => {
                    add({ kind: "deal", id: d.id, name: d.title, unitPrice: d.price });
                    ping(d.title);
                  }}
                >
                  Add deal
                </button>
              </article>
            ))}
          </div>
        </section>
      )}

      {active !== "deals" && (
        <section className="mt-10">
          <h2 className="font-display text-xl">{active === "all" ? "All items" : categories.find((c) => c.id === active)?.name}</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((item) => (
              <ItemCard key={item.id} item={item} onAdd={ping} />
            ))}
          </div>
        </section>
      )}

      {toast && (
        <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-full bg-[#1C1B1A] px-5 py-2.5 text-sm font-bold text-white shadow-lg">
          {toast}
        </div>
      )}
    </main>
  );
}

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold ${
        on ? "bg-[#FF4630] text-white" : "border border-[#EDE7E1] bg-white text-[#5c5750]"
      }`}
    >
      {children}
    </button>
  );
}

function ItemCard({ item, onAdd }: { item: MenuItem; onAdd: (name: string) => void }) {
  const { add } = useCart();
  const [half, setHalf] = useState(false);
  const price = half && item.variantPrice ? item.variantPrice : item.price;
  const variant = half ? item.variantLabel || "Half" : item.variantPrice ? "Full" : undefined;

  return (
    <article className="rounded-3xl border border-[#EDE7E1] bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-2xl">{item.emoji}</div>
          <h3 className="mt-2 font-black">{item.name}</h3>
          {item.description && <p className="mt-1 text-xs font-medium text-[#8a8580]">{item.description}</p>}
        </div>
        <div className="ticket-price text-lg font-bold">Rs {price}</div>
      </div>
      {item.variantPrice && (
        <div className="mt-3 flex gap-2">
          <button
            onClick={() => setHalf(false)}
            className={`rounded-full px-3 py-1 text-xs font-bold ${!half ? "bg-[#FFEFE3] text-[#FF4630]" : "bg-[#F5F2EE] text-[#8a8580]"}`}
          >
            Full Rs {item.price}
          </button>
          <button
            onClick={() => setHalf(true)}
            className={`rounded-full px-3 py-1 text-xs font-bold ${half ? "bg-[#FFEFE3] text-[#FF4630]" : "bg-[#F5F2EE] text-[#8a8580]"}`}
          >
            Half Rs {item.variantPrice}
          </button>
        </div>
      )}
      <button
        className="mt-4 w-full rounded-full bg-[#1C1B1A] py-2.5 text-sm font-bold text-white"
        onClick={() => {
          add({
            kind: "item",
            id: item.id,
            name: variant ? `${item.name} (${variant})` : item.name,
            unitPrice: price,
            variant,
          });
          onAdd(item.name);
        }}
      >
        Add to cart
      </button>
    </article>
  );
}
