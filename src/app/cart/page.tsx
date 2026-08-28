"use client";

import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/components/CartProvider";

export default function CartPage() {
  const { items, setQty, remove, total } = useCart();

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="font-display text-4xl">CART EMPTY</h1>
        <p className="mt-3 text-sm font-medium text-[#8a8580]">Add rolls, BBQ, broast or a combo deal first.</p>
        <Link href="/menu" className="mt-6 inline-block rounded-full bg-[#FF4630] px-6 py-3 text-sm font-bold text-white">
          Browse menu
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="font-display text-4xl">YOUR CART</h1>
      <ul className="mt-6 space-y-3">
        {items.map((line) => (
          <li key={line.key} className="flex items-center gap-3 rounded-3xl border border-[#EDE7E1] bg-white p-4">
            <div className="flex-1">
              <div className="font-black">{line.name}</div>
              <div className="ticket-price text-sm font-bold text-[#8a8580]">Rs {line.unitPrice}</div>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-[#F5F2EE] px-2 py-1">
              <button onClick={() => setQty(line.key, line.quantity - 1)} aria-label="Decrease">
                <Minus size={14} />
              </button>
              <span className="w-6 text-center text-sm font-bold">{line.quantity}</span>
              <button onClick={() => setQty(line.key, line.quantity + 1)} aria-label="Increase">
                <Plus size={14} />
              </button>
            </div>
            <button onClick={() => remove(line.key)} className="text-[#8a8580]" aria-label="Remove">
              <Trash2 size={16} />
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-6 flex items-center justify-between rounded-3xl bg-[#1C1B1A] px-5 py-4 text-white">
        <span className="text-sm font-bold">Total</span>
        <span className="ticket-price text-2xl font-bold">Rs {total}</span>
      </div>
      <Link href="/checkout" className="mt-4 block rounded-full bg-[#FF4630] py-3.5 text-center text-sm font-bold text-white">
        Checkout
      </Link>
    </main>
  );
}
