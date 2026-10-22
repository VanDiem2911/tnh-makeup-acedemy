import "server-only";
import type { Inquiry } from "./inquiries";
import { serviceLabel } from "./validation";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

async function post(url: string, body: unknown) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`${new URL(url).hostname} trả về ${res.status}`);
}

/** Gửi thông báo khách mới qua Telegram và/hoặc webhook (nếu đã cấu hình). Lỗi chỉ ghi log, không ảnh hưởng khách. */
export async function notifyInquiry(item: Inquiry) {
  const tasks: Promise<unknown>[] = [];

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chat = process.env.TELEGRAM_CHAT_ID;
  if (token && chat) {
    const lines = [
      "<b>Khách mới từ website</b>",
      `Tên: ${esc(item.name)}`,
      `SĐT/Zalo: ${esc(item.phone)}`,
      `Dịch vụ: ${esc(serviceLabel(item.service))}`,
      item.date ? `Ngày dự kiến: ${esc(item.date)}` : "",
      item.message ? `Lời nhắn: ${esc(item.message)}` : "",
    ].filter(Boolean);
    tasks.push(
      post(`https://api.telegram.org/bot${token}/sendMessage`, {
        chat_id: chat,
        text: lines.join("\n"),
        parse_mode: "HTML",
      }),
    );
  }

  const hook = process.env.INQUIRY_WEBHOOK_URL;
  if (hook) tasks.push(post(hook, { ...item, serviceLabel: serviceLabel(item.service) }));

  const results = await Promise.allSettled(tasks);
  for (const r of results) if (r.status === "rejected") console.error("[notify]", r.reason);
}
