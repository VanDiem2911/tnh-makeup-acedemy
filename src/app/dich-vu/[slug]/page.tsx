import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AlbumCard } from "@/components/AlbumCard";
import { Check } from "@/components/icons";
import { LinkButton } from "@/components/LinkButton";
import { PageHero } from "@/components/PageHero";
import { Photo } from "@/components/Photo";
import { albumsForService, photoOf } from "@/data/albums";
import { SERVICE_BY_SLUG, SERVICES, type ServiceSlug } from "@/data/services";
import { pageMeta } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = SERVICE_BY_SLUG[slug as ServiceSlug];
  if (!service) return {};
  return pageMeta({ title: service.title, description: `${service.tagline} ${service.description}`, path: `/dich-vu/${service.slug}` });
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = SERVICE_BY_SLUG[slug as ServiceSlug];
  if (!service) notFound();

  const albums = albumsForService(service.slug);
  const cover = photoOf(service.cover[0], service.cover[1]);
  const others = SERVICES.filter((s) => s.slug !== service.slug);

  return (
    <>
      <PageHero crumbs={[{ href: "/#dich-vu", label: "Dịch vụ" }, { label: service.label }]} eyebrow={`Dịch vụ ${service.no}`} title={service.title} />

      <section className="container-x mt-10 grid gap-12 md:mt-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7" data-reveal>
          <p className="display text-[clamp(1.6rem,3vw,2.2rem)] italic text-sunset">{service.tagline}</p>
          <p className="lead mt-6">{service.description}</p>

          <ul className="mt-9 space-y-4 border-t hairline pt-8">
            {service.points.map((p) => (
              <li key={p} className="flex gap-4">
                <span className="mt-1 grid size-6 shrink-0 place-items-center rounded-full bg-sunset text-white">
                  <Check size={14} strokeWidth={2.4} />
                </span>
                <span>{p}</span>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <LinkButton href={`/lien-he?dv=${service.slug}#dat-lich`}>Đặt lịch tư vấn</LinkButton>
            <LinkButton href="/albums" variant="outline" arrow={false}>
              Tất cả bộ ảnh
            </LinkButton>
          </div>
        </div>

        <div className="lg:col-span-5" data-reveal style={{ "--reveal-delay": "100ms" } as React.CSSProperties}>
          <div className="relative mx-auto aspect-[4/5] max-w-md overflow-hidden bg-sand-200 lg:max-w-none">
            <Photo photo={cover} fill preload sizes="(min-width: 1024px) 40vw, 90vw" />
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="svc-albums">
        <div className="container-x">
          <div className="flex items-end justify-between gap-4 border-b hairline pb-5" data-reveal>
            <h2 id="svc-albums" className="display text-[clamp(1.9rem,3.6vw,2.8rem)]">
              Bộ ảnh thuộc dịch vụ này
            </h2>
            <p className="text-sm text-muted">{albums.length} bộ</p>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-14">
            {albums.map((a, i) => (
              <AlbumCard key={a.slug} album={a} delay={(i % 3) * 80} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-sand-100 py-14 md:py-20" aria-labelledby="svc-others">
        <div className="container-x">
          <h2 id="svc-others" className="display text-[1.9rem]">
            Dịch vụ khác
          </h2>
          <ul className="mt-6 grid gap-px overflow-hidden border hairline bg-ink/10 sm:grid-cols-2 lg:grid-cols-4">
            {others.map((s) => (
              <li key={s.slug} className="bg-cream">
                <Link href={`/dich-vu/${s.slug}`} className="group block h-full p-6 transition-colors hover:bg-ivory">
                  <span className="text-sm font-medium tracking-[0.2em] text-sunset">{s.no}</span>
                  <span className="display mt-2 block text-[1.45rem] leading-tight transition-colors group-hover:text-sunset">
                    {s.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
