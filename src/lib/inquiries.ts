import "server-only";
import { randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import type { InquiryInput } from "./validation";

export type Inquiry = InquiryInput & {
  id: string;
  createdAt: string;
  status: "new" | "contacted";
};

// Thư mục dữ liệu nằm ngoài mã nguồn: báo cho bundler đừng truy vết/đóng gói nó vào bản build
const dir = path.resolve(/*turbopackIgnore: true*/ process.cwd(), process.env.DATA_DIR ?? ".data");
const file = path.join(dir, "inquiries.json");

// Hàng đợi tuần tự: tránh hai yêu cầu ghi đè lên nhau
let queue: Promise<unknown> = Promise.resolve();
function serial<T>(task: () => Promise<T>): Promise<T> {
  const run = queue.then(task, task);
  queue = run.catch(() => undefined);
  return run;
}

async function readAll(): Promise<Inquiry[]> {
  try {
    return JSON.parse(await fs.readFile(file, "utf8")) as Inquiry[];
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw err;
  }
}

async function writeAll(list: Inquiry[]) {
  await fs.mkdir(dir, { recursive: true });
  const tmp = `${file}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(list, null, 2), "utf8");
  await fs.rename(tmp, file); // ghi nguyên tử: file không bao giờ nằm ở trạng thái dở dang
}

export function listInquiries() {
  return serial(async () => (await readAll()).sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
}

export function addInquiry(input: InquiryInput) {
  return serial(async () => {
    const list = await readAll();
    const item: Inquiry = { ...input, id: randomUUID(), createdAt: new Date().toISOString(), status: "new" };
    list.push(item);
    await writeAll(list);
    return item;
  });
}

export function setInquiryStatus(id: string, status: Inquiry["status"]) {
  return serial(async () => {
    const list = await readAll();
    const item = list.find((i) => i.id === id);
    if (!item) return false;
    item.status = status;
    await writeAll(list);
    return true;
  });
}

export function deleteInquiry(id: string) {
  return serial(async () => {
    const list = await readAll();
    const next = list.filter((i) => i.id !== id);
    if (next.length === list.length) return false;
    await writeAll(next);
    return true;
  });
}
