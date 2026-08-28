"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartProvider";
import { RESTAURANT } from "@/lib/seed";

export default function CheckoutPage() {
  const { items, total, clear } = useCart();
  const router = useRouter();
  const [orderType, setOrderType] = useState<"pickup" | "delivery">("delivery");
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "EasyPaisa" | "JazzCash">("COD");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [txnId, setTxnId] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (items.length === 0) router.replace("/cart");
  }, [items.length, router]);

  if (items.length === 0) return null;

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: name,
          customerPhone: phone,
          customerAddress: address,
          orderType,
          paymentMethod,
          txnId: paymentMethod === "COD" ? undefined : txnId,
          items: items.map(({ kind, id, name, quantity, unitPrice, variant }) => ({
            kind,
            id,
            name,
            quantity,
            unitPrice,
            variant,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not place order");
        return;
      }
      clear();
      router.push(`/confirmation/${data.orderNumber}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto max-w-xl px-4 py-8">
      <h1 className="font-display text-4xl">CHECKOUT</h1>
      <p className="mt-2 text-sm font-medium text-[#8a8580]">Guest checkout — no account needed.</p>

      <div className="mt-6 rounded-3xl border border-[#EDE7E1] bg-white p-4">
        {items.map((i) => (
          <div key={i.key} className="flex justify-between py-1 text-sm font-semibold">
            <span>
              {i.quantity}× {i.name}
            </span>
            <span className="ticket-price">Rs {i.unitPrice * i.quantity}</span>
          </div>
        ))}
        <div className="mt-3 flex justify-between border-t border-[#F0EBE5] pt-3 font-black">
          <span>Total</span>
          <span className="ticket-price">Rs {total}</span>
        </div>
      </div>

      <form onSubmit={submit} className="mt-6 space-y-5">
        <fieldset>
          <legend className="mb-2 text-xs font-bold uppercase tracking-wider text-[#8a8580]">Order type</legend>
          <div className="grid grid-cols-2 gap-2">
            <TypeBtn on={orderType === "pickup"} onClick={() => setOrderType("pickup")}>
              Pickup
            </TypeBtn>
            <TypeBtn on={orderType === "delivery"} onClick={() => setOrderType("delivery")}>
              Delivery
            </TypeBtn>
          </div>
        </fieldset>

        <label className="block">
          <span className="text-xs font-bold uppercase tracking-wider text-[#8a8580]">Name</span>
          <input required value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded-2xl border border-[#EDE7E1] bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-[#1C1B1A]" />
        </label>
        <label className="block">
          <span className="text-xs font-bold uppercase tracking-wider text-[#8a8580]">Phone</span>
          <input required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="03XXXXXXXXX" className="mt-1 w-full rounded-2xl border border-[#EDE7E1] bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-[#1C1B1A]" />
        </label>
        {orderType === "delivery" && (
          <label className="block">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8a8580]">Delivery address</span>
            <textarea required value={address} onChange={(e) => setAddress(e.target.value)} rows={3} className="mt-1 w-full rounded-2xl border border-[#EDE7E1] bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-[#1C1B1A]" />
          </label>
        )}

        <fieldset>
          <legend className="mb-2 text-xs font-bold uppercase tracking-wider text-[#8a8580]">Payment</legend>
          <div className="grid gap-2">
            {(["COD", "EasyPaisa", "JazzCash"] as const).map((m) => (
              <TypeBtn key={m} on={paymentMethod === m} onClick={() => setPaymentMethod(m)}>
                {m === "COD" ? "Cash on Delivery" : m}
              </TypeBtn>
            ))}
          </div>
        </fieldset>

        {paymentMethod !== "COD" && (
          <div className="rounded-3xl border border-[#FFEFE3] bg-[#FFF8F4] p-4 text-sm font-medium">
            <p>
              Send <span className="font-black">Rs {total}</span> via {paymentMethod} to{" "}
              <span className="font-black">{paymentMethod === "EasyPaisa" ? RESTAURANT.easypaisa : RESTAURANT.jazzcash}</span>.
            </p>
            <p className="mt-2 text-xs text-[#8a8580]">
              Full gateway APIs need the restaurant merchant account. Until then, staff confirm the transfer in the admin
              panel.
            </p>
            <label className="mt-3 block">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8a8580]">Transaction ID (optional)</span>
              <input value={txnId} onChange={(e) => setTxnId(e.target.value)} className="mt-1 w-full rounded-2xl border border-[#EDE7E1] bg-white px-4 py-3 text-sm font-semibold outline-none" />
            </label>
          </div>
        )}

        {error && <p className="text-sm font-bold text-[#FF4630]">{error}</p>}

        <button disabled={busy} className="w-full rounded-full bg-[#FF4630] py-3.5 text-sm font-bold text-white disabled:opacity-60">
          {busy ? "Placing order…" : "Place order"}
        </button>
      </form>
    </main>
  );
}

function TypeBtn({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border px-4 py-3 text-sm font-bold ${
        on ? "border-[#FF4630] bg-[#FFEFE3] text-[#FF4630]" : "border-[#EDE7E1] bg-white"
      }`}
    >
      {children}
    </button>
  );
}
