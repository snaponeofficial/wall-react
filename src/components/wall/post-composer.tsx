"use client";

import Image from "next/image";
import { type ChangeEvent, useEffect, useRef, useState } from "react";
import { ImagePlus, LoaderCircle, PencilLine, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { Post } from "@/types/post";

const MAX_LENGTH = 280;
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_FILE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export function PostComposer({ onPublished }: { onPublished: (post: Post) => void }) {
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const submitting = useRef(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const trimmed = content.trim();
  const busy = status !== null;

  useEffect(() => () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  function clearPhoto() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setImageFile(null);
    setUploadedImageUrl(null);
    if (fileInput.current) fileInput.current.value = "";
  }

  function choosePhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!ALLOWED_FILE_TYPES.has(file.type)) {
      toast.error("Choose a JPEG, PNG, or WebP photo.");
      event.target.value = "";
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error("Photos must be smaller than 5 MB.");
      event.target.value = "";
      return;
    }
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setUploadedImageUrl(null);
  }

  async function uploadPhoto() {
    if (!imageFile) return null;
    if (uploadedImageUrl) return uploadedImageUrl;
    setStatus("Uploading photo…");
    const formData = new FormData();
    formData.append("file", imageFile);
    const response = await fetch("/api/uploads", { method: "POST", body: formData });
    const payload = (await response.json()) as { imageUrl?: string; error?: string };
    if (!response.ok || !payload.imageUrl) throw new Error(payload.error || "The photo could not be uploaded.");
    setUploadedImageUrl(payload.imageUrl);
    return payload.imageUrl;
  }

  async function publish() {
    if (!trimmed || busy || submitting.current) return;
    if (trimmed.length > MAX_LENGTH) {
      toast.error("Your post is longer than 280 characters.");
      return;
    }

    submitting.current = true;
    setStatus(imageFile ? "Uploading photo…" : "Sharing…");
    try {
      const imageUrl = await uploadPhoto();
      setStatus("Sharing…");
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ content: trimmed, image_url: imageUrl }),
      });
      const payload = (await response.json()) as { post?: Post; error?: string };
      if (!response.ok || !payload.post) throw new Error(payload.error || "Your post could not be published.");
      onPublished(payload.post);
      setContent("");
      clearPhoto();
      toast.success("Your post is now on the wall.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Your post could not be published.");
    } finally {
      submitting.current = false;
      setStatus(null);
    }
  }

  return (
    <section className="overflow-hidden rounded-sm border border-[#b7c3d5] bg-white shadow-[0_1px_3px_rgba(32,48,74,.08)]">
      <div className="flex items-center gap-2 border-b border-[#cbd4e1] bg-[#e7ebf2] px-3 py-2 text-sm font-bold text-[#334f84]">
        <PencilLine className="size-4" /> Write something…
      </div>
      <div className="p-3">
        <label htmlFor="composer" className="mb-2 block font-serif text-lg font-bold text-[#1c2430]">What&apos;s on your mind?</label>
        <textarea
          id="composer"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          maxLength={MAX_LENGTH}
          rows={4}
          placeholder="Share a thought with the wall…"
          className="min-h-28 w-full resize-y rounded-sm border border-[#aab6c8] bg-white px-3 py-2.5 text-[15px] leading-relaxed text-[#1c2430] shadow-[inset_0_1px_2px_rgba(30,45,70,.08)] outline-none placeholder:text-[#98a2b3] focus:border-[#5b74a8] focus:ring-2 focus:ring-[#c4d0e5]"
        />

        {previewUrl && (
          <div className="relative mt-3 aspect-video max-h-64 overflow-hidden rounded-sm border border-[#cbd4e1] bg-[#f4f6f9]">
            <Image src={previewUrl} alt="Selected photo preview" fill unoptimized className="object-contain" />
            <button
              type="button"
              onClick={clearPhoto}
              disabled={busy}
              aria-label="Remove selected photo"
              className="absolute right-2 top-2 grid size-8 place-items-center rounded-full bg-[#1c2430]/80 text-white shadow-sm transition-colors hover:bg-[#1c2430] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <X className="size-4" />
            </button>
          </div>
        )}

        <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <input ref={fileInput} type="file" accept="image/jpeg,image/png,image/webp" onChange={choosePhoto} className="sr-only" aria-label="Choose a photo" />
            <Button type="button" variant="ghost" size="sm" onClick={() => fileInput.current?.click()} disabled={busy || Boolean(imageFile)}>
              <ImagePlus className="size-4" /> {imageFile ? "Photo attached" : "Add photo"}
            </Button>
            <span aria-live="polite" className={`text-xs tabular-nums ${content.length > 250 ? "font-semibold text-amber-700" : "text-[#7b8798]"}`}>
              {MAX_LENGTH - content.length} characters left
            </span>
          </div>
          <Button onClick={publish} disabled={!trimmed || busy} className="min-w-28">
            {busy && <LoaderCircle className="size-4 animate-spin" />}
            {status ?? "Share"}
          </Button>
        </div>
        <p className="mt-2 text-[11px] text-[#8a94a4]">Optional photo · JPEG, PNG, or WebP · 5 MB maximum</p>
      </div>
    </section>
  );
}
