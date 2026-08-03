"use client";

import { motion } from "framer-motion";
import PortalButtons from "@/components/ui/PortalButtons";
// Picks the 3D avatar or a static photo, and owns the client-only dynamic import.
import HeroVisual from "@/components/three/HeroVisual";

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

      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-6 px-6 pt-24 md:grid-cols-2 md:gap-8 md:pt-0">
        {/* Left — copy. Centred on phones, where a single column reads better
            centred and the left-aligned stack felt cramped. */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="text-center md:text-left"
        >
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
            className="mx-auto mt-5 max-w-md text-base text-white/60 md:mx-0 md:mt-6 md:text-lg"
          >
            <span className="text-white/90">Developer.</span>{" "}
            <span className="text-white/90">Designer.</span>{" "}
            <span className="text-white/90">Strategist.</span>
            <br />
            Computer Science student. Building things at the intersection of
            code, AI, and design.
          </motion.p>

          <motion.p
            variants={item}
            className="mt-7 font-mono text-[11px] uppercase tracking-[0.25em] text-white/35 md:mt-9"
          >
            My sites
          </motion.p>

          {/* PortalButtons owns its own entrance stagger, so no variant wrapper. */}
          <div className="mt-3">
            <PortalButtons />
          </div>

          <motion.div
            variants={item}
            className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm md:mt-6 md:justify-start"
          >
            <a
              href="#projects"
              className="font-semibold text-white/70 transition-colors hover:text-white"
            >
              Or scroll my work ↓
            </a>
            <span className="hidden h-3 w-px bg-white/15 sm:block" />
            <a
              href="#contact"
              className="text-white/50 transition-colors hover:text-neon-cyan"
            >
              Get in touch
            </a>
          </motion.div>

          <motion.div
            variants={item}
            className="mt-7 flex items-center justify-center gap-6 font-mono text-xs text-white/40 md:mt-10 md:justify-start"
          >
            <span>📍 Kerala, India</span>
            <span className="h-3 w-px bg-white/15" />
            <span>MBCET</span>
          </motion.div>
        </motion.div>

        {/* Right — 3D me, watching the cursor */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          // Phones get a much smaller portrait — a full-width square pushed the
          // portal buttons and the scroll cue far apart.
          className="relative mx-auto aspect-square w-full max-w-[220px] md:max-w-none"
        >
          {/* Layered ambient glow so the avatar sits in a pool of light. */}
          <div className="absolute inset-[-15%] -z-10 rounded-full bg-[radial-gradient(circle,rgba(168,85,247,0.45),transparent_60%)] blur-[90px]" />
          <div className="absolute inset-[5%] -z-10 rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.28),transparent_55%)] blur-[70px] animate-pulse-glow" />
          <HeroVisual />
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
