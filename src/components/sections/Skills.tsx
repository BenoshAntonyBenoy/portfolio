"use client";

import { motion } from "framer-motion";
import Reveal from "@/components/ui/Reveal";
import { skills } from "@/lib/data";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function Skills() {
  return (
    <section id="skills" className="relative mx-auto max-w-6xl px-6 py-28">
      {/* faint constellation lines */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(34,211,238,0.06),transparent_60%)]" />

      <Reveal>
        <p className="mb-3 font-mono text-sm text-neon-cyan">
          {"// the toolkit"}
        </p>
        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Skills &amp; <span className="text-gradient">tools</span>
        </h2>
        <p className="mt-4 max-w-lg text-white/50">
          A constellation of the things I build with — hover to light them up.
        </p>
      </Reveal>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
      >
        {skills.map((skill) => {
          const Icon = skill.icon;
          return (
            <motion.div
              key={skill.name}
              variants={item}
              whileHover={{ y: -6 }}
              className="group relative flex flex-col items-center gap-4 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-8 transition-colors duration-300 hover:border-white/20"
              style={{ ["--accent" as string]: skill.color }}
            >
              {/* glow that blooms on hover */}
              <div
                className="absolute inset-0 -z-10 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-30"
                style={{ background: skill.color }}
              />
              <Icon className="skill-icon text-4xl" />
              <span className="text-sm font-medium text-white/60 transition-colors group-hover:text-white">
                {skill.name}
              </span>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
