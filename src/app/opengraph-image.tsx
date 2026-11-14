import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Christian Louie Illahi's Wall";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const portraitData = await readFile(join(process.cwd(), "public", "christian-louie-illahi.png"), "base64");
const portraitUrl = `data:image/png;base64,${portraitData}`;

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        background: "#F4F6F9",
        color: "#1C2430",
        padding: "70px 84px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={portraitUrl}
        alt=""
        width={390}
        height={390}
        style={{ objectFit: "cover", borderRadius: "16px", border: "8px solid white", boxShadow: "0 12px 36px rgba(30,45,70,.18)" }}
      />
      <div style={{ display: "flex", flexDirection: "column", marginLeft: "64px" }}>
        <div style={{ color: "#3B5998", fontSize: "28px", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase" }}>My Wall</div>
        <div style={{ marginTop: "18px", fontSize: "62px", lineHeight: 1.05, fontWeight: 800 }}>Christian Louie Illahi</div>
        <div style={{ marginTop: "24px", color: "#667085", fontSize: "28px", lineHeight: 1.35 }}>Messages, photos, and a little old-web nostalgia.</div>
      </div>
    </div>,
    size,
  );
}
