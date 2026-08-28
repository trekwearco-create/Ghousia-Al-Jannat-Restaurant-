import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_PASS, ADMIN_USER, signToken } from "@/lib/auth";

export async function POST(req: Request) {
  const { username, password } = await req.json();
  if (username !== ADMIN_USER || password !== ADMIN_PASS) {
    return NextResponse.json({ error: "Invalid username or password." }, { status: 401 });
  }
  const token = signToken(username);
  const jar = await cookies();
  jar.set("admin_session", token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return NextResponse.json({ ok: true });
}
