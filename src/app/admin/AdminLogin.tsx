"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function AdminLogin() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const password = String(new FormData(e.currentTarget).get("password") ?? "");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) return router.refresh();
      const json = (await res.json().catch(() => ({}))) as { message?: string };
      setError(json.message ?? "Đăng nhập không thành công");
    } catch {
      setError("Mất kết nối mạng");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto mt-10 max-w-sm rounded-xl bg-ivory p-7">
      <label htmlFor="admin-password" className="mb-1.5 block text-sm font-medium">
        Mật khẩu quản trị
      </label>
      <input
        id="admin-password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        className="field"
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? "admin-error" : undefined}
      />
      {error && (
        <p id="admin-error" role="alert" className="mt-2 text-sm text-[#b3261e]">
          {error}
        </p>
      )}
      <button type="submit" disabled={busy} className="btn btn-dark mt-5 w-full disabled:opacity-70">
        {busy ? "Đang kiểm tra..." : "Đăng nhập"}
      </button>
    </form>
  );
}
