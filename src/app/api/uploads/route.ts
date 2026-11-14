import { randomUUID } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_UPLOADS_PER_HOUR = 12;
const WINDOW_MS = 60 * 60 * 1000;
const allowedTypes = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
]);
const uploadsByVisitor = new Map<string, number[]>();

function hasValidSignature(type: string, bytes: Uint8Array) {
  if (type === "image/jpeg") return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (type === "image/png") return [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a].every((byte, index) => bytes[index] === byte);
  if (type === "image/webp") {
    return String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" && String.fromCharCode(...bytes.slice(8, 12)) === "WEBP";
  }
  return false;
}

function getClientKey(request: NextRequest) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "local";
}

function isRateLimited(key: string) {
  const now = Date.now();
  const recent = (uploadsByVisitor.get(key) ?? []).filter((time) => now - time < WINDOW_MS);
  if (recent.length >= MAX_UPLOADS_PER_HOUR) return true;
  uploadsByVisitor.set(key, [...recent, now]);
  if (uploadsByVisitor.size > 5_000) uploadsByVisitor.clear();
  return false;
}

export async function POST(request: NextRequest) {
  if (isRateLimited(getClientKey(request))) {
    return NextResponse.json({ error: "You have uploaded too many photos. Please try again later." }, { status: 429 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "The photo upload was not valid." }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Choose a photo to upload." }, { status: 400 });
  const extension = allowedTypes.get(file.type);
  if (!extension) return NextResponse.json({ error: "Photos must be JPEG, PNG, or WebP." }, { status: 415 });
  if (file.size === 0 || file.size > MAX_FILE_SIZE) return NextResponse.json({ error: "Photos must be smaller than 5 MB." }, { status: 413 });
  const signature = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  if (!hasValidSignature(file.type, signature)) {
    return NextResponse.json({ error: "The selected file is not a valid image." }, { status: 415 });
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) return NextResponse.json({ error: "Supabase is not configured on this deployment." }, { status: 503 });

  const date = new Date();
  const folder = `${date.getUTCFullYear()}/${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
  const path = `public/${folder}/${randomUUID()}.${extension}`;
  const { data, error } = await supabase.storage.from("wall-photos").upload(path, file, {
    cacheControl: "31536000",
    contentType: file.type,
    upsert: false,
  });

  if (error) {
    console.error("Photo upload failed", error.message);
    return NextResponse.json({ error: "The photo could not be uploaded. Please try again." }, { status: 500 });
  }

  const { data: publicFile } = supabase.storage.from("wall-photos").getPublicUrl(data.path);
  return NextResponse.json({ imageUrl: publicFile.publicUrl }, { status: 201 });
}
