"use client";

import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import { content } from "@/lib/content";
import { skillIcon } from "@/lib/icons";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function Skills() {
  const skills = content.skills;

  return (
    <section
      id="skills"
      className="relative mx-auto max-w-6xl px-6 py-24 md:py-32"
    >
      <SectionHeading heading={skills.heading} />

      {/* Grouped columns of hairline-separated rows. The old version was eight
          identical cards that each bloomed a different colour on hover — the
          colour was carrying no information, so it's gone.

          A group with nothing in it is skipped rather than left as an empty
          column: renaming a group in the panel without moving its skills across
          would otherwise leave a labelled void in the grid. */}
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="mt-16 grid grid-cols-1 gap-x-12 gap-y-12 sm:grid-cols-2 lg:grid-cols-3"
      >
        {skills.groups.map((group) => {
          const members = skills.items.filter((s) => s.group === group);
          if (members.length === 0) return null;

          return (
            <div key={group}>
              <p className="label border-b border-line pb-3 text-bone-mute">
                {group}
              </p>
              <ul>
                {members.map((skill) => {
                  const Icon = skillIcon(skill.icon);
                  return (
                    <motion.li
                      key={skill.name}
                      variants={item}
                      className="group flex items-center gap-4 border-b border-line py-4"
                    >
                      <Icon className="shrink-0 text-lg text-bone-mute transition-colors duration-300 group-hover:text-lichen" />
                      <span className="text-[0.95rem] text-bone-dim transition-colors duration-300 group-hover:text-bone">
                        {skill.name}
                      </span>
                    </motion.li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </motion.div>
    </section>
  );
}
