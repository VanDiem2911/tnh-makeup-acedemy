import { photoOf } from "@/data/albums";
import { LinkButton } from "../LinkButton";
import { Photo } from "../Photo";

// Ảnh đen trắng phóng sự: [slug bộ, thứ tự ảnh]
const FRAMES: [string, number][] = [
  ["phong-su-nguoi-than", 1],
  ["hau-truong-co-dau", 2],
  ["getting-ready", 3],
  ["phong-su-doi-ngu", 2],
];

export function ReportageBand() {
  return (
    <section className="on-dark section bg-ink text-cream" aria-labelledby="report-title">
      <div className="container-x">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end" data-reveal>
          <div className="lg:col-span-7">
            <p className="eyebrow">Phong cách phóng sự</p>
            <h2 id="report-title" className="display mt-5 text-[clamp(2.4rem,5vw,4rem)]">
              Khoảnh khắc thật không cần <em>dàn dựng</em>.
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="lead">
              Chúng tôi đứng ở khoảng cách vừa đủ, để bạn cười, khóc và ôm người thân theo cách của chính mình. Đen
              trắng hay màu, điều giữ lại vẫn là cảm xúc.
            </p>
            <div className="mt-7">
              <LinkButton href="/albums/phong-su-nguoi-than" variant="outline">
                Xem bộ phóng sự
              </LinkButton>
            </div>
          </div>
        </div>

        <ul className="mt-14 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5 lg:mt-20">
          {FRAMES.map(([slug, n], i) => {
            const photo = photoOf(slug, n);
            return (
              <li
                key={`${slug}-${n}`}
                className={i % 2 === 1 ? "md:mt-12" : ""}
                data-reveal
                style={{ "--reveal-delay": `${i * 90}ms` } as React.CSSProperties}
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-ink-soft">
                  <Photo photo={photo} fill sizes="(min-width: 1024px) 22vw, 46vw" />
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
