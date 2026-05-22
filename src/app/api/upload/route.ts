import type { NextRequest } from "next/server";
import { withAuth } from "@/lib/auth";
import { ok, badRequest, handle, serverError } from "@/lib/api";

export const runtime = "nodejs";

const MAX_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/avif", "application/pdf"]);

export const POST = withAuth(async (req: NextRequest) =>
  handle(async () => {
    const form = await req.formData().catch(() => null);
    if (!form) return badRequest("Expected multipart/form-data");
    const file = form.get("file");
    if (!(file instanceof File)) return badRequest("Missing file");
    if (file.size > MAX_BYTES) return badRequest("File too large (max 5MB)");
    if (!ALLOWED.has(file.type)) return badRequest("Unsupported file type");

    // Vercel Blob integration would happen here.
    // For now, return a placeholder URL — wire BLOB_READ_WRITE_TOKEN + @vercel/blob to enable.
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return serverError("Upload provider not configured (set BLOB_READ_WRITE_TOKEN)");
    }
    return ok({ url: `https://placeholder.example/${encodeURIComponent(file.name)}` });
  })
);
