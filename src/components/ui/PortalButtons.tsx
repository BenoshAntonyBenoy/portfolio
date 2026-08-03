"use client";

import { motion, type Variants } from "framer-motion";
import { liveSites } from "@/lib/data";

// Each tile drives its own entrance — `custom` carries the index so the two
// stagger in behind the hero copy without depending on a parent variant tree.
const tile: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: 0.7 + i * 0.14,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
  // Gesture variant — the label propagates to the children that define it.
  hover: {
    y: -6,
    transition: { type: "spring", stiffness: 320, damping: 22 },
  },
};

const arrow: Variants = {
  hover: {
    x: 3,
    y: -3,
    transition: { type: "spring", stiffness: 400, damping: 18 },
  },
};

const glow: Variants = {
  hover: { opacity: 0.5, scale: 1.15, transition: { duration: 0.35 } },
};

const wash: Variants = {
  hover: { opacity: 0.16, transition: { duration: 0.35 } },
};

const cta: Variants = {
  hover: { x: 3, transition: { type: "spring", stiffness: 400, damping: 22 } },
};

/**
 * The big front-page portal buttons — one per live site. Sized to be the first
 * thing you reach for on benosh.tech, and to stay tappable on a phone.
 */
export default function PortalButtons() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {liveSites.map((site, i) => (
        <motion.a
          key={site.href}
          href={site.href}
          target="_blank"
          rel="noopener noreferrer"
          custom={i}
          variants={tile}
          initial="hidden"
          animate="show"
          whileHover="hover"
          whileFocus="hover"
          whileTap={{ scale: 0.985 }}
          className="group relative flex min-h-[132px] flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-colors duration-300 hover:border-white/25 hover:bg-white/[0.06] focus:outline-none focus-visible:border-white/40"
        >
          {/* accent wash + glow, both intensify on hover */}
          <motion.div
            variants={wash}
            initial={{ opacity: 0.07 }}
            className="pointer-events-none absolute inset-0"
            style={{
              background: `radial-gradient(circle at 15% 0%, ${site.accent}, transparent 70%)`,
            }}
          />
          <motion.div
            variants={glow}
            initial={{ opacity: 0.2 }}
            className="pointer-events-none absolute -bottom-12 -right-10 h-36 w-36 rounded-full blur-3xl"
            style={{ background: site.accent }}
          />

          <div className="relative flex items-start justify-between gap-3">
            <span className="text-2xl font-bold tracking-tight sm:text-3xl">
              {site.title}
            </span>
            <motion.span
              aria-hidden
              variants={arrow}
              className="text-lg"
              style={{ color: site.accent }}
            >
              ↗
            </motion.span>
          </div>

          <div className="relative mt-4 flex items-center gap-2 font-mono text-[11px] text-white/45">
            <span
              className="h-1.5 w-1.5 animate-pulse-glow rounded-full"
              style={{ background: site.accent }}
            />
            {site.domain}
          </div>

          <motion.span
            variants={cta}
            className="relative mt-2 inline-block text-sm font-semibold text-white/70 transition-colors group-hover:text-white"
          >
            Open site →
          </motion.span>
        </motion.a>
      ))}
    </div>
  );
}
