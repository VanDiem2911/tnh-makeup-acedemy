"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import type { Photo } from "@/data/albums";

// Lightbox chỉ được tải khi khách bấm vào ảnh đầu tiên
const Lightbox = dynamic(() => import("./Lightbox"), { ssr: false });

// Bố cục so le (từ màn hình vừa trở lên), lặp theo chu kỳ 4 ảnh: ảnh to bên trái, ảnh nhỏ lệch xuống bên phải,
// rồi ảnh nhỏ thụt vào, ảnh to bên phải. Các cặp (0,1) và (2,3) nằm chung một hàng, không bao giờ chồng nhau.
// Trên điện thoại: một cột, ảnh tràn chiều rộng.
const SLOTS = [
  "md:col-start-1 md:col-span-6",
  "md:col-start-9 md:col-span-3 md:mt-44",
  "md:col-start-3 md:col-span-4 md:mt-6",
  "md:col-start-7 md:col-span-5 md:mt-28",
];
const SIZES = [
  "(min-width: 768px) 50vw, 100vw",
  "(min-width: 768px) 25vw, 100vw",
  "(min-width: 768px) 34vw, 100vw",
  "(min-width: 768px) 42vw, 100vw",
];

/**
 * Các ảnh của một bộ, xếp so le như trang tạp chí. `photos` là toàn bộ ảnh của bộ (lightbox duyệt được tất cả),
 * `from` là ảnh đầu tiên được hiển thị ở đây (ảnh trước đó đã dùng làm ảnh bìa ở đầu trang).
 */
export function AlbumGallery({ photos, from = 1 }: { photos: Photo[]; from?: number }) {
  const [open, setOpen] = useState<number | null>(null);
  const opener = useRef<HTMLElement | null>(null);

  const close = useCallback(() => {
    setOpen(null);
    opener.current?.focus(); // trả focus về ảnh vừa mở
  }, []);

  const shown = photos.slice(from);
  if (!shown.length) return null;

  return (
    <>
      <ul className="grid grid-cols-1 gap-y-4 md:grid-cols-12 md:gap-x-6 md:gap-y-20 lg:gap-y-28">
        {shown.map((p, i) => (
          <li
            key={p.src}
            className={`${SLOTS[i % 4]} md:self-start`}
            data-reveal
            style={{ "--reveal-delay": `${(i % 2) * 90}ms` } as React.CSSProperties}
          >
            <button
              type="button"
              className="group block w-full cursor-zoom-in overflow-hidden bg-sand-200"
              aria-label={`Phóng to ảnh ${from + i + 1} trên ${photos.length}`}
              onClick={(e) => {
                opener.current = e.currentTarget;
                setOpen(from + i);
              }}
            >
              <Image
                src={p.src}
                alt={p.alt}
                width={p.width}
                height={p.height}
                sizes={SIZES[i % 4]}
                placeholder="blur"
                blurDataURL={p.blur}
                loading={i < 2 ? "eager" : undefined}
                className="h-auto w-full transition-transform duration-[1200ms] ease-[var(--ease-soft)] group-hover:scale-[1.025]"
              />
            </button>
          </li>
        ))}
      </ul>

      {open !== null && <Lightbox photos={photos} index={open} onIndex={setOpen} onClose={close} />}
    </>
  );
}
