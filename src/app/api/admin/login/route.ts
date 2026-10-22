import { NextResponse } from "next/server";
import { ADMIN_COOKIE, adminEnabled, checkPassword, createSession, sameOrigin, SESSION_SECONDS } from "@/lib/admin-auth";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ ok: false }, { status: 403 });
  if (!adminEnabled()) {
    return NextResponse.json({ ok: false, message: "Chưa cấu hình ADMIN_PASSWORD trên máy chủ" }, { status: 503 });
  }

  const limited = rateLimit(`login:${clientIp(request)}`, 6, 10 * 60 * 1000);
  if (!limited.ok) {
    return NextResponse.json(
      { ok: false, message: "Thử sai quá nhiều lần. Vui lòng chờ ít phút." },
      { status: 429, headers: { "Retry-After": String(limited.retryAfter) } },
    );
  }

  const body = (await request.json().catch(() => null)) as { password?: unknown } | null;
  if (typeof body?.password !== "string" || !checkPassword(body.password)) {
    return NextResponse.json({ ok: false, message: "Mật khẩu không đúng" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, createSession(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_SECONDS,
  });
  return res;
}
