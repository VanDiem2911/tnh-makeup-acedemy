import { ContactSection } from "@/components/ContactSection";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Liên hệ & đặt lịch tư vấn",
  description:
    "Để lại thông tin hoặc gọi/nhắn Zalo 097 1020 742 để được tư vấn chụp ảnh cưới, couple, gia đình, chân dung và makeup trọn gói tại Phú Quốc.",
  path: "/lien-he",
});

export default function ContactPage() {
  return (
    <div className="pt-4 md:pt-10">
      <ContactSection as="h1" />
    </div>
  );
}
