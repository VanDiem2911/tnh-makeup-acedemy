import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AlbumCard } from "@/components/AlbumCard";
import { Gallery } from "@/components/Gallery";
import { ArrowRight } from "@/components/icons";
import { LinkButton } from "@/components/LinkButton";
import { PageHero } from "@/components/PageHero";
import { ALBUMS, ALBUM_BY_SLUG } from "@/data/albums";
import { SERVICE_BY_SLUG } from "@/data/services";
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

export default async function AlbumPage({ params }: Props) {
  const { slug } = await params;
  const album = ALBUM_BY_SLUG[slug];
  if (!album) notFound();

  const index = ALBUMS.indexOf(album);
  const next = ALBUMS[(index + 1) % ALBUMS.length];
  const prev = ALBUMS[(index - 1 + ALBUMS.length) % ALBUMS.length];
  const primary = SERVICE_BY_SLUG[album.services[0]];
  const related = ALBUMS.filter((a) => a.slug !== album.slug && a.services[0] === album.services[0]).slice(0, 3);

  return (
    <>
      <PageHero
        crumbs={[{ href: "/albums", label: "Bộ ảnh" }, { label: album.title }]}
        eyebrow={`${primary.no} · ${primary.label}`}
        title={album.title}
      >
        <p className="lead">{album.description}</p>
        <ul className="mt-6 flex flex-wrap gap-2 text-sm">
          <li className="rounded-full bg-sand-100 px-4 py-1.5 text-muted">{album.photos.length} ảnh</li>
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
      </PageHero>

      <section className="container-x mt-12 md:mt-16" aria-label={`Ảnh trong bộ ${album.title}`}>
        <Gallery photos={album.photos} />
      </section>

      <section className="container-x mt-20 md:mt-28" aria-label="Điều hướng giữa các bộ ảnh">
        <div className="grid gap-px overflow-hidden border hairline bg-ink/10 sm:grid-cols-2">
          <Link
            href={`/albums/${prev.slug}`}
            className="group block bg-cream p-6 transition-colors hover:bg-sand-100 sm:p-8"
          >
            <span className="text-sm text-muted">← Bộ trước</span>
            <span className="display mt-2 block text-[1.8rem] transition-colors group-hover:text-sunset">{prev.title}</span>
          </Link>
          <Link
            href={`/albums/${next.slug}`}
            className="group block bg-cream p-6 text-left transition-colors hover:bg-sand-100 sm:p-8 sm:text-right"
          >
            <span className="text-sm text-muted">Bộ tiếp theo →</span>
            <span className="display mt-2 block text-[1.8rem] transition-colors group-hover:text-sunset">{next.title}</span>
          </Link>
        </div>
      </section>

      <section className="section mt-20 bg-sand-100 md:mt-28" aria-labelledby="album-cta">
        <div className="container-x grid gap-8 lg:grid-cols-12 lg:items-center" data-reveal>
          <div className="lg:col-span-7">
            <p className="eyebrow">{primary.label}</p>
            <h2 id="album-cta" className="display mt-4 text-[clamp(2rem,4.2vw,3.2rem)]">
              Thích phong cách này? Hãy cùng chúng tôi tạo <em>bộ ảnh của bạn</em>.
            </h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:col-span-5 lg:justify-end">
            <LinkButton href={`/lien-he?dv=${primary.slug}#dat-lich`}>Đặt lịch tư vấn</LinkButton>
            <LinkButton href={`/dich-vu/${primary.slug}`} variant="outline" arrow={false}>
              Về dịch vụ này
            </LinkButton>
          </div>
        </div>

        {related.length > 0 && (
          <div className="container-x mt-16 md:mt-20">
            <div className="flex items-end justify-between gap-4 border-b hairline pb-4">
              <h2 className="display text-[1.9rem]">Bộ ảnh cùng dịch vụ</h2>
              <Link href={`/dich-vu/${primary.slug}`} className="link-line hidden text-ink sm:inline-flex">
                Xem tất cả <ArrowRight size={18} />
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8">
              {related.map((a, i) => (
                <AlbumCard key={a.slug} album={a} delay={i * 80} />
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  );
}
