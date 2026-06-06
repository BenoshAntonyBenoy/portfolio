"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  Float,
  MeshDistortMaterial,
  Sparkles,
  Sphere,
} from "@react-three/drei";
import { ComponentRef, Suspense, useRef } from "react";
import * as THREE from "three";

function Blob() {
  const mesh = useRef<THREE.Mesh>(null);
  // Infer the drei material instance type (exposes the mutable `distort` uniform).
  const matRef = useRef<ComponentRef<typeof MeshDistortMaterial>>(null);

  useFrame((state) => {
    if (!mesh.current) return;
    const { pointer, clock } = state;
    const t = clock.getElapsedTime();

    // Smooth mouse parallax — ease the blob toward the cursor.
    const targetX = pointer.y * 0.35;
    const targetY = pointer.x * 0.5;
    mesh.current.rotation.x = THREE.MathUtils.lerp(
      mesh.current.rotation.x,
      targetX,
      0.05,
    );
    mesh.current.rotation.y = THREE.MathUtils.lerp(
      mesh.current.rotation.y,
      targetY + t * 0.15,
      0.05,
    );

    // Breathing distortion — a clear, smooth morph that swells and settles,
    // nudged a little more open as the cursor moves away from center.
    if (matRef.current) {
      const dist = Math.hypot(pointer.x, pointer.y);
      matRef.current.distort = 0.55 + Math.sin(t * 1.1) * 0.12 + dist * 0.08;
    }
  });

  return (
    <Float speed={1.6} rotationIntensity={0.5} floatIntensity={0.9}>
      <Sphere ref={mesh} args={[1.3, 256, 256]}>
        <MeshDistortMaterial
          ref={matRef}
          color="#7c3aed"
          attach="material"
          distort={0.55}
          speed={2.6}
          roughness={0.12}
          metalness={0.85}
          emissive="#4c1d95"
          emissiveIntensity={0.5}
        />
      </Sphere>
    </Float>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.25} />
      {/* Cyan key from upper-right, magenta rim from lower-left, purple fill on top —
          colored speculars wrap the metal so it reads with depth, not flat purple. */}
      <directionalLight position={[4, 3, 5]} intensity={2.4} color="#22d3ee" />
      <pointLight position={[-5, -3, -2]} intensity={6} color="#ec4899" />
      <pointLight position={[2, 4, 3]} intensity={4} color="#a855f7" />
      <pointLight position={[-3, 2, 4]} intensity={3} color="#22d3ee" />
      {/* Image-based reflections add real highlights to the gloss. Isolated in
          its own Suspense so a slow/failed HDR fetch never blocks the blob. */}
      <Suspense fallback={null}>
        <Environment preset="night" />
      </Suspense>
      <Blob />
      <Sparkles
        count={40}
        scale={6}
        size={2.5}
        speed={0.3}
        opacity={0.5}
        color="#22d3ee"
      />
    </>
  );
}

export default function NeonBlob() {
  return (
    <Canvas
      camera={{ position: [0, 0, 4], fov: 45 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      // Allow vertical scroll gestures to pass through to the page so a finger
      // on the blob doesn't trap the user on the hero. Mouse parallax (desktop)
      // is unaffected — touch-action only governs touch input.
      className="!touch-pan-y"
    >
      <Scene />
    </Canvas>
  );
}
