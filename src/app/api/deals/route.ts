import { NextResponse } from "next/server";
import { getPublicCatalog } from "@/lib/store";

export async function GET() {
  const { deals } = await getPublicCatalog();
  return NextResponse.json(deals);
}
