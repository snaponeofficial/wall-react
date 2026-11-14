import { CircleCheck, Clock3, Radio, ShieldCheck } from "lucide-react";

export function RightSidebar({ realtime }: { realtime: boolean }) {
  return (
    <aside className="hidden w-[230px] shrink-0 xl:block">
      <section id="about" className="overflow-hidden rounded-sm border border-[#cbd4e1] bg-white shadow-[0_1px_2px_rgba(20,35,60,.05)]">
        <h2 className="border-b border-[#cbd4e1] bg-[#e7ebf2] px-3 py-2 font-serif text-sm font-bold text-[#334f84]">About this Wall</h2>
        <div className="space-y-3 p-3 text-xs leading-relaxed text-[#596579]">
          <p>A small corner of the internet for sharing what is on your mind—just like we did in 2009.</p>
          <div className="flex items-center gap-2 text-[#344054]"><ShieldCheck className="size-4 text-[#3b5998]" /> Posts are securely saved</div>
          <div className="flex items-center gap-2 text-[#344054]"><Radio className="size-4 text-[#3b5998]" /> {realtime ? "Live updates connected" : "Connecting live updates…"}</div>
        </div>
      </section>

      <section className="mt-4 overflow-hidden rounded-sm border border-[#cbd4e1] bg-white">
        <h2 className="border-b border-[#cbd4e1] bg-[#e7ebf2] px-3 py-2 font-serif text-sm font-bold text-[#334f84]">Wall Notes</h2>
        <ul className="space-y-3 p-3 text-xs text-[#596579]">
          <li className="flex gap-2"><CircleCheck className="size-4 shrink-0 text-emerald-600" /> 280 characters per post</li>
          <li className="flex gap-2"><Clock3 className="size-4 shrink-0 text-[#3b5998]" /> Newest stories appear first</li>
        </ul>
      </section>

      <p className="mt-4 text-center text-[11px] text-[#8b95a5]">My Wall © 2009–2026<br />Built with a little nostalgia.</p>
    </aside>
  );
}
