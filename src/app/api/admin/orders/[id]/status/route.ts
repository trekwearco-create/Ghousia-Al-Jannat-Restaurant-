import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { updateOrderStatus, type OrderStatus } from "@/lib/store";

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await ctx.params;
  const { status } = await req.json();
  const allowed: OrderStatus[] = ["Received", "Preparing", "Ready", "Completed", "Cancelled"];
  if (!allowed.includes(status)) return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  const order = await updateOrderStatus(id, status);
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(order);
}
