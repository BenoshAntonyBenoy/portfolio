/** @type {import('next').NextConfig} */
const nextConfig = {
  /**
   * The admin panel runs a full `next build` before every publish, to prove the
   * site still compiles. Left on the default `.next`, that build would wipe the
   * output the running dev server is serving from, and the preview would start
   * 404ing layout.css — which silently drops all of Tailwind and reads as a
   * layout bug rather than as a clobbered directory.
   *
   * So the panel sets NEXT_DIST_DIR and builds somewhere else entirely. Nothing
   * sets it on Vercel, so production builds are unchanged.
   */
  distDir: process.env.NEXT_DIST_DIR || ".next",
};

export default nextConfig;
