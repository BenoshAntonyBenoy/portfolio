"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// WebGL + a 1.1MB avatar is desktop-only weight, and there's no cursor to follow
// on a phone anyway — so the 3D chunk is never even requested below md.
const AvatarScene = dynamic(() => import("./AvatarScene"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full animate-pulse-glow rounded-full bg-radial-fade" />
  ),
});

export default function HeroVisual() {
  const [use3D, setUse3D] = useState(false);

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 768px)");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setUse3D(wide.matches && !still.matches);

    update();
    wide.addEventListener("change", update);
    still.addEventListener("change", update);
    return () => {
      wide.removeEventListener("change", update);
      still.removeEventListener("change", update);
    };
  }, []);

  if (use3D) return <AvatarScene />;

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="relative aspect-square w-[70%] max-w-xs overflow-hidden rounded-full border border-white/10">
        <div className="absolute inset-0 -z-10 bg-radial-fade" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/me.png"
          alt="Benosh Benoy"
          className="h-full w-full object-cover [object-position:50%_20%]"
        />
      </div>
    </div>
  );
}
