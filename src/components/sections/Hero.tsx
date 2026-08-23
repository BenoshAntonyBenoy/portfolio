"use client";

import { motion } from "framer-motion";
import PortalButtons from "@/components/ui/PortalButtons";
import HeroPortrait from "@/components/ui/HeroPortrait";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col overflow-hidden"
    >
      <div className="flex flex-1 items-center">
        {/* Weighted toward the copy. The 3D canvas used to want all the room it
            could get; a photograph caps at 19rem, so the slack goes to the text
            — which also stops the portal tiles squeezing their domain labels
            into an ellipsis between md and lg. */}
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-8 px-6 pb-16 pt-28 md:grid-cols-[1.3fr_0.7fr] md:gap-12 md:pb-20 md:pt-24">
          {/* Left — copy. Centred on phones, where a single column reads better
              centred and the left-aligned stack felt cramped. */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="text-center md:text-left"
          >
            <motion.p
              variants={item}
              className="label flex items-center justify-center gap-2.5 text-bone-mute md:justify-start"
            >
              <span className="h-1 w-1 animate-pulse rounded-full bg-lichen" />
              Available for collaborations
            </motion.p>

            {/* One weight, two styles. The italic surname is the whole
                typographic idea — it does the job the old animated gradient
                was doing, without the shimmer. */}
            <motion.h1
              variants={item}
              className="mt-7 font-display text-[3.5rem] leading-[0.92] tracking-[-0.02em] sm:text-7xl lg:text-[5.5rem]"
            >
              Benosh
              <br />
              <span className="italic text-lichen">Benoy</span>
            </motion.h1>

            <motion.p
              variants={item}
              className="mx-auto mt-7 max-w-md text-[0.975rem] leading-relaxed text-bone-dim md:mx-0"
            >
              <span className="text-bone">
                Developer. Designer. Strategist.
              </span>
              <br />
              Computer Science student. Building things at the intersection of
              code, AI, and design.
            </motion.p>

            <motion.p
              variants={item}
              className="label mt-10 text-bone-mute"
            >
              My sites
            </motion.p>

            {/* PortalButtons owns its own entrance stagger, so no variant wrapper. */}
            <div className="mt-4">
              <PortalButtons />
            </div>

            <motion.div
              variants={item}
              className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm md:justify-start"
            >
              <a
                href="#projects"
                className="border-b border-line-strong pb-0.5 text-bone transition-colors hover:border-lichen hover:text-lichen"
              >
                Scroll my work
              </a>
              <a
                href="#contact"
                className="text-bone-dim transition-colors hover:text-bone"
              >
                Get in touch
              </a>
            </motion.div>
          </motion.div>

          {/* Right — the portrait. The bottom fade mask that used to live here
              is gone with the avatar: it existed only to hide where the 3D
              model's torso was cut off, and it ate the framed photo's border. */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            // Taller than square: the arch and the standing figure both want
            // vertical room, and a square slot squashed the arch into a dome.
            // Phones get a much smaller portrait — a full-width one pushed the
            // portal buttons and the scroll cue far apart.
            // min-w-0 so the portrait's own width can't inflate this grid track
            // and steal room from the copy — that squeezed the portal tiles
            // until their domain labels ellipsised.
            className="relative mx-auto aspect-[4/5] w-full min-w-0 max-w-[190px] md:max-w-[21rem]"
          >
            <HeroPortrait />
          </motion.div>
        </div>
      </div>

      {/* Bottom rail — the metadata gets a real structural home instead of
          floating loose under the copy. */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="border-t border-line"
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-5">
          <div className="label flex items-center gap-4 text-bone-mute sm:gap-7">
            <span>Kerala, India</span>
            <span className="hidden h-2.5 w-px bg-line-strong sm:block" />
            <span className="hidden sm:block">MBCET</span>
          </div>

          <a
            href="#about"
            className="label group flex items-center gap-3 text-bone-mute transition-colors hover:text-bone"
          >
            Scroll
            <span className="flex h-7 w-4 justify-center border border-line-strong pt-1 transition-colors group-hover:border-lichen">
              <span className="h-1 w-px animate-scroll-cue bg-lichen" />
            </span>
          </a>
        </div>
      </motion.div>
    </section>
  );
}
