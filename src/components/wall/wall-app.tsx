"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Wifi } from "lucide-react";
import { Header } from "@/components/layout/header";
import { LeftSidebar } from "@/components/layout/left-sidebar";
import { RightSidebar } from "@/components/layout/right-sidebar";
import { Avatar } from "@/components/avatar";
import { PostComposer } from "@/components/wall/post-composer";
import { PostFeed } from "@/components/wall/post-feed";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import type { Post } from "@/types/post";

const PAGE_SIZE = 15;

function sortPosts(posts: Post[]) {
  return [...posts].sort((a, b) => b.created_at.localeCompare(a.created_at) || b.id.localeCompare(a.id));
}

export function WallApp() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [realtime, setRealtime] = useState(false);
  const [freshIds, setFreshIds] = useState<Set<string>>(() => new Set());
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    if (!supabase) {
      setError("Supabase is not configured yet. Add the two public environment variables from .env.example.");
      setLoading(false);
      return;
    }
    const { data, error: fetchError } = await supabase.from("posts").select("id,author_name,content,image_url,created_at").order("created_at", { ascending: false }).order("id", { ascending: false }).limit(PAGE_SIZE);
    if (fetchError) setError(fetchError.message);
    else {
      const loaded = (data ?? []) as Post[];
      setPosts(loaded);
      setHasMore(loaded.length === PAGE_SIZE);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    const task = window.setTimeout(() => void loadPosts(), 0);
    return () => window.clearTimeout(task);
  }, [loadPosts]);

  useEffect(() => {
    if (!supabase) return;
    const channel = supabase.channel("public-wall").on("postgres_changes", { event: "INSERT", schema: "public", table: "posts" }, (payload) => {
      const incoming = payload.new as Post;
      setFreshIds((current) => new Set(current).add(incoming.id));
      setPosts((current) => sortPosts([incoming, ...current.filter((post) => post.id !== incoming.id)]));
    }).subscribe((status) => setRealtime(status === "SUBSCRIBED"));
    return () => { void supabase.removeChannel(channel); };
  }, [supabase]);

  function addPublished(post: Post) {
    setFreshIds((current) => new Set(current).add(post.id));
    setPosts((current) => sortPosts([post, ...current.filter((item) => item.id !== post.id)]));
  }

  async function loadMore() {
    if (!supabase || loadingMore || posts.length === 0) return;
    setLoadingMore(true);
    const last = posts.at(-1);
    const cursor = `created_at.lt.${last!.created_at},and(created_at.eq.${last!.created_at},id.lt.${last!.id})`;
    const { data, error: fetchError } = await supabase.from("posts").select("id,author_name,content,image_url,created_at").or(cursor).order("created_at", { ascending: false }).order("id", { ascending: false }).limit(PAGE_SIZE);
    if (fetchError) setError(fetchError.message);
    else {
      const older = (data ?? []) as Post[];
      setPosts((current) => sortPosts([...current, ...older.filter((post) => !current.some((item) => item.id === post.id))]));
      setHasMore(older.length === PAGE_SIZE);
    }
    setLoadingMore(false);
  }

  const normalizedQuery = query.trim().toLowerCase();
  const visiblePosts = normalizedQuery ? posts.filter((post) => post.content.toLowerCase().includes(normalizedQuery) || post.author_name.toLowerCase().includes(normalizedQuery)) : posts;

  return (
    <>
      <Header query={query} onQueryChange={setQuery} />
      <div className="mx-auto grid max-w-[1180px] grid-cols-1 gap-6 px-3 py-5 sm:px-5 lg:grid-cols-[210px_minmax(0,1fr)] xl:grid-cols-[210px_minmax(0,1fr)_230px]">
        <LeftSidebar />
        <main id="wall" className="min-w-0 scroll-mt-20">
          <div className="mb-4 flex items-center gap-3 rounded-sm border border-[#cbd4e1] bg-white p-3 shadow-[0_1px_2px_rgba(20,35,60,.05)] lg:hidden">
            <Avatar size="md" profile />
            <div className="min-w-0">
              <h1 className="truncate font-serif text-lg font-bold text-[#1c2430]">Christian Louie Illahi</h1>
              <p className="text-xs text-[#667085]">Software developer and curious builder</p>
            </div>
          </div>
          <div className="mb-4 flex items-end justify-between border-b border-[#c4cddd] pb-2">
            <div><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#72809a]">Christian Louie Illahi&apos;s profile</p><h1 className="font-serif text-3xl font-bold tracking-tight text-[#1c2430]">The Wall</h1></div>
            <span className="flex items-center gap-1.5 text-xs text-[#667085]"><Wifi className={`size-3.5 ${realtime ? "text-emerald-600" : "text-[#98a2b3]"}`} /> {realtime ? "Live" : "Offline"}</span>
          </div>
          <PostComposer onPublished={addPublished} />
          <section aria-labelledby="wall-stories" className="mt-5 overflow-hidden rounded-sm border border-[#cbd4e1] shadow-[0_1px_3px_rgba(32,48,74,.06)]">
            <div className="flex items-center justify-between border-b border-[#b7c3d5] bg-[#e7ebf2] px-4 py-2.5"><h2 id="wall-stories" className="font-serif font-bold text-[#334f84]">Wall posts</h2><span className="text-xs text-[#667085]">{normalizedQuery ? `${visiblePosts.length} matches` : posts.length ? `${posts.length}${hasMore ? "+" : ""} posts` : ""}</span></div>
            <PostFeed posts={visiblePosts} loading={loading} error={error} freshIds={freshIds} hasMore={!normalizedQuery && hasMore} loadingMore={loadingMore} onRetry={loadPosts} onLoadMore={loadMore} />
          </section>
        </main>
        <RightSidebar realtime={realtime} />
      </div>
    </>
  );
}
