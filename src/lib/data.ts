import { SiPython, SiC, SiFigma } from "react-icons/si";
import {
  FaBrain,
  FaPenNib,
  FaVideo,
  FaDatabase,
  FaChartLine,
} from "react-icons/fa6";
import { IconType } from "react-icons";

/**
 * No per-item accent colours anywhere in here any more. Cards used to each
 * carry their own hex, which is why the page read as a swatch sampler; they now
 * differentiate by number, label and type instead, and every colour comes from
 * the single palette in tailwind.config.ts.
 */

export type Skill = {
  name: string;
  icon: IconType;
  /** Grouping shown as a mono label above each cluster. */
  group: "Languages" | "Data & AI" | "Design";
};

export const skills: Skill[] = [
  { name: "Python", icon: SiPython, group: "Languages" },
  { name: "C", icon: SiC, group: "Languages" },
  { name: "SQL", icon: FaDatabase, group: "Data & AI" },
  { name: "AI / ML", icon: FaBrain, group: "Data & AI" },
  { name: "Stock Analysis", icon: FaChartLine, group: "Data & AI" },
  { name: "Figma", icon: SiFigma, group: "Design" },
  { name: "UI Design", icon: FaPenNib, group: "Design" },
  { name: "Video Editing", icon: FaVideo, group: "Design" },
];

export const skillGroups = ["Languages", "Data & AI", "Design"] as const;

export type Project = {
  title: string;
  tag: string;
  description: string;
  tech: string[];
  image?: string; // optional real screenshot; falls back to a typographic plate
};

// Screenshots come from portfolio.benosh.tech, which already had optimised webp
// versions of all five.
export const projects: Project[] = [
  {
    title: "BQuick",
    tag: "JavaScript app",
    description:
      "An adaptive browser typing trainer that measures dwell and flight time for every keystroke, identifies weak key-to-key transitions, and turns them into focused drills.",
    tech: ["JavaScript", "Browser APIs", "Adaptive Analytics"],
    image: "/projects/bquick.webp",
  },
  {
    title: "BeMag",
    tag: "React + TypeScript",
    description:
      "A browser arcade — a galaxy-themed front page and four game cabinets, one of them built. Emoji Bounce is a canvas keepy-uppy game where the paddle tracks your cursor and the screen shifts colour as you climb through star thresholds.",
    tech: ["React", "Vite", "TypeScript", "Canvas"],
    image: "/projects/bemag.webp",
  },
  {
    title: "Student Report Analyser",
    tag: "Python + UI",
    description:
      "A desktop tool that ingests student marksheets and turns them into clear, actionable performance insights — trends, weak areas, and printable summaries through a clean GUI.",
    tech: ["Python", "Tkinter", "Pandas", "Matplotlib"],
    image: "/projects/student-report.webp",
  },
  {
    title: "Personal Budget Tracker",
    tag: "Python + UI",
    description:
      "A friendly budgeting app to log expenses, set category limits, and visualise where the money actually goes — with charts that make overspending obvious.",
    tech: ["Python", "Tkinter", "Matplotlib"],
    image: "/projects/budget-tracker.webp",
  },
  {
    title: "Google Pay Mobile App Redesign",
    tag: "Figma case study",
    description:
      "An end-to-end UX case study reimagining the Google Pay flow — research, wireframes, and a polished high-fidelity prototype focused on clarity and trust.",
    tech: ["Figma", "Prototyping", "UX Research"],
    image: "/projects/gpay-redesign.webp",
  },
];

export type LiveSite = {
  title: string;
  tag: string;
  domain: string; // shown as the link label
  href: string;
  description: string;
  tech: string[];
};

// Things that are actually deployed and clickable — each opens in a new tab.
export const liveSites: LiveSite[] = [
  {
    title: "Portfolio",
    tag: "Live site",
    domain: "portfolio.benosh.tech",
    href: "https://portfolio.benosh.tech",
    description:
      "A second take on my portfolio — an editorial, arena-style layout with the same work presented in a very different visual language.",
    tech: ["React", "Vite", "TypeScript", "Tailwind"],
  },
  {
    title: "BQuick",
    tag: "Live app",
    domain: "bquick.benosh.tech",
    href: "https://bquick.benosh.tech",
    description:
      "A typing trainer that measures the rhythm between your keystrokes, finds your weakest key-to-key transitions, and drills them with real words until they smooth out.",
    tech: ["JavaScript", "Web Audio", "localStorage"],
  },
];

export type Achievement = {
  title: string;
  detail: string;
  /** Short mono kicker in place of the old emoji tile. */
  kicker: string;
};

export const achievements: Achievement[] = [
  {
    title: "Chess — 1st Place",
    detail:
      "Champion of the MBCET inter-college chess tournament. Calculated, patient, decisive.",
    kicker: "Tournament",
  },
  {
    title: "Chess — 3rd Place",
    detail:
      "Represented MBCET at inter-college level — podium finish against strong opposition from other colleges.",
    kicker: "Tournament",
  },
  {
    title: "Multiple Hackathons",
    detail:
      "Shipped ideas fast under pressure across multiple hackathons — quick prototyping, tight deadlines, real teamwork.",
    kicker: "Building",
  },
  {
    title: "Stock Market — 2+ Years",
    detail:
      "Two years studying markets, risk, and long-term strategic thinking.",
    kicker: "Markets",
  },
  {
    title: "Continuous AI Learning",
    detail: "Always taking courses and experimenting at the frontier of AI.",
    kicker: "Learning",
  },
];

export type ContactLink = {
  label: string;
  value: string;
  href: string;
  iconName: "email" | "linkedin" | "github" | "discord";
};

export const contactLinks: ContactLink[] = [
  {
    label: "Email",
    value: "benosh.benoy2@gmail.com",
    href: "mailto:benosh.benoy2@gmail.com",
    iconName: "email",
  },
  {
    label: "LinkedIn",
    value: "/in/benoshbenoy",
    href: "https://linkedin.com/in/benoshbenoy",
    iconName: "linkedin",
  },
  {
    label: "GitHub",
    value: "@BenoshAntonyBenoy",
    href: "https://github.com/BenoshAntonyBenoy",
    iconName: "github",
  },
  {
    label: "Discord",
    value: "_benosh",
    href: "https://discord.com/users/",
    iconName: "discord",
  },
];
