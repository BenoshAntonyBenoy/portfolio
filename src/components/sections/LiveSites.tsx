"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import { content, type LiveSite } from "@/lib/content";

const categories = Array.from(new Set(content.liveSites.items.flatMap(site => site.category ? [site.category] : [])));

function WebsiteCard({ site, index }: { site: LiveSite; index: number }) {
  const local = site.availability === "local";
  const labels = content.liveSites.filters;
  const reducedMotion = useReducedMotion();
  return (
    <motion.article initial={reducedMotion ? false : { opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ duration: 0.3, delay: (index % 3) * 0.04 }}
      className="surface surface-hover flex min-w-0 flex-col p-6">
      <div className="label-tight flex flex-wrap items-center justify-between gap-3 text-bone-mute">
        <span>{site.tag}</span>
        <span className="flex items-center gap-2">
          <span aria-hidden className={`h-1 w-1 rounded-full ${local ? "bg-bone-dim" : "bg-lichen"}`} />
          {local ? labels.local : content.liveSites.onlineLabel}
        </span>
      </div>
      <h3 className="mt-6 font-display text-3xl leading-tight">{site.title}</h3>
      <p className="mt-4 flex-1 leading-relaxed text-bone-mute">{site.description}</p>
      <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-2">
        {site.tech.map(tech => <li key={tech} className="label-tight text-bone-dim">{tech}</li>)}
      </ul>
      <div className="mt-7 border-t border-line pt-5">
        {site.href ? (
          <a href={site.href} target="_blank" rel="noopener noreferrer"
            aria-label={`${site.title} — ${local ? labels.source : content.liveSites.openLabel}`}
            className="group flex min-h-11 items-center justify-between gap-3 text-sm text-bone transition-colors hover:text-lichen focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lichen">
            <span className="label-tight min-w-0 break-all text-bone-mute">{site.domain}</span>
            <span className="shrink-0">{local ? labels.source : content.liveSites.openLabel} <span aria-hidden>↗</span></span>
          </a>
        ) : <p className="label-tight flex min-h-11 items-center text-bone-dim">{labels.localAction}</p>}
      </div>
    </motion.article>
  );
}

export default function LiveSites() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const { items, filters } = content.liveSites;
  const search = query.trim().toLowerCase();
  const visible = items.filter(site => (!category || site.category === category) &&
    `${site.title} ${site.tag} ${site.domain} ${site.description} ${site.tech.join(" ")}`.toLowerCase().includes(search));

  return (
    <section id="websites" className="relative mx-auto max-w-6xl scroll-mt-24 px-6 py-24 md:py-32">
      <span id="live" className="absolute top-0" aria-hidden />
      <SectionHeading heading={content.liveSites.heading} />
      <div className="mt-10 flex flex-col gap-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <label className="flex w-full flex-col gap-2 sm:max-w-sm">
            <span className="label-tight text-bone-mute">{filters.search}</span>
            <input type="search" value={query} onChange={event => setQuery(event.target.value)}
              className="min-h-12 border border-line-strong bg-transparent px-4 text-bone focus:border-lichen focus:outline-none" />
          </label>
          <p role="status" aria-live="polite" className="label-tight text-bone-mute">{visible.length} / {items.length} {filters.count}</p>
        </div>
        <div role="group" aria-label={content.liveSites.heading.label} className="flex flex-wrap gap-2">
          {[{value:"", label:filters.all}, ...categories.map(value => ({value, label:value}))].map(option => (
            <button key={option.value} type="button" aria-pressed={category === option.value}
              onClick={() => setCategory(option.value)}
              className={`min-h-11 border px-4 py-2 text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lichen ${category === option.value ? "border-lichen bg-lichen text-ink" : "border-line-strong text-bone-mute hover:border-lichen hover:text-bone"}`}>
              {option.label}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {visible.map((site, index) => <WebsiteCard key={site.title} site={site} index={index} />)}
      </div>
      {visible.length === 0 && <p className="surface mt-8 p-8 text-bone-mute">{filters.empty}</p>}
    </section>
  );
}
