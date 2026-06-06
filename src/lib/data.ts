import { SiPython, SiC, SiFigma } from "react-icons/si";
import {
  FaBrain,
  FaPenNib,
  FaVideo,
  FaDatabase,
  FaChartLine,
} from "react-icons/fa6";
import { IconType } from "react-icons";

export type Skill = {
  name: string;
  icon: IconType;
  color: string;
};

export const skills: Skill[] = [
  { name: "Python", icon: SiPython, color: "#3776AB" },
  { name: "C", icon: SiC, color: "#A8B9CC" },
  { name: "SQL", icon: FaDatabase, color: "#22d3ee" },
  { name: "Figma", icon: SiFigma, color: "#F24E1E" },
  { name: "UI Design", icon: FaPenNib, color: "#a855f7" },
  { name: "AI / ML", icon: FaBrain, color: "#ec4899" },
  { name: "Video Editing", icon: FaVideo, color: "#9999FF" },
  { name: "Stock Analysis", icon: FaChartLine, color: "#22d3ee" },
];

export type Project = {
  title: string;
  tag: string;
  description: string;
  tech: string[];
  accent: string; // hex used for the placeholder mockup gradient
  image?: string; // optional real screenshot; falls back to the stylized placeholder
};

export const projects: Project[] = [
  {
    title: "Student Report Analyser",
    tag: "Python + UI",
    description:
      "A desktop tool that ingests student marksheets and turns them into clear, actionable performance insights — trends, weak areas, and printable summaries through a clean GUI.",
    tech: ["Python", "Tkinter", "Pandas", "Matplotlib"],
    accent: "#a855f7",
    image: "/projects/student-report.png",
  },
  {
    title: "Game Store Management System",
    tag: "Python",
    description:
      "An inventory and sales management system for a game store: stock tracking, billing, and customer records backed by a structured database layer.",
    tech: ["Python", "SQLite", "OOP"],
    accent: "#22d3ee",
  },
  {
    title: "Personal Budget Tracker",
    tag: "Python + UI",
    description:
      "A friendly budgeting app to log expenses, set category limits, and visualise where the money actually goes — with charts that make overspending obvious.",
    tech: ["Python", "Tkinter", "Matplotlib"],
    accent: "#ec4899",
  },
  {
    title: "Google Pay Mobile App Redesign",
    tag: "Figma case study",
    description:
      "An end-to-end UX case study reimagining the Google Pay flow — research, wireframes, and a polished high-fidelity prototype focused on clarity and trust.",
    tech: ["Figma", "Prototyping", "UX Research"],
    accent: "#22d3ee",
  },
  {
    title: "Locally Trained LLM",
    tag: "AI project",
    description:
      "Trained and fine-tuned a language model running entirely on local hardware — exploring data prep, training loops, and inference without relying on the cloud.",
    tech: ["Python", "PyTorch", "Transformers", "Fine-tuning"],
    accent: "#a855f7",
  },
];

export type Achievement = {
  title: string;
  detail: string;
  icon: string; // emoji
  accent: string;
};

export const achievements: Achievement[] = [
  {
    title: "Chess — 1st Place",
    detail:
      "Champion of the MBCET inter-college chess tournament. Calculated, patient, decisive.",
    icon: "♛",
    accent: "#a855f7",
  },
  {
    title: "Chess — 3rd Place",
    detail:
      "Represented MBCET at inter-college level — podium finish against strong opposition from other colleges.",
    icon: "♞",
    accent: "#22d3ee",
  },
  {
    title: "Multiple Hackathons",
    detail:
      "Shipped ideas fast under pressure across multiple hackathons — quick prototyping, tight deadlines, real teamwork.",
    icon: "⚡",
    accent: "#ec4899",
  },
  {
    title: "Stock Market — 2+ Years",
    detail: "Two years studying markets, risk, and long-term strategic thinking.",
    icon: "📈",
    accent: "#22d3ee",
  },
  {
    title: "Continuous AI Learning",
    detail: "Always taking courses and experimenting at the frontier of AI.",
    icon: "🧠",
    accent: "#a855f7",
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
