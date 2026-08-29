import type { Metadata } from "next";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import { content } from "@/lib/content";
import "./globals.css";

/**
 * Self-hosted rather than pulled through next/font/google so a build never
 * depends on reaching fonts.gstatic.com. Latin subsets only.
 */
const display = localFont({
  src: [
    { path: "./fonts/InstrumentSerif.woff2", weight: "400", style: "normal" },
    {
      path: "./fonts/InstrumentSerif-Italic.woff2",
      weight: "400",
      style: "italic",
    },
  ],
  variable: "--font-display",
  display: "swap",
});

// Variable file — one woff2 covers the whole weight range.
const sans = localFont({
  src: "./fonts/IBMPlexSans.woff2",
  variable: "--font-sans",
  weight: "100 700",
  display: "swap",
});

const mono = localFont({
  src: [
    { path: "./fonts/IBMPlexMono-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/IBMPlexMono-500.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: content.site.title,
  description: content.site.description,
  // The canonical serving origin: benosh.tech 308-redirects to www, so OG and
  // Twitter card URLs should resolve against the host that actually returns 200.
  metadataBase: new URL(content.site.url),
  openGraph: {
    title: content.site.ogTitle,
    description: content.site.ogDescription,
    type: "website",
  },
  twitter: {
    description: content.site.twitterDescription,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${display.variable} ${sans.variable} ${mono.variable} bg-ink text-bone antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
