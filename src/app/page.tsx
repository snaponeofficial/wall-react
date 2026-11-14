import { WallApp } from "@/components/wall/wall-app";
import { getSiteUrl } from "@/lib/site";

export default function Home() {
  const siteUrl = getSiteUrl();
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: "Christian Louie Illahi's Wall",
    description: "A public social wall for messages and photos.",
    url: siteUrl.toString(),
    isAccessibleForFree: true,
    mainEntity: {
      "@type": "Person",
      name: "Christian Louie Illahi",
      image: new URL("/christian-louie-illahi.png", siteUrl).toString(),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
      <WallApp />
    </>
  );
}
