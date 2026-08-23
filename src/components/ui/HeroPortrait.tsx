/**
 * The hero portrait — a background-removed cutout standing in front of an arch.
 *
 * Two things make this read as composed rather than as a photo dropped into a
 * box. The figure is taller than the arch, so his head and shoulders cross its
 * top edge instead of sitting politely inside it; and his base lands exactly on
 * the arch's bottom rule, which turns the cutout's hard mid-torso crop into a
 * deliberate baseline he's standing on.
 *
 * The arch is the only curve on a page of square corners. That's the point — one
 * deliberate shape reads as a decision, where rounding everything reads as a
 * default.
 */
export default function HeroPortrait() {
  return (
    <div className="relative flex h-full w-full items-end justify-center">
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 top-[20%] rounded-t-full border border-line bg-gradient-to-b from-transparent via-lichen/[0.06] to-lichen/[0.16]"
      />

      {/* 95% rather than full height, which keeps him narrower than the arch so
          only his head crosses it. At full height his shoulders overhung both
          sides too and the whole thing read as overflow, not as a break.
          No `max-w-none` here: it removes the default max-width:100% guard, and
          the img's intrinsic width then inflates the grid track it sits in. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/me-cutout.webp"
        alt="Benosh Benoy"
        className="relative h-[95%] w-auto object-contain object-bottom"
      />
    </div>
  );
}
