"use client";

import { motion, type Variants } from "framer-motion";
import { liveSites } from "@/lib/content";

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
    y: -3,
    transition: { type: "spring", stiffness: 320, damping: 24 },
  },
};

const arrow: Variants = {
  hover: {
    x: 3,
    y: -3,
    transition: { type: "spring", stiffness: 400, damping: 18 },
  },
};

/**
 * The big front-page portal buttons — one per live site. Sized to be the first
 * thing you reach for on benosh.tech, and to stay tappable on a phone.
 */
export default function PortalButtons() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
          whileTap={{ scale: 0.99 }}
          className="surface surface-hover group flex min-h-[116px] flex-col justify-between p-5 text-left focus:outline-none focus-visible:border-lichen"
        >
          <div className="flex items-start justify-between gap-3">
            <span className="font-display text-2xl leading-none sm:text-[1.75rem]">
              {site.title}
            </span>
            <motion.span
              aria-hidden
              variants={arrow}
              className="text-sm text-bone-mute transition-colors group-hover:text-lichen"
            >
              ↗
            </motion.span>
          </div>

          {/* Tracking is dialled back from the shared .label value — the full
              domain at 0.18em overran the tile at tablet widths. */}
          <div className="label-tight mt-6 flex items-center gap-2 text-bone-mute">
            <span className="h-1 w-1 shrink-0 animate-pulse rounded-full bg-lichen" />
            <span className="truncate">{site.domain}</span>
          </div>
        </motion.a>
      ))}
    </div>
  );
}
