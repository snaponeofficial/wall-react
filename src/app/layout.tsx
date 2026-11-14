import type { Metadata, Viewport } from "next";
import { Toaster } from "sonner";
import { getSiteUrl } from "@/lib/site";
import "./globals.css";

const title = "Christian Louie Illahi's Wall";
const description = "Share messages and photos on Christian Louie Illahi's nostalgic, real-time social wall.";

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: { default: title, template: "%s | My Wall" },
  description,
  applicationName: "My Wall",
  authors: [{ name: "Christian Louie Illahi" }],
  creator: "Christian Louie Illahi",
  publisher: "Christian Louie Illahi",
  category: "social networking",
  keywords: ["Christian Louie Illahi", "My Wall", "social wall", "Facebook-inspired wall"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "My Wall",
    title,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#3B5998",
  colorScheme: "light",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster position="bottom-right" richColors closeButton />
      </body>
    </html>
  );
}
