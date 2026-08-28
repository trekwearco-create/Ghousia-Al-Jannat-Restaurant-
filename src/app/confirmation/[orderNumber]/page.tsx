"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import type { Order } from "@/lib/types";

export default function ConfirmationPage() {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetch(`/api/orders/${orderNumber}`)
      .then((r) => r.json())
      .then(setOrder);
  }, [orderNumber]);

  if (!order?.orderNumber) {
    return (
      <main className="mx-auto max-w-lg px-4 py-20 text-center">
        <p className="font-medium text-[#8a8580]">Loading order…</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-lg px-4 py-12 text-center">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FF4630]">Order placed</p>
      <h1 className="font-display mt-3 text-4xl">THANK YOU</h1>
      <p className="mt-3 text-sm font-medium text-[#5c5750]">
        We received your {order.orderType} order. Kitchen will start preparing it. Keep this number if you call us.
      </p>
      <div className="mt-8 rounded-3xl border border-[#EDE7E1] bg-white p-6">
        <div className="text-[11px] font-bold uppercase tracking-wider text-[#8a8580]">Order number</div>
        <div className="ticket-price mt-1 text-3xl font-bold">{order.orderNumber}</div>
        <div className="mt-4 space-y-1 text-sm font-semibold">
          {order.items.map((i, idx) => (
            <div key={idx}>
              {i.quantity}× {i.name}
            </div>
          ))}
        </div>
        <div className="ticket-price mt-4 border-t border-[#F0EBE5] pt-3 text-xl font-bold">Rs {order.totalAmount}</div>
        <p className="mt-3 text-xs font-medium text-[#8a8580]">
          {order.paymentMethod} · {order.paymentStatus === "paid" ? "Paid" : "Payment pending"}
        </p>
      </div>
      <Link href="/menu" className="mt-8 inline-block rounded-full bg-[#1C1B1A] px-6 py-3 text-sm font-bold text-white">
        Order again
      </Link>
    </main>
  );
}
