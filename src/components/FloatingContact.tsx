"use client";

import { usePathname } from "next/navigation";
import { SITE } from "@/data/site";
import { Chat, Phone } from "./icons";

const pill =
  "group flex min-h-12 items-center gap-2.5 rounded-full border border-ink/10 bg-cream/95 px-5 text-[0.9375rem] font-medium text-ink shadow-[0_10px_28px_-10px_rgba(30,28,26,0.4)] backdrop-blur transition-[background-color,transform] duration-200 hover:bg-ivory active:scale-95";

// Hiện dần sau khi trang tải; fill-mode "backwards" để không giữ transform, nút vẫn có hiệu ứng nhấn (scale)
const enter = (delayMs: number): React.CSSProperties => ({
  animation: "rise 0.8s var(--ease-soft) backwards",
  animationDelay: `${delayMs}ms`,
});

/** Nút liên hệ nổi ở mép phải: gọi điện và Zalo, luôn trong tầm tay ở mọi trang */
export function FloatingContact() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <div
      className="fixed right-3 z-40 flex flex-col items-end gap-3 sm:right-5"
      style={{ bottom: "max(1rem, env(safe-area-inset-bottom))" }}
    >
      <a href={SITE.zalo} target="_blank" rel="noopener noreferrer" className={pill} style={enter(900)}>
        <Chat size={20} className="text-sunset" />
        Zalo
      </a>
      <a href={`tel:${SITE.phoneTel}`} className={pill} style={enter(780)}>
        <Phone size={20} className="text-sunset" />
        Gọi ngay
      </a>
    </div>
  );
}
