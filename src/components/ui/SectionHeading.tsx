import { ReactNode } from "react";

type SectionHeadingProps = {
  /** Two-digit index shown in the rail, e.g. "02". */
  index: string;
  label: string;
  title: ReactNode;
  lede?: ReactNode;
};

/**
 * Every section opens the same way: a hairline, a numbered rail, then the
 * title. Repeating a structure is what makes a page feel edited — it's
 * repeating decoration (a glow per section, a gradient per heading) that made
 * the old layout feel stamped out.
 */
export default function SectionHeading({
  index,
  label,
  title,
  lede,
}: SectionHeadingProps) {
  return (
    <header className="grid gap-x-10 gap-y-6 border-t border-line pt-7 md:grid-cols-[9rem_1fr]">
      {/* Stacked rather than "02 / SELECTED WORK" on one line — the longer
          labels wrapped mid-phrase inside the rail. */}
      <div className="label flex gap-3 md:block">
        <span className="text-lichen">{index}</span>
        <span className="text-bone-mute md:mt-2.5 md:block">{label}</span>
      </div>

      <div>
        <h2 className="max-w-2xl text-balance text-[2.25rem] leading-[1.08] sm:text-5xl lg:text-[3.5rem]">
          {title}
        </h2>
        {lede && (
          <p className="mt-5 max-w-lg leading-relaxed text-bone-dim">{lede}</p>
        )}
      </div>
    </header>
  );
}
