import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro, Cormorant_Garamond } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { HideOnPaths } from "@/components/HideOnPaths";
import { FloatingContact } from "@/components/FloatingContact";
import { RevealObserver } from "@/components/RevealObserver";
import { SITE } from "@/data/site";
import "./globals.css";

// Font biến thiên (1 file cho mọi độ đậm) + subset tiếng Việt để dấu không bị rơi về font hệ thống
const display = Cormorant_Garamond({
  subsets: ["latin", "vietnamese"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});
const sans = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500"],
  variable: "--font-be-vietnam",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} | Ảnh cưới & du lịch Phú Quốc`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [
    "chụp ảnh cưới Phú Quốc",
    "pre-wedding biển Phú Quốc",
    "chụp ảnh couple Phú Quốc",
    "săn hoàng hôn Phú Quốc",
    "chụp ảnh gia đình resort Phú Quốc",
    "makeup cô dâu Phú Quốc",
    "Triệu Ngọc Hạnh Makeup Academy",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: SITE.name,
    title: `${SITE.name} | Ảnh cưới & du lịch Phú Quốc`,
    description: SITE.description,
    url: "/",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Ảnh cưới biển Phú Quốc – Triệu Ngọc Hạnh Makeup Academy" }],
  },
  twitter: { card: "summary_large_image", images: ["/og.jpg"] },
};

export const viewport: Viewport = {
  themeColor: "#faf6ef",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "Photographer"],
  name: SITE.name,
  image: `${SITE.url}/og.jpg`,
  logo: `${SITE.url}/brand/logo.png`,
  url: SITE.url,
  telephone: SITE.phoneTel,
  description: SITE.description,
  address: {
    "@type": "PostalAddress",
    streetAddress: SITE.address.street,
    addressLocality: SITE.address.locality,
    addressRegion: SITE.address.region,
    postalCode: SITE.address.postal,
    addressCountry: SITE.address.country,
  },
  hasMap: SITE.maps,
  sameAs: [SITE.facebook],
  areaServed: "Phú Quốc, An Giang",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${display.variable} ${sans.variable}`}>
      <body>
        <a href="#main" className="skip-link">
          Bỏ qua đến nội dung chính
        </a>
        <Header />
        <main id="main">{children}</main>
        {/* Trang Bộ ảnh là tường ảnh toàn màn hình nên không có footer */}
        <HideOnPaths paths={["/albums"]}>
          <Footer />
        </HideOnPaths>
        <FloatingContact />
        <RevealObserver />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
      </body>
    </html>
  );
}
