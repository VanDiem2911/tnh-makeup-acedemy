import Link from "next/link";
import { primaryService, type Album } from "@/data/albums";
import { Photo } from "./Photo";

type Props = {
  album: Album;
  /** Dùng ảnh thứ n (bắt đầu từ 1) làm bìa thay vì ảnh đầu tiên */
  coverIndex?: number;
  sizes?: string;
  className?: string;
  delay?: number;
};

export function AlbumCard({
  album,
  coverIndex = 1,
  sizes = "(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw",
  className = "",
  delay = 0,
}: Props) {
  const cover = album.photos[coverIndex - 1] ?? album.photos[0];
  const service = primaryService(album);

  return (
    <article className={`group ${className}`} data-reveal style={{ "--reveal-delay": `${delay}ms` } as React.CSSProperties}>
      <Link href={`/albums/${album.slug}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-sand-200">
          <Photo
            photo={cover}
            alt={`Bộ ảnh ${album.title}: ${album.alt}`}
            fill
            sizes={sizes}
            className="transition-transform duration-[1200ms] ease-[var(--ease-soft)] group-hover:scale-[1.045]"
          />
          <span className="absolute left-3 top-3 rounded-full bg-cream/90 px-3 py-1 text-xs font-medium tracking-wide text-ink backdrop-blur">
            {album.photos.length} ảnh
          </span>
        </div>
        <div className="mt-4 flex items-start justify-between gap-4">
          <div>
            <h3 className="display text-[1.65rem] transition-colors group-hover:text-sunset">{album.title}</h3>
            <p className="mt-1 text-sm text-muted">{service.label}</p>
          </div>
          <span
            aria-hidden="true"
            className="mt-1.5 hidden h-px w-10 shrink-0 bg-ink/30 transition-all duration-500 group-hover:w-16 group-hover:bg-sunset sm:block"
          />
        </div>
      </Link>
    </article>
  );
}
