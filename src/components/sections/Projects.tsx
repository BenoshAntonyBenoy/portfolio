"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { content, type Project } from "@/lib/content";

function ProjectShot({
  project,
  onFail,
}: {
  project: Project;
  onFail: () => void;
}) {
  return (
    // `contain`, not `cover`. These screenshots range from 1.98 (a wide desktop
    // window) to 0.46 (a portrait phone mockup); cover would crop the sides off
    // the wide ones and eat most of the phone. Contained and mounted on the
    // surface, each one shows whole and the plate does the composing.
    <div className="surface relative aspect-[3/2] w-full overflow-hidden p-3 sm:p-4">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={project.image}
        alt={`${project.title} interface`}
        onError={onFail}
        className="h-full w-full object-contain"
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
  // Fallback for a project with no screenshot, or one whose image fails to
  // load. Previously a neon-stroked numeral over a coloured radial glow; now
  // the numeral just is the composition.
  return (
    <div className="surface relative flex aspect-[3/2] w-full items-center justify-center overflow-hidden">
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
  // Lives on the row, not inside ProjectShot: the shot can't render its own
  // fallback, because a component that returns null on error just leaves an
  // empty cell where the visual should be.
  const [shotFailed, setShotFailed] = useState(false);
  const showShot = Boolean(project.image) && !shotFailed;

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
        {showShot ? (
          <ProjectShot project={project} onFail={() => setShotFailed(true)} />
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
      <SectionHeading heading={content.projects.heading} />

      <div className="mt-8">
        {content.projects.items.map((project, i) => (
          <ProjectRow key={project.title} project={project} index={i} />
        ))}
      </div>
    </section>
  );
}
