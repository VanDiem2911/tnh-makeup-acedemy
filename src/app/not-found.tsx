import type { Metadata } from "next";
import { LinkButton } from "@/components/LinkButton";

export const metadata: Metadata = { title: "Không tìm thấy trang", robots: { index: false } };

export default function NotFound() {
  return (
    <section className="container-x grid min-h-[60svh] place-items-center py-24 text-center">
      <div>
        <p className="eyebrow">Lỗi 404</p>
        <h1 className="display mt-5 text-[clamp(2.6rem,6vw,4.5rem)]">
          Trang bạn tìm <em>không còn ở đây</em>.
        </h1>
        <p className="lead mx-auto mt-5 max-w-md">Có thể đường dẫn đã thay đổi. Mời bạn quay lại trang chủ hoặc xem các bộ ảnh.</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <LinkButton href="/">Về trang chủ</LinkButton>
          <LinkButton href="/albums" variant="outline" arrow={false}>
            Xem bộ ảnh
          </LinkButton>
        </div>
      </div>
    </section>
  );
}
