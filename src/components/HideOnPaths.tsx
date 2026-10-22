"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** Ẩn phần tử (vd. footer) ở một số trang đặc biệt, nội dung vẫn được render sẵn từ server */
export function HideOnPaths({ paths, children }: { paths: string[]; children: ReactNode }) {
  const pathname = usePathname();
  return paths.includes(pathname) ? null : <>{children}</>;
}
