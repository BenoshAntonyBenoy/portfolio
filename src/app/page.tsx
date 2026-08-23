import Navbar from "@/components/Navbar";
import Hero from "@/components/sections/Hero";
import IntroTransition from "@/components/sections/IntroTransition";
import About from "@/components/sections/About";
import Projects from "@/components/sections/Projects";
import LiveSites from "@/components/sections/LiveSites";
import Skills from "@/components/sections/Skills";
import Achievements from "@/components/sections/Achievements";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      {/* Order now matches the navbar, which had listed Projects before Skills
          while the page rendered them the other way round. Work first, then the
          tools it was built with. */}
      <main className="relative">
        <Hero />
        <IntroTransition />
        <About />
        <Projects />
        <LiveSites />
        <Skills />
        <Achievements />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
