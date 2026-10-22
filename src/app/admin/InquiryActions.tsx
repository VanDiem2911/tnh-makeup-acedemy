"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function InquiryActions({ id, status }: { id: string; status: "new" | "contacted" }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function call(init: RequestInit) {
    setBusy(true);
    try {
      const res = await fetch(`/api/inquiries/${id}`, { ...init, headers: { "Content-Type": "application/json" } });
      if (!res.ok) window.alert("Thao tác không thành công. Hãy tải lại trang và thử lại.");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        disabled={busy}
        onClick={() => call({ method: "PATCH", body: JSON.stringify({ status: status === "new" ? "contacted" : "new" }) })}
        className="btn btn-outline min-h-11 px-4 text-sm disabled:opacity-60"
      >
        {status === "new" ? "Đánh dấu đã liên hệ" : "Đánh dấu chưa liên hệ"}
      </button>
      <button
        type="button"
        disabled={busy}
        onClick={() => {
          if (window.confirm("Xoá yêu cầu này? Thao tác không thể hoàn tác.")) call({ method: "DELETE" });
        }}
        className="min-h-11 rounded-full px-4 text-sm text-[#b3261e] underline-offset-4 hover:underline disabled:opacity-60"
      >
        Xoá
      </button>
    </div>
  );
}
