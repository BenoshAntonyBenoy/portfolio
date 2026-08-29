"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { content } from "@/lib/content";

export default function Navbar() {
  const { brand, brandAccent, links, cta } = content.nav;
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "border-b border-line bg-ink/85 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Was "benosh.dev" — the site has always been served from benosh.tech. */}
        <a href="#" className="label text-bone">
          {brand}
          <span className="text-lichen">{brandAccent}</span>
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-sm text-bone-dim transition-colors hover:text-bone"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href={cta.href}
          className="border border-line-strong px-4 py-1.5 text-sm text-bone transition-colors hover:border-lichen hover:text-lichen"
        >
          {cta.label}
        </a>
      </nav>
    </motion.header>
  );
}
