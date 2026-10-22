import { SITE } from "@/data/site";
import { InquiryForm } from "./InquiryForm";
import { ArrowUpRight, Chat, Facebook, MapPin, Phone } from "./icons";

const row = "group flex items-start gap-4 py-4 transition-colors";
const iconWrap = "grid size-11 shrink-0 place-items-center rounded-full border hairline text-sunset transition-colors group-hover:bg-sunset group-hover:text-white";

export function ContactSection({ id = "lien-he", as: Tag = "h2" }: { id?: string; as?: "h1" | "h2" }) {
  return (
    <section id={id} className="section bg-cream" aria-labelledby={`${id}-title`}>
      <div className="container-x grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5" data-reveal>
          <p className="eyebrow">Liên hệ</p>
          <Tag id={`${id}-title`} className="display mt-5 text-[clamp(2.4rem,5vw,3.8rem)]">
            Kể cho chúng tôi nghe <em>câu chuyện</em> của bạn.
          </Tag>
          <p className="lead mt-6 max-w-md">
            Để lại thông tin hoặc nhắn trực tiếp, chúng tôi sẽ tư vấn concept, địa điểm và giờ chụp phù hợp với bạn.
          </p>

          <ul className="mt-9 divide-y divide-ink/15 border-y hairline">
            <li>
              <a href={`tel:${SITE.phoneTel}`} className={row}>
                <span className={iconWrap}>
                  <Phone size={20} />
                </span>
                <span>
                  <span className="block text-sm text-muted">Điện thoại</span>
                  <span className="text-lg font-medium">{SITE.phoneDisplay}</span>
                </span>
              </a>
            </li>
            <li>
              <a href={SITE.zalo} target="_blank" rel="noopener noreferrer" className={row}>
                <span className={iconWrap}>
                  <Chat size={20} />
                </span>
                <span>
                  <span className="block text-sm text-muted">Zalo</span>
                  <span className="text-lg font-medium">{SITE.phoneDisplay}</span>
                </span>
              </a>
            </li>
            <li>
              <a href={SITE.facebook} target="_blank" rel="noopener noreferrer" className={row}>
                <span className={iconWrap}>
                  <Facebook size={20} />
                </span>
                <span>
                  <span className="block text-sm text-muted">Facebook</span>
                  <span className="text-lg font-medium">hanhtrieu16.08</span>
                </span>
              </a>
            </li>
            <li>
              <a href={SITE.maps} target="_blank" rel="noopener noreferrer" className={row}>
                <span className={iconWrap}>
                  <MapPin size={20} />
                </span>
                <span className="flex-1">
                  <span className="block text-sm text-muted">Địa chỉ</span>
                  <span className="block font-medium leading-snug">{SITE.address.full}</span>
                  <span className="mt-1.5 inline-flex items-center gap-1 text-sm text-sunset">
                    Mở Google Maps <ArrowUpRight size={15} />
                  </span>
                </span>
              </a>
            </li>
          </ul>
        </div>

        <div id="dat-lich" className="scroll-mt-28 lg:col-span-7" data-reveal style={{ "--reveal-delay": "120ms" } as React.CSSProperties}>
          <div className="relative rounded-xl bg-sand-100 p-2 sm:p-3">
            <InquiryForm />
          </div>
        </div>
      </div>
    </section>
  );
}
