import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED_BUCKETS = new Set([
  "package-images",
  "location-images",
  "testimonial-images",
  "site-content",
]);

const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"]);
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

const EXT_FROM_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
};

export async function POST(request: Request) {
  await requireAdmin();

  const formData = await request.formData();
  const bucket = String(formData.get("bucket") ?? "package-images");
  const file = formData.get("file");

  if (!ALLOWED_BUCKETS.has(bucket)) {
    return NextResponse.json({ error: "Invalid upload folder." }, { status: 400 });
  }
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "File is required." }, { status: 400 });
  }
  if (!ALLOWED_MIME.has(file.type)) {
    return NextResponse.json(
      { error: "Unsupported file type. Use JPG, PNG, WebP, GIF, or SVG." },
      { status: 400 },
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File is too large (max 5 MB)." }, { status: 400 });
  }

  const originalExt = path.extname(file.name).slice(1).toLowerCase();
  const ext = EXT_FROM_MIME[file.type] || (originalExt || "bin");
  const baseName = slugify(path.basename(file.name, path.extname(file.name))) || "upload";
  const fileName = `${baseName}-${randomUUID().slice(0, 8)}.${ext}`;

  const dir = path.join(process.cwd(), "public", "storage", bucket);
  const fullPath = path.join(dir, fileName);

  try {
    await mkdir(dir, { recursive: true });
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(fullPath, buffer);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to save file." },
      { status: 500 },
    );
  }

  const url = `/storage/${bucket}/${fileName}`;
  return NextResponse.json({ url, path: url });
}
