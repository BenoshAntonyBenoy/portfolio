import AccentText from "@/components/ui/AccentText";
import type { Heading } from "@/lib/content";

/**
 * Every section opens the same way: a hairline, a numbered rail, then the
 * title. Repeating a structure is what makes a page feel edited — it's
 * repeating decoration (a glow per section, a gradient per heading) that made
 * the old layout feel stamped out.
 *
 * Takes the whole heading object straight out of content.json rather than four
 * separate props, so adding a field to a heading never means touching six
 * call sites.
 */
export default function SectionHeading({ heading }: { heading: Heading }) {
  return (
    <header className="grid gap-x-10 gap-y-6 border-t border-line pt-7 md:grid-cols-[9rem_1fr]">
      {/* Stacked rather than "02 / SELECTED WORK" on one line — the longer
          labels wrapped mid-phrase inside the rail. */}
      <div className="label flex gap-3 md:block">
        <span className="text-lichen">{heading.index}</span>
        <span className="text-bone-mute md:mt-2.5 md:block">
          {heading.label}
        </span>
      </div>

      <div>
        <h2 className="max-w-2xl text-balance text-[2.25rem] leading-[1.08] sm:text-5xl lg:text-[3.5rem]">
          <AccentText value={heading.title} />
        </h2>
        {heading.lede ? (
          <p className="mt-5 max-w-lg leading-relaxed text-bone-dim">
            {heading.lede}
          </p>
        ) : null}
      </div>
    </header>
  );
}
