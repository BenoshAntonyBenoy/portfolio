import type { Config } from "tailwindcss";

/**
 * One accent, warm neutrals, a green-black ground.
 *
 * Every colour on the site resolves to a token in here or to a CSS variable in
 * globals.css — nothing is spelled as a raw hex in a component. Retheming is a
 * one-file edit, which is the whole point after the last palette ended up
 * copy-pasted into a dozen files.
 */
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Ground. Not pure black — a green cast warms the whole page and keeps
        // the accent from reading as neon against it.
        ink: {
          DEFAULT: "#0b0e0c",
          raised: "#121714", // cards, tiles
          high: "#191f1b", // hover state on raised surfaces
        },
        // Warm off-white. Blue-white (#e8e8f0) is what made the old palette read
        // as screen-glow rather than print.
        bone: {
          DEFAULT: "#e8e6df",
          dim: "#a3a69c",
          mute: "#7d8177", // 4.9:1 on ink — the floor for readable body text
        },
        // Lichen. Olive-green, deliberately not a Tailwind default swatch —
        // green and yellow in one hue, which is what "jungle" was reaching for.
        lichen: {
          DEFAULT: "#9db668",
          deep: "#5f7541",
          wash: "#1b2416",
        },
        // Hairlines. Tinted with the text colour rather than pure white so they
        // sit in the same warm family as everything else.
        line: {
          DEFAULT: "rgba(232, 230, 223, 0.11)",
          strong: "rgba(232, 230, 223, 0.22)",
        },
      },
      fontFamily: {
        // Display only. One weight (400) — size does the work, never bolding,
        // which would synthesise a fake bold and look muddy.
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        // Near-square. 16px pill corners on everything was half the reason the
        // old layout read as a template.
        DEFAULT: "2px",
        sm: "2px",
        md: "3px",
        lg: "4px",
      },
      letterSpacing: {
        label: "0.18em",
      },
      keyframes: {
        pulse: {
          "0%, 100%": { opacity: "0.35" },
          "50%": { opacity: "1" },
        },
        "scroll-cue": {
          "0%": { transform: "translateY(0)", opacity: "0" },
          "40%": { opacity: "1" },
          "80%, 100%": { transform: "translateY(10px)", opacity: "0" },
        },
      },
      animation: {
        pulse: "pulse 3.5s ease-in-out infinite",
        "scroll-cue": "scroll-cue 1.8s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
