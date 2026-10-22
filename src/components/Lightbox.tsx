"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";
import type { Photo } from "@/data/albums";
import { ChevronLeft, ChevronRight, Close } from "./icons";

type Props = {
  photos: Photo[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
};

const iconBtn =
  "grid size-12 place-items-center rounded-full bg-cream/10 text-cream transition-colors hover:bg-cream/25 focus-visible:bg-cream/25";

export default function Lightbox({ photos, index, onIndex, onClose }: Props) {
  const n = photos.length;
  const photo = photos[index];
  const rootRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const swipe = useRef<{ x: number; y: number } | null>(null);

  const go = useCallback((delta: number) => onIndex((index + delta + n) % n), [index, n, onIndex]);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return onClose();
      if (e.key === "ArrowLeft") return go(-1);
      if (e.key === "ArrowRight") return go(1);
      if (e.key === "Tab") {
        // giữ focus trong hộp thoại
        const items = rootRef.current?.querySelectorAll<HTMLElement>("button:not([disabled])");
        if (!items?.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, onClose]);

  const neighbours = n > 1 ? [photos[(index + 1) % n], photos[(index - 1 + n) % n]] : [];

  return (
    <div
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Xem ảnh phóng to, ảnh ${index + 1} trên ${n}`}
      className="on-dark fixed inset-0 z-[100] flex flex-col bg-ink/95 backdrop-blur-sm"
      style={{ animation: "fade-in 0.25s var(--ease-soft) both" }}
      onPointerDown={(e) => {
        swipe.current = { x: e.clientX, y: e.clientY };
      }}
      onPointerUp={(e) => {
        const s = swipe.current;
        swipe.current = null;
        if (!s || n < 2) return;
        const dx = e.clientX - s.x;
        const dy = e.clientY - s.y;
        if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.5) go(dx < 0 ? 1 : -1);
      }}
    >
      <div className="flex h-16 shrink-0 items-center justify-between px-3 sm:px-5">
        <p className="px-3 text-sm tracking-widest text-cream/80" aria-live="polite">
          {index + 1} / {n}
        </p>
        <button ref={closeRef} type="button" onClick={onClose} className={iconBtn} aria-label="Đóng">
          <Close size={24} />
        </button>
      </div>

      <div
        className="relative flex min-h-0 flex-1 items-center justify-center px-3 pb-6 sm:px-20"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        {n > 1 && (
          <button
            type="button"
            onClick={() => go(-1)}
            className={`${iconBtn} absolute left-2 top-1/2 z-10 hidden -translate-y-1/2 sm:grid`}
            aria-label="Ảnh trước"
          >
            <ChevronLeft size={26} />
          </button>
        )}

        <Image
          key={photo.src}
          src={photo.src}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          sizes="100vw"
          quality={85}
          placeholder="blur"
          blurDataURL={photo.blur}
          draggable={false}
          className="h-auto max-h-full w-auto max-w-full select-none object-contain"
          style={{ animation: "fade-in 0.35s var(--ease-soft) both" }}
        />

        {n > 1 && (
          <button
            type="button"
            onClick={() => go(1)}
            className={`${iconBtn} absolute right-2 top-1/2 z-10 hidden -translate-y-1/2 sm:grid`}
            aria-label="Ảnh sau"
          >
            <ChevronRight size={26} />
          </button>
        )}
      </div>

      {n > 1 && (
        <div className="flex shrink-0 items-center justify-center gap-3 pb-5 sm:hidden">
          <button type="button" onClick={() => go(-1)} className={iconBtn} aria-label="Ảnh trước">
            <ChevronLeft size={26} />
          </button>
          <button type="button" onClick={() => go(1)} className={iconBtn} aria-label="Ảnh sau">
            <ChevronRight size={26} />
          </button>
        </div>
      )}

      {/* Nạp trước ảnh kế bên để chuyển ảnh tức thì (cùng URL đã tối ưu nên dùng lại cache) */}
      {neighbours.map((p) => (
        <Image
          key={p.src}
          src={p.src}
          alt=""
          width={p.width}
          height={p.height}
          sizes="100vw"
          quality={85}
          loading="eager"
          aria-hidden="true"
          className="pointer-events-none absolute size-px opacity-0"
        />
      ))}
    </div>
  );
}
