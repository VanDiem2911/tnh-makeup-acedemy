import Link from "next/link";
import type { ReactNode } from "react";

export type Crumb = { href?: string; label: string };

export function PageHero({
  crumbs,
  eyebrow,
  title,
  children,
}: {
  crumbs: Crumb[];
  eyebrow?: string;
  title: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="container-x pb-4 pt-10 md:pt-16">
      <nav aria-label="Đường dẫn" className="text-sm text-muted">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <li>
            <Link href="/" className="inline-flex min-h-8 items-center hover:text-ink">
              Trang chủ
            </Link>
          </li>
          {crumbs.map((c, i) => (
            <li key={c.label} className="flex items-center gap-2">
              <span aria-hidden="true">/</span>
              {c.href && i < crumbs.length - 1 ? (
                <Link href={c.href} className="inline-flex min-h-8 items-center hover:text-ink">
                  {c.label}
                </Link>
              ) : (
                <span aria-current="page" className="text-ink">
                  {c.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <div className="mt-8 max-w-4xl">
        {eyebrow && (
          <p className="eyebrow rise" data-reveal>
            {eyebrow}
          </p>
        )}
        <h1
          className="display rise mt-5 text-[clamp(2.6rem,6vw,4.75rem)]"
          data-reveal
          style={{ "--d": "80ms", "--reveal-delay": "80ms" } as React.CSSProperties}
        >
          {title}
        </h1>
        {children && (
          <div className="rise mt-6 max-w-2xl" data-reveal style={{ "--d": "170ms", "--reveal-delay": "170ms" } as React.CSSProperties}>
            {children}
          </div>
        )}
      </div>
    </section>
  );
}
