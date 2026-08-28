"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BarChart3,
  Bell,
  ClipboardList,
  MoreVertical,
  Phone,
  Plus,
  Search,
  Store,
  Tag,
  Truck,
  UtensilsCrossed,
} from "lucide-react";
import type { Order, OrderStatus } from "@/lib/types";
import type { Category, Deal, MenuItem } from "@/lib/seed";

const ACCENT = "#FF4630";
const INK = "#1C1B1A";
const STATUSES: OrderStatus[] = ["Received", "Preparing", "Ready", "Completed"];

export default function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState("orders");
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [banner, setBanner] = useState("");

  async function loadOrders() {
    const res = await fetch("/api/admin/orders");
    if (res.status === 401) {
      setAuthed(false);
      router.replace("/admin/login");
      return;
    }
    setAuthed(true);
    setOrders(await res.json());
  }

  useEffect(() => {
    loadOrders();
    const es = new EventSource("/api/admin/events");
    es.onmessage = (ev) => {
      try {
        const data = JSON.parse(ev.data);
        if (data.type === "order") {
          setOrders((curr) => [data.order, ...curr.filter((o) => o.id !== data.order.id)]);
          setBanner(`New order ${data.order.orderNumber}`);
          try {
            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.frequency.value = 880;
            gain.gain.value = 0.05;
            osc.start();
            osc.stop(ctx.currentTime + 0.18);
          } catch {
            /* ignore */
          }
        }
      } catch {
        /* ignore */
      }
    };
    const poll = setInterval(loadOrders, 20000);
    return () => {
      es.close();
      clearInterval(poll);
    };
  }, [router]);

  useEffect(() => {
    if (!banner) return;
    const t = setTimeout(() => setBanner(""), 4000);
    return () => clearTimeout(t);
  }, [banner]);

  if (authed === null) {
    return <div className="flex min-h-screen items-center justify-center text-sm font-medium text-[#8a8580]">Loading…</div>;
  }
  if (!authed) return null;

  const nav = [
    { id: "orders", label: "Orders", icon: ClipboardList },
    { id: "menu", label: "Menu", icon: UtensilsCrossed },
    { id: "deals", label: "Deals", icon: Tag },
    { id: "reports", label: "Reports", icon: BarChart3 },
  ];

  return (
    <div className="flex min-h-screen bg-[#FAF8F6] text-[#1C1B1A]">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-[#EDE7E1] bg-white md:flex">
        <div className="border-b border-[#EDE7E1] px-5 py-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-black text-white" style={{ backgroundColor: ACCENT }}>
              GJ
            </div>
            <div className="leading-none">
              <div className="font-display text-sm">ADMIN</div>
              <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#8a8580]">Ghousia & Jannat</div>
            </div>
          </div>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {nav.map((n) => (
            <button
              key={n.id}
              onClick={() => setTab(n.id)}
              className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-bold"
              style={tab === n.id ? { backgroundColor: "#FFEFE3", color: ACCENT } : { color: "#5c5750" }}
            >
              <n.icon size={17} />
              {n.label}
            </button>
          ))}
        </nav>
        <div className="flex items-center justify-between border-t border-[#EDE7E1] px-5 py-4">
          <div className="text-xs">
            <div className="font-bold">Staff Account</div>
            <div className="text-[#8a8580]">on shift</div>
          </div>
          <button
            className="text-xs font-bold text-[#FF4630]"
            onClick={async () => {
              await fetch("/api/admin/logout", { method: "POST" });
              router.replace("/admin/login");
            }}
          >
            Logout
          </button>
        </div>
      </aside>

      <main className="min-w-0 flex-1">
        <header className="flex items-center justify-between border-b border-[#EDE7E1] bg-white px-4 py-4 md:px-8">
          <h1 className="font-display text-2xl">{nav.find((n) => n.id === tab)?.label}</h1>
          <div className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[#EDE7E1]">
            <Bell size={17} />
            {orders.some((o) => o.orderStatus === "Received") && (
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full" style={{ backgroundColor: ACCENT }} />
            )}
          </div>
        </header>
        <div className="flex gap-2 overflow-x-auto border-b border-[#EDE7E1] px-4 py-2 md:hidden">
          {nav.map((n) => (
            <button key={n.id} onClick={() => setTab(n.id)} className={`rounded-full px-3 py-1.5 text-xs font-bold ${tab === n.id ? "bg-[#FFEFE3] text-[#FF4630]" : "text-[#5c5750]"}`}>
              {n.label}
            </button>
          ))}
        </div>
        {banner && <div className="bg-[#FF4630] px-4 py-2 text-center text-sm font-bold text-white">{banner}</div>}
        <div className="p-4 md:p-8">
          {tab === "orders" && <OrdersView orders={orders} setOrders={setOrders} />}
          {tab === "menu" && <MenuView />}
          {tab === "deals" && <DealsView />}
          {tab === "reports" && <ReportsView orders={orders} />}
        </div>
      </main>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, { bg: string; fg: string }> = {
    Received: { bg: "#FFEFE3", fg: ACCENT },
    Preparing: { bg: "#FFF6E0", fg: "#B8860B" },
    Ready: { bg: "#E8F7EC", fg: "#2F9E44" },
    Completed: { bg: "#F0EDEA", fg: "#8a8580" },
    Cancelled: { bg: "#F0EDEA", fg: "#8a8580" },
  };
  const s = map[status] || map.Completed;
  return (
    <span className="rounded-full px-2.5 py-1 text-[11px] font-bold" style={{ backgroundColor: s.bg, color: s.fg }}>
      {status}
    </span>
  );
}

function OrdersView({ orders, setOrders }: { orders: Order[]; setOrders: (o: Order[]) => void }) {
  const [open, setOpen] = useState<Order | null>(null);

  async function patchStatus(id: string, status: OrderStatus) {
    const res = await fetch(`/api/admin/orders/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const updated = await res.json();
    setOrders(orders.map((o) => (o.id === id ? updated : o)));
    if (open?.id === id) setOpen(updated);
  }

  async function patchPay(id: string, paymentStatus: "paid" | "pending") {
    const res = await fetch(`/api/admin/orders/${id}/payment`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentStatus }),
    });
    const updated = await res.json();
    setOrders(orders.map((o) => (o.id === id ? updated : o)));
    if (open?.id === id) setOpen(updated);
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {STATUSES.map((status) => {
          const list = orders.filter((o) => o.orderStatus === status);
          return (
            <div key={status}>
              <div className="mb-3 flex items-center justify-between px-1">
                <span className="text-sm font-black">{status}</span>
                <span className="rounded-full bg-[#F5F2EE] px-2 py-0.5 font-mono text-xs font-bold text-[#8a8580]">{list.length}</span>
              </div>
              {list.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[#EDE7E1] py-8 text-center text-xs text-[#c4bdb4]">No orders</div>
              ) : (
                list.map((order) => {
                  const nextIdx = STATUSES.indexOf(order.orderStatus) + 1;
                  const nextStatus = STATUSES[nextIdx];
                  return (
                    <div key={order.id} className="mb-3 rounded-2xl border border-[#EDE7E1] bg-white p-4">
                      <div className="mb-2 flex items-start justify-between">
                        <div>
                          <div className="font-mono text-xs font-bold text-[#8a8580]">#{order.orderNumber}</div>
                          <div className="mt-0.5 text-sm font-bold">{order.customerName}</div>
                        </div>
                        <button onClick={() => setOpen(order)} className="text-[#8a8580]">
                          <MoreVertical size={16} />
                        </button>
                      </div>
                      <div className="mb-2 flex items-center gap-2 text-xs font-medium text-[#8a8580]">
                        {order.orderType === "delivery" ? <Truck size={12} /> : <Store size={12} />}
                        <span className="capitalize">{order.orderType}</span>
                        <span>·</span>
                        <span>{order.paymentMethod}</span>
                        {order.paymentStatus !== "paid" && (
                          <span className="rounded px-1.5 py-0.5 text-[10px] font-bold" style={{ backgroundColor: "#FFEFE3", color: ACCENT }}>
                            unpaid
                          </span>
                        )}
                      </div>
                      <div className="mb-3 space-y-0.5 text-xs font-medium text-[#5c5750]">
                        {order.items.map((it, i) => (
                          <div key={i}>
                            {it.quantity}× {it.name}
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-between border-t border-[#F0EBE5] pt-2">
                        <span className="font-mono text-sm font-bold">Rs {order.totalAmount}</span>
                        {nextStatus ? (
                          <button
                            onClick={() => patchStatus(order.id, nextStatus)}
                            className="rounded-full px-3 py-1.5 text-xs font-bold text-white"
                            style={{ backgroundColor: INK }}
                          >
                            Mark {nextStatus}
                          </button>
                        ) : (
                          <span className="text-xs font-bold text-[#8a8580]">✓ Done</span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          );
        })}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 md:items-center" onClick={() => setOpen(null)}>
          <div className="w-full max-w-md rounded-3xl bg-white p-6" onClick={(e) => e.stopPropagation()}>
            <div className="font-mono text-xs font-bold text-[#8a8580]">#{open.orderNumber}</div>
            <div className="mt-1 text-xl font-black">{open.customerName}</div>
            <div className="mt-2 flex items-center gap-2 text-sm font-medium text-[#5c5750]">
              <Phone size={14} /> {open.customerPhone}
            </div>
            {open.customerAddress && <p className="mt-2 text-sm font-medium">{open.customerAddress}</p>}
            <p className="mt-3 text-sm">
              {open.orderType} · {open.paymentMethod}
              {open.txnId ? ` · Txn ${open.txnId}` : ""}
            </p>
            <div className="mt-3">
              <StatusPill status={open.orderStatus} />
            </div>
            <ul className="mt-4 space-y-1 text-sm font-semibold">
              {open.items.map((i, idx) => (
                <li key={idx}>
                  {i.quantity}× {i.name} — Rs {i.unitPrice * i.quantity}
                </li>
              ))}
            </ul>
            <div className="mt-4 flex gap-2">
              <button className="flex-1 rounded-full bg-[#F5F2EE] py-2 text-xs font-bold" onClick={() => patchPay(open.id, open.paymentStatus === "paid" ? "pending" : "paid")}>
                {open.paymentStatus === "paid" ? "Mark unpaid" : "Mark paid"}
              </button>
              <button className="flex-1 rounded-full bg-[#1C1B1A] py-2 text-xs font-bold text-white" onClick={() => setOpen(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function MenuView() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [q, setQ] = useState("");
  const [form, setForm] = useState<Partial<MenuItem> | null>(null);

  async function load() {
    const res = await fetch("/api/admin/menu");
    const data = await res.json();
    setItems(data.menuItems);
    setCategories(data.categories);
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = items.filter((i) => i.name.toLowerCase().includes(q.toLowerCase()));

  async function save() {
    if (!form?.name || !form.categoryId || !form.price) return;
    await fetch("/api/admin/menu", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm(null);
    load();
  }

  return (
    <div>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-xs">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8a8580]" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search menu items..."
            className="w-full rounded-full border border-[#EDE7E1] py-2.5 pl-10 pr-4 text-sm font-medium outline-none"
          />
        </div>
        <button
          className="flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-bold text-white"
          style={{ backgroundColor: ACCENT }}
          onClick={() =>
            setForm({
              id: `item-${Date.now()}`,
              name: "",
              categoryId: categories[0]?.id,
              price: 0,
              emoji: "🍽️",
              isAvailable: true,
            })
          }
        >
          <Plus size={16} /> Add Item
        </button>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-[#EDE7E1]">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#FAF8F6] text-left text-[11px] font-bold uppercase tracking-wider text-[#8a8580]">
              <th className="px-5 py-3">Item</th>
              <th className="px-5 py-3">Category</th>
              <th className="px-5 py-3">Price</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item, i) => (
              <tr key={item.id} className={i !== filtered.length - 1 ? "border-b border-[#F0EBE5]" : ""}>
                <td className="px-5 py-3.5 font-bold">
                  {item.emoji} {item.name}
                </td>
                <td className="px-5 py-3.5 font-medium text-[#8a8580]">{categories.find((c) => c.id === item.categoryId)?.name}</td>
                <td className="px-5 py-3.5 font-mono font-bold">Rs {item.price}</td>
                <td className="px-5 py-3.5">
                  <button
                    className="rounded-full px-2.5 py-1 text-[11px] font-bold"
                    style={{
                      backgroundColor: item.isAvailable ? "#E8F7EC" : "#F0EDEA",
                      color: item.isAvailable ? "#2F9E44" : "#8a8580",
                    }}
                    onClick={async () => {
                      await fetch("/api/admin/menu", {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ id: item.id, isAvailable: !item.isAvailable }),
                      });
                      load();
                    }}
                  >
                    {item.isAvailable ? "Available" : "Out of stock"}
                  </button>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <button className="text-xs font-bold" onClick={() => setForm(item)}>
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {form && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setForm(null)}>
          <div className="w-full max-w-md space-y-3 rounded-3xl bg-white p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-black">Menu item</h3>
            <input className="w-full rounded-2xl border border-[#EDE7E1] px-4 py-2.5 text-sm" placeholder="Name" value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <select className="w-full rounded-2xl border border-[#EDE7E1] px-4 py-2.5 text-sm" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <input type="number" className="w-full rounded-2xl border border-[#EDE7E1] px-4 py-2.5 text-sm" placeholder="Price" value={form.price || ""} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
            <div className="flex gap-2">
              <button className="flex-1 rounded-full bg-[#1C1B1A] py-2.5 text-sm font-bold text-white" onClick={save}>
                Save
              </button>
              <button className="flex-1 rounded-full bg-[#F5F2EE] py-2.5 text-sm font-bold" onClick={() => setForm(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DealsView() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [form, setForm] = useState<Partial<Deal> | null>(null);

  async function load() {
    setDeals(await (await fetch("/api/admin/deals")).json());
  }
  useEffect(() => {
    load();
  }, []);

  async function save() {
    if (!form?.title || !form.price) return;
    await fetch("/api/admin/deals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm(null);
    load();
  }

  return (
    <div>
      <div className="mb-5 flex justify-end">
        <button
          className="flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-bold text-white"
          style={{ backgroundColor: ACCENT }}
          onClick={() => setForm({ id: `deal-${Date.now()}`, title: "", description: "", price: 0, isActive: true })}
        >
          <Plus size={16} /> Add Deal
        </button>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-[#EDE7E1]">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#FAF8F6] text-left text-[11px] font-bold uppercase tracking-wider text-[#8a8580]">
              <th className="px-5 py-3">Deal</th>
              <th className="px-5 py-3">Includes</th>
              <th className="px-5 py-3">Price</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {deals.map((d, i) => (
              <tr key={d.id} className={i !== deals.length - 1 ? "border-b border-[#F0EBE5]" : ""}>
                <td className="px-5 py-3.5 font-bold">{d.title}</td>
                <td className="px-5 py-3.5 font-medium text-[#8a8580]">{d.description}</td>
                <td className="px-5 py-3.5 font-mono font-bold">Rs {d.price}</td>
                <td className="px-5 py-3.5">
                  <button
                    className="rounded-full px-2.5 py-1 text-[11px] font-bold"
                    style={{
                      backgroundColor: d.isActive ? "#E8F7EC" : "#F0EDEA",
                      color: d.isActive ? "#2F9E44" : "#8a8580",
                    }}
                    onClick={async () => {
                      await fetch("/api/admin/deals", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ ...d, isActive: !d.isActive }),
                      });
                      load();
                    }}
                  >
                    {d.isActive ? "Active" : "Off"}
                  </button>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <button className="text-xs font-bold" onClick={() => setForm(d)}>
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {form && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setForm(null)}>
          <div className="w-full max-w-md space-y-3 rounded-3xl bg-white p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-black">Deal</h3>
            <input className="w-full rounded-2xl border border-[#EDE7E1] px-4 py-2.5 text-sm" placeholder="Title" value={form.title || ""} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <textarea className="w-full rounded-2xl border border-[#EDE7E1] px-4 py-2.5 text-sm" placeholder="Includes" value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <input type="number" className="w-full rounded-2xl border border-[#EDE7E1] px-4 py-2.5 text-sm" value={form.price || ""} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
            <div className="flex gap-2">
              <button className="flex-1 rounded-full bg-[#1C1B1A] py-2.5 text-sm font-bold text-white" onClick={save}>
                Save
              </button>
              <button className="flex-1 rounded-full bg-[#F5F2EE] py-2.5 text-sm font-bold" onClick={() => setForm(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ReportsView({ orders }: { orders: Order[] }) {
  const today = new Date().toDateString();
  const todays = orders.filter((o) => new Date(o.createdAt).toDateString() === today && o.orderStatus !== "Cancelled");
  const revenue = todays.reduce((s, o) => s + o.totalAmount, 0);
  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const o of orders) {
      for (const i of o.items) map.set(i.name, (map.get(i.name) || 0) + i.quantity);
    }
    return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
  }, [orders]);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Stat label="Today's orders" value={String(todays.length)} />
      <Stat label="Today's revenue" value={`Rs ${revenue}`} />
      <Stat label="All-time orders" value={String(orders.length)} />
      <div className="rounded-3xl border border-[#EDE7E1] bg-white p-5 md:col-span-3">
        <h3 className="font-black">Best sellers</h3>
        <ul className="mt-3 space-y-2 text-sm font-semibold">
          {counts.length === 0 && <li className="text-[#8a8580]">Place a few orders to see this.</li>}
          {counts.map(([name, n]) => (
            <li key={name} className="flex justify-between">
              <span>{name}</span>
              <span className="font-mono text-[#8a8580]">{n}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-[#EDE7E1] bg-white p-5">
      <div className="text-[11px] font-bold uppercase tracking-wider text-[#8a8580]">{label}</div>
      <div className="ticket-price mt-2 text-2xl font-bold">{value}</div>
    </div>
  );
}
