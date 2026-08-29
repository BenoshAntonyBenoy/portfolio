"use client";

import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import { content } from "@/lib/content";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function Achievements() {
  const section = content.achievements;

  return (
    <section id="beyond" className="relative overflow-hidden py-24 md:py-32">
      {/* Kept: the oversized ghost pawn. It's specific to him and it's doing
          composition, not decoration — which is why it survived the cull that
          took the five section glows. */}
      {section.watermark ? (
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 top-1/2 -z-10 -translate-y-1/2 select-none font-display text-[34rem] leading-none text-bone/[0.028]"
        >
          {section.watermark}
        </div>
      ) : null}

      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading heading={section.heading} />

        {/* A read-down list rather than a grid of glowing tiles — five items
            never divided evenly into three columns anyway. */}
        <motion.ul
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-16 border-t border-line"
        >
          {section.items.map((a) => (
            <motion.li
              key={a.title}
              variants={item}
              className="grid grid-cols-1 gap-x-10 gap-y-2 border-b border-line py-7 md:grid-cols-[8rem_1fr] md:py-8"
            >
              <p className="label pt-1 text-lichen">{a.kicker}</p>
              <div>
                <h3 className="font-display text-2xl leading-tight sm:text-[1.75rem]">
                  {a.title}
                </h3>
                <p className="mt-2 max-w-xl leading-relaxed text-bone-mute">
                  {a.detail}
                </p>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
