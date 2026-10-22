import { ALBUMS } from "./albums";
import type { ServiceSlug } from "./services";

export type WallTile = {
  key: string;
  src: string;
  width: number;
  height: number;
  alt: string;
  albumSlug: string;
  albumTitle: string;
  /** Dịch vụ chính của bộ ảnh (dùng cho bộ lọc) */
  service: ServiceSlug;
  /** Góc nghiêng nhẹ (độ) để tường ảnh có cảm giác ảnh in rải trên bàn */
  tilt: number;
};

// Bộ sinh số ngẫu nhiên có hạt giống: server và client cho cùng thứ tự, không lệch khi hydrate
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Toàn bộ ảnh của mọi bộ, trộn xen kẽ; mỗi ảnh nhớ nó thuộc bộ nào */
export function buildWall(): WallTile[] {
  const rand = mulberry32(20261022);
  const tiles: WallTile[] = ALBUMS.flatMap((album) =>
    album.photos.map((p, i) => ({
      key: `${album.slug}-${i}`,
      src: p.src,
      width: p.width,
      height: p.height,
      alt: p.alt,
      albumSlug: album.slug,
      albumTitle: album.title,
      service: album.services[0],
      tilt: 0,
    })),
  );

  // Fisher–Yates
  for (let i = tiles.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
  }
  // Góc nghiêng -2.4° … +2.4°, tránh các ảnh gần như thẳng để tường có nhịp
  return tiles.map((t) => {
    const mag = 0.7 + rand() * 1.7;
    return { ...t, tilt: Math.round((rand() < 0.5 ? -mag : mag) * 10) / 10 };
  });
}
