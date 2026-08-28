import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { deleteMenuItem, getFullCatalog, setItemAvailability, upsertMenuItem } from "@/lib/store";

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data = await getFullCatalog();
  return NextResponse.json({ menuItems: data.menuItems, categories: data.categories });
}

export async function POST(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const item = await upsertMenuItem({
    id: body.id || `item-${Date.now()}`,
    name: String(body.name || "").trim(),
    categoryId: body.categoryId,
    price: Number(body.price),
    variantPrice: body.variantPrice ? Number(body.variantPrice) : undefined,
    variantLabel: body.variantLabel,
    description: body.description,
    emoji: body.emoji || "🍽️",
    isAvailable: body.isAvailable !== false,
  });
  return NextResponse.json(item);
}

export async function PATCH(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  if (typeof body.isAvailable === "boolean" && body.id) {
    const item = await setItemAvailability(body.id, body.isAvailable);
    return NextResponse.json(item);
  }
  return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
}

export async function DELETE(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await deleteMenuItem(id);
  return NextResponse.json({ ok: true });
}
