import Navbar from "@/components/Navbar";
import Hero from "@/components/sections/Hero";
import IntroTransition from "@/components/sections/IntroTransition";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import LiveSites from "@/components/sections/LiveSites";
import Achievements from "@/components/sections/Achievements";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="relative">
        <Hero />
        <IntroTransition />
        <About />
        <Skills />
        <Projects />
        <LiveSites />
        <Achievements />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
