"use client";

import { motion } from "framer-motion";
import Reveal from "@/components/ui/Reveal";
import CountUp from "@/components/ui/CountUp";

const stats = [
  { to: 100, suffix: "+", label: "UI designs crafted" },
  {
    to: 1,
    suffix: "",
    label: "ML Models Trained",
    sub: "Regression models across multiple projects",
    display: "📊",
  },
  { to: 1, suffix: "", label: "Hackathon participant", display: "⚡" },
];

export default function About() {
  return (
    <section id="about" className="relative mx-auto max-w-6xl px-6 py-28">
      <Reveal>
        <p className="mb-3 font-mono text-sm text-neon-cyan">{"// about me"}</p>
        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Who&apos;s behind the <span className="text-gradient">pixels</span>?
        </h2>
      </Reveal>

      <div className="mt-14 grid grid-cols-1 items-center gap-12 md:grid-cols-[0.9fr_1.1fr]">
        {/* Photo placeholder with neon ring */}
        <Reveal>
          <div className="relative mx-auto aspect-square w-64 sm:w-80">
            <div className="absolute inset-0 animate-pulse-glow rounded-full bg-[conic-gradient(from_0deg,#a855f7,#22d3ee,#ec4899,#a855f7)] blur-md" />
            {/* Themed backdrop so any breathing room reads as an intentional vignette */}
            <div className="absolute inset-[3px] rounded-full bg-[radial-gradient(circle_at_50%_35%,#1a1230,#0a0a0f)]" />
            {/* Photo. `cover` fills the whole circle (cropping top/bottom as
                needed); backgroundPosition keeps the face roughly centered. */}
            <div
              role="img"
              aria-label="Benosh Benoy"
              className="absolute inset-[3px] rounded-full bg-no-repeat"
              style={{
                backgroundImage: "url(/me.png)",
                backgroundSize: "cover",
                backgroundPosition: "center 30%",
              }}
            />
            {/* floating accent dot */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-2 top-8 h-4 w-4 rounded-full bg-neon-cyan shadow-glow-cyan"
            />
          </div>
        </Reveal>

        {/* Bio */}
        <div>
          <Reveal delay={0.1}>
            <p className="text-lg leading-relaxed text-white/70">
              I&apos;m{" "}
              <span className="font-semibold text-white">Benosh Benoy</span>, a
              Computer Science student building at the intersection of code,
              design, and AI, currently studying at{" "}
              <span className="text-neon-purple">
                Mar Baselios College of Engineering and Technology
              </span>
              .
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-5 leading-relaxed text-white/50">
              I live where engineering meets aesthetics — writing code that
              works and interfaces that feel right. From Python tools to AI
              experiments to UI case studies, I care about the craft end to end,
              and I think about products strategically, not just visually.
            </p>
          </Reveal>
        </div>
      </div>

      {/* Stat cards */}
      <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.12}>
            <div className="glass group h-full rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-glow-soft">
              <div className="text-4xl font-bold text-gradient sm:text-5xl">
                {s.display ? (
                  s.display
                ) : (
                  <CountUp to={s.to} suffix={s.suffix} />
                )}
              </div>
              <p className="mt-3 text-sm text-white/50">{s.label}</p>
              {s.sub && (
                <p className="mt-1 text-xs text-white/30">{s.sub}</p>
              )}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
