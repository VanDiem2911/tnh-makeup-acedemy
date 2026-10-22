import { PhotoWall } from "@/components/PhotoWall";
import { buildWall } from "@/data/wall";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Bộ ảnh",
  description:
    "Tường ảnh cưới, pre-wedding, hoàng hôn, gia đình, chân dung và hậu trường makeup do Triệu Ngọc Hạnh Makeup Academy thực hiện tại Phú Quốc. Kéo hoặc cuộn để xem, bấm vào một ảnh để mở cả bộ.",
  path: "/albums",
});

export default function AlbumsPage() {
  return (
    // Vừa khít một màn hình (trừ header): bản thân tường ảnh cuộn vô hạn nên không cần cuộn trang
    <section
      className="relative h-[calc(100svh-var(--header-h))] min-h-[28rem] overflow-hidden"
      style={{ overflow: "clip" }}
    >
      <h1 className="sr-only">Bộ ảnh của Triệu Ngọc Hạnh Makeup Academy</h1>
      <PhotoWall tiles={buildWall()} />
    </section>
  );
}
