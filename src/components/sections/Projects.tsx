"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import Reveal from "@/components/ui/Reveal";
import { projects, type Project } from "@/lib/data";

function ProjectMockup({ project }: { project: Project }) {
  // If a real screenshot is provided (and loads), show it inside the window
  // frame; otherwise fall back to the stylized gradient placeholder.
  const [imgFailed, setImgFailed] = useState(false);
  const showImage = Boolean(project.image) && !imgFailed;

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-white/10">
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 30% 20%, ${project.accent}55, transparent 55%), radial-gradient(circle at 80% 80%, #22d3ee33, transparent 50%), #0d0d14`,
        }}
      />

      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={project.image}
          alt={`${project.title} preview`}
          onError={() => setImgFailed(true)}
          className="absolute inset-0 h-full w-full rounded-2xl object-cover"
        />
      ) : (
        <>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-mono text-sm text-white/30">
              {project.title} — preview
            </span>
          </div>
          <div className="absolute inset-0 bg-grid-faint [background-size:32px_32px] opacity-40" />
        </>
      )}

      {/* fake browser chrome — kept on top so it frames the screenshot too */}
      <div className="absolute left-4 top-4 flex gap-2">
        <span className="h-3 w-3 rounded-full bg-white/20" />
        <span className="h-3 w-3 rounded-full bg-white/20" />
        <span className="h-3 w-3 rounded-full bg-white/20" />
      </div>
    </div>
  );
}

function ProjectVisual({ project, index }: { project: Project; index: number }) {
  // For projects without a screenshot — a big outlined number anchors the side,
  // wrapped in the same framed/grid/glow treatment as the preview window so the
  // layout rhythm stays consistent.
  return (
    <div className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-2xl border border-white/10">
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${project.accent}22, transparent 70%), #0d0d14`,
        }}
      />
      <div className="absolute inset-0 bg-grid-faint [background-size:40px_40px] opacity-25" />
      <div
        className="absolute h-40 w-40 rounded-full opacity-30 blur-3xl"
        style={{ background: project.accent }}
      />
      <span
        className="relative select-none font-mono text-[8rem] font-bold leading-none sm:text-[11rem]"
        style={{
          color: "transparent",
          WebkitTextStroke: `1.5px ${project.accent}99`,
        }}
      >
        0{index + 1}
      </span>
      <span className="absolute bottom-5 left-6 font-mono text-xs uppercase tracking-[0.3em] text-white/40">
        {project.tag}
      </span>
    </div>
  );
}

function ProjectRow({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reversed = index % 2 === 1;
  const hasWindow = index === 0;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["12%", "-12%"]);

  return (
    <div
      ref={ref}
      className="grid grid-cols-1 items-center gap-10 py-16 md:min-h-[80vh] md:grid-cols-2 md:gap-16"
    >
      {/* Visual side — preview window for project 01, stylized number otherwise */}
      <motion.div
        style={{ y }}
        initial={{ opacity: 0, x: reversed ? 40 : -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={`relative ${reversed ? "md:order-2" : "md:order-1"}`}
      >
        <div
          className="absolute -inset-6 -z-10 rounded-3xl opacity-40 blur-3xl"
          style={{ background: project.accent }}
        />
        {hasWindow ? (
          <ProjectMockup project={project} />
        ) : (
          <ProjectVisual project={project} index={index} />
        )}
      </motion.div>

      {/* Copy */}
      <div className={reversed ? "md:order-1" : "md:order-2"}>
        <Reveal>
          <div className="flex items-center gap-3">
            <span className="font-mono text-5xl font-bold text-white/10">
              0{index + 1}
            </span>
            <span
              className="rounded-full border px-3 py-1 text-xs font-medium"
              style={{
                color: project.accent,
                borderColor: `${project.accent}55`,
                background: `${project.accent}11`,
              }}
            >
              {project.tag}
            </span>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <h3 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            {project.title}
          </h3>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mt-4 max-w-md leading-relaxed text-white/55">
            {project.description}
          </p>
        </Reveal>
        <Reveal delay={0.3}>
          <div className="mt-6 flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <span
                key={t}
                className="rounded-md border border-white/10 bg-white/[0.03] px-3 py-1 font-mono text-xs text-white/60"
              >
                {t}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </div>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="relative mx-auto max-w-6xl px-6 py-28">
      <Reveal>
        <p className="mb-3 font-mono text-sm text-neon-cyan">
          {"// selected work"}
        </p>
        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Featured <span className="text-gradient">projects</span>
        </h2>
      </Reveal>

      <div className="mt-8">
        {projects.map((project, i) => (
          <ProjectRow key={project.title} project={project} index={i} />
        ))}
      </div>
    </section>
  );
}
