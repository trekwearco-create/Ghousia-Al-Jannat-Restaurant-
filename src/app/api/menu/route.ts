import { NextResponse } from "next/server";
import { getPublicCatalog } from "@/lib/store";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const { menuItems } = await getPublicCatalog();
  const items = category ? menuItems.filter((i) => i.categoryId === category) : menuItems;
  return NextResponse.json(items);
}
