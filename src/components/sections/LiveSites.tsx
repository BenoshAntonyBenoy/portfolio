"use client";

import { motion, type Variants } from "framer-motion";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { content, type LiveSite } from "@/lib/content";

const card: Variants = {
  hover: { y: -3, transition: { type: "spring", stiffness: 320, damping: 24 } },
};

const cardArrow: Variants = {
  hover: {
    x: 3,
    y: -3,
    transition: { type: "spring", stiffness: 400, damping: 18 },
  },
};

function LiveCard({ site, index }: { site: LiveSite; index: number }) {
  return (
    <Reveal delay={index * 0.1} className="h-full">
      <motion.a
        href={site.href}
        target="_blank"
        rel="noopener noreferrer"
        variants={card}
        whileHover="hover"
        whileFocus="hover"
        whileTap={{ scale: 0.995 }}
        className="surface surface-hover group flex h-full flex-col p-7 focus:outline-none focus-visible:border-lichen"
      >
        <div className="label flex items-center gap-3 text-bone-mute">
          {site.tag}
          <span className="h-2.5 w-px bg-line-strong" />
          <span className="flex items-center gap-2">
            <span className="h-1 w-1 animate-pulse rounded-full bg-lichen" />
            {content.liveSites.onlineLabel}
          </span>
        </div>

        <h3 className="mt-6 font-display text-3xl leading-none sm:text-4xl">
          {site.title}
        </h3>

        <p className="mt-4 flex-1 leading-relaxed text-bone-mute">
          {site.description}
        </p>

        <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-2">
          {site.tech.map((t) => (
            <li key={t} className="label text-bone-dim">
              {t}
            </li>
          ))}
        </ul>

        <div className="mt-8 flex items-center justify-between border-t border-line pt-5">
          <span className="label text-bone-mute">{site.domain}</span>
          <span className="flex items-center gap-2 text-sm text-bone transition-colors group-hover:text-lichen">
            {content.liveSites.openLabel}
            <motion.span aria-hidden variants={cardArrow}>
              ↗
            </motion.span>
          </span>
        </div>
      </motion.a>
    </Reveal>
  );
}

export default function LiveSites() {
  return (
    <section
      id="live"
      className="relative mx-auto max-w-6xl px-6 py-24 md:py-32"
    >
      <SectionHeading heading={content.liveSites.heading} />

      <div className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-2">
        {content.liveSites.items.map((site, i) => (
          <LiveCard key={site.href} site={site} index={i} />
        ))}
      </div>
    </section>
  );
}
