import manifest from "./photos.generated.json";
import { SERVICES, type ServiceSlug } from "./services";

export type Photo = {
  src: string;
  width: number;
  height: number;
  blur: string;
  alt: string;
};

export type Album = {
  slug: string;
  title: string;
  description: string;
  /** Dịch vụ chính đứng đầu; các dịch vụ sau là mục liên quan */
  services: ServiceSlug[];
  /** Mô tả nội dung ảnh, dùng làm alt (kèm số thứ tự) */
  alt: string;
  photos: Photo[];
};

type Raw = Omit<Album, "photos">;
const files = manifest as Record<string, { src: string; width: number; height: number; blur: string }[]>;

// Thứ tự trong mảng = thứ tự hiển thị trong trang "Bộ ảnh"
const RAW: Raw[] = [
  // ───────── 01 · Cưới & Pre-wedding ngoại cảnh biển ─────────
  {
    slug: "ngay-cuoi-ben-bien",
    title: "Ngày cưới bên biển",
    description: "Lễ cưới ngoài trời với hoa xanh, nắng gió và những nụ cười thật của hai bên gia đình.",
    services: ["cuoi-pre-wedding", "couple-hoang-hon", "gia-dinh-nghi-duong"],
    alt: "Cô dâu chú rể và phù dâu trong lễ cưới ngoài trời bên biển",
  },
  {
    slug: "co-dau-va-bien",
    title: "Cô dâu & biển",
    description: "Từ lúc trang điểm trong phòng đến khi bước ra bờ biển, veil bay trong gió chiều.",
    services: ["cuoi-pre-wedding", "tron-goi"],
    alt: "Cô dâu váy trắng đội veil trên bãi biển",
  },
  {
    slug: "pre-wedding-dong-co",
    title: "Pre-wedding đồng cỏ",
    description: "Váy trắng, boots và giỏ hoa cam giữa thảm cỏ xanh: một concept pre-wedding nhẹ nhàng, vui tươi.",
    services: ["cuoi-pre-wedding"],
    alt: "Cô dâu váy trắng và boots cầm giỏ hoa trên đồng cỏ xanh",
  },
  {
    slug: "ao-dai-ren-ngay-cuoi",
    title: "Áo dài ren ngày cưới",
    description: "Áo dài ren trắng thanh lịch, bó hoa pastel và những khoảnh khắc bên người thân.",
    services: ["cuoi-pre-wedding", "tron-goi"],
    alt: "Cô dâu mặc áo dài ren trắng cầm bó hoa",
  },

  // ───────── 02 · Couple, cầu hôn & săn hoàng hôn ─────────
  {
    slug: "san-hoang-hon",
    title: "Săn hoàng hôn",
    description: "Mặt biển đổi màu, ánh vàng cam cuối ngày và chiếc váy đen bay trong gió.",
    services: ["couple-hoang-hon", "chan-dung-su-kien"],
    alt: "Cô gái đứng trên bãi biển lúc hoàng hôn",
  },
  {
    slug: "den-va-bac-ben-song",
    title: "Đen & bạc bên sóng",
    description: "Sắc biển trầm, váy đen và bó hoa bạc: một bộ ảnh nghệ thuật dưới bầu trời nhiều mây.",
    services: ["couple-hoang-hon", "chan-dung-su-kien"],
    alt: "Cô gái váy đen cầm bó hoa bạc bên sóng biển",
  },
  {
    slug: "ao-dai-xanh-reu-ben-song",
    title: "Áo dài xanh rêu bên sóng",
    description: "Tà áo dài nhung xanh rêu, lồng chim cùng hoa trắng trên ghềnh đá ven biển.",
    services: ["couple-hoang-hon", "chan-dung-su-kien"],
    alt: "Cô gái mặc áo dài nhung xanh rêu ngồi trên ghềnh đá ven biển",
  },
  {
    slug: "hoang-hon-quang-truong",
    title: "Hoàng hôn quảng trường",
    description: "Áo dài trắng, nón lá và ánh chiều tà trên quảng trường rộng: hai người bạn, một buổi chiều.",
    services: ["couple-hoang-hon", "gia-dinh-nghi-duong"],
    alt: "Hai cô gái mặc áo dài trắng cầm nón lá trên quảng trường lúc hoàng hôn",
  },

  // ───────── 03 · Gia đình, du lịch nghỉ dưỡng Resort/Villa ─────────
  {
    slug: "pho-bien-cung-ban-than",
    title: "Phố biển cùng bạn thân",
    description: "Ba tà áo dài, ba chiếc khăn quàng đầu: dạo phố, ghé quán nướng ven biển và cười thật nhiều.",
    services: ["gia-dinh-nghi-duong", "chan-dung-su-kien"],
    alt: "Ba cô gái mặc áo dài đội khăn quàng đầu dạo phố ven biển",
  },
  {
    slug: "satin-trang-ben-villa",
    title: "Satin trắng bên villa",
    description: "Váy satin trắng, tường vôi sáng và những tán cọ: vẻ đẹp tối giản của một buổi sáng nghỉ dưỡng.",
    services: ["gia-dinh-nghi-duong", "cuoi-pre-wedding"],
    alt: "Cô dâu váy satin trắng bên villa có hàng cọ",
  },
  {
    slug: "co-dau-va-cac-be",
    title: "Cô dâu & các bé phù dâu",
    description: "Khoảnh khắc đáng yêu bên hồ bơi resort: cô dâu cùng các bé với vòng hoa trên tóc.",
    services: ["gia-dinh-nghi-duong", "tron-goi"],
    alt: "Cô dâu cùng các bé phù dâu đội vòng hoa bên hồ bơi resort",
  },
  {
    slug: "hoa-giay-vay-trang",
    title: "Hoa giấy & váy trắng",
    description: "Váy trắng tinh khôi giữa giàn hoa giấy và bức tường màu đất nung.",
    services: ["gia-dinh-nghi-duong", "cuoi-pre-wedding"],
    alt: "Cô gái váy trắng đứng dưới giàn hoa giấy",
  },

  // ───────── 04 · Chân dung nghệ thuật (Portrait/Lookbook) & Sự kiện ─────────
  {
    slug: "dark-mood",
    title: "Dark Mood",
    description: "Ánh sáng trầm, làn da thật và mái tóc xoăn nâu đỏ: chân dung nghệ thuật tối giản.",
    services: ["chan-dung-su-kien"],
    alt: "Chân dung cô gái tóc xoăn nâu đỏ trên nền tối",
  },
  {
    slug: "sac-cat",
    title: "Sắc cát",
    description: "Tông be cát, đầm voan nâu và nắng dịu: lookbook ấm áp, gần với màu của biển cuối ngày.",
    services: ["chan-dung-su-kien"],
    alt: "Cô gái mặc đầm voan nâu trước bức tường màu be cát",
  },
  {
    slug: "trung-thu-do",
    title: "Trung Thu đỏ",
    description: "Concept Trung Thu: nền đỏ rực, đèn lồng, mặt nạ và váy hoạ tiết nhiều màu sắc.",
    services: ["chan-dung-su-kien"],
    alt: "Cô gái mặc váy hoạ tiết giữa nền đỏ và đèn lồng Trung Thu",
  },
  {
    slug: "ao-dai-do",
    title: "Áo dài đỏ",
    description: "Áo dài đỏ thêu, quạt và tua rua: makeup và tóc theo phong cách truyền thống.",
    services: ["chan-dung-su-kien", "tron-goi"],
    alt: "Cô gái mặc áo dài đỏ thêu cầm quạt",
  },
  {
    slug: "non-la-ao-dai-hong",
    title: "Nón lá & áo dài hồng",
    description: "Áo dài hồng phấn, nón lá và nắng chiều: nét dịu dàng rất Việt.",
    services: ["chan-dung-su-kien"],
    alt: "Cô gái mặc áo dài hồng phấn đội nón lá dưới nắng chiều",
  },
  {
    slug: "nu-tinh-toi-gian",
    title: "Nữ tính tối giản",
    description: "Nền trắng, áo ren bèo và mái tóc dài thẳng: chân dung studio nhẹ nhàng.",
    services: ["chan-dung-su-kien"],
    alt: "Cô gái tóc đen dài mặc áo ren bèo trước nền trắng",
  },
  {
    slug: "black-elegance",
    title: "Black Elegance",
    description: "Đầm đen cổ cao, trang sức vàng và ly champagne: chân dung sang trọng trên nền xám.",
    services: ["chan-dung-su-kien"],
    alt: "Cô gái mặc đầm đen cổ cao, trang sức vàng, cầm ly champagne",
  },
  {
    slug: "studio-xanh",
    title: "Studio xanh",
    description: "Lookbook studio nền xanh bầu trời, ghế đen cách điệu và kính tối màu.",
    services: ["chan-dung-su-kien"],
    alt: "Người mẫu đeo kính tối màu trên chiếc ghế đen, nền xanh nhạt",
  },
  {
    slug: "ruy-bang",
    title: "Ruy băng",
    description: "Lookbook nữ tính với ruy băng lụa và tông xám xanh dịu.",
    services: ["chan-dung-su-kien"],
    alt: "Người mẫu với ruy băng lụa trên chiếc ghế đen, nền xám xanh",
  },

  // ───────── 05 · Trọn gói: Makeup, trang phục cưới, quay phóng sự ─────────
  {
    slug: "co-dau-veil-hoa-hong",
    title: "Cô dâu veil & hoa hồng",
    description: "Makeup cô dâu nhẹ nhàng, veil voan và bó hoa hồng trắng, hồng phấn.",
    services: ["tron-goi", "cuoi-pre-wedding"],
    alt: "Cô dâu đội veil, ôm bó hoa hồng trắng và hồng phấn",
  },
  {
    slug: "co-dau-ren",
    title: "Cô dâu ren",
    description: "Veil ren, môi đỏ và váy cổ cao: makeup cô dâu cổ điển.",
    services: ["tron-goi", "cuoi-pre-wedding"],
    alt: "Cô dâu đội veil ren, son đỏ, mặc váy ren cổ cao",
  },
  {
    slug: "getting-ready",
    title: "Getting ready",
    description: "Từ phòng thay đồ đến chiếc gương: những phút chuẩn bị trước lễ cưới tại resort.",
    services: ["tron-goi"],
    alt: "Cô dâu chuẩn bị makeup và thay váy cưới trong phòng resort",
  },
  {
    slug: "hau-truong-co-dau",
    title: "Hậu trường cô dâu",
    description: "Đội ngũ makeup hoàn thiện từng chi tiết, từ veil đến đôi giày cưới.",
    services: ["tron-goi"],
    alt: "Thợ makeup chỉnh veil và giày cho cô dâu trong phòng khách sạn",
  },
  {
    slug: "phong-su-nguoi-than",
    title: "Phóng sự: buổi sáng ngày cưới",
    description: "Đen trắng, tự nhiên, không dàn dựng: máy ảnh bám theo đội ngũ makeup trong buổi sáng ngày cưới.",
    services: ["tron-goi"],
    alt: "Ảnh đen trắng thợ makeup trang điểm cho khách trong buổi sáng ngày cưới",
  },
  {
    slug: "phong-su-doi-ngu",
    title: "Phóng sự: đội ngũ makeup",
    description: "Cả ê-kíp làm việc trong khách sạn, để cô dâu và người thân đều rạng rỡ.",
    services: ["tron-goi"],
    alt: "Ảnh đen trắng đội ngũ makeup làm việc trong phòng khách sạn",
  },
  {
    slug: "makeup-orchid",
    title: "Makeup hoa lan",
    description: "Lớp nền mỏng, má hồng đào và hoa lan trắng: makeup tự nhiên, trong trẻo.",
    services: ["tron-goi", "chan-dung-su-kien"],
    alt: "Cô gái makeup tự nhiên với hoa lan trắng",
  },
  {
    slug: "makeup-nuoc",
    title: "Makeup ánh nước",
    description: "Tóc xoăn bồng, váy sequin và hiệu ứng nước: makeup nghệ thuật cho concept beauty.",
    services: ["tron-goi", "chan-dung-su-kien"],
    alt: "Cô gái tóc xoăn bồng mặc váy sequin trên nền xanh có hiệu ứng nước",
  },
  {
    slug: "makeup-do-cam",
    title: "Makeup đỏ cam",
    description: "Son đỏ, mi dài và tông cam đào rực rỡ.",
    services: ["tron-goi", "chan-dung-su-kien"],
    alt: "Cô gái tóc mái makeup son đỏ trên nền cam đào",
  },
  {
    slug: "makeup-leopard",
    title: "Makeup leopard",
    description: "Khăn hoạ tiết da báo, làn da căng bóng và tông nâu ấm.",
    services: ["tron-goi", "chan-dung-su-kien"],
    alt: "Cô gái đội khăn hoạ tiết da báo, makeup tông nâu ấm",
  },
  {
    slug: "makeup-gold",
    title: "Makeup & trang sức vàng",
    description: "Mắt mèo, tóc mái và lớp trang sức vàng nổi bật trên nền tối.",
    services: ["tron-goi", "chan-dung-su-kien"],
    alt: "Cô gái tóc mái đeo trang sức vàng, makeup mắt mèo",
  },
];

export const ALBUMS: Album[] = RAW.map((a) => {
  const list = files[a.slug];
  if (!list?.length) throw new Error(`Thiếu ảnh cho bộ "${a.slug}" — hãy chạy: npm run images`);
  return {
    ...a,
    photos: list.map((p, i) => ({ ...p, alt: `${a.alt} (${i + 1}/${list.length})` })),
  };
});

export const ALBUM_BY_SLUG: Record<string, Album> = Object.fromEntries(ALBUMS.map((a) => [a.slug, a]));

/** Albums thuộc một dịch vụ: bộ có dịch vụ đó là chính đứng trước */
export function albumsForService(slug: ServiceSlug): Album[] {
  const inService = ALBUMS.filter((a) => a.services.includes(slug));
  return [...inService.filter((a) => a.services[0] === slug), ...inService.filter((a) => a.services[0] !== slug)];
}

/** Lấy ảnh thứ n (bắt đầu từ 1) của một bộ */
export function photoOf(albumSlug: string, n = 1): Photo {
  const album = ALBUM_BY_SLUG[albumSlug];
  const p = album?.photos[n - 1];
  if (!p) throw new Error(`Không có ảnh ${n} trong bộ "${albumSlug}"`);
  return p;
}

export function primaryService(album: Album) {
  return SERVICES.find((s) => s.slug === album.services[0])!;
}
