"use client";

import { useEffect, useId, useRef, useState } from "react";
import { SERVICES } from "@/data/services";
import { SITE } from "@/data/site";
import { Chat, Check, Phone } from "./icons";

type Status = "idle" | "sending" | "done" | "error";
type FieldErrors = Partial<Record<"name" | "phone" | "service" | "date" | "message", string>>;

export function InquiryForm() {
  const uid = useId();
  const serviceRef = useRef<HTMLSelectElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [notice, setNotice] = useState("");

  // Chọn sẵn dịch vụ khi khách đi từ trang dịch vụ (?dv=slug). Đọc sau hydrate để trang vẫn là HTML tĩnh.
  useEffect(() => {
    const dv = new URLSearchParams(window.location.search).get("dv");
    if (dv && serviceRef.current && [...serviceRef.current.options].some((o) => o.value === dv)) {
      serviceRef.current.value = dv;
    }
  }, []);

  // Đưa focus tới ô lỗi đầu tiên sau khi lỗi đã được vẽ lên màn hình (để trình đọc màn hình đọc đúng ô)
  useEffect(() => {
    if (Object.keys(errors).length) formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  }, [errors]);

  async function onSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    setStatus("sending");
    setErrors({});
    setNotice("");
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        message?: string;
        errors?: Record<string, string[]>;
      };
      if (res.ok && json.ok) {
        form.reset();
        setStatus("done");
        return;
      }
      if (json.errors) {
        setErrors(Object.fromEntries(Object.entries(json.errors).map(([k, v]) => [k, v[0]])) as FieldErrors);
      }
      setNotice(json.message ?? "Chưa gửi được. Vui lòng thử lại.");
      setStatus("error");
    } catch {
      setNotice("Mất kết nối mạng. Vui lòng thử lại hoặc gọi trực tiếp cho chúng tôi.");
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div role="status" className="rounded-xl bg-ivory p-8 text-center sm:p-12">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-sunset text-white">
          <Check size={28} />
        </span>
        <h3 className="display mt-6 text-[2rem]">Cảm ơn bạn đã để lại thông tin</h3>
        <p className="lead mt-3">
          Chúng tôi đã nhận được và sẽ liên hệ lại với bạn qua số điện thoại/Zalo vừa nhập. Nếu cần gấp, bạn có thể nhắn
          trực tiếp:
        </p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <a href={SITE.zalo} target="_blank" rel="noopener noreferrer" className="btn btn-dark">
            <Chat size={18} /> Nhắn Zalo
          </a>
          <a href={`tel:${SITE.phoneTel}`} className="btn btn-outline">
            <Phone size={18} /> Gọi {SITE.phoneDisplay}
          </a>
        </div>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 min-h-11 text-sm text-muted underline underline-offset-4 hover:text-ink"
        >
          Gửi thêm một yêu cầu khác
        </button>
      </div>
    );
  }

  const id = (name: string) => `${uid}-${name}`;
  const err = (name: keyof FieldErrors) =>
    errors[name] ? (
      <p id={id(`${name}-err`)} className="mt-1.5 text-sm text-[#b3261e]">
        {errors[name]}
      </p>
    ) : null;
  const aria = (name: keyof FieldErrors) => ({
    "aria-invalid": errors[name] ? (true as const) : undefined,
    "aria-describedby": errors[name] ? id(`${name}-err`) : undefined,
  });
  const label = "mb-1.5 block text-sm font-medium text-ink";

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="relative rounded-xl bg-ivory p-6 sm:p-9" aria-describedby={id("note")}>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={id("name")} className={label}>
            Họ và tên <span className="font-normal text-muted">(bắt buộc)</span>
          </label>
          <input
            id={id("name")}
            name="name"
            type="text"
            autoComplete="name"
            required
            maxLength={80}
            className="field"
            placeholder="Nguyễn Văn A"
            {...aria("name")}
          />
          {err("name")}
        </div>
        <div>
          <label htmlFor={id("phone")} className={label}>
            SĐT / Zalo <span className="font-normal text-muted">(bắt buộc)</span>
          </label>
          <input
            id={id("phone")}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
            className="field"
            placeholder="0971 020 742"
            {...aria("phone")}
          />
          {err("phone")}
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor={id("service")} className={label}>
          Dịch vụ quan tâm
        </label>
        <select
          ref={serviceRef}
          id={id("service")}
          name="service"
          required
          defaultValue={SERVICES[0].slug}
          className="field appearance-none bg-[length:1.1rem] bg-[right_1rem_center] bg-no-repeat pr-11"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%235e574e' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
          }}
          {...aria("service")}
        >
          {SERVICES.map((s) => (
            <option key={s.slug} value={s.slug}>
              {s.title}
            </option>
          ))}
          <option value="khac">Khác / Tôi chưa chắc chắn</option>
        </select>
        {err("service")}
      </div>

      <div className="mt-5">
        <label htmlFor={id("date")} className={label}>
          Ngày dự kiến chụp <span className="font-normal text-muted">(không bắt buộc)</span>
        </label>
        <input id={id("date")} name="date" type="date" className="field" {...aria("date")} />
        {err("date")}
      </div>

      <div className="mt-5">
        <label htmlFor={id("message")} className={label}>
          Lời nhắn <span className="font-normal text-muted">(không bắt buộc)</span>
        </label>
        <textarea
          id={id("message")}
          name="message"
          rows={4}
          maxLength={1500}
          className="field resize-y"
          placeholder="Số người, địa điểm mong muốn, phong cách bạn thích..."
          {...aria("message")}
        />
        {err("message")}
      </div>

      {/* Ô bẫy bot: người thật không nhìn thấy và không điền */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div role="alert" aria-live="assertive" className="min-h-0">
        {status === "error" && notice && (
          <p className="mt-5 rounded-lg border border-[#b3261e]/30 bg-[#b3261e]/5 px-4 py-3 text-sm text-[#8c1d18]">{notice}</p>
        )}
      </div>

      <button type="submit" disabled={status === "sending"} className="btn btn-sunset mt-6 w-full disabled:cursor-wait disabled:opacity-70">
        {status === "sending" ? "Đang gửi..." : "Gửi yêu cầu tư vấn"}
      </button>
      <p id={id("note")} className="mt-4 text-center text-sm text-muted">
        Thông tin của bạn chỉ dùng để liên hệ tư vấn và không được chia sẻ cho bên thứ ba.
      </p>
    </form>
  );
}
