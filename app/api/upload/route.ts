import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { adminStorage } from "@/lib/firebase/admin";
import { slugify } from "@/lib/utils";

const allowedBuckets = new Set(["package-images", "site-images", "testimonial-images"]);

export async function POST(request: Request) {
  await requireAdmin();
  const storage = adminStorage();
  if (!storage) return NextResponse.json({ error: "Firebase Admin Storage is not configured." }, { status: 500 });

  const formData = await request.formData();
  const bucketFolder = String(formData.get("bucket") ?? "package-images");
  const file = formData.get("file");

  if (!allowedBuckets.has(bucketFolder)) return NextResponse.json({ error: "Invalid upload folder." }, { status: 400 });
  if (!(file instanceof File)) return NextResponse.json({ error: "File is required." }, { status: 400 });

  const ext = file.name.split(".").pop() || "jpg";
  const token = randomUUID();
  const objectPath = `${bucketFolder}/${Date.now()}-${slugify(file.name.replace(/\.[^.]+$/, ""))}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  const bucket = storage.bucket();
  const object = bucket.file(objectPath);

  await object.save(buffer, {
    metadata: {
      contentType: file.type || "application/octet-stream",
      metadata: {
        firebaseStorageDownloadTokens: token,
      },
    },
    resumable: false,
  });

  const url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(objectPath)}?alt=media&token=${token}`;
  return NextResponse.json({ url, path: objectPath });
}
