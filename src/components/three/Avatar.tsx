"use client";

import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useWindowCursor } from "./useWindowCursor";

const MODEL = "/avatar/me.glb";

// Measured from the model: eye line sits at y≈1.72m, shoulders at ≈1.51m, and the
// face points down +Z. Lifting the rig by -EYE_HEIGHT puts the eyes on the origin,
// which is what the camera is aimed at.
const EYE_HEIGHT = 1.7;

// Share of the total look-at rotation per bone. Spreading it down the chain reads
// as a person turning toward you rather than a head pivoting on a stick.
const CHAIN = [
  { name: "Head", weight: 0.55 },
  { name: "Neck", weight: 0.3 },
  { name: "Spine2", weight: 0.15 },
];

const MAX_YAW = 0.55; // rad, ~31°
const MAX_PITCH = 0.32; // rad, ~18°

// The download is a T-pose, whose outstretched upper arms cut across the bottom of
// a head-and-shoulders shot. Drop them to a resting A-pose once, on load. Angles
// are about world Z and mirror per side (the rig's left arm points +X).
const REST_POSE: [string, number][] = [
  ["LeftArm", -1.25],
  ["RightArm", 1.25],
  ["LeftForeArm", -0.12],
  ["RightForeArm", 0.12],
];

type Tracked = {
  bone: THREE.Object3D;
  weight: number;
  /** Local rotation in the bind pose. */
  rest: THREE.Quaternion;
  /** Parent's world rotation in the bind pose, and its inverse. */
  parentWorld: THREE.Quaternion;
  parentWorldInv: THREE.Quaternion;
};

export default function Avatar() {
  const { scene } = useGLTF(MODEL);
  const cursor = useWindowCursor();
  const tracked = useRef<Tracked[]>([]);
  const aim = useRef({ yaw: 0, pitch: 0 });

  const delta = useMemo(() => new THREE.Quaternion(), []);
  const euler = useMemo(() => new THREE.Euler(0, 0, 0, "YXZ"), []);
  const next = useMemo(() => new THREE.Quaternion(), []);

  useEffect(() => {
    scene.updateWorldMatrix(true, true);

    // Same world-space trick as the look-at below, so the angles mean what they say
    // no matter how each bone is oriented internally.
    const axis = new THREE.Vector3(0, 0, 1);
    for (const [name, angle] of REST_POSE) {
      const bone = scene.getObjectByName(name);
      if (!bone?.parent) continue;
      const parentWorld = bone.parent.getWorldQuaternion(new THREE.Quaternion());
      const swing = new THREE.Quaternion().setFromAxisAngle(axis, angle);
      bone.quaternion.premultiply(
        parentWorld.clone().invert().multiply(swing).multiply(parentWorld),
      );
      // The forearm's parent just moved, so refresh before reading its world state.
      scene.updateWorldMatrix(true, true);
    }

    tracked.current = CHAIN.flatMap(({ name, weight }) => {
      const bone = scene.getObjectByName(name);
      if (!bone?.parent) return [];
      const parentWorld = bone.parent.getWorldQuaternion(new THREE.Quaternion());
      return [
        {
          bone,
          weight,
          rest: bone.quaternion.clone(),
          parentWorld,
          parentWorldInv: parentWorld.clone().invert(),
        },
      ];
    });

    // Skinned bounding spheres are computed from the bind pose, so a rotated head
    // can pop out of frame if we let three cull it.
    scene.traverse((o) => {
      o.frustumCulled = false;
    });
  }, [scene]);

  useFrame((state, dt) => {
    // Frame-rate independent easing, capped so a long frame can't overshoot.
    const ease = Math.min(1, dt * 4);

    // cursor.y is positive downward, and a positive pitch looks down — no flip.
    aim.current.yaw += (cursor.current.x * MAX_YAW - aim.current.yaw) * ease;
    aim.current.pitch += (cursor.current.y * MAX_PITCH - aim.current.pitch) * ease;

    // Idle drift so it never looks frozen when the cursor is still.
    const idle = Math.sin(state.clock.elapsedTime * 0.6) * 0.03;

    for (const b of tracked.current) {
      euler.set(
        aim.current.pitch * b.weight,
        (aim.current.yaw + idle) * b.weight,
        0,
      );
      delta.setFromEuler(euler);

      // Rotate by `delta` about world axes regardless of how the bone itself is
      // oriented: local = P⁻¹ · delta · P · rest. Deltas compose down the chain,
      // so the weights sum to one full rotation at the head.
      next
        .copy(b.parentWorldInv)
        .multiply(delta)
        .multiply(b.parentWorld)
        .multiply(b.rest);
      b.bone.quaternion.copy(next);
    }
  });

  return <primitive object={scene} position={[0, -EYE_HEIGHT, 0]} />;
}

useGLTF.preload(MODEL);
