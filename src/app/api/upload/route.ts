import type { NextRequest } from "next/server";
import { put } from "@vercel/blob";
import { withAuth } from "@/lib/auth";
import { ok, badRequest, handle, serverError } from "@/lib/api";

export const runtime = "nodejs";

const MAX_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/avif", "application/pdf"]);
const EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "application/pdf": "pdf",
};

export const POST = withAuth(async (req: NextRequest) =>
  handle(async () => {
    const form = await req.formData().catch(() => null);
    if (!form) return badRequest("Expected multipart/form-data");
    const file = form.get("file");
    if (!(file instanceof File)) return badRequest("Missing file");
    if (file.size > MAX_BYTES) return badRequest("File too large (max 5MB)");
    if (!ALLOWED.has(file.type)) return badRequest("Unsupported file type");
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return serverError("Upload provider not configured (set BLOB_READ_WRITE_TOKEN)");
    }

    const ext = EXT[file.type] ?? "bin";
    // addRandomSuffix prevents collisions when two uploads share a filename.
    const blob = await put(`uploads/${Date.now()}.${ext}`, file, {
      access: "public",
      addRandomSuffix: true,
      contentType: file.type,
    });
    return ok({ url: blob.url });
  })
);
