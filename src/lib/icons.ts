import type { IconType } from "react-icons";
import { HiOutlineMail } from "react-icons/hi";
import {
  SiPython,
  SiC,
  SiCplusplus,
  SiJavascript,
  SiTypescript,
  SiReact,
  SiNextdotjs,
  SiTailwindcss,
  SiHtml5,
  SiNodedotjs,
  SiGit,
  SiGithub,
  SiFigma,
  SiMysql,
  SiPostgresql,
  SiSqlite,
  SiPandas,
  SiNumpy,
  SiScikitlearn,
  SiTensorflow,
  SiOpenai,
  SiVite,
  SiLinux,
  SiCanva,
  SiBlender,
  SiNotion,
  SiArduino,
  SiRaspberrypi,
} from "react-icons/si";
import {
  FaBrain,
  FaPenNib,
  FaVideo,
  FaDatabase,
  FaChartLine,
  FaCode,
  FaJava,
  FaMobileScreen,
  FaPalette,
  FaRobot,
  FaChess,
  FaTerminal,
  FaCloud,
  FaLightbulb,
  FaLinkedinIn,
  FaGithub,
  FaDiscord,
  FaXTwitter,
  FaInstagram,
  FaWhatsapp,
  FaTelegram,
  FaYoutube,
  FaPhone,
  FaLocationDot,
  FaBehance,
  FaDribbble,
  FaMedium,
} from "react-icons/fa6";

/**
 * The only icons the site can draw.
 *
 * content.json stores an icon by *name*, because JSON cannot hold a React
 * component. Anything the admin panel offers has to be listed here, and
 * anything listed here has to be imported above — an unresolvable name would
 * otherwise render nothing at all and look like a broken build.
 *
 * `admin/schema.mjs` keeps its own copy of these key lists and rejects a save
 * that uses a name missing from them, so a bad value can never reach the file.
 */
export const skillIcons: Record<string, IconType> = {
  SiPython,
  SiC,
  SiCplusplus,
  SiJavascript,
  SiTypescript,
  SiReact,
  SiNextdotjs,
  SiTailwindcss,
  SiHtml5,
  SiNodedotjs,
  SiGit,
  SiGithub,
  SiFigma,
  SiMysql,
  SiPostgresql,
  SiSqlite,
  SiPandas,
  SiNumpy,
  SiScikitlearn,
  SiTensorflow,
  SiOpenai,
  SiVite,
  SiLinux,
  SiCanva,
  SiBlender,
  SiNotion,
  SiArduino,
  SiRaspberrypi,
  FaBrain,
  FaPenNib,
  FaVideo,
  FaDatabase,
  FaChartLine,
  FaCode,
  FaJava,
  FaMobileScreen,
  FaPalette,
  FaRobot,
  FaChess,
  FaTerminal,
  FaCloud,
  FaLightbulb,
};

export const contactIcons: Record<string, IconType> = {
  HiOutlineMail,
  FaLinkedinIn,
  FaGithub,
  FaDiscord,
  FaXTwitter,
  FaInstagram,
  FaWhatsapp,
  FaTelegram,
  FaYoutube,
  FaPhone,
  FaLocationDot,
  FaBehance,
  FaDribbble,
  FaMedium,
};

/** Falls back to a neutral glyph rather than rendering an empty slot. */
export const skillIcon = (name: string): IconType => skillIcons[name] ?? FaCode;
export const contactIcon = (name: string): IconType =>
  contactIcons[name] ?? FaLocationDot;
