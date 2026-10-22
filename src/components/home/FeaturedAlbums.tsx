import Link from "next/link";
import { ALBUM_BY_SLUG } from "@/data/albums";
import { AlbumCard } from "../AlbumCard";
import { ArrowRight } from "../icons";

// [slug bộ ảnh, ảnh bìa dùng riêng cho trang chủ]
const FEATURED: [string, number][] = [
  ["ngay-cuoi-ben-bien", 3],
  ["pre-wedding-dong-co", 1],
  ["ao-dai-xanh-reu-ben-song", 1],
  ["co-dau-va-bien", 2],
  ["sac-cat", 1],
  ["hoang-hon-quang-truong", 1],
];

export function FeaturedAlbums() {
  return (
    <section id="bo-anh" className="section" aria-labelledby="albums-title">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end" data-reveal>
          <div>
            <p className="eyebrow">Bộ ảnh</p>
            <h2 id="albums-title" className="display mt-5 text-[clamp(2.4rem,5vw,4rem)]">
              Chiều sâu của <em>từng bộ ảnh</em>.
            </h2>
          </div>
          <Link href="/albums" className="link-line text-ink">
            Xem tất cả bộ ảnh <ArrowRight size={18} />
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-x-5 gap-y-12 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-16">
          {FEATURED.map(([slug, cover], i) => (
            <AlbumCard
              key={slug}
              album={ALBUM_BY_SLUG[slug]}
              coverIndex={cover}
              delay={(i % 3) * 90}
              className={i % 3 === 1 ? "lg:mt-14" : ""}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
