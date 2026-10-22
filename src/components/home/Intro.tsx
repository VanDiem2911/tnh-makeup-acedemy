import { photoOf } from "@/data/albums";
import { Photo } from "../Photo";

const PILLARS = [
  {
    no: "01",
    title: "Dành cho khách trong nước",
    text: "Hiểu gu thẩm mỹ, văn hoá cưới hỏi và thói quen du lịch của người Việt: từ áo dài truyền thống đến váy cưới ngoại cảnh bên biển.",
  },
  {
    no: "02",
    title: "Phóng sự tự nhiên",
    text: "Ít sắp đặt, nhiều cảm xúc. Chúng tôi giữ lại ánh mắt, cái nắm tay, tiếng cười: những điều không thể dàn dựng.",
  },
  {
    no: "03",
    title: "Nhiếp ảnh gia bản địa",
    text: "Am hiểu những bãi biển riêng tư của Phú Quốc, biết giờ nắng đẹp nhất và góc ít người nhất để bạn thoải mái trước ống kính.",
  },
];

export function Intro() {
  const vow = photoOf("ngay-cuoi-ben-bien", 4);

  return (
    <section id="ve-chung-toi" className="section" aria-labelledby="intro-title">
      <div className="container-x grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5" data-reveal>
          <div className="relative mx-auto max-w-md lg:max-w-none">
            <div className="relative aspect-[4/5] overflow-hidden bg-sand-200">
              <Photo
                photo={vow}
                fill
                sizes="(min-width: 1024px) 40vw, 90vw"
                alt="Chú rể đọc lời thề bên cô dâu trước cổng hoa xanh trong lễ cưới ngoài trời"
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div data-reveal>
            <p className="eyebrow">Về chúng tôi</p>
            <h2 id="intro-title" className="display mt-5 text-[clamp(2.4rem,5vw,4rem)]">
              Chụp như cách bạn đang sống: <em>chân thực</em>, nhẹ nhàng, giàu cảm xúc.
            </h2>
            <p className="lead mt-6 max-w-2xl">
              Triệu Ngọc Hạnh Makeup Academy ở Phú Quốc, nơi makeup, trang phục và nhiếp ảnh phóng sự cùng làm việc
              trong một đội ngũ. Mỗi buổi chụp được chuẩn bị riêng cho bạn, để bức ảnh cuối cùng vẫn còn nguyên
              không khí của ngày hôm đó.
            </p>
          </div>

          <ol className="mt-12 divide-y divide-ink/15 border-y hairline">
            {PILLARS.map((p, i) => (
              <li
                key={p.no}
                className="grid gap-x-8 gap-y-2 py-7 sm:grid-cols-[4rem_1fr]"
                data-reveal
                style={{ "--reveal-delay": `${i * 90}ms` } as React.CSSProperties}
              >
                <span className="display text-[1.9rem] text-sunset" aria-hidden="true">
                  {p.no}
                </span>
                <div>
                  <h3 className="display text-[1.75rem]">{p.title}</h3>
                  <p className="mt-2 text-muted">{p.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
