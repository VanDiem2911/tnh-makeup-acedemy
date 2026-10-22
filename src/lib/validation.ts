import { z } from "zod";
import { SERVICES } from "@/data/services";

const VALID_SERVICES = new Set<string>([...SERVICES.map((s) => s.slug), "khac"]);

/** Chuẩn hoá số điện thoại Việt Nam: bỏ khoảng trắng/dấu chấm/gạch, +84 → 0 */
export function normalizePhone(raw: string) {
  const digits = raw.replace(/[\s.\-()]/g, "");
  return digits.startsWith("+84") ? `0${digits.slice(3)}` : digits.startsWith("84") && digits.length === 11 ? `0${digits.slice(2)}` : digits;
}

export const inquirySchema = z.object({
  name: z
    .string({ error: "Vui lòng nhập họ tên" })
    .trim()
    .min(2, { error: "Vui lòng nhập họ tên" })
    .max(80, { error: "Họ tên quá dài" }),
  phone: z
    .string({ error: "Vui lòng nhập số điện thoại / Zalo" })
    .trim()
    .transform(normalizePhone)
    .refine((v) => /^0\d{9}$/.test(v), { error: "Số điện thoại chưa đúng (ví dụ: 0971 020 742)" }),
  service: z.string({ error: "Vui lòng chọn dịch vụ" }).refine((v) => VALID_SERVICES.has(v), { error: "Vui lòng chọn dịch vụ" }),
  date: z
    .string()
    .trim()
    .max(40)
    .optional()
    .transform((v) => v || undefined),
  message: z
    .string()
    .trim()
    .max(1500, { error: "Lời nhắn tối đa 1500 ký tự" })
    .optional()
    .transform((v) => v || undefined),
});

export type InquiryInput = z.infer<typeof inquirySchema>;

export function serviceLabel(slug: string) {
  return SERVICES.find((s) => s.slug === slug)?.title ?? "Khác / Chưa chắc chắn";
}
