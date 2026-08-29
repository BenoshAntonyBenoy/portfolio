import { content, liveSites } from "@/lib/content";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line py-10">
      {/* Tracking is dialled back from the shared .label value and every item is
          nowrap — at 0.18em the four items broke mid-phrase ("© 2026 BENOSH /
          BENOY") instead of wrapping as units. */}
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-3 px-6 sm:justify-between">
        <p className="label-tight whitespace-nowrap text-bone-mute">
          © {year} {content.footer.name}
        </p>

        <nav className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {liveSites.map((site) => (
            <a
              key={site.href}
              href={site.href}
              target="_blank"
              rel="noopener noreferrer"
              className="label-tight whitespace-nowrap text-bone-mute transition-colors hover:text-bone"
            >
              {site.domain} ↗
            </a>
          ))}
        </nav>

        {/* Was "Next.js + Three.js" — there's no Three.js left in the bundle. */}
        <p className="label-tight whitespace-nowrap text-bone-mute">
          {content.footer.builtWith}
        </p>
      </div>
    </footer>
  );
}
