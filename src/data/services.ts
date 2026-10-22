export type ServiceSlug =
  | "cuoi-pre-wedding"
  | "couple-hoang-hon"
  | "gia-dinh-nghi-duong"
  | "chan-dung-su-kien"
  | "tron-goi";

export type Service = {
  slug: ServiceSlug;
  no: string;
  title: string;
  /** Tên ngắn dùng cho nhãn, bộ lọc */
  label: string;
  tagline: string;
  description: string;
  points: string[];
  /** Ảnh dùng làm bìa thẻ dịch vụ: [slug bộ ảnh, thứ tự ảnh 1..n] */
  cover: [string, number];
};

export const SERVICES: Service[] = [
  {
    slug: "cuoi-pre-wedding",
    no: "01",
    title: "Chụp ảnh cưới & Pre-wedding ngoại cảnh biển Phú Quốc",
    label: "Cưới & Pre-wedding",
    tagline: "Biển, nắng và lời hứa của hai người.",
    description:
      "Từ buổi chụp pre-wedding trên bãi biển đến lễ cưới ngoài trời tại resort, chúng tôi ghi lại hành trình của cặp đôi bằng góc nhìn phóng sự: tự nhiên, ít sắp đặt, đủ cảm xúc để nhìn lại sau nhiều năm vẫn thấy mình trong từng khung hình.",
    points: [
      "Ngoại cảnh biển Phú Quốc, ưu tiên những bãi biển riêng tư, ít người",
      "Chụp phóng sự: giữ trọn ánh mắt, nụ cười, cái ôm thật của ngày cưới",
      "Nhiếp ảnh gia bản địa chọn giờ nắng đẹp và địa điểm phù hợp với concept của bạn",
    ],
    cover: ["ngay-cuoi-ben-bien", 2],
  },
  {
    slug: "couple-hoang-hon",
    no: "02",
    title: "Chụp ảnh cặp đôi (Couple), cầu hôn & săn hoàng hôn",
    label: "Couple & hoàng hôn",
    tagline: "Khoảnh khắc riêng tư khi mặt trời xuống.",
    description:
      "Một buổi chiều chỉ dành cho hai người. Chúng tôi dẫn bạn đến nơi hoàng hôn đẹp nhất, giữ khoảng cách vừa đủ để bạn tự nhiên, và sẵn sàng cho cả những màn cầu hôn bất ngờ.",
    points: [
      "Săn hoàng hôn đúng giờ, đúng góc biển đẹp nhất trong ngày",
      "Hỗ trợ lên ý tưởng và bố trí khoảnh khắc cầu hôn kín đáo",
      "Phong cách tự nhiên: bạn chỉ cần tận hưởng, phần còn lại để chúng tôi lo",
    ],
    cover: ["san-hoang-hon", 1],
  },
  {
    slug: "gia-dinh-nghi-duong",
    no: "03",
    title: "Chụp ảnh gia đình, du lịch nghỉ dưỡng tại Resort/Villa",
    label: "Gia đình & nghỉ dưỡng",
    tagline: "Kỳ nghỉ trọn vẹn, những tấm ảnh không cần diễn.",
    description:
      "Ba thế hệ cùng đi biển, một nhóm bạn thân dạo phố, hay một buổi sáng yên tĩnh bên hồ bơi villa. Chúng tôi theo sát bạn trong kỳ nghỉ để giữ lại những khoảnh khắc đời thường mà đáng nhớ nhất.",
    points: [
      "Chụp ngay tại resort/villa nơi gia đình lưu trú, không phải di chuyển nhiều",
      "Ưu tiên khoảnh khắc thật của trẻ nhỏ và người lớn tuổi",
      "Tư vấn trang phục, giờ chụp phù hợp với lịch trình du lịch",
    ],
    cover: ["pho-bien-cung-ban-than", 1],
  },
  {
    slug: "chan-dung-su-kien",
    no: "04",
    title: "Chụp ảnh chân dung nghệ thuật (Portrait/Lookbook) & Sự kiện",
    label: "Chân dung & sự kiện",
    tagline: "Một chân dung nói được cá tính của bạn.",
    description:
      "Portrait và lookbook với ánh sáng, makeup và phong cách được chuẩn bị riêng cho từng người. Chúng tôi cũng nhận ghi hình sự kiện, từ tiệc nhỏ đến lễ kỷ niệm, theo cách kín đáo và tự nhiên.",
    points: [
      "Studio hoặc ngoại cảnh, tông màu và concept thống nhất từ makeup đến ánh sáng",
      "Lookbook cho thương hiệu thời trang, người mẫu, cá nhân làm nội dung",
      "Ghi hình sự kiện theo phong cách phóng sự, không làm gián đoạn không khí",
    ],
    cover: ["dark-mood", 1],
  },
  {
    slug: "tron-goi",
    no: "05",
    title: "Dịch vụ trọn gói: Makeup, trang phục cưới, quay phóng sự",
    label: "Trọn gói",
    tagline: "Một đội ngũ, từ lớp nền đầu tiên đến khung hình cuối cùng.",
    description:
      "Chính đội ngũ makeup của Triệu Ngọc Hạnh Makeup Academy đồng hành cùng bạn. Đặt trọn gói makeup, trang phục cưới và quay phóng sự để mọi khâu ăn khớp, từ buổi sáng chuẩn bị cho đến khi lễ cưới kết thúc.",
    points: [
      "Makeup cô dâu và người thân, hoàn thiện ngay tại phòng khách sạn/resort",
      "Tư vấn và chuẩn bị trang phục cưới phù hợp với concept",
      "Quay phóng sự xuyên suốt ngày cưới, không dàn dựng",
    ],
    cover: ["co-dau-veil-hoa-hong", 1],
  },
];

export const SERVICE_BY_SLUG = Object.fromEntries(SERVICES.map((s) => [s.slug, s])) as Record<ServiceSlug, Service>;
