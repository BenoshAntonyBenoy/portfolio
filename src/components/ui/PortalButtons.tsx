"use client";

import { liveSites } from "@/lib/data";

/**
 * The big front-page portal buttons — one per live site. Sized to be the first
 * thing you reach for on benosh.tech, and to stay tappable on a phone.
 */
export default function PortalButtons() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {liveSites.map((site) => (
        <a
          key={site.href}
          href={site.href}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex min-h-[132px] flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.06]"
        >
          {/* accent wash + glow, both intensify on hover */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.07] transition-opacity duration-300 group-hover:opacity-[0.16]"
            style={{
              background: `radial-gradient(circle at 15% 0%, ${site.accent}, transparent 70%)`,
            }}
          />
          <div
            className="pointer-events-none absolute -bottom-12 -right-10 h-36 w-36 rounded-full opacity-20 blur-3xl transition-opacity duration-300 group-hover:opacity-50"
            style={{ background: site.accent }}
          />

          <div className="relative flex items-start justify-between gap-3">
            <span className="text-2xl font-bold tracking-tight sm:text-3xl">
              {site.title}
            </span>
            <span
              aria-hidden
              className="text-lg transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              style={{ color: site.accent }}
            >
              ↗
            </span>
          </div>

          <div className="relative mt-4 flex items-center gap-2 font-mono text-[11px] text-white/45">
            <span
              className="h-1.5 w-1.5 animate-pulse-glow rounded-full"
              style={{ background: site.accent }}
            />
            {site.domain}
          </div>

          <span className="relative mt-2 text-sm font-semibold text-white/70 transition-colors group-hover:text-white">
            Open site →
          </span>
        </a>
      ))}
    </div>
  );
}
