"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import type { Photo } from "@/data/albums";

// Lightbox chỉ được tải khi khách bấm vào ảnh đầu tiên
const Lightbox = dynamic(() => import("./Lightbox"), { ssr: false });

export function Gallery({ photos }: { photos: Photo[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const opener = useRef<HTMLElement | null>(null);

  const close = useCallback(() => {
    setOpen(null);
    opener.current?.focus(); // trả focus về ảnh vừa mở
  }, []);

  return (
    <>
      <ul className="columns-2 gap-3 md:columns-3 md:gap-5 [&>li]:mb-3 md:[&>li]:mb-5">
        {photos.map((p, i) => (
          <li key={p.src} className="break-inside-avoid" data-reveal style={{ "--reveal-delay": `${(i % 3) * 70}ms` } as React.CSSProperties}>
            <button
              type="button"
              className="group block w-full cursor-zoom-in overflow-hidden bg-sand-200"
              aria-label={`Phóng to ảnh ${i + 1} trên ${photos.length}`}
              onClick={(e) => {
                opener.current = e.currentTarget;
                setOpen(i);
              }}
            >
              <Image
                src={p.src}
                alt={p.alt}
                width={p.width}
                height={p.height}
                sizes="(min-width: 1280px) 400px, (min-width: 768px) 33vw, 50vw"
                placeholder="blur"
                blurDataURL={p.blur}
                preload={i === 0}
                loading={i < 4 ? "eager" : undefined}
                className="h-auto w-full transition-transform duration-[900ms] ease-[var(--ease-soft)] group-hover:scale-[1.035]"
              />
            </button>
          </li>
        ))}
      </ul>

      {open !== null && <Lightbox photos={photos} index={open} onIndex={setOpen} onClose={close} />}
    </>
  );
}
