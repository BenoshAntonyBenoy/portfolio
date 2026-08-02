"use client";

import Reveal from "@/components/ui/Reveal";
import { liveSites, type LiveSite } from "@/lib/data";

function LiveCard({ site, index }: { site: LiveSite; index: number }) {
  return (
    <Reveal delay={index * 0.1} className="h-full">
      <a
        href={site.href}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-white/20"
      >
        {/* accent glow that warms up on hover */}
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-20 blur-3xl transition-opacity duration-300 group-hover:opacity-40"
          style={{ background: site.accent }}
        />

        <div className="flex items-center gap-3">
          <span
            className="rounded-full border px-3 py-1 text-xs font-medium"
            style={{
              color: site.accent,
              borderColor: `${site.accent}55`,
              background: `${site.accent}11`,
            }}
          >
            {site.tag}
          </span>
          <span className="flex items-center gap-1.5 font-mono text-xs text-white/40">
            <span
              className="h-1.5 w-1.5 animate-pulse-glow rounded-full"
              style={{ background: site.accent }}
            />
            online
          </span>
        </div>

        <h3 className="mt-5 text-2xl font-bold tracking-tight sm:text-3xl">
          {site.title}
        </h3>

        <p className="mt-3 flex-1 leading-relaxed text-white/55">
          {site.description}
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {site.tech.map((t) => (
            <span
              key={t}
              className="rounded-md border border-white/10 bg-white/[0.03] px-3 py-1 font-mono text-xs text-white/60"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="mt-7 flex items-center justify-between border-t border-white/5 pt-5">
          <span className="font-mono text-xs text-white/40">{site.domain}</span>
          <span
            className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-all"
            style={{
              color: site.accent,
              borderColor: `${site.accent}55`,
              background: `${site.accent}11`,
            }}
          >
            Open
            <span
              aria-hidden
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            >
              ↗
            </span>
          </span>
        </div>
      </a>
    </Reveal>
  );
}

export default function LiveSites() {
  return (
    <section id="live" className="relative mx-auto max-w-6xl px-6 py-28">
      <Reveal>
        <p className="mb-3 font-mono text-sm text-neon-cyan">{"// live now"}</p>
        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Try it <span className="text-gradient">yourself</span>
        </h2>
        <p className="mt-4 max-w-md text-white/55">
          Deployed and running — open either one in a new tab.
        </p>
      </Reveal>

      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
        {liveSites.map((site, i) => (
          <LiveCard key={site.href} site={site} index={i} />
        ))}
      </div>
    </section>
  );
}
