"use client";

import { motion } from "framer-motion";
import Reveal from "@/components/ui/Reveal";
import { achievements } from "@/lib/data";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function Achievements() {
  return (
    <section id="beyond" className="relative overflow-hidden py-28">
      {/* giant ghost chess piece for the strategic-thinking theme */}
      <div className="pointer-events-none absolute -right-10 top-1/2 -z-10 -translate-y-1/2 select-none text-[40rem] leading-none text-white/[0.02]">
        ♟
      </div>
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_left,rgba(236,72,153,0.06),transparent_60%)]" />

      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <p className="mb-3 font-mono text-sm text-neon-cyan">
            {"// beyond code"}
          </p>
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Strategy, on and off the{" "}
            <span className="text-gradient">board</span>
          </h2>
          <p className="mt-4 max-w-lg text-white/50">
            The same thinking I bring to chess and markets shows up in how I
            build — patient, deliberate, a few moves ahead.
          </p>
        </Reveal>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {achievements.map((a) => (
            <motion.div
              key={a.title}
              variants={item}
              whileHover={{ y: -6 }}
              className="glass group relative overflow-hidden rounded-2xl p-7 transition-shadow duration-300 hover:shadow-glow-soft"
            >
              <div
                className="absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-20 blur-2xl transition-opacity group-hover:opacity-40"
                style={{ background: a.accent }}
              />
              <div
                className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl text-3xl"
                style={{
                  background: `${a.accent}1a`,
                  border: `1px solid ${a.accent}40`,
                }}
              >
                {a.icon}
              </div>
              <h3 className="text-lg font-semibold">{a.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/50">
                {a.detail}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
