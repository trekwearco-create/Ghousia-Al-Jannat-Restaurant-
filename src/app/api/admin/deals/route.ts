import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getFullCatalog, upsertDeal } from "@/lib/store";

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data = await getFullCatalog();
  return NextResponse.json(data.deals);
}

export async function POST(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const deal = await upsertDeal({
    id: body.id || `deal-${Date.now()}`,
    title: String(body.title || "").trim(),
    description: String(body.description || "").trim(),
    price: Number(body.price),
    isActive: body.isActive !== false,
  });
  return NextResponse.json(deal);
}
