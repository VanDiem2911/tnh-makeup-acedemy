import { after, NextResponse } from "next/server";
import { z } from "zod";
import { sameOrigin } from "@/lib/admin-auth";
import { addInquiry } from "@/lib/inquiries";
import { notifyInquiry } from "@/lib/notify";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { inquirySchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ ok: false, message: "Yêu cầu không hợp lệ" }, { status: 403 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Dữ liệu gửi lên không hợp lệ" }, { status: 400 });
  }

  // Ô bẫy bot: người thật không thấy nên không điền. Trả về "thành công" để bot không dò được.
  if (typeof body === "object" && body && "website" in body && (body as { website?: unknown }).website) {
    return NextResponse.json({ ok: true });
  }

  const parsed = inquirySchema.safeParse(body);
  if (!parsed.success) {
    const { fieldErrors } = z.flattenError(parsed.error);
    return NextResponse.json({ ok: false, message: "Vui lòng kiểm tra lại thông tin", errors: fieldErrors }, { status: 400 });
  }

  // Chỉ đếm hạn mức với yêu cầu hợp lệ: khách điền sai vài lần để sửa không bị tính là spam
  const limited = rateLimit(`inquiry:${clientIp(request)}`, 5, 10 * 60 * 1000);
  if (!limited.ok) {
    return NextResponse.json(
      { ok: false, message: "Bạn gửi hơi nhiều lần. Vui lòng thử lại sau ít phút hoặc gọi trực tiếp cho chúng tôi." },
      { status: 429, headers: { "Retry-After": String(limited.retryAfter) } },
    );
  }

  try {
    const item = await addInquiry(parsed.data);
    after(() => notifyInquiry(item));
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[inquiries] không lưu được", err);
    return NextResponse.json(
      { ok: false, message: "Hệ thống đang gặp sự cố. Vui lòng gọi hoặc nhắn Zalo cho chúng tôi nhé." },
      { status: 500 },
    );
  }
}
