import type { Metadata } from "next";
import { adminEnabled, isAdmin } from "@/lib/admin-auth";
import { listInquiries } from "@/lib/inquiries";
import { serviceLabel } from "@/lib/validation";
import { AdminLogin } from "./AdminLogin";
import { InquiryActions } from "./InquiryActions";
import { LogoutButton } from "./LogoutButton";

export const metadata: Metadata = { title: "Quản trị", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const fmt = new Intl.DateTimeFormat("vi-VN", { dateStyle: "short", timeStyle: "short", timeZone: "Asia/Ho_Chi_Minh" });

export default async function AdminPage() {
  const shell = (children: React.ReactNode) => (
    <section className="container-x min-h-[70svh] py-14 md:py-20">{children}</section>
  );

  if (!adminEnabled()) {
    return shell(
      <div className="mx-auto max-w-xl rounded-xl bg-ivory p-8">
        <h1 className="display text-[2rem]">Trang quản trị chưa được bật</h1>
        <p className="mt-3 text-muted">
          Hãy đặt biến môi trường <code className="rounded bg-sand-100 px-1.5 py-0.5">ADMIN_PASSWORD</code> (xem{" "}
          <code className="rounded bg-sand-100 px-1.5 py-0.5">.env.example</code>) rồi khởi động lại máy chủ.
        </p>
      </div>,
    );
  }

  if (!(await isAdmin())) {
    return shell(
      <>
        <h1 className="display text-center text-[2.4rem]">Quản trị</h1>
        <AdminLogin />
      </>,
    );
  }

  const items = await listInquiries();
  const fresh = items.filter((i) => i.status === "new").length;

  return shell(
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Quản trị</p>
          <h1 className="display mt-3 text-[2.4rem]">Khách để lại thông tin</h1>
          <p className="mt-2 text-muted">
            {items.length} yêu cầu · {fresh} chưa liên hệ
          </p>
        </div>
        <LogoutButton />
      </div>

      {items.length === 0 ? (
        <p className="mt-12 rounded-xl bg-ivory p-8 text-center text-muted">Chưa có yêu cầu nào.</p>
      ) : (
        <ul className="mt-10 space-y-4">
          {items.map((i) => (
            <li key={i.id} className="rounded-xl bg-ivory p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="flex flex-wrap items-center gap-3">
                    <span className="text-lg font-medium">{i.name}</span>
                    <span
                      className={`rounded-full px-3 py-0.5 text-xs font-medium ${
                        i.status === "new" ? "bg-sunset text-white" : "bg-sand-200 text-muted"
                      }`}
                    >
                      {i.status === "new" ? "Mới" : "Đã liên hệ"}
                    </span>
                  </p>
                  <p className="mt-1 text-sm text-muted">{fmt.format(new Date(i.createdAt))}</p>
                </div>
                <a
                  href={`tel:${i.phone}`}
                  className="btn btn-dark min-h-11 px-5 text-sm"
                >
                  {i.phone}
                </a>
              </div>
              <dl className="mt-4 grid gap-x-8 gap-y-2 text-sm sm:grid-cols-[auto_1fr]">
                <dt className="text-muted">Dịch vụ</dt>
                <dd>{serviceLabel(i.service)}</dd>
                {i.date && (
                  <>
                    <dt className="text-muted">Ngày dự kiến</dt>
                    <dd>{i.date}</dd>
                  </>
                )}
                {i.message && (
                  <>
                    <dt className="text-muted">Lời nhắn</dt>
                    <dd className="whitespace-pre-wrap">{i.message}</dd>
                  </>
                )}
              </dl>
              <div className="mt-5 border-t hairline pt-4">
                <InquiryActions id={i.id} status={i.status} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </>,
  );
}
