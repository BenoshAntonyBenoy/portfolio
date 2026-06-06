"use client";

import { motion } from "framer-motion";
import { HiOutlineMail, HiDownload } from "react-icons/hi";
import { FaLinkedinIn, FaGithub, FaDiscord } from "react-icons/fa6";
import Reveal from "@/components/ui/Reveal";
import { contactLinks, type ContactLink } from "@/lib/data";

const iconMap = {
  email: HiOutlineMail,
  linkedin: FaLinkedinIn,
  github: FaGithub,
  discord: FaDiscord,
} as const;

function LinkCard({ link, index }: { link: ContactLink; index: number }) {
  const Icon = iconMap[link.iconName];
  const external = link.iconName !== "email";
  return (
    <motion.a
      href={link.href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ y: -6 }}
      className="glass group flex items-center gap-5 rounded-2xl p-6 transition-all duration-300 hover:border-neon-purple/40 hover:shadow-glow-soft"
    >
      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white/[0.04] text-2xl text-white/70 transition-all duration-300 group-hover:bg-neon-purple/20 group-hover:text-white">
        <Icon />
      </span>
      <span className="min-w-0">
        <span className="block text-xs uppercase tracking-widest text-white/40">
          {link.label}
        </span>
        <span className="block truncate text-lg font-medium text-white/90">
          {link.value}
        </span>
      </span>
      <span className="ml-auto text-white/20 transition-all duration-300 group-hover:translate-x-1 group-hover:text-neon-cyan">
        ↗
      </span>
    </motion.a>
  );
}

export default function Contact() {
  return (
    <section
      id="contact"
      className="relative flex min-h-screen flex-col justify-center overflow-hidden py-28"
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(168,85,247,0.18),transparent_60%)] blur-3xl" />
        <div className="absolute inset-0 bg-grid-faint [background-size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
      </div>

      <div className="mx-auto w-full max-w-4xl px-6 text-center">
        <Reveal>
          <p className="mb-3 font-mono text-sm text-neon-cyan">
            {"// the destination"}
          </p>
          <h2 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Let&apos;s build something{" "}
            <span className="text-gradient-animated">remarkable</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-white/50">
            Got an idea, a role, or just want to talk shop about AI, design, or
            chess? My inbox is open.
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <a
            href="/resume.pdf"
            download
            className="mt-10 inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-neon-purple to-neon-cyan px-8 py-4 text-base font-semibold text-ink transition-transform hover:scale-[1.03]"
          >
            <HiDownload className="text-xl" />
            Download Résumé
          </a>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-4 text-left sm:grid-cols-2">
          {contactLinks.map((link, i) => (
            <LinkCard key={link.label} link={link} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
