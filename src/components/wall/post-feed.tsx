"use client";

import { AlertCircle, MessageSquareDashed, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PostCard } from "@/components/wall/post-card";
import { PostSkeleton } from "@/components/wall/post-skeleton";
import type { Post } from "@/types/post";

type Props = {
  posts: Post[];
  loading: boolean;
  error: string | null;
  freshIds: Set<string>;
  hasMore: boolean;
  loadingMore: boolean;
  onRetry: () => void;
  onLoadMore: () => void;
};

export function PostFeed({ posts, loading, error, freshIds, hasMore, loadingMore, onRetry, onLoadMore }: Props) {
  if (loading) return <div aria-label="Loading wall posts">{[0, 1, 2].map((value) => <PostSkeleton key={value} />)}</div>;

  if (error && posts.length === 0) {
    return (
      <div className="grid min-h-52 place-items-center bg-white px-6 py-10 text-center">
        <div><AlertCircle className="mx-auto size-8 text-[#a14b4b]" /><h3 className="mt-3 font-serif text-lg font-bold text-[#1c2430]">The wall is unavailable</h3><p className="mt-1 max-w-sm text-sm text-[#667085]">{error}</p><Button onClick={onRetry} variant="ghost" className="mt-3"><RefreshCw className="size-4" /> Try again</Button></div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="grid min-h-52 place-items-center bg-white px-6 py-10 text-center">
        <div><MessageSquareDashed className="mx-auto size-9 text-[#8da0c4]" /><h3 className="mt-3 font-serif text-lg font-bold text-[#1c2430]">No posts yet</h3><p className="mt-1 text-sm text-[#667085]">Be the first to share something!</p></div>
      </div>
    );
  }

  return (
    <div>
      {error && <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-800">Live refresh had a problem. Showing the posts already loaded.</div>}
      {posts.map((post) => <PostCard key={post.id} post={post} fresh={freshIds.has(post.id)} />)}
      {hasMore && <div className="bg-white p-3 text-center"><Button variant="ghost" onClick={onLoadMore} disabled={loadingMore}>{loadingMore && <RefreshCw className="size-4 animate-spin" />}{loadingMore ? "Loading…" : "View older posts"}</Button></div>}
    </div>
  );
}
