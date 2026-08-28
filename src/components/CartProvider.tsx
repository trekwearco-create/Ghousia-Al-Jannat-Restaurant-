"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CartLine = {
  key: string;
  kind: "item" | "deal";
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  variant?: string;
};

type CartContextValue = {
  items: CartLine[];
  add: (line: Omit<CartLine, "key" | "quantity">, qty?: number) => void;
  setQty: (key: string, quantity: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  count: number;
  total: number;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE = "ghousia-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(STORAGE, JSON.stringify(items));
  }, [items, ready]);

  const value = useMemo<CartContextValue>(() => {
    const add: CartContextValue["add"] = (line, qty = 1) => {
      const key = `${line.kind}-${line.id}-${line.variant || "std"}`;
      setItems((curr) => {
        const existing = curr.find((i) => i.key === key);
        if (existing) {
          return curr.map((i) => (i.key === key ? { ...i, quantity: i.quantity + qty } : i));
        }
        return [...curr, { ...line, key, quantity: qty }];
      });
    };
    return {
      items,
      add,
      setQty: (key, quantity) =>
        setItems((curr) =>
          quantity <= 0 ? curr.filter((i) => i.key !== key) : curr.map((i) => (i.key === key ? { ...i, quantity } : i))
        ),
      remove: (key) => setItems((curr) => curr.filter((i) => i.key !== key)),
      clear: () => setItems([]),
      count: items.reduce((n, i) => n + i.quantity, 0),
      total: items.reduce((n, i) => n + i.unitPrice * i.quantity, 0),
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
