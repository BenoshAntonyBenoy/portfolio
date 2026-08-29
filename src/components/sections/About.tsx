"use client";

import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import AccentText from "@/components/ui/AccentText";
import { content } from "@/lib/content";

export default function About() {
  const about = content.about;

  return (
    <section
      id="about"
      className="relative mx-auto max-w-6xl px-6 py-24 md:py-32"
    >
      <SectionHeading heading={about.heading} />

      <div className="mt-16 grid grid-cols-1 items-start gap-10 md:grid-cols-[0.75fr_1.25fr] md:gap-14">
        {/* Portrait. A framed rectangle rather than a circle in a glowing conic
            ring — the ring was doing decoration, the frame does composition. */}
        <Reveal>
          <div className="relative mx-auto aspect-[4/5] w-56 border border-line sm:w-full sm:max-w-xs">
            <div
              role="img"
              aria-label={about.portrait.alt}
              className="absolute inset-0 bg-no-repeat"
              style={{
                backgroundImage: `url(${about.portrait.src})`,
                backgroundSize: "cover",
                backgroundPosition: about.portrait.position,
              }}
            />
          </div>
        </Reveal>

        {/* Bio. First paragraph is the lead — larger and brighter; the rest are
            body copy. Anything after the second is styled like the second. */}
        <div>
          {about.bio.map((paragraph, i) => (
            <Reveal key={i} delay={0.1 + i * 0.1}>
              <p
                className={
                  i === 0
                    ? "text-lg leading-relaxed text-bone-dim"
                    : "mt-6 leading-relaxed text-bone-mute"
                }
              >
                <AccentText value={paragraph} />
              </p>
            </Reveal>
          ))}

          {/* These replaced a row of animated count-up "stat cards". Two of the
              three counters were counting to 1, which is why they'd been
              swapped for emoji to hide it — a fake metric is worse than a plain
              sentence. Same claims, stated rather than animated. */}
          <div className="mt-12 grid grid-cols-1 border-t border-line sm:grid-cols-3">
            {about.facts.map((f, i) => (
              <Reveal key={f.kicker} delay={i * 0.1}>
                <div className="h-full border-b border-line py-6 pr-6 sm:border-b-0 sm:border-l sm:py-0 sm:pl-6 sm:pt-6 sm:first:border-l-0 sm:first:pl-0">
                  <p className="label text-lichen">{f.kicker}</p>
                  <p className="mt-3 text-sm leading-relaxed text-bone-dim">
                    {f.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
