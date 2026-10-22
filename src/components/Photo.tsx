import Image from "next/image";
import type { Photo as PhotoData } from "@/data/albums";

type Props = {
  photo: PhotoData;
  sizes: string;
  /** Khung cắt: ảnh phủ kín khung cha (cha cần `relative` + tỉ lệ khung) */
  fill?: boolean;
  /** LCP: chỉ dùng cho ảnh đầu trang */
  preload?: boolean;
  eager?: boolean;
  quality?: 60 | 75 | 85;
  /** Mặc định dùng alt của ảnh. Truyền "" cho ảnh trang trí. */
  alt?: string;
  className?: string;
  position?: string;
};

export function Photo({ photo, sizes, fill, preload, eager, quality = 75, alt, className = "", position }: Props) {
  const altText = alt ?? photo.alt;
  const loading = eager ? "eager" : undefined;

  if (fill) {
    return (
      <Image
        src={photo.src}
        alt={altText}
        sizes={sizes}
        quality={quality}
        placeholder={preload ? "empty" : "blur"}
        blurDataURL={preload ? undefined : photo.blur}
        preload={preload}
        fetchPriority={preload ? "high" : undefined}
        loading={loading}
        fill
        className={`object-cover ${className}`}
        style={position ? { objectPosition: position } : undefined}
      />
    );
  }
  return (
    <Image
      src={photo.src}
      alt={altText}
      sizes={sizes}
      quality={quality}
      placeholder={preload ? "empty" : "blur"}
      blurDataURL={preload ? undefined : photo.blur}
      preload={preload}
      fetchPriority={preload ? "high" : undefined}
      loading={loading}
      width={photo.width}
      height={photo.height}
      className={className}
    />
  );
}
