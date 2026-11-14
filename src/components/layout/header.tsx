"use client";

import { Search, UserRound } from "lucide-react";

type HeaderProps = {
  query: string;
  onQueryChange: (value: string) => void;
};

export function Header({ query, onQueryChange }: HeaderProps) {
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <header className="sticky top-0 z-50 border-b border-[#243b6b] bg-[#3b5998] text-white shadow-sm">
      <div className="mx-auto flex h-14 max-w-[1180px] items-center gap-3 px-3 sm:px-5">
        <button onClick={() => scrollTo("wall")} className="group flex items-center gap-2 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80">
          <span className="grid size-8 place-items-center rounded-[3px] border border-white/40 bg-white text-xl font-black text-[#3b5998] shadow-sm transition-transform group-hover:-rotate-2">W</span>
          <span className="hidden font-serif text-xl font-bold tracking-tight sm:block">my wall</span>
        </button>

        <label className="relative ml-1 max-w-md flex-1">
          <span className="sr-only">Search wall posts</span>
          <Search className="absolute left-2 top-1/2 size-4 -translate-y-1/2 text-[#75849f]" />
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search this wall"
            className="h-8 w-full rounded-[3px] border border-[#29447e] bg-white pl-8 pr-3 text-sm text-[#1c2430] outline-none placeholder:text-[#8792a5] focus:ring-2 focus:ring-white/30"
          />
        </label>

        <nav aria-label="Primary navigation" className="ml-auto flex h-full items-stretch text-sm font-semibold">
          <button onClick={() => scrollTo("wall")} className="border-l border-white/10 px-3 hover:bg-[#2d4373] focus-visible:outline-none focus-visible:bg-[#2d4373]">Home</button>
          <button onClick={() => scrollTo("profile")} className="hidden border-l border-white/10 px-3 hover:bg-[#2d4373] focus-visible:outline-none focus-visible:bg-[#2d4373] sm:block">Profile</button>
          <button onClick={() => document.getElementById("composer")?.focus()} className="border-x border-white/10 px-3 hover:bg-[#2d4373] focus-visible:outline-none focus-visible:bg-[#2d4373]">Wall</button>
          <span className="hidden items-center pl-3 text-white/75 lg:flex"><UserRound className="size-4" /></span>
        </nav>
      </div>
    </header>
  );
}
