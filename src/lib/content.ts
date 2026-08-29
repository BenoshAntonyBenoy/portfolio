import raw from "@/content/content.json";

/**
 * Every word, link and image on the site, loaded from one JSON file.
 *
 * The file is the single source of truth: the admin panel (see `admin/`)
 * rewrites it, validates it, rebuilds the site and pushes — so nothing that
 * appears on benosh.tech should be typed into a component any more.
 *
 * TypeScript can only *shape* this file, not prove it correct — the import is
 * a cast, so a missing field would be a runtime hole rather than a build error.
 * `admin/schema.mjs` is the real gate and runs before every write.
 */

export type NavLink = { label: string; href: string };

export type Heading = {
  /** Two-digit numeral shown in the rail, e.g. "02". */
  index: string;
  label: string;
  /**
   * Accent markers: `*word*` renders italic in the accent colour, `**word**`
   * renders in the bright foreground. See `ui/AccentText`.
   */
  title: string;
  /** Optional standfirst under the heading; "" means none. */
  lede?: string;
};

export type Project = {
  title: string;
  tag: string;
  description: string;
  tech: string[];
  /** Optional screenshot; without one the row falls back to a numbered plate. */
  image?: string;
};

export type LiveSite = {
  title: string;
  tag: string;
  /** Shown as the link label. */
  domain: string;
  href: string;
  description: string;
  tech: string[];
};

export type Skill = {
  name: string;
  /** A key of `skillIcons` in lib/icons.ts. */
  icon: string;
  group: string;
};

export type Achievement = { kicker: string; title: string; detail: string };

export type ContactLink = {
  label: string;
  value: string;
  href: string;
  /** A key of `contactIcons` in lib/icons.ts. */
  icon: string;
};

export type SiteContent = {
  site: {
    url: string;
    title: string;
    description: string;
    ogTitle: string;
    ogDescription: string;
    twitterDescription: string;
  };
  nav: {
    brand: string;
    brandAccent: string;
    links: NavLink[];
    cta: NavLink;
  };
  hero: {
    availability: string;
    nameLine1: string;
    nameLine2: string;
    tagline: string;
    intro: string;
    portalLabel: string;
    primaryLink: NavLink;
    secondaryLink: NavLink;
    portrait: { src: string; alt: string };
    rail: {
      location: string;
      affiliation: string;
      scrollLabel: string;
      scrollHref: string;
    };
  };
  intro: { line1: string; line2: string; body: string; texture: string };
  about: {
    heading: Heading;
    portrait: { src: string; alt: string; position: string };
    bio: string[];
    facts: { kicker: string; body: string }[];
  };
  projects: { heading: Heading; items: Project[] };
  liveSites: {
    heading: Heading;
    onlineLabel: string;
    openLabel: string;
    items: LiveSite[];
  };
  skills: { heading: Heading; groups: string[]; items: Skill[] };
  achievements: {
    heading: Heading;
    /** The oversized ghost glyph behind the section. */
    watermark: string;
    items: Achievement[];
  };
  contact: {
    heading: Heading;
    resume: NavLink;
    links: ContactLink[];
  };
  footer: { name: string; builtWith: string };
};

export const content = raw as SiteContent;

// Convenience re-exports for the two lists used by more than one section:
// liveSites feeds the hero portal tiles and the footer as well as its own
// section, and both would otherwise reach three levels into `content`.
export const liveSites = content.liveSites.items;
export const projects = content.projects.items;
