import Image from "next/image";
import { cn } from "@/lib/utils";

export function Avatar({ size = "md", visitor = false, profile = false }: { size?: "sm" | "md" | "lg"; visitor?: boolean; profile?: boolean }) {
  if (profile) {
    return (
      <div
        className={cn(
          "relative shrink-0 overflow-hidden rounded-sm border border-[#c6cfdd] bg-[#e7ebf2]",
          size === "sm" && "size-10",
          size === "md" && "size-12",
          size === "lg" && "aspect-square w-full",
        )}
      >
        <Image
          src="/christian-louie-illahi.png"
          alt="Christian Louie Illahi"
          fill
          priority={size === "lg"}
          sizes={size === "lg" ? "210px" : size === "md" ? "48px" : "40px"}
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative shrink-0 overflow-hidden rounded-sm border border-[#c6cfdd] bg-gradient-to-br",
        visitor ? "from-[#9ab0d4] to-[#3b5998]" : "from-[#e3c7a8] via-[#d49775] to-[#526a8e]",
        size === "sm" && "size-10",
        size === "md" && "size-12",
        size === "lg" && "h-44 w-full",
      )}
    >
      <div className={cn("absolute rounded-full bg-[#f2d0b6]", size === "lg" ? "left-1/2 top-5 size-20 -translate-x-1/2" : "left-1/2 top-1 size-5 -translate-x-1/2")} />
      <div className={cn("absolute rounded-t-full", visitor ? "bg-[#dce5f3]" : "bg-[#213250]", size === "lg" ? "bottom-0 left-1/2 h-24 w-32 -translate-x-1/2" : "bottom-0 left-1/2 h-6 w-8 -translate-x-1/2")} />
      {!visitor && <div className={cn("absolute rounded-t-full bg-[#38291f]", size === "lg" ? "left-1/2 top-3 h-8 w-20 -translate-x-1/2" : "left-1/2 top-0 h-3 w-6 -translate-x-1/2")} />}
    </div>
  );
}
