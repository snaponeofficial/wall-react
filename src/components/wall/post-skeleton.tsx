import { Skeleton } from "@/components/ui/skeleton";

export function PostSkeleton() {
  return (
    <div className="flex gap-3 border-b border-[#d8dfe8] bg-white px-4 py-4">
      <Skeleton className="size-12 shrink-0 rounded-sm" />
      <div className="flex-1 space-y-2.5">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  );
}
