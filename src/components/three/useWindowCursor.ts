"use client";

import { useThree } from "@react-three/fiber";
import { useEffect, useRef, type MutableRefObject } from "react";

const clamp = (v: number) => Math.max(-1, Math.min(1, v));

/**
 * Cursor position relative to the canvas centre, ±1 at the window edges.
 *
 * R3F's own `state.pointer` only updates while the cursor is over the canvas, so
 * anything driven by it freezes the moment you move away. This tracks the whole
 * window instead, and normalises each side against its own edge so reaching any
 * edge of the page is a full deflection — whichever side the canvas sits on.
 *
 * `y` is positive downward, matching screen coordinates.
 */
export function useWindowCursor(): MutableRefObject<{ x: number; y: number }> {
  const gl = useThree((s) => s.gl);
  const cursor = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = gl.domElement;
    let last: { x: number; y: number } | null = null;

    const measure = () => {
      if (!last) return;
      const rect = canvas.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = last.x - cx;
      const dy = last.y - cy;
      cursor.current.x = clamp(dx / (dx >= 0 ? window.innerWidth - cx : cx) || 0);
      cursor.current.y = clamp(dy / (dy >= 0 ? window.innerHeight - cy : cy) || 0);
    };

    const onMove = (e: PointerEvent) => {
      last = { x: e.clientX, y: e.clientY };
      measure();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    // The canvas moves under a still cursor while scrolling or resizing.
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [gl]);

  return cursor;
}
