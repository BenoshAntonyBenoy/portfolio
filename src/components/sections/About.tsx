"use client";

import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";

/**
 * These replaced a row of animated count-up "stat cards". Two of the three
 * counters were counting to 1, which is why they'd been swapped for emoji to
 * hide it — a fake metric is worse than a plain sentence. Same claims, stated
 * rather than animated.
 */
const facts = [
  { kicker: "Design", body: "100+ UI designs crafted." },
  {
    kicker: "Machine Learning",
    body: "Regression models trained across multiple projects.",
  },
  {
    kicker: "Building",
    body: "Multiple hackathons — prototypes shipped under deadline.",
  },
];

export default function About() {
  return (
    <section id="about" className="relative mx-auto max-w-6xl px-6 py-24 md:py-32">
      <SectionHeading
        index="01"
        label="About"
        title={
          <>
            Who&apos;s behind the <span className="italic text-lichen">work</span>?
          </>
        }
      />

      <div className="mt-16 grid grid-cols-1 items-start gap-10 md:grid-cols-[0.75fr_1.25fr] md:gap-14">
        {/* Portrait. A framed rectangle rather than a circle in a glowing conic
            ring — the ring was doing decoration, the frame does composition. */}
        <Reveal>
          <div className="relative mx-auto aspect-[4/5] w-56 border border-line sm:w-full sm:max-w-xs">
            <div
              role="img"
              aria-label="Benosh Benoy"
              className="absolute inset-0 bg-no-repeat"
              style={{
                backgroundImage: "url(/me.png)",
                backgroundSize: "cover",
                backgroundPosition: "center 25%",
              }}
            />
          </div>
        </Reveal>

        {/* Bio */}
        <div>
          <Reveal delay={0.1}>
            <p className="text-lg leading-relaxed text-bone-dim">
              I&apos;m <span className="text-bone">Benosh Benoy</span>, a
              Computer Science student building at the intersection of code,
              design, and AI, currently studying at{" "}
              <span className="text-bone">
                Mar Baselios College of Engineering and Technology
              </span>
              .
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-6 leading-relaxed text-bone-mute">
              I live where engineering meets aesthetics — writing code that
              works and interfaces that feel right. From Python tools to AI
              experiments to UI case studies, I care about the craft end to end,
              and I think about products strategically, not just visually.
            </p>
          </Reveal>

          <div className="mt-12 grid grid-cols-1 border-t border-line sm:grid-cols-3">
            {facts.map((f, i) => (
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
