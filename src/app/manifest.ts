import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Christian Louie Illahi's Wall",
    short_name: "My Wall",
    description: "A nostalgic, real-time social wall for messages and photos.",
    start_url: "/",
    display: "standalone",
    background_color: "#F4F6F9",
    theme_color: "#3B5998",
    categories: ["social", "lifestyle"],
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
    ],
  };
}
