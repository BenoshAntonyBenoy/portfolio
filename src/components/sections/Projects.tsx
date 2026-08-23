"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { projects, type Project } from "@/lib/data";

function ProjectShot({ project }: { project: Project }) {
  // If a real screenshot is provided (and loads), show it in a plain frame;
  // otherwise fall back to the typographic plate.
  const [imgFailed, setImgFailed] = useState(false);
  if (!project.image || imgFailed) return null;

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden border border-line bg-ink-raised">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={project.image}
        alt={`${project.title} preview`}
        onError={() => setImgFailed(true)}
        className="absolute inset-0 h-full w-full object-cover"
      />
    </div>
  );
}

function ProjectPlate({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  // For projects without a screenshot. Previously a neon-stroked numeral over a
  // coloured radial glow; now the numeral just is the composition.
  return (
    <div className="surface relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden">
      <span className="select-none font-display text-[9rem] leading-none text-bone/[0.07] sm:text-[12rem]">
        {String(index + 1).padStart(2, "0")}
      </span>
      <span className="label absolute bottom-5 left-5 text-bone-mute">
        {project.tag}
      </span>
    </div>
  );
}

function ProjectRow({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reversed = index % 2 === 1;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["8%", "-8%"]);

  return (
    <div
      ref={ref}
      className="grid grid-cols-1 items-center gap-8 border-b border-line py-14 md:grid-cols-2 md:gap-16 md:py-20"
    >
      {/* Visual side */}
      <motion.div
        style={{ y }}
        initial={{ opacity: 0, x: reversed ? 32 : -32 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={reversed ? "md:order-2" : "md:order-1"}
      >
        {project.image ? (
          <ProjectShot project={project} />
        ) : (
          <ProjectPlate project={project} index={index} />
        )}
      </motion.div>

      {/* Copy */}
      <div className={reversed ? "md:order-1" : "md:order-2"}>
        <Reveal>
          <div className="label flex items-center gap-3 text-bone-mute">
            <span className="text-lichen">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="h-2.5 w-px bg-line-strong" />
            {project.tag}
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <h3 className="mt-5 max-w-md text-balance font-display text-3xl leading-[1.1] sm:text-[2.5rem]">
            {project.title}
          </h3>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mt-5 max-w-md leading-relaxed text-bone-mute">
            {project.description}
          </p>
        </Reveal>
        <Reveal delay={0.3}>
          <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-2">
            {project.tech.map((t) => (
              <li key={t} className="label text-bone-dim">
                {t}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </div>
  );
}

export default function Projects() {
  return (
    <section
      id="projects"
      className="relative mx-auto max-w-6xl px-6 py-24 md:py-32"
    >
      <SectionHeading
        index="02"
        label="Selected work"
        title={
          <>
            Featured <span className="italic text-lichen">projects</span>
          </>
        }
      />

      <div className="mt-8">
        {projects.map((project, i) => (
          <ProjectRow key={project.title} project={project} index={i} />
        ))}
      </div>
    </section>
  );
}
