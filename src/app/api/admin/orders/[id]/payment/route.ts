import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { updatePaymentStatus, type PaymentStatus } from "@/lib/store";

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await ctx.params;
  const { paymentStatus } = await req.json();
  const allowed: PaymentStatus[] = ["pending", "paid", "failed"];
  if (!allowed.includes(paymentStatus)) return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  const order = await updatePaymentStatus(id, paymentStatus);
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(order);
}
