import Image from "next/image";
import Link from "next/link";
import { SERVICES } from "@/data/services";
import { SITE } from "@/data/site";
import { Chat, Facebook, MapPin, Phone } from "./icons";

export function Footer() {
  return (
    <footer className="on-dark bg-ink-soft pb-28 pt-16 text-cream md:pb-12 md:pt-24">
      <div className="container-x">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3">
              <Image src="/brand/logo.png" alt="" width={56} height={56} className="size-14" />
              <div className="leading-none">
                <p className="display text-[1.7rem]">{SITE.short}</p>
                <p className="mt-1.5 text-xs font-medium uppercase tracking-[0.28em] text-[#b9b0a3]">{SITE.sub}</p>
              </div>
            </div>
            <p className="lead mt-6 max-w-sm text-[0.9375rem]">
              Chụp ảnh cưới, cặp đôi, gia đình và chân dung tại Phú Quốc theo phong cách phóng sự tự nhiên, cùng makeup
              và trang phục trọn gói.
            </p>
          </div>

          <div className="lg:col-span-3 lg:col-start-6">
            <h2 className="eyebrow">Dịch vụ</h2>
            <ul className="mt-5 space-y-1">
              {SERVICES.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/dich-vu/${s.slug}`}
                    className="inline-flex min-h-10 items-center text-[0.9375rem] text-cream/85 transition-colors hover:text-sunset-light"
                  >
                    {s.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/albums"
                  className="inline-flex min-h-10 items-center text-[0.9375rem] text-cream/85 transition-colors hover:text-sunset-light"
                >
                  Tất cả bộ ảnh
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-4">
            <h2 className="eyebrow">Liên hệ</h2>
            <ul className="mt-5 space-y-3 text-[0.9375rem]">
              <li>
                <a
                  href={`tel:${SITE.phoneTel}`}
                  className="inline-flex min-h-10 items-center gap-3 transition-colors hover:text-sunset-light"
                >
                  <Phone size={18} className="shrink-0 text-sunset-light" /> {SITE.phoneDisplay}
                </a>
              </li>
              <li>
                <a
                  href={SITE.zalo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-10 items-center gap-3 transition-colors hover:text-sunset-light"
                >
                  <Chat size={18} className="shrink-0 text-sunset-light" /> Nhắn Zalo {SITE.phoneDisplay}
                </a>
              </li>
              <li>
                <a
                  href={SITE.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-10 items-center gap-3 transition-colors hover:text-sunset-light"
                >
                  <Facebook size={18} className="shrink-0 text-sunset-light" /> Facebook · hanhtrieu16.08
                </a>
              </li>
              <li>
                <a
                  href={SITE.maps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-start gap-3 py-1.5 transition-colors hover:text-sunset-light"
                >
                  <MapPin size={18} className="mt-1 shrink-0 text-sunset-light" /> {SITE.address.full}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t hairline pt-6 text-sm text-[#b9b0a3] sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {SITE.name}. Bảo lưu mọi quyền.
          </p>
          <p>Hình ảnh thuộc quyền sở hữu của {SITE.owner}.</p>
        </div>
      </div>
    </footer>
  );
}
