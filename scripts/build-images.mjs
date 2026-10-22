// Tối ưu ảnh nguồn ("Ảnh FB/") -> public/photos/<bộ>/<nn>.webp + src/data/photos.generated.json
// Chạy: npm run images   (chỉ cần chạy lại khi đổi scripts/album-sources.json hoặc thêm ảnh)
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC_DIR = path.join(root, "Ảnh FB");
const OUT_DIR = path.join(root, "public", "photos");
const MANIFEST = path.join(root, "src", "data", "photos.generated.json");
const MAX_EDGE = 1800; // đủ nét cho lightbox 2x; next/image sẽ tự hạ xuống đúng kích thước màn hình
const QUALITY = 82;

const sources = JSON.parse(await fs.readFile(path.join(root, "scripts", "album-sources.json"), "utf8"));

async function exists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function blurDataUrl(buf) {
  const tiny = await sharp(buf).resize(14).blur(1).webp({ quality: 45 }).toBuffer();
  return `data:image/webp;base64,${tiny.toString("base64")}`;
}

const manifest = {};
let converted = 0;
let skipped = 0;
let bytes = 0;

for (const [slug, files] of Object.entries(sources)) {
  const dir = path.join(OUT_DIR, slug);
  await fs.mkdir(dir, { recursive: true });
  manifest[slug] = [];

  for (const [i, file] of files.entries()) {
    const out = path.join(dir, `${String(i + 1).padStart(2, "0")}.webp`);
    const input = path.join(SRC_DIR, file);
    const srcStat = await fs.stat(input);

    let buf;
    if ((await exists(out)) && (await fs.stat(out)).mtimeMs > srcStat.mtimeMs) {
      buf = await fs.readFile(out);
      skipped++;
    } else {
      // rotate() áp dụng EXIF orientation; không gọi withMetadata() nên EXIF/GPS bị loại bỏ
      buf = await sharp(input)
        .rotate()
        .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside", withoutEnlargement: true })
        .webp({ quality: QUALITY, effort: 5 })
        .toBuffer();
      await fs.writeFile(out, buf);
      converted++;
    }
    bytes += buf.length;

    const { width, height } = await sharp(buf).metadata();
    manifest[slug].push({
      src: `/photos/${slug}/${String(i + 1).padStart(2, "0")}.webp`,
      width,
      height,
      blur: await blurDataUrl(buf),
    });
  }
}

await fs.writeFile(MANIFEST, JSON.stringify(manifest));
console.log(
  `Ảnh: ${converted} mới, ${skipped} dùng lại · ${Object.keys(manifest).length} bộ · ${(bytes / 1e6).toFixed(1)} MB`,
);

// ---- Logo, favicon, ảnh chia sẻ (OG) ----
await fs.mkdir(path.join(root, "public", "brand"), { recursive: true });
const logoSrc = path.join(root, "assets", "logo.webp");
await sharp(logoSrc).png({ compressionLevel: 9 }).toFile(path.join(root, "public", "brand", "logo.png"));
// Icon trình duyệt: logo trên nền kem để luôn đọc được ở cả tab sáng/tối
const cream = { r: 250, g: 246, b: 239, alpha: 1 };
const iconBase = (size, pad) =>
  sharp(logoSrc)
    .resize(size - pad * 2, size - pad * 2, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .extend({ top: pad, bottom: pad, left: pad, right: pad, background: cream })
    .flatten({ background: cream });
await iconBase(192, 14).png().toFile(path.join(root, "src", "app", "icon.png"));
await iconBase(180, 14).png().toFile(path.join(root, "src", "app", "apple-icon.png"));

const ogPick = ["ngay-cuoi-ben-bien", "co-dau-va-bien", "san-hoang-hon"];
const ogTiles = await Promise.all(
  ogPick.map((slug) =>
    sharp(path.join(OUT_DIR, slug, "01.webp")).resize(400, 630, { fit: "cover", position: "attention" }).toBuffer(),
  ),
);
await sharp({ create: { width: 1200, height: 630, channels: 3, background: cream } })
  .composite(ogTiles.map((input, i) => ({ input, left: i * 400, top: 0 })))
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(path.join(root, "public", "og.jpg"));
console.log("Logo, icon, og.jpg: xong");
