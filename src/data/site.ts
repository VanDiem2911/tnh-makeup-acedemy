export const SITE = {
  name: "Triệu Ngọc Hạnh Makeup Academy",
  short: "Triệu Ngọc Hạnh",
  sub: "Makeup Academy",
  owner: "Triệu Ngọc Hạnh",
  tagline: "Ảnh cưới & du lịch Phú Quốc — makeup, trang phục, phóng sự trọn gói",
  description:
    "Triệu Ngọc Hạnh Makeup Academy: chụp ảnh cưới, pre-wedding, cặp đôi, gia đình và chân dung tại Phú Quốc theo phong cách phóng sự tự nhiên, cùng dịch vụ makeup và trang phục trọn gói.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  phoneDisplay: "097 1020 742",
  phoneTel: "+84971020742",
  zalo: "https://zalo.me/0971020742",
  facebook: "https://www.facebook.com/hanhtrieu16.08",
  maps: "https://maps.app.goo.gl/HckPNkcye1YjM1cw7",
  address: {
    street: "1/1 Đường Nguyễn Thái Bình",
    locality: "Phú Quốc",
    region: "An Giang",
    postal: "92500",
    country: "VN",
    full: "1/1 Đường Nguyễn Thái Bình, Phú Quốc, An Giang 92500, Việt Nam",
  },
} as const;

export const NAV = [
  { href: "/#dich-vu", label: "Dịch vụ" },
  { href: "/albums", label: "Bộ ảnh" },
  { href: "/#ve-chung-toi", label: "Về chúng tôi" },
  { href: "/lien-he", label: "Liên hệ" },
] as const;
