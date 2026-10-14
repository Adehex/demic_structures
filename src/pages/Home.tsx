import React from 'react';
import { Nav } from '../components/Nav';
import { Hero } from '../components/Hero';
import { CaseStudy } from '../components/CaseStudy/CaseStudy';
import { About } from '../components/About';
import { Projects } from '../components/Projects';
import { Services } from '../components/Services';
import { Process } from '../components/Process';
import { Testimonial } from '../components/Testimonial';
import { Contact } from '../components/Contact';
import { Footer } from '../components/Footer';
import { MobileActionBar } from '../components/MobileActionBar';

export function Home() {
  return (
    <div className="min-h-full w-full bg-bone-50 font-sans">
      <Nav />
      <main>
        <Hero />
        <CaseStudy />
        <About />
        <Projects />
        <Services />
        <Process />
        <Testimonial />
        <Contact />
      </main>
      <Footer />
      <MobileActionBar />
    </div>);

}