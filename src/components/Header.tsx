import Image from "next/image";
import Link from "next/link";
import { NAV, SITE } from "@/data/site";
import { MobileMenu } from "./MobileMenu";
import { NavLink } from "./NavLink";

export function Header() {
  return (
    <header className="sticky top-0 z-50 h-[var(--header-h)] border-b hairline">
      {/* Lớp nền mờ tách riêng: backdrop-filter trên chính <header> sẽ biến nó thành khung chứa của menu mobile (fixed) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-cream/90 backdrop-blur-md supports-[backdrop-filter]:bg-cream/80"
      />
      <div className="container-x flex h-full items-center justify-between gap-6">
        {/* <a> thường (không phải <Link>): bấm logo là tải lại cả trang, kể cả khi đang ở trang chủ */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/" className="flex items-center gap-3">
          <Image src="/brand/logo.png" alt="" width={48} height={48} className="size-11 sm:size-12" loading="eager" />
          <span className="leading-none">
            <span className="display block text-[1.35rem] sm:text-[1.5rem]">{SITE.short}</span>
            <span className="mt-1 block text-xs font-medium uppercase tracking-[0.28em] text-muted">{SITE.sub}</span>
            <span className="sr-only"> – Trang chủ</span>
          </span>
        </a>

        <nav aria-label="Menu chính" className="hidden items-center gap-9 md:flex">
          {NAV.map((item) => (
            <NavLink key={item.href} href={item.href} className="link-line text-[0.9375rem] text-ink">
              {item.label}
            </NavLink>
          ))}
          <Link href="/lien-he#dat-lich" className="btn btn-dark min-h-11 px-6" prefetch={false}>
            Đặt lịch tư vấn
          </Link>
        </nav>

        <MobileMenu />
      </div>
    </header>
  );
}
