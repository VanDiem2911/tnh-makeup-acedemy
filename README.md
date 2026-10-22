# Triệu Ngọc Hạnh Makeup Academy – Website

Website giới thiệu dịch vụ chụp ảnh cưới, couple, gia đình, chân dung và makeup trọn gói tại Phú Quốc.
Next.js 16 (App Router) · React 19 · Tailwind CSS 4 · TypeScript.

## Chạy dự án

```bash
npm install
npm run dev          # http://localhost:3000
npm run build && npm start   # chạy bản production
npm run typecheck && npm run lint
```

Sao chép `.env.example` thành `.env.local` rồi điền giá trị (xem mục *Biến môi trường*).

## Cấu trúc trang

| Đường dẫn | Nội dung |
| --- | --- |
| `/` | Trang chủ: hero, giới thiệu, 5 dịch vụ, bộ ảnh nổi bật, phóng sự, liên hệ |
| `/albums` | **Tường ảnh cuộn vô hạn** (kéo / vuốt / lăn chuột / phím mũi tên). Bấm vào một ảnh để mở bộ ảnh của nó |
| `/albums/[bộ]` | Một bộ ảnh: lưới ảnh + lightbox (phím ← → Esc, vuốt trên điện thoại) |
| `/dich-vu/[dịch vụ]` | 5 trang dịch vụ, mỗi trang liệt kê các bộ ảnh thuộc dịch vụ đó |
| `/lien-he` | Form đặt lịch tư vấn + thông tin liên hệ |
| `/admin` | Quản trị: xem / đánh dấu / xoá yêu cầu của khách (cần `ADMIN_PASSWORD`) |

## Sửa nội dung

| Muốn sửa | File |
| --- | --- |
| Số điện thoại, Zalo, Facebook, địa chỉ, tên | `src/data/site.ts` |
| 5 dịch vụ (tên, mô tả, gạch đầu dòng, ảnh bìa) | `src/data/services.ts` |
| Tiêu đề / mô tả / dịch vụ liên quan của từng bộ ảnh | `src/data/albums.ts` |
| Màu, font, nút, hiệu ứng | `src/app/globals.css` (khối `@theme`) |
| Chữ trên hero, phần giới thiệu | `src/components/home/` |

> Một số câu mô tả dịch vụ (các gạch đầu dòng "Bạn sẽ nhận được…", phần giới thiệu) được viết từ brief. Hãy rà lại
> cho đúng với thực tế dịch vụ trước khi chạy thật.

## Thêm / đổi ảnh

Ảnh gốc nằm ở thư mục `Ảnh FB/` (không đưa lên git). Ảnh dùng trên web đã được tối ưu sang `public/photos/<bộ>/NN.webp`.

1. Bỏ ảnh mới vào `Ảnh FB/`.
2. Mở `scripts/album-sources.json`: mỗi bộ là một danh sách tên file, **ảnh đầu tiên là ảnh bìa**.
   Thêm bộ mới thì thêm một khoá mới, rồi khai báo tiêu đề/mô tả trong `src/data/albums.ts`.
3. Chạy `npm run images` (đổi sang WebP tối đa 1800px, **xoá EXIF/GPS**, tạo ảnh mờ placeholder, ảnh chia sẻ `og.jpg`, icon).
4. `npm run build`.

Logo gốc là `assets/logo.webp` (230×230 px, nền trong suốt). Logo chỉ nên hiển thị ≤ 96 px; nếu có bản lớn hơn
(PNG/SVG), thay file này rồi chạy lại `npm run images`.

## Biến môi trường

| Biến | Ý nghĩa |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Địa chỉ website thật (SEO, sitemap, ảnh chia sẻ) |
| `ADMIN_PASSWORD` | Mật khẩu vào `/admin`. Không đặt thì `/admin` bị tắt |
| `ADMIN_SESSION_SECRET` | (tuỳ chọn) khoá ký phiên đăng nhập |
| `DATA_DIR` | Thư mục lưu yêu cầu của khách (mặc định `.data`) |
| `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` | (tuỳ chọn) nhận thông báo Telegram khi có khách mới |
| `INQUIRY_WEBHOOK_URL` | (tuỳ chọn) gửi JSON tới Make / Zapier / n8n / Google Apps Script |

### Lưu ý khi deploy

Yêu cầu của khách được lưu bằng file JSON trong `DATA_DIR`. Trên VPS/Docker có ổ đĩa bền vững thì dùng được ngay.
Trên Vercel/serverless, ổ đĩa **không giữ dữ liệu giữa các lần chạy**, nên hãy bật Telegram hoặc webhook để nhận
thông tin ngay khi khách gửi (hoặc đổi `src/lib/inquiries.ts` sang cơ sở dữ liệu như Postgres/Supabase).
Bộ chống spam (giới hạn theo IP) lưu trong bộ nhớ tiến trình; nếu chạy nhiều instance, nên chuyển sang Redis.

## Hiệu năng & truy cập

- Trang tĩnh (SSG), ảnh qua `next/image` (AVIF/WebP, đúng kích thước theo màn hình, lazy-load), font tự host.
- Ảnh hero được preload với `fetchpriority=high`; lightbox chỉ tải khi bấm vào ảnh.
- Hiệu ứng chỉ dùng `transform`/`opacity`, tắt hoàn toàn khi hệ điều hành bật *giảm chuyển động*.
- Lighthouse (mobile, mạng 4G giả lập chậm): Accessibility 100 · Best Practices 100 · SEO 100.
- Bảo mật form: kiểm tra dữ liệu phía server (zod), ô bẫy bot, giới hạn tốc độ, chặn request khác nguồn.
