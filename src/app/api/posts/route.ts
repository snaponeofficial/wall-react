import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase";

const WINDOW_MS = 60_000;
const MAX_POSTS_PER_WINDOW = 3;
const visitors = new Map<string, number[]>();

function getClientKey(request: NextRequest) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "local";
}

function isRateLimited(key: string) {
  const now = Date.now();
  const recent = (visitors.get(key) ?? []).filter((time) => now - time < WINDOW_MS);
  if (recent.length >= MAX_POSTS_PER_WINDOW) return true;
  visitors.set(key, [...recent, now]);
  if (visitors.size > 5_000) visitors.clear();
  return false;
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Please send a valid post." }, { status: 400 });
  }

  const content = typeof body === "object" && body !== null && "content" in body && typeof body.content === "string" ? body.content.trim() : "";
  const imageUrl = typeof body === "object" && body !== null && "image_url" in body && typeof body.image_url === "string" ? body.image_url.trim() : "";
  if (!content || content.length > 280) return NextResponse.json({ error: "Posts must contain between 1 and 280 characters." }, { status: 422 });
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  const allowedImagePrefix = supabaseUrl ? `${supabaseUrl}/storage/v1/object/public/wall-photos/public/` : "";
  if (imageUrl && (!allowedImagePrefix || !imageUrl.startsWith(allowedImagePrefix))) {
    return NextResponse.json({ error: "The attached photo URL is not valid." }, { status: 422 });
  }
  if (isRateLimited(getClientKey(request))) return NextResponse.json({ error: "You are posting too quickly. Please wait a minute and try again." }, { status: 429 });

  const supabase = getSupabaseServerClient();
  if (!supabase) return NextResponse.json({ error: "Supabase is not configured on this deployment." }, { status: 503 });

  const { data, error } = await supabase.from("posts").insert({ author_name: "Wall Visitor", content, image_url: imageUrl || null }).select("id,author_name,content,image_url,created_at").single();
  if (error) {
    console.error("Post insert failed", error.code, error.message);
    return NextResponse.json({ error: "The wall could not save your post. Please try again." }, { status: 500 });
  }
  return NextResponse.json({ post: data }, { status: 201 });
}
