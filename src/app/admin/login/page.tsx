"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
      setError("Invalid username or password.");
      setBusy(false);
      return;
    }
    router.push("/admin");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FAF8F6] px-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-3xl border border-[#EDE7E1] bg-white p-8">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#FF4630] font-black text-white">
          GJ
        </div>
        <h1 className="font-display mt-4 text-center text-2xl">ADMIN</h1>
        <p className="mt-1 text-center text-xs font-semibold uppercase tracking-wider text-[#8a8580]">
          Ghousia & Jannat
        </p>
        <label className="mt-6 block text-xs font-bold uppercase tracking-wider text-[#8a8580]">
          Username
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 w-full rounded-2xl border border-[#EDE7E1] px-4 py-3 text-sm font-semibold outline-none"
          />
        </label>
        <label className="mt-4 block text-xs font-bold uppercase tracking-wider text-[#8a8580]">
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-2xl border border-[#EDE7E1] px-4 py-3 text-sm font-semibold outline-none"
          />
        </label>
        {error && <p className="mt-3 text-sm font-bold text-[#FF4630]">{error}</p>}
        <button disabled={busy} className="mt-6 w-full rounded-full bg-[#1C1B1A] py-3 text-sm font-bold text-white">
          Sign in
        </button>
      </form>
    </main>
  );
}
