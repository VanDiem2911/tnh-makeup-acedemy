import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AlbumGallery } from "@/components/AlbumGallery";
import { LinkButton } from "@/components/LinkButton";
import { Photo } from "@/components/Photo";
import { ALBUMS, ALBUM_BY_SLUG } from "@/data/albums";
import { SERVICE_BY_SLUG } from "@/data/services";
import { SITE } from "@/data/site";
import { pageMeta } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return ALBUMS.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const album = ALBUM_BY_SLUG[slug];
  if (!album) return {};
  return pageMeta({
    title: `${album.title} – bộ ảnh`,
    description: `${album.description} (${album.photos.length} ảnh)`,
    path: `/albums/${album.slug}`,
  });
}

const delay = (ms: number) => ({ "--d": `${ms}ms`, "--reveal-delay": `${ms}ms` }) as React.CSSProperties;

export default async function AlbumPage({ params }: Props) {
  const { slug } = await params;
  const album = ALBUM_BY_SLUG[slug];
  if (!album) notFound();

  const index = ALBUMS.indexOf(album);
  const prev = ALBUMS[(index - 1 + ALBUMS.length) % ALBUMS.length];
  const next = ALBUMS[(index + 1) % ALBUMS.length];
  const primary = SERVICE_BY_SLUG[album.services[0]];
  const cover = album.photos[0];

  return (
    <>
      {/* ── Đầu trang: chữ bên trái, ảnh bìa lớn bên phải ── */}
      <section className="container-x grid gap-8 py-8 sm:py-10 lg:min-h-[calc(100svh-var(--header-h))] lg:grid-cols-12 lg:items-center lg:gap-10 lg:py-8">
        <div className="lg:col-span-6">
          <Link
            href="/albums"
            className="rise inline-flex min-h-11 items-center text-sm text-muted transition-colors hover:text-ink"
            data-reveal
          >
            ← Tất cả bộ ảnh
          </Link>
          <p className="eyebrow rise mt-3" data-reveal style={delay(40)}>
            {primary.label}
          </p>
          <h1
            className="display title-first rise mt-4 text-[clamp(2.6rem,min(6vw,9svh),4.6rem)]"
            data-reveal
            style={delay(100)}
          >
            {album.title}
          </h1>
          <p className="display rise mt-4 text-[clamp(1.35rem,2.2vw,1.7rem)] italic text-sunset" data-reveal style={delay(170)}>
            {primary.tagline}
          </p>
          <p className="lead rise mt-4 max-w-lg" data-reveal style={delay(230)}>
            {album.description}
          </p>

          <ul className="rise mt-6 flex flex-wrap gap-2 text-sm" data-reveal style={delay(290)}>
            {album.services.map((s) => (
              <li key={s}>
                <Link
                  href={`/dich-vu/${s}`}
                  className="inline-flex min-h-9 items-center rounded-full border hairline px-4 text-ink transition-colors hover:border-ink hover:bg-ink hover:text-cream"
                >
                  {SERVICE_BY_SLUG[s].label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="rise mt-7 flex flex-wrap gap-3" data-reveal style={delay(350)}>
            <LinkButton href={`/lien-he?dv=${primary.slug}#dat-lich`}>Chọn phong cách này</LinkButton>
            <LinkButton href={SITE.zalo} variant="outline" arrow={false} external>
              Hỏi qua Zalo
            </LinkButton>
          </div>
          <p className="rise mt-5 text-sm text-muted" data-reveal style={delay(400)}>
            {album.photos.length} ảnh trong bộ này. Cuộn xuống để xem hết.
          </p>
        </div>

        <div className="lg:col-span-6">
          {/* Chiều cao khớp màn hình ở máy tính; chiều rộng suy ra từ tỉ lệ 4:5 */}
          <div className="drift relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden bg-sand-200 lg:ml-auto lg:mr-0 lg:h-[min(42rem,calc(100svh-var(--header-h)-4rem))] lg:w-auto lg:max-w-none">
            <Photo
              photo={cover}
              fill
              preload
              quality={85}
              sizes="(min-width: 1024px) 560px, (min-width: 448px) 448px, 100vw"
              position="50% 22%"
            />
          </div>
        </div>
      </section>

      {/* ── Các ảnh còn lại, xếp so le ── */}
      <section
        className="container-x mt-16 md:mt-28 lg:mt-36"
        aria-label={`Ảnh trong bộ ${album.title}`}
      >
        <AlbumGallery photos={album.photos} from={1} />
      </section>

      {/* ── Kêu gọi đặt lịch ── */}
      <section className="container-x py-24 text-center md:py-36" aria-labelledby="album-cta">
        <div data-reveal>
          <h2 id="album-cta" className="display mx-auto max-w-2xl text-[clamp(2rem,4.4vw,3.2rem)]">
            Thích phong cách này? <em>Mình hẹn lịch nhé.</em>
          </h2>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <LinkButton href={`/lien-he?dv=${primary.slug}#dat-lich`}>Đặt lịch chụp</LinkButton>
            <LinkButton href="/albums" variant="outline" arrow={false}>
              Xem bộ ảnh khác
            </LinkButton>
          </div>
        </div>
      </section>

      {/* ── Bộ trước / bộ sau ── */}
      <section className="bg-sand-100 pb-24 pt-16 md:pb-32 md:pt-24" aria-labelledby="album-explore">
        <div className="container-x">
          <p id="album-explore" className="eyebrow text-center" data-reveal>
            Khám phá
          </p>
          <div className="mx-auto mt-8 grid max-w-3xl grid-cols-2 gap-3 sm:gap-5">
            {[
              { album: prev, label: "Bộ trước" },
              { album: next, label: "Bộ tiếp theo" },
            ].map(({ album: a, label }, i) => (
              <Link
                key={a.slug}
                href={`/albums/${a.slug}`}
                className="group on-dark relative block aspect-[3/4] overflow-hidden bg-ink"
                data-reveal
                style={{ "--reveal-delay": `${i * 100}ms` } as React.CSSProperties}
              >
                <Photo
                  photo={a.photos[0]}
                  fill
                  quality={60}
                  alt=""
                  sizes="(min-width: 768px) 380px, 46vw"
                  className="transition-transform duration-[1400ms] ease-[var(--ease-soft)] group-hover:scale-[1.05]"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-linear-to-t from-ink/85 from-10% via-ink/30 via-45% to-transparent"
                />
                <div className="absolute inset-x-0 bottom-0 p-4 text-cream sm:p-6">
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-sunset-light">{label}</p>
                  <p className="display mt-1.5 text-[1.3rem] leading-tight sm:text-[1.6rem]">{a.title}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
