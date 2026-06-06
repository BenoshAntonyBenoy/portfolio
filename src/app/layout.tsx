import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Benosh Benoy — Developer. Designer. Strategist.",
  description:
    "Portfolio of Benosh Benoy — software developer with a strong design sensibility. Projects in Python, AI, and UI/UX design.",
  metadataBase: new URL("https://benoshbenoy.vercel.app"),
  openGraph: {
    title: "Benosh Benoy — Developer. Designer. Strategist.",
    description:
      "Software developer with a strong design sensibility. Python, AI, and UI/UX.",
    type: "website",
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
        className={`${geistSans.variable} ${geistMono.variable} bg-ink text-foreground antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
