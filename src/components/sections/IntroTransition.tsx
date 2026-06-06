"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function IntroTransition() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Parallax: the two lines drift in opposite directions as you scroll through.
  const y1 = useTransform(scrollYProgress, [0, 1], ["40%", "-40%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["-30%", "30%"]);
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [0, 1, 1, 0],
  );

  return (
    <section
      ref={ref}
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.08),transparent_70%)]" />

      <motion.div style={{ opacity }} className="px-6 text-center">
        <motion.h2
          style={{ y: y1 }}
          className="text-4xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl"
        >
          I build things that
        </motion.h2>
        <motion.h2
          style={{ y: y2 }}
          className="text-gradient-animated text-5xl font-bold leading-tight tracking-tight sm:text-7xl lg:text-8xl"
        >
          think.
        </motion.h2>
        <motion.p
          style={{ y: y2 }}
          className="mx-auto mt-8 max-w-xl text-base text-white/40 sm:text-lg"
        >
          Code as craft. Design as language. Strategy as the thread between them.
        </motion.p>
      </motion.div>
    </section>
  );
}
