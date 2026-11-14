"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Globe2 } from "lucide-react";
import Image from "next/image";
import { Avatar } from "@/components/avatar";
import { formatRelativeTime } from "@/lib/utils";
import type { Post } from "@/types/post";

export function PostCard({ post, fresh = false }: { post: Post; fresh?: boolean }) {
  const [, tick] = useState(0);
  useEffect(() => {
    const timer = window.setInterval(() => tick((value) => value + 1), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <motion.article
      initial={fresh ? { opacity: 0, y: -10 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className="border-b border-[#d8dfe8] bg-white px-4 py-4 first:border-t"
    >
      <div className="flex gap-3">
        <Avatar size="md" visitor />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2">
            <h3 className="font-bold text-[#3b5998]">{post.author_name}</h3>
            <span className="text-xs text-[#8a94a4]">wrote on Christian&apos;s Wall</span>
          </div>
          <p className="mt-1 whitespace-pre-wrap break-words text-[15px] leading-6 text-[#1c2430]">{post.content}</p>
          {post.image_url && <Image src={post.image_url} alt="Post attachment" width={900} height={600} unoptimized className="mt-3 max-h-96 w-full rounded-sm border border-[#d8dfe8] object-cover" />}
          <div className="mt-2 flex items-center gap-1.5 text-xs text-[#7b8798]">
            <time dateTime={post.created_at} title={new Date(post.created_at).toLocaleString()}>{formatRelativeTime(post.created_at)}</time>
            <span aria-hidden="true">·</span>
            <Globe2 className="size-3.5" aria-label="Public post" />
          </div>
        </div>
      </div>
    </motion.article>
  );
}
