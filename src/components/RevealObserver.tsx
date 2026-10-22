"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Sự kiện để các thành phần động (vd. bộ lọc) báo có khối [data-reveal] mới vừa được vẽ ra */
export const REVEAL_REFRESH = "reveal:refresh";

/**
 * Hiệu ứng hiện dần, lặp lại mỗi lần khối đi vào màn hình (cuộn xuống lẫn cuộn lên).
 *
 * - HTML từ server luôn hiển thị đầy đủ (không phụ thuộc JS). Sau khi hydrate, khối nằm ngoài màn hình
 *   chuyển sang trạng thái ẩn; khi vào màn hình lại hiện dần; ra khỏi màn hình hẳn thì ẩn lại.
 * - Dùng sự kiện cuộn (gộp theo frame) thay vì IntersectionObserver: khối bị cuộn "nhảy cóc"
 *   (anchor, phím End, kéo thanh cuộn) vẫn luôn có trạng thái đúng, không bao giờ để trống.
 * - Tôn trọng prefers-reduced-motion: tắt hẳn.
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const visible = new Map<HTMLElement, boolean>();

    const show = (el: HTMLElement) => {
      el.classList.remove("reveal-pending");
      el.classList.add("reveal-in");
      visible.set(el, true);
    };
    const hide = (el: HTMLElement) => {
      // Hoạt ảnh vào trang bằng CSS (rise/drift) giữ trạng thái cuối; gỡ ra để hiệu ứng cuộn điều khiển được
      el.classList.remove("rise", "drift", "reveal-in");
      el.classList.add("reveal-pending");
      visible.set(el, false);
    };

    const evaluate = () => {
      const vh = window.innerHeight;

      // Quét khối mới (vd. sau khi lọc ảnh) và bỏ khối đã bị gỡ khỏi trang
      const fresh: HTMLElement[] = [];
      document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
        if (!visible.has(el)) fresh.push(el);
      });
      for (const el of visible.keys()) if (!el.isConnected) visible.delete(el);

      const all = [...visible.keys(), ...fresh];
      const rects = all.map((el) => el.getBoundingClientRect()); // đọc layout một lượt, rồi mới ghi class
      all.forEach((el, i) => {
        const { top, bottom } = rects[i];
        if (!visible.has(el)) {
          // Khối mới: đang thấy thì giữ nguyên (không animate lúc vừa xuất hiện), còn lại chuyển sang ẩn
          if (top < vh * 0.92 && bottom > 0) show(el);
          else hide(el);
          return;
        }
        const isVisible = visible.get(el);
        if (!isVisible && top < vh * 0.9 && bottom > vh * 0.04) show(el);
        else if (isVisible && (bottom <= 0 || top >= vh)) hide(el);
      });
    };

    let frame = 0;
    const schedule = () => {
      if (!frame)
        frame = requestAnimationFrame(() => {
          frame = 0;
          evaluate();
        });
    };

    evaluate();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    window.addEventListener(REVEAL_REFRESH, schedule);
    // Ảnh tải xong có thể làm dịch bố cục mà không có sự kiện cuộn
    window.addEventListener("load", schedule);
    const settle = window.setTimeout(schedule, 700);

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener(REVEAL_REFRESH, schedule);
      window.removeEventListener("load", schedule);
      window.clearTimeout(settle);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [pathname]);

  return null;
}
