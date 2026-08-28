import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { listOrders } from "@/lib/store";

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(await listOrders());
}
