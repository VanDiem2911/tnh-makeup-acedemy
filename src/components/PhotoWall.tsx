"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useSyncExternalStore } from "react";
import type { WallTile } from "@/data/wall";

const COLS = 12;
// Lệch pha đầu của từng cột (px) để mép trên các cột so le nhau như ảnh in rải trên bàn
const PHASE = [0, 240, 90, 330, 160, 40, 300, 120, 370, 200, 60, 280];

const mod = (n: number, m: number) => ((n % m) + m) % m;

const subscribe = () => () => {};
const isClient = () => true;
const isServer = () => false;

/**
 * Tường ảnh cuộn vô hạn theo mọi hướng (kéo chuột / vuốt / lăn chuột / phím mũi tên).
 *
 * Mỗi cột là một dải ảnh tự lặp vòng theo chiều dọc (hai bản sao xếp chồng), các cột cũng lặp vòng theo chiều
 * ngang. Việc di chuyển chỉ đổi `transform` của 12 cột trong một vòng requestAnimationFrame, không render lại React,
 * nên vẫn mượt với 138 ảnh. Bản HTML từ server là một lưới tĩnh đầy đủ liên kết (tốt cho SEO, vẫn dùng được khi chưa có JS).
 */
export function PhotoWall({ tiles }: { tiles: WallTile[] }) {
  const wallRef = useRef<HTMLDivElement>(null);
  const colRefs = useRef<(HTMLDivElement | null)[]>([]);
  // Bản sao thứ hai (để lặp vòng) chỉ có ở client: không làm nặng HTML và không bị đọc/tab trùng
  const duplicate = useSyncExternalStore(subscribe, isClient, isServer);

  const columns = useMemo(() => {
    const cols: WallTile[][] = Array.from({ length: COLS }, () => []);
    tiles.forEach((t, i) => cols[i % COLS].push(t));
    return cols;
  }, [tiles]);

  useEffect(() => {
    const wall = wallRef.current;
    if (!wall) return;
    const cols = colRefs.current.filter((c): c is HTMLDivElement => !!c);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let step = 0;
    let width = 0;
    const period: number[] = [];

    const measure = () => {
      const gap = parseFloat(getComputedStyle(cols[0]).marginRight) || 0;
      step = cols[0].offsetWidth + gap;
      width = step * COLS;
      cols.forEach((c, i) => {
        period[i] = c.querySelector<HTMLElement>("[data-copy='a']")?.offsetHeight || 1;
      });
    };

    // tx/ty: đích; cx/cy: vị trí đang hiển thị (đuổi theo đích cho mượt); vx/vy: quán tính khi thả tay
    const s = { tx: 0, ty: 0, cx: 0, cy: 0, vx: 0, vy: 0 };
    let dragging = false;
    let raf = 0;

    const paint = () => {
      for (let i = 0; i < cols.length; i++) {
        const x = mod(s.cx + i * step, width) - step;
        const y = mod(s.cy - PHASE[i], period[i]) - period[i];
        cols[i].style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      }
    };

    const tick = () => {
      raf = 0;
      if (!dragging && (Math.abs(s.vx) > 0.05 || Math.abs(s.vy) > 0.05)) {
        s.tx += s.vx;
        s.ty += s.vy;
        s.vx *= 0.94;
        s.vy *= 0.94;
      }
      const k = reduce ? 1 : dragging ? 0.38 : 0.15;
      s.cx += (s.tx - s.cx) * k;
      s.cy += (s.ty - s.cy) * k;
      paint();
      const busy =
        dragging ||
        Math.abs(s.tx - s.cx) > 0.1 ||
        Math.abs(s.ty - s.cy) > 0.1 ||
        Math.abs(s.vx) > 0.05 ||
        Math.abs(s.vy) > 0.05;
      if (busy) raf = requestAnimationFrame(tick);
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    // ── Lăn chuột / touchpad ──
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const unit = e.deltaMode === 1 ? 32 : e.deltaMode === 2 ? wall.clientHeight : 1;
      const horizontal = e.shiftKey && !e.deltaX;
      s.tx -= (horizontal ? e.deltaY : e.deltaX) * unit;
      s.ty -= (horizontal ? 0 : e.deltaY) * unit;
      kick();
    };

    // ── Kéo chuột / vuốt tay ──
    let pointerId = -1;
    let captured = false;
    let moved = 0;
    let blockClick = false;
    let last = { x: 0, y: 0, t: 0 };

    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      pointerId = e.pointerId;
      dragging = true;
      captured = false;
      moved = 0;
      blockClick = false;
      last = { x: e.clientX, y: e.clientY, t: e.timeStamp };
      s.vx = 0;
      s.vy = 0;
      kick();
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging || e.pointerId !== pointerId) return;
      const dx = e.clientX - last.x;
      const dy = e.clientY - last.y;
      moved += Math.abs(dx) + Math.abs(dy);
      if (!captured) {
        if (moved <= 6) return; // còn là cú bấm: không coi là kéo, để liên kết ảnh vẫn mở được
        // Chỉ bắt con trỏ khi đã thực sự kéo; bắt ngay lúc nhấn sẽ làm mất cú bấm vào ảnh
        wall.setPointerCapture(pointerId);
        captured = true;
        wall.classList.add("is-dragging");
      }
      const dt = Math.max(1, e.timeStamp - last.t);
      s.tx += dx;
      s.ty += dy;
      s.vx = s.vx * 0.5 + ((dx / dt) * 16) * 0.5;
      s.vy = s.vy * 0.5 + ((dy / dt) * 16) * 0.5;
      last = { x: e.clientX, y: e.clientY, t: e.timeStamp };
      kick();
    };
    const onUp = (e: PointerEvent) => {
      if (e.pointerId !== pointerId) return;
      dragging = false;
      if (captured) {
        blockClick = true; // cú nhả chuột sau khi kéo không được tính là bấm vào ảnh
        if (wall.hasPointerCapture(pointerId)) wall.releasePointerCapture(pointerId);
        wall.classList.remove("is-dragging");
        if (reduce || performance.now() - last.t > 90) {
          s.vx = 0; // dừng tay trước khi thả thì không văng tiếp
          s.vy = 0;
        }
      }
      captured = false;
      pointerId = -1;
      kick();
    };
    const onClickCapture = (e: MouseEvent) => {
      if (!blockClick) return;
      blockClick = false;
      e.preventDefault();
      e.stopPropagation();
    };

    // ── Bàn phím ──
    const onKey = (e: KeyboardEvent) => {
      const h = wall.clientHeight;
      const moves: Record<string, [number, number]> = {
        ArrowLeft: [200, 0],
        ArrowRight: [-200, 0],
        ArrowUp: [0, 200],
        ArrowDown: [0, -200],
        PageUp: [0, h * 0.85],
        PageDown: [0, -h * 0.85],
      };
      const m = moves[e.key];
      if (!m) return;
      e.preventDefault();
      s.tx += m[0];
      s.ty += m[1];
      kick();
    };
    // Mỗi ảnh có một "song sinh" ở bản sao thứ hai. Tab vào ảnh nào thì đưa bản đang gần giữa khung nhất vào tầm nhìn
    // và hiện vòng focus trên cả hai bản (bản đang thấy trên màn hình có thể là bản sao).
    const twinOf = (el: HTMLElement) => {
      const li = el.closest("li");
      const own = li?.parentElement;
      const col = own?.parentElement;
      if (!li || !own || !col) return null;
      const other = col.querySelector<HTMLElement>(`[data-copy='${own.dataset.copy === "a" ? "b" : "a"}']`);
      return other?.children[[...own.children].indexOf(li)]?.querySelector<HTMLElement>("a") ?? null;
    };
    const onFocusIn = (e: FocusEvent) => {
      const el = e.target as HTMLElement;
      if (!el.matches("a")) return;
      const twin = twinOf(el);
      twin?.setAttribute("data-twin-focus", "");

      // Chốt vị trí hiện tại (dừng hoạt ảnh dở) để đo chính xác, tránh cộng dồn khi Tab liên tiếp
      s.tx = s.cx;
      s.ty = s.cy;
      s.vx = 0;
      s.vy = 0;
      paint();

      const w = wall.getBoundingClientRect();
      const cx = w.left + w.width / 2;
      const cy = w.top + w.height / 2;
      const rects = [el, twin].filter((n): n is HTMLElement => !!n).map((n) => n.getBoundingClientRect());
      if (rects.some((r) => r.left >= w.left && r.right <= w.right && r.top >= w.top && r.bottom <= w.bottom)) return;
      const dist = (r: DOMRect) => Math.hypot(r.left + r.width / 2 - cx, r.top + r.height / 2 - cy);
      const nearest = rects.reduce((a, b) => (dist(a) <= dist(b) ? a : b));
      s.tx += cx - (nearest.left + nearest.width / 2);
      s.ty += cy - (nearest.top + nearest.height / 2);
      kick();
    };
    const onFocusOut = () => {
      wall.querySelectorAll("[data-twin-focus]").forEach((n) => n.removeAttribute("data-twin-focus"));
    };

    measure();
    paint();
    const ro = new ResizeObserver(() => {
      measure();
      paint();
    });
    ro.observe(wall);

    wall.addEventListener("wheel", onWheel, { passive: false });
    wall.addEventListener("pointerdown", onDown);
    wall.addEventListener("pointermove", onMove);
    wall.addEventListener("pointerup", onUp);
    wall.addEventListener("pointercancel", onUp);
    wall.addEventListener("click", onClickCapture, true);
    wall.addEventListener("keydown", onKey);
    wall.addEventListener("focusin", onFocusIn);
    wall.addEventListener("focusout", onFocusOut);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      wall.removeEventListener("wheel", onWheel);
      wall.removeEventListener("pointerdown", onDown);
      wall.removeEventListener("pointermove", onMove);
      wall.removeEventListener("pointerup", onUp);
      wall.removeEventListener("pointercancel", onUp);
      wall.removeEventListener("click", onClickCapture, true);
      wall.removeEventListener("keydown", onKey);
      wall.removeEventListener("focusin", onFocusIn);
      wall.removeEventListener("focusout", onFocusOut);
    };
  }, []);

  const renderTiles = (list: WallTile[], copy: "a" | "b", offset: number) =>
    list.map((t, i) => (
      <li key={t.key} className="shrink-0">
        <Link
          href={`/albums/${t.albumSlug}`}
          prefetch={false}
          draggable={false}
          tabIndex={copy === "b" ? -1 : undefined}
          aria-label={copy === "a" ? `Mở bộ ảnh ${t.albumTitle}` : undefined}
          style={{ "--r": `${t.tilt}deg` } as React.CSSProperties}
          className="group relative block overflow-hidden bg-sand-200 shadow-[0_8px_22px_-12px_rgba(30,28,26,0.5)] transition-[rotate,scale,box-shadow] duration-500 ease-[var(--ease-soft)] [rotate:var(--r)] hover:z-10 hover:scale-[1.06] hover:shadow-[0_22px_44px_-18px_rgba(30,28,26,0.6)] hover:[rotate:0deg] focus-visible:z-10 focus-visible:scale-[1.06] focus-visible:[rotate:0deg]"
        >
          <Image
            src={t.src}
            alt={copy === "a" ? t.alt : ""}
            width={t.width}
            height={t.height}
            sizes="(min-width: 1600px) 272px, max(144px, 17vw)"
            quality={60}
            draggable={false}
            loading={copy === "a" && offset + i < 8 ? "eager" : undefined}
            className="h-auto w-full"
          />
          <span
            aria-hidden="true"
            className="on-dark pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-ink/85 to-transparent px-3 pb-3 pt-10 text-cream opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
          >
            <span className="display block text-[1.2rem] leading-tight">{t.albumTitle}</span>
            <span className="mt-0.5 block text-xs tracking-wide text-cream/80">Xem bộ ảnh</span>
          </span>
        </Link>
      </li>
    ));

  return (
    <div
      ref={wallRef}
      role="region"
      aria-label="Tường ảnh. Kéo hoặc cuộn để xem, dùng phím mũi tên để di chuyển, nhấn vào ảnh để mở bộ ảnh"
      tabIndex={0}
      className="wall absolute inset-0 cursor-grab touch-none select-none overflow-hidden"
      style={
        {
          // clip (không phải hidden): khung không thể bị cuộn, kể cả khi trình duyệt tự cuộn tới phần tử đang focus
          overflow: "clip",
          "--colw": "clamp(9rem, 17vw, 17rem)",
          "--gap": "clamp(0.6rem, 1.1vw, 1rem)",
          "--step": "calc(var(--colw) + var(--gap))",
        } as React.CSSProperties
      }
    >
      {columns.map((list, c) => (
        <div
          key={c}
          ref={(el) => {
            colRefs.current[c] = el;
          }}
          className="absolute left-0 top-0 will-change-transform"
          style={{
            width: "var(--colw)",
            marginRight: "var(--gap)",
            transform: `translate3d(calc(var(--step) * ${c - 1}), ${-PHASE[c]}px, 0)`,
          }}
        >
          <ul data-copy="a" className="flex flex-col gap-[var(--gap)] pb-[var(--gap)]">
            {renderTiles(list, "a", c)}
          </ul>
          {duplicate && (
            <ul data-copy="b" aria-hidden="true" inert className="flex flex-col gap-[var(--gap)] pb-[var(--gap)]">
              {renderTiles(list, "b", c)}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}
