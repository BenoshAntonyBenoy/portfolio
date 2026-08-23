"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

/**
 * The one photographic moment on the page.
 *
 * `/texture/code.webp` is a stock shot (Pexels, by Nemuel Sereti) and a very
 * well-worn one — angled monitor, blurred syntax highlighting. Used at full
 * strength it would read as exactly that. Crushed to near-black, drained of its
 * own colour, tinted to the accent and masked to nothing at both edges, what
 * survives is grain and a suggestion of screen glow. It's here to break up a
 * page that is otherwise flat CSS, and nowhere else.
 */
export default function IntroTransition() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Parallax: the two lines drift in opposite directions as you scroll through.
  const y1 = useTransform(scrollYProgress, [0, 1], ["40%", "-40%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["-30%", "30%"]);
  // The plate drifts slower than either line, which is what sells the depth.
  const yPlate = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
    >
      <motion.div
        style={{ y: yPlate }}
        aria-hidden
        className="pointer-events-none absolute inset-[-10%] -z-10 opacity-40 [mask-image:linear-gradient(to_bottom,transparent,black_28%,black_72%,transparent)]"
      >
        <div className="code-texture" />
      </motion.div>

      <motion.div style={{ opacity }} className="px-6 text-center">
        <motion.h2
          style={{ y: y1 }}
          className="font-display text-[2.75rem] leading-[1.02] sm:text-6xl lg:text-7xl"
        >
          I build things that
        </motion.h2>
        <motion.h2
          style={{ y: y2 }}
          className="font-display text-[3.5rem] italic leading-[1.02] text-lichen sm:text-7xl lg:text-8xl"
        >
          think.
        </motion.h2>
        <motion.p
          style={{ y: y2 }}
          className="mx-auto mt-10 max-w-md leading-relaxed text-bone-dim"
        >
          Code as craft. Design as language. Strategy as the thread between them.
        </motion.p>
      </motion.div>
    </section>
  );
}
