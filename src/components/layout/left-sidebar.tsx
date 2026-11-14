import { BookOpen, BriefcaseBusiness, GraduationCap, Home, MapPin, MessageSquareText } from "lucide-react";
import { Avatar } from "@/components/avatar";

export function LeftSidebar() {
  return (
    <aside id="profile" className="hidden w-[210px] shrink-0 scroll-mt-20 lg:block">
      <Avatar size="lg" profile />
      <h1 className="mt-3 font-serif text-2xl font-bold leading-tight text-[#1c2430]">Christian Louie Illahi</h1>
      <p className="mt-1 text-sm leading-relaxed text-[#667085]">Software developer, curious builder, and unapologetic fan of the old web.</p>

      <nav className="mt-5 border-y border-[#d8dfe8] py-2 text-sm font-semibold text-[#3b5998]" aria-label="Profile sections">
        <a href="#wall" className="flex items-center gap-2 rounded-sm bg-[#e7ebf2] px-2 py-2 text-[#1c2430]"><MessageSquareText className="size-4 text-[#3b5998]" /> Wall</a>
        <a href="#about" className="mt-1 flex items-center gap-2 rounded-sm px-2 py-2 hover:bg-[#e7ebf2]"><BookOpen className="size-4" /> Info</a>
      </nav>

      <div className="mt-5 space-y-3 text-xs leading-relaxed text-[#4b5565]">
        <h2 className="border-b border-[#d8dfe8] pb-1 font-bold uppercase tracking-wide text-[#1c2430]">Information</h2>
        <p className="flex gap-2"><BriefcaseBusiness className="mt-0.5 size-3.5 shrink-0 text-[#7c8ca6]" /> Builds thoughtful digital products</p>
        <p className="flex gap-2"><GraduationCap className="mt-0.5 size-3.5 shrink-0 text-[#7c8ca6]" /> Studied Computer Science</p>
        <p className="flex gap-2"><MapPin className="mt-0.5 size-3.5 shrink-0 text-[#7c8ca6]" /> Lives on the internet</p>
        <p className="flex gap-2"><Home className="mt-0.5 size-3.5 shrink-0 text-[#7c8ca6]" /> From the class of 2009</p>
      </div>
    </aside>
  );
}
