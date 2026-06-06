import Navbar from '@/components/public/Navbar';
import Hero from '@/components/public/Hero';
import About from '@/components/public/About';
import Skills from '@/components/public/Skills';
import Experience from '@/components/public/Experience';
import Projects from '@/components/public/Projects';
import Achievements from '@/components/public/Achievements';
import Certificates from '@/components/public/Certificates';
import Education from '@/components/public/Education';
import CodingProfiles from '@/components/public/CodingProfiles';
import Contact from '@/components/public/Contact';
import Footer from '@/components/public/Footer';

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Experience />
      <Projects />
      <Achievements />
      <Certificates />
      <Education />
      <CodingProfiles />
      <Contact />
      <Footer />
    </main>
  );
}
