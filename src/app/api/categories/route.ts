import { NextResponse } from "next/server";
import { getPublicCatalog } from "@/lib/store";

export async function GET() {
  const { categories } = await getPublicCatalog();
  return NextResponse.json(categories);
}
