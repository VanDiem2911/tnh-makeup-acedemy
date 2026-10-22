"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { NAV, SITE } from "@/data/site";
import { Chat, Close, Menu, Phone } from "./icons";
import { NavLink } from "./NavLink";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Đóng menu khi đổi trang (điều chỉnh state trong lúc render theo khuyến nghị của React)
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLElement>("a")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className="-mr-2 grid size-12 place-items-center rounded-full text-ink md:hidden"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Đóng menu" : "Mở menu"}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <Close size={26} /> : <Menu size={26} />}
      </button>

      {open && (
        <div
          ref={panelRef}
          id="mobile-menu"
          className="fixed inset-x-0 bottom-0 top-[var(--header-h)] z-40 overflow-y-auto bg-cream md:hidden"
          style={{ animation: "fade-in 0.25s var(--ease-soft) both" }}
        >
          <nav aria-label="Menu chính" className="container-x flex min-h-full flex-col pb-10 pt-6">
            <ul className="divide-y divide-ink/15 border-y hairline">
              {NAV.map((item) => (
                <li key={item.href}>
                  <NavLink
                    href={item.href}
                    onNavigate={() => setOpen(false)}
                    className="display flex min-h-16 items-center justify-between py-3 text-[2rem]"
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
            <div className="mt-8 grid gap-3">
              <a href={`tel:${SITE.phoneTel}`} className="btn btn-dark">
                <Phone size={18} /> Gọi {SITE.phoneDisplay}
              </a>
              <a href={SITE.zalo} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                <Chat size={18} /> Nhắn Zalo
              </a>
            </div>
            <p className="mt-auto pt-10 text-sm text-muted">{SITE.address.full}</p>
          </nav>
        </div>
      )}
    </>
  );
}
