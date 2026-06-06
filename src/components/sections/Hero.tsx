"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";

// Three.js / R3F is client-only — load the Canvas without SSR.
const NeonBlob = dynamic(() => import("@/components/three/NeonBlob"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full animate-pulse-glow rounded-full bg-radial-fade" />
  ),
});

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center overflow-hidden"
    >
      {/* Backdrop layers */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid-faint [background-size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-radial-fade blur-2xl" />
        <div className="absolute -right-20 top-1/4 h-72 w-72 rounded-full bg-neon-cyan/10 blur-[120px]" />
        <div className="absolute -left-20 bottom-1/4 h-72 w-72 rounded-full bg-neon-magenta/10 blur-[120px]" />
      </div>

      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-8 px-6 pt-28 md:grid-cols-2 md:pt-0">
        {/* Left — copy */}
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.p
            variants={item}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs text-white/70"
          >
            <span className="h-1.5 w-1.5 animate-pulse-glow rounded-full bg-neon-cyan" />
            Available for collaborations
          </motion.p>

          <motion.h1
            variants={item}
            className="text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl"
          >
            Benosh
            <br />
            <span className="text-gradient-animated">Benoy</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-6 max-w-md text-lg text-white/60"
          >
            <span className="text-white/90">Developer.</span>{" "}
            <span className="text-white/90">Designer.</span>{" "}
            <span className="text-white/90">Strategist.</span>
            <br />
            Computer Science student. Building things at the intersection of
            code, AI, and design.
          </motion.p>

          <motion.div variants={item} className="mt-9 flex flex-wrap gap-4">
            <a
              href="#projects"
              className="group relative overflow-hidden rounded-full bg-gradient-to-r from-neon-purple to-neon-cyan px-6 py-3 text-sm font-semibold text-ink transition-transform hover:scale-[1.03]"
            >
              View my work
            </a>
            <a
              href="#contact"
              className="rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white/90 transition-all hover:border-neon-cyan/50 hover:bg-white/5 hover:shadow-glow-cyan"
            >
              Get in touch
            </a>
          </motion.div>

          <motion.div
            variants={item}
            className="mt-10 flex items-center gap-6 font-mono text-xs text-white/40"
          >
            <span>📍 Kerala, India</span>
            <span className="h-3 w-px bg-white/15" />
            <span>MBCET</span>
          </motion.div>
        </motion.div>

        {/* Right — 3D blob */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="relative mx-auto aspect-square w-full max-w-md md:max-w-none"
        >
          {/* Layered ambient glow so the blob sits in a pool of light. */}
          <div className="absolute inset-[-15%] -z-10 rounded-full bg-[radial-gradient(circle,rgba(168,85,247,0.45),transparent_60%)] blur-[90px]" />
          <div className="absolute inset-[5%] -z-10 rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.28),transparent_55%)] blur-[70px] animate-pulse-glow" />
          <NeonBlob />
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-white/40 transition-colors hover:text-white/80"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.2em]">
          Scroll
        </span>
        <span className="flex h-9 w-5 justify-center rounded-full border border-white/20 pt-1.5">
          <span className="h-1.5 w-1 animate-scroll-cue rounded-full bg-neon-cyan" />
        </span>
      </motion.a>
    </section>
  );
}
