import { promises as fs } from "fs";
import path from "path";
import { categories, deals, menuItems, type Category, type Deal, type MenuItem } from "./seed";
import type { Order, OrderStatus, PaymentStatus } from "./types";

export type { Order, OrderStatus, PaymentStatus, CartLine, OrderType, PaymentMethod } from "./types";

type StoreData = {
  categories: Category[];
  menuItems: MenuItem[];
  deals: Deal[];
  orders: Order[];
  orderSeq: number;
};

const filePath = path.join(process.cwd(), "data", "store.json");

let writeQueue: Promise<void> = Promise.resolve();
const listeners = new Set<(order: Order) => void>();

export function onNewOrder(fn: (order: Order) => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function notify(order: Order) {
  listeners.forEach((fn) => fn(order));
}

async function ensureStore(): Promise<StoreData> {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw) as StoreData;
  } catch {
    const initial: StoreData = {
      categories,
      menuItems,
      deals,
      orders: [],
      orderSeq: 230,
    };
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(initial, null, 2));
    return initial;
  }
}

async function persist(data: StoreData) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

function mutate<T>(fn: (data: StoreData) => T | Promise<T>): Promise<T> {
  const run = writeQueue.then(async () => {
    const data = await ensureStore();
    const result = await fn(data);
    await persist(data);
    return result;
  });
  writeQueue = run.then(() => undefined).catch(() => undefined);
  return run;
}

export async function getPublicCatalog() {
  const data = await ensureStore();
  return {
    categories: data.categories,
    menuItems: data.menuItems.filter((i) => i.isAvailable),
    deals: data.deals.filter((d) => d.isActive),
  };
}

export async function getFullCatalog() {
  return ensureStore();
}

export async function createOrder(input: Omit<Order, "id" | "orderNumber" | "createdAt" | "orderStatus">) {
  return mutate((data) => {
    data.orderSeq += 1;
    const orderNumber = `GFF-${String(data.orderSeq).padStart(5, "0")}`;
    const order: Order = {
      ...input,
      id: crypto.randomUUID(),
      orderNumber,
      orderStatus: "Received",
      createdAt: new Date().toISOString(),
    };
    data.orders.unshift(order);
    notify(order);
    return order;
  });
}

export async function getOrderByNumber(orderNumber: string) {
  const data = await ensureStore();
  return data.orders.find((o) => o.orderNumber === orderNumber) || null;
}

export async function listOrders() {
  const data = await ensureStore();
  return data.orders;
}

export async function updateOrderStatus(id: string, orderStatus: OrderStatus) {
  return mutate((data) => {
    const order = data.orders.find((o) => o.id === id);
    if (!order) return null;
    order.orderStatus = orderStatus;
    return order;
  });
}

export async function updatePaymentStatus(id: string, paymentStatus: PaymentStatus) {
  return mutate((data) => {
    const order = data.orders.find((o) => o.id === id);
    if (!order) return null;
    order.paymentStatus = paymentStatus;
    return order;
  });
}

export async function upsertMenuItem(item: MenuItem) {
  return mutate((data) => {
    const idx = data.menuItems.findIndex((i) => i.id === item.id);
    if (idx >= 0) data.menuItems[idx] = item;
    else data.menuItems.push(item);
    return item;
  });
}

export async function setItemAvailability(id: string, isAvailable: boolean) {
  return mutate((data) => {
    const item = data.menuItems.find((i) => i.id === id);
    if (!item) return null;
    item.isAvailable = isAvailable;
    return item;
  });
}

export async function deleteMenuItem(id: string) {
  return mutate((data) => {
    const before = data.menuItems.length;
    data.menuItems = data.menuItems.filter((i) => i.id !== id);
    return before !== data.menuItems.length;
  });
}

export async function upsertDeal(deal: Deal) {
  return mutate((data) => {
    const idx = data.deals.findIndex((d) => d.id === deal.id);
    if (idx >= 0) data.deals[idx] = deal;
    else data.deals.push(deal);
    return deal;
  });
}

export async function upsertCategory(cat: Category) {
  return mutate((data) => {
    const idx = data.categories.findIndex((c) => c.id === cat.id);
    if (idx >= 0) data.categories[idx] = cat;
    else data.categories.push(cat);
    data.categories.sort((a, b) => a.displayOrder - b.displayOrder);
    return cat;
  });
}
