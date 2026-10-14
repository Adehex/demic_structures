import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRightIcon, MapPinIcon } from 'lucide-react';
import { useSiteContent } from '../contexts/SiteContentContext';

const heroImage = "/photo_2026-08-25_13-33-14.jpg";
const ease = [0.23, 1, 0.32, 1] as const;

export function Hero() {
  const { company } = useSiteContent().content;
  return (
    <section id="top" className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden bg-ink-950 lg:min-h-[92vh]">
      <img
        src={heroImage}
        alt="Completed contemporary three-storey residence built by Demic Structures in Lekki, Lagos"
        className="absolute inset-0 h-full w-full object-cover object-center" />
      
      <div className="absolute inset-0 bg-ink-950/72" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-ink-950/60" aria-hidden="true" />

      <div className="relative mx-auto w-full max-w-shell px-5 pb-10 pt-28 sm:px-6 sm:pb-14 sm:pt-32 lg:px-10 lg:pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
          className="max-w-4xl">
          
          <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.28em] text-signal">
            Building since 2013
          </span>
          <h1 className="mt-5 font-display text-[2.4rem] font-bold leading-[1] tracking-tightest text-white min-[400px]:text-[2.75rem] sm:mt-6 sm:text-6xl lg:text-[5.25rem]">
            We build it right,
            <br />
            from ground
            <span className="text-signal"> to greatness.</span>
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.12, ease }}
          className="mt-8 grid gap-7 border-t border-white/15 pt-6 sm:mt-10 sm:gap-10 sm:pt-8 lg:grid-cols-12 lg:items-end">
          
          <p className="max-w-xl text-[15px] leading-relaxed text-bone-100/85 sm:text-base lg:col-span-6 lg:text-lg">
            {company.name} is a Nigerian building contractor delivering homes, duplexes and structural works from
            foundation to finishing — with a costed programme up front and progress you can see every week.
          </p>

          <div className="grid grid-cols-1 gap-3 min-[400px]:grid-cols-2 sm:flex sm:flex-wrap sm:items-center sm:gap-4 lg:col-span-4 lg:col-start-9 lg:justify-end">
            <a
              href="#contact"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-signal px-6 py-3.5 text-sm font-semibold text-ink-950 transition-colors duration-150 ease-out hover:bg-white">
              
              Request a quote
              <ArrowRightIcon className="h-4 w-4 transition-transform duration-200 ease-out group-hover:translate-x-1" />
            </a>
            <a
              href="#projects"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border border-white/25 px-6 py-3.5 text-sm font-semibold text-white transition-colors duration-150 ease-out hover:border-white hover:bg-white/10">
              
              See our projects
            </a>
          </div>
        </motion.div>

        <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 text-[11px] sm:mt-10 sm:text-xs font-medium uppercase tracking-[0.18em] text-bone-100/60">
          <MapPinIcon className="h-4 w-4 text-signal" aria-hidden="true" />
          {company.serviceAreas.map((area, i) =>
          <span key={area} className="flex items-center gap-3">
              {area}
              {i < company.serviceAreas.length - 1 && <span className="h-1 w-1 rounded-full bg-white/30" />}
            </span>
          )}
        </div>
      </div>
    </section>);

}