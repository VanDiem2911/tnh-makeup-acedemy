import { photoOf } from "@/data/albums";
import { LinkButton } from "../LinkButton";
import { Photo } from "../Photo";

const delay = (ms: number) => ({ "--d": `${ms}ms`, "--reveal-delay": `${ms}ms` }) as React.CSSProperties;

/**
 * Hero vừa khít đúng một màn hình (trừ chiều cao header) ở mọi kích thước:
 * - chiều cao khung = 100svh - header; chữ co theo cả chiều rộng lẫn chiều cao màn hình
 * - cặp ảnh chồng nhau tự co theo khung chứa (container query units) nên không bao giờ tràn xuống dưới
 */
export function Hero() {
  const bride = photoOf("co-dau-va-bien", 1);
  const couple = photoOf("ngay-cuoi-ben-bien", 1);

  return (
    <section
      className="relative h-[calc(100svh-var(--header-h))] min-h-[30rem] overflow-hidden"
      aria-labelledby="hero-title"
    >
      <div className="container-x flex h-full flex-col gap-5 py-5 sm:py-7 lg:grid lg:grid-cols-12 lg:items-center lg:gap-8 lg:py-8">
        <div className="lg:col-span-5">
          <h1
            id="hero-title"
            className="display rise text-[clamp(2.3rem,min(6vw,8.4svh),4.6rem)]"
            data-reveal
            style={delay(0)}
          >
            Ảnh cưới biển Phú&nbsp;Quốc, <em>tự nhiên</em> và giàu cảm xúc.
          </h1>
          <p
            className="lead rise mt-4 max-w-md sm:mt-6 max-lg:[@media(max-height:760px)]:hidden"
            data-reveal
            style={delay(110)}
          >
            Triệu Ngọc Hạnh Makeup Academy đồng hành cùng bạn từ makeup, trang phục đến lúc bấm máy: phong cách phóng sự
            chân thực dành cho cặp đôi, gia đình và những ai muốn giữ lại một mùa biển thật đẹp.
          </p>
          <div className="rise mt-5 flex gap-3 sm:mt-8" data-reveal style={delay(210)}>
            <LinkButton href="/albums" className="flex-1 px-4 sm:flex-none sm:px-7">
              Xem bộ ảnh
            </LinkButton>
            <LinkButton
              href="/lien-he#dat-lich"
              variant="outline"
              arrow={false}
              className="flex-1 px-4 sm:flex-none sm:px-7"
            >
              Nhận tư vấn
            </LinkButton>
          </div>
        </div>

        {/* Khung chiếm phần chiều cao còn lại; container-type:size để cặp ảnh tính kích thước theo chính khung này */}
        <div className="min-h-0 flex-1 lg:col-span-7 lg:h-full" style={{ containerType: "size" }}>
          <div
            className="relative mx-auto lg:ml-auto lg:mr-0"
            style={
              {
                "--s": "min(100cqh, 100cqw / 0.96, 40rem)",
                height: "var(--s)",
                width: "calc(var(--s) * 0.96)",
              } as React.CSSProperties
            }
          >
            <div
              className="drift absolute left-0 top-0"
              data-reveal
              style={{ ...delay(60), height: "calc(var(--s) * 0.92)", aspectRatio: "2 / 3" }}
            >
              <div className="relative h-full w-full overflow-hidden bg-sand-200">
                <Photo
                  photo={bride}
                  fill
                  preload
                  quality={85}
                  sizes="(min-width: 1024px) 400px, 60vw"
                  alt="Cô dâu váy trắng, đội veil, cầm bó hoa lan hồng trên bãi biển Phú Quốc lúc nắng chiều"
                />
              </div>
            </div>
            <div
              className="drift absolute bottom-0 right-0"
              data-reveal
              style={{ ...delay(220), height: "calc(var(--s) * 0.64)", aspectRatio: "2 / 3" }}
            >
              <div className="relative h-full w-full overflow-hidden bg-sand-200 shadow-[0_28px_70px_-18px_rgba(30,28,26,0.55)]">
                <Photo
                  photo={couple}
                  fill
                  eager
                  sizes="(min-width: 1024px) 280px, 40vw"
                  alt="Cô dâu chú rể ôm nhau dưới nắng, veil bay trong gió"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
