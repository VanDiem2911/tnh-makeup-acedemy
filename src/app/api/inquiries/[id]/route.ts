import { NextResponse } from "next/server";
import { isAdmin, sameOrigin } from "@/lib/admin-auth";
import { deleteInquiry, setInquiryStatus } from "@/lib/inquiries";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

async function guard(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ ok: false }, { status: 403 });
  if (!(await isAdmin())) return NextResponse.json({ ok: false }, { status: 401 });
  return null;
}

export async function PATCH(request: Request, { params }: Ctx) {
  const denied = await guard(request);
  if (denied) return denied;

  const { id } = await params;
  const body = (await request.json().catch(() => null)) as { status?: string } | null;
  if (body?.status !== "new" && body?.status !== "contacted") {
    return NextResponse.json({ ok: false, message: "Trạng thái không hợp lệ" }, { status: 400 });
  }
  const found = await setInquiryStatus(id, body.status);
  return NextResponse.json({ ok: found }, { status: found ? 200 : 404 });
}

export async function DELETE(request: Request, { params }: Ctx) {
  const denied = await guard(request);
  if (denied) return denied;

  const { id } = await params;
  const found = await deleteInquiry(id);
  return NextResponse.json({ ok: found }, { status: found ? 200 : 404 });
}
