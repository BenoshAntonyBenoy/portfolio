import { liveSites } from "@/lib/data";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-white/5 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-sm text-white/40 sm:flex-row">
        <p className="font-mono">
          © {year} Benosh Benoy. All rights reserved.
        </p>
        <nav className="flex items-center gap-5 font-mono text-xs">
          {liveSites.map((site) => (
            <a
              key={site.href}
              href={site.href}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-white/80"
            >
              {site.domain} ↗
            </a>
          ))}
        </nav>
        <p className="flex items-center gap-2">
          Made with
          <span className="text-white/70">Next.js</span>+
          <span className="text-white/70">Three.js</span>
          <span className="ml-1 h-1.5 w-1.5 animate-pulse-glow rounded-full bg-neon-cyan" />
        </p>
      </div>
    </footer>
  );
}
