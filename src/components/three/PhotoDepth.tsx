"use client";

import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useLayoutEffect, useRef } from "react";
import * as THREE from "three";
import { useWindowCursor } from "./useWindowCursor";

const PHOTO = "/avatar/me-photo.webp";
const DEPTH = "/avatar/me-depth.png";
const MASK = "/avatar/me-mask.png";

// Photo is 1141×1415.
const ASPECT = 1141 / 1415;
const HEIGHT = 1.55;

// How far the near pixels stand off the far ones. Past ~0.3 the silhouette starts
// to tear, because displaced geometry can't invent what's hidden behind a head.
const RELIEF = 0.22;

// Deflection at the window edges. Deliberately small — this is a photo leaning
// toward the cursor, not a head turning, and it distorts if pushed.
const MAX_TILT_X = 0.11; // rad, ~6°
const MAX_TILT_Y = 0.16; // rad, ~9°

export default function PhotoDepth() {
  const cursor = useWindowCursor();
  const mesh = useRef<THREE.Mesh>(null);
  const [photo, depth, mask] = useTexture([PHOTO, DEPTH, MASK]);

  useLayoutEffect(() => {
    // The photo is colour; depth and mask are data, so they must stay linear.
    photo.colorSpace = THREE.SRGBColorSpace;
    depth.colorSpace = THREE.NoColorSpace;
    mask.colorSpace = THREE.NoColorSpace;
    photo.anisotropy = 4;
  }, [photo, depth, mask]);

  useFrame((_, dt) => {
    if (!mesh.current) return;
    const ease = Math.min(1, dt * 4);
    const targetY = cursor.current.x * MAX_TILT_Y;
    const targetX = cursor.current.y * MAX_TILT_X;

    mesh.current.rotation.y += (targetY - mesh.current.rotation.y) * ease;
    mesh.current.rotation.x += (targetX - mesh.current.rotation.x) * ease;
    // A touch of counter-drift sells the parallax beyond the rotation alone.
    mesh.current.position.x += (-cursor.current.x * 0.04 - mesh.current.position.x) * ease;
  });

  return (
    <mesh ref={mesh}>
      <planeGeometry args={[HEIGHT * ASPECT, HEIGHT, 180, 220]} />
      {/* Black base + white emissive shows the photo at its own brightness instead
          of relighting it with the scene's neon rig. Depth displaces the geometry;
          the mask (thresholded from that same depth) cuts the conference backdrop
          away and fades the torso out at the bottom. */}
      <meshStandardMaterial
        color="#000000"
        emissive="#ffffff"
        emissiveMap={photo}
        emissiveIntensity={1}
        displacementMap={depth}
        displacementScale={RELIEF}
        displacementBias={-RELIEF / 2}
        alphaMap={mask}
        transparent
        depthWrite={false}
        toneMapped={false}
        roughness={1}
        metalness={0}
      />
    </mesh>
  );
}

// Deliberately no `useTexture.preload` here: this component is the alternative to
// the GLB avatar, and a module-scope preload would fetch its textures on every
// visit even while SUBJECT is "glb". They load when it actually renders.
