import { NextResponse } from "next/server";
import { getOrderByNumber } from "@/lib/store";

export async function GET(_req: Request, ctx: { params: Promise<{ orderNumber: string }> }) {
  const { orderNumber } = await ctx.params;
  const order = await getOrderByNumber(orderNumber);
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(order);
}
