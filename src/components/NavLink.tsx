"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import type { ReactNode } from "react";

// Đặt cờ khi khách bấm một mục menu sang trang khác; <ScrollToTop /> đọc cờ này sau khi đổi trang
let scrollTopPending = false;

/**
 * Liên kết của menu:
 * - mục dẫn tới chính trang đang xem: cuộn mượt lên đầu trang (không tải lại)
 * - mục dẫn sang trang khác: trang mới luôn mở ở đầu trang
 * - mục có #neo: để trình duyệt cuộn tới đúng khối đó
 */
export function NavLink({
  href,
  className,
  onNavigate,
  children,
}: {
  href: string;
  className?: string;
  onNavigate?: () => void;
  children: ReactNode;
}) {
  const pathname = usePathname();

  return (
    <Link
      href={href}
      prefetch={false}
      className={className}
      onClick={(e) => {
        onNavigate?.();
        const [path, hash] = href.split("#");
        if (hash) return;
        const modified = e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0;
        if (modified) return; // mở tab mới, v.v.: giữ hành vi mặc định
        if (path === pathname) {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          scrollTopPending = true;
        }
      }}
    >
      {children}
    </Link>
  );
}

/** Sau khi đổi trang bằng menu, đưa trang mới về đầu ngay (không ảnh hưởng nút Back/Forward của trình duyệt) */
export function ScrollToTop() {
  const pathname = usePathname();
  useEffect(() => {
    if (!scrollTopPending) return;
    scrollTopPending = false;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}
