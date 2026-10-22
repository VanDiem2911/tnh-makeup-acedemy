import Link from "next/link";
import { photoOf } from "@/data/albums";
import { SERVICES } from "@/data/services";
import { ArrowRight } from "../icons";
import { Photo } from "../Photo";

// Bố cục lưới 6 cột ở màn hình lớn: 3 + 3 / 2 + 2 + 2
const SHAPE = [
  "aspect-[4/5] sm:aspect-[5/4] md:aspect-[4/5] lg:col-span-3 lg:aspect-[5/4]",
  "aspect-[4/5] sm:aspect-[5/4] md:aspect-[4/5] lg:col-span-3 lg:aspect-[5/4]",
  "aspect-[4/5] sm:aspect-[5/4] md:aspect-[4/5] lg:col-span-2 lg:aspect-[3/4]",
  "aspect-[4/5] sm:aspect-[5/4] md:aspect-[4/5] lg:col-span-2 lg:aspect-[3/4]",
  "aspect-[4/5] sm:aspect-[5/4] md:col-span-2 md:aspect-[16/9] lg:col-span-2 lg:aspect-[3/4]",
];

export function ServicesGrid() {
  return (
    <section id="dich-vu" className="section bg-sand-100" aria-labelledby="services-title">
      <div className="container-x">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end" data-reveal>
          <div className="lg:col-span-7">
            <p className="eyebrow">Dịch vụ</p>
            <h2 id="services-title" className="display mt-5 text-[clamp(2.4rem,5vw,4rem)]">
              Năm cách để lưu giữ <em>mùa biển</em> của bạn.
            </h2>
          </div>
          <p className="lead lg:col-span-5">
            Từ ngày cưới, buổi chiều săn hoàng hôn đến kỳ nghỉ của cả gia đình, mỗi dịch vụ đều theo cùng một tinh thần:
            tự nhiên và chân thực.
          </p>
        </div>

        <ul className="mt-12 grid gap-4 md:grid-cols-2 md:gap-5 lg:mt-16 lg:grid-cols-6">
          {SERVICES.map((s, i) => {
            const photo = photoOf(s.cover[0], s.cover[1]);
            return (
              <li
                key={s.slug}
                className={SHAPE[i]}
                data-reveal
                style={{ "--reveal-delay": `${(i % 2) * 90}ms` } as React.CSSProperties}
              >
                <Link
                  href={`/dich-vu/${s.slug}`}
                  className="group on-dark relative block h-full w-full overflow-hidden bg-ink"
                >
                  <Photo
                    photo={photo}
                    fill
                    sizes="(min-width: 1024px) 40vw, (min-width: 768px) 50vw, 92vw"
                    className="transition-transform duration-[1400ms] ease-[var(--ease-soft)] group-hover:scale-[1.05]"
                    position={i === 4 ? "50% 25%" : undefined}
                    alt={`${s.label}: ${photo.alt}`}
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-linear-to-t from-ink/90 from-15% via-ink/45 via-50% to-transparent"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-5 text-cream sm:p-7">
                    <p className="text-sm font-medium tracking-[0.2em] text-sunset-light">{s.no}</p>
                    <h3 className="display mt-2 text-[1.55rem] leading-[1.12] sm:text-[1.8rem]">{s.title}</h3>
                    <p className="mt-2 hidden max-w-sm text-[0.9375rem] text-cream/85 sm:block">{s.tagline}</p>
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium">
                      Xem bộ ảnh
                      <ArrowRight
                        size={18}
                        className="transition-transform duration-300 group-hover:translate-x-1.5"
                      />
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
