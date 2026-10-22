import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight } from "./icons";

type Variant = "dark" | "outline" | "sunset" | "light";

export function LinkButton({
  href,
  children,
  variant = "dark",
  arrow = true,
  external = false,
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  arrow?: boolean;
  external?: boolean;
  className?: string;
}) {
  const cls = `btn btn-${variant} ${className}`;
  const inner = (
    <>
      {children}
      {arrow && <ArrowRight size={18} className="arrow" />}
    </>
  );
  if (external || href.startsWith("tel:") || href.startsWith("http")) {
    return (
      <a
        href={href}
        className={cls}
        {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {inner}
      </a>
    );
  }
  return (
    // Không prefetch: nút ở đầu trang sẽ tranh băng thông với ảnh LCP; trang đích là HTML tĩnh nên vào vẫn nhanh
    <Link href={href} className={cls} prefetch={false}>
      {inner}
    </Link>
  );
}
