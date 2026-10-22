import type { Metadata } from "next";
import { SITE } from "@/data/site";

/** Metadata theo trang: giữ ảnh chia sẻ và locale của site (Next thay thế nguyên khối openGraph nếu trang tự khai báo) */
export function pageMeta({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "vi_VN",
      siteName: SITE.name,
      title: `${title} | ${SITE.name}`,
      description,
      url: path,
      images: [{ url: "/og.jpg", width: 1200, height: 630, alt: SITE.name }],
    },
    twitter: { card: "summary_large_image", images: ["/og.jpg"] },
  };
}
