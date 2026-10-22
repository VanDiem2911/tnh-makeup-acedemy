import type { MetadataRoute } from "next";
import { ALBUMS } from "@/data/albums";
import { SERVICES } from "@/data/services";
import { SITE } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const url = (path: string) => `${SITE.url}${path}`;
  return [
    { url: url("/"), lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: url("/albums"), lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    ...SERVICES.map((s) => ({
      url: url(`/dich-vu/${s.slug}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...ALBUMS.map((a) => ({
      url: url(`/albums/${a.slug}`),
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
    { url: url("/lien-he"), lastModified: now, changeFrequency: "yearly", priority: 0.7 },
  ];
}
