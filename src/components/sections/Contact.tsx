"use client";

import { motion } from "framer-motion";
import { HiOutlineMail, HiDownload } from "react-icons/hi";
import { FaLinkedinIn, FaGithub, FaDiscord } from "react-icons/fa6";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
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
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="surface surface-hover group flex items-center gap-5 p-5 focus:outline-none focus-visible:border-lichen"
    >
      <Icon className="shrink-0 text-lg text-bone-mute transition-colors duration-300 group-hover:text-lichen" />
      <span className="min-w-0 flex-1">
        <span className="label block text-bone-mute">{link.label}</span>
        {/* text-sm rather than 0.95rem so the longest value — the full email
            address — still fits the card at tablet widths instead of
            truncating the one thing someone came here to copy. */}
        <span className="mt-1.5 block truncate text-sm text-bone">
          {link.value}
        </span>
      </span>
      <span className="text-sm text-bone-mute transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-lichen">
        ↗
      </span>
    </motion.a>
  );
}

export default function Contact() {
  return (
    <section
      id="contact"
      className="relative mx-auto max-w-6xl px-6 py-24 md:py-32"
    >
      <SectionHeading
        index="06"
        label="Get in touch"
        title={
          <>
            Let&apos;s build something{" "}
            <span className="italic text-lichen">remarkable</span>
          </>
        }
        lede="Got an idea, a role, or just want to talk shop about AI, design, or chess? My inbox is open."
      />

      <div className="mt-16 grid grid-cols-1 gap-x-10 gap-y-10 md:grid-cols-[8rem_1fr]">
        {/* Empty rail keeps the content aligned under the section title. */}
        <div aria-hidden className="hidden md:block" />

        <div>
          <Reveal>
            {/* The single solid CTA on the page. It used to be a purple→cyan
                gradient pill, which is the one shape everyone recognises. */}
            <a
              href="/resume.pdf"
              download
              className="inline-flex items-center gap-3 bg-lichen px-7 py-3.5 text-[0.95rem] font-medium text-ink transition-colors hover:bg-bone"
            >
              <HiDownload className="text-lg" />
              Download Résumé
            </a>
          </Reveal>

          {/* Two-up only from lg. At tablet widths the rail already eats 9rem,
              which left the cards too narrow for a full email address. */}
          <div className="mt-10 grid grid-cols-1 gap-3 lg:grid-cols-2">
            {contactLinks.map((link, i) => (
              <LinkCard key={link.label} link={link} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
