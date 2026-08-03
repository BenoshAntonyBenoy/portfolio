"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, Sparkles } from "@react-three/drei";
import { Suspense } from "react";
import Avatar from "./Avatar";
import PhotoDepth from "./PhotoDepth";
import { Blob } from "./NeonBlob";

// "photo" is your real photograph given depth and tilted toward the cursor —
// perfect likeness, subtle motion. "glb" is the Avaturn 3D avatar, which turns its
// head properly but only looks like you approximately. Swap the constant to switch.
const SUBJECT: "photo" | "glb" = "glb";

function Lights() {
  return (
    <>
      <ambientLight intensity={0.4} />

      {/* Key light kept low and frontal. High and steep was blowing out the
          forehead and dropping the eyes into brow shadow. */}
      <directionalLight position={[0.9, 1.1, 3.4]} intensity={1.6} />

      {/* Soft fill from slightly below lifts the eye sockets back out. */}
      <directionalLight position={[-0.6, -0.4, 2.6]} intensity={0.45} />

      {/* Neons as accents and rims, not as the main source. */}
      <directionalLight position={[3, 1.2, 1.5]} intensity={0.9} color="#22d3ee" />
      <pointLight position={[-2.4, 1.2, -0.8]} intensity={5} color="#ec4899" />
      {/* Above and behind: separates the hair from the background and gives the
          crown a specular sheen now that the hair isn't fully rough. */}
      <pointLight position={[0.4, 2.4, -1.4]} intensity={5.5} color="#c4b5fd" />
    </>
  );
}

export default function AvatarScene() {
  return (
    <Canvas
      // The photo plane is 1.55 tall and the rig's eye line sits at the origin, so
      // these two framings differ by roughly the plane's height.
      camera={{ position: [0, 0, SUBJECT === "photo" ? 3.3 : 1], fov: 30 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
      // Let vertical swipes scroll the page instead of being captured here.
      className="!touch-pan-y"
    >
      <Lights />

      {/* The blob is now a small glowing backdrop rather than the centrepiece. */}
      <group scale={0.45} position={[0, 0.05, -2.2]}>
        <Blob segments={96} />
      </group>

      <Suspense fallback={null}>
        <Environment preset="night" />
      </Suspense>

      <Suspense fallback={null}>
        {SUBJECT === "photo" ? <PhotoDepth /> : <Avatar />}
      </Suspense>

      <Sparkles
        count={30}
        scale={3}
        size={2}
        speed={0.3}
        opacity={0.45}
        color="#22d3ee"
      />
    </Canvas>
  );
}
