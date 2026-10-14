import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CalendarIcon, MapPinIcon, RulerIcon } from 'lucide-react';
import { useSiteContent } from '../contexts/SiteContentContext';

const ease = [0.23, 1, 0.32, 1] as const;

export function Projects() {
  // Projects without a photo are drafts and stay off the public site.
  const projects = useSiteContent().content.projects.filter((p) => p.image);
  const [activeId, setActiveId] = useState(projects[0]?.id);
  const active = projects.find((p) => p.id === activeId) ?? projects[0];

  if (!active) return null;

  return (
    <section id="projects" className="bg-ink-950 py-16 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-shell px-5 sm:px-6 lg:px-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-6">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-signal">Selected projects</p>
            <h2 className="mt-4 font-display text-3xl font-bold leading-tight tracking-tightest text-white sm:mt-5 sm:text-4xl lg:text-[2.85rem]">
              Buildings we stand behind.
            </h2>
          </div>
          <p className="max-w-sm text-[15px] leading-relaxed text-bone-100/70">
            Recent builds handed over or currently on site. Pick one to see the scope, the programme and how it was
            delivered.
          </p>
        </div>

        <div className="mt-8 grid gap-6 sm:mt-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.figure
                key={active.id}
                initial={{ opacity: 0, scale: 0.985 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.24, ease }}
                className="relative overflow-hidden rounded-sm">
                
                <img
                  src={active.image}
                  alt={`${active.name} — ${active.type} in ${active.location}`}
                  className="aspect-[4/3] w-full object-cover sm:aspect-[16/10]" />
                
                <figcaption className="absolute left-0 top-0 m-3 flex items-center gap-2 bg-ink-950/85 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white sm:m-4">
                  <span
                    className={`h-2 w-2 rounded-full ${active.status === 'In progress' ? 'bg-signal' : 'bg-emerald-400'}`}
                    aria-hidden="true" />
                  
                  {active.status}
                </figcaption>
              </motion.figure>
            </AnimatePresence>

            {/* Phone thumbnail strip — sits right under the image so taps update what's in view */}
            <div
              role="tablist"
              aria-label="Project gallery"
              className="-mx-5 mt-3 flex snap-x gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:-mx-6 sm:px-6 lg:hidden [&::-webkit-scrollbar]:hidden">
              
              {projects.map((project) => {
                const isActive = project.id === active.id;
                return (
                  <button
                    key={project.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-label={project.name}
                    onClick={() => setActiveId(project.id)}
                    className={`shrink-0 snap-start overflow-hidden rounded-sm border-2 transition-colors duration-150 ease-out ${
                    isActive ? 'border-signal' : 'border-transparent opacity-70'}`
                    }>
                    
                    <img src={project.image} alt="" className="h-16 w-24 object-cover" />
                  </button>);

              })}
            </div>
          </div>

          <div className="flex flex-col lg:col-span-4">
            <h3 className="font-display text-2xl font-bold leading-tight tracking-tightest text-white lg:text-3xl">
              {active.name}
            </h3>
            <p className="mt-2 text-[15px] text-signal">{active.type}</p>

            <dl className="mt-5 space-y-3.5 border-t border-white/10 pt-5 text-sm lg:mt-6 lg:space-y-4 lg:pt-6">
              <div className="flex items-start gap-3">
                <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0 text-ink-400" aria-hidden="true" />
                <dt className="sr-only">Location</dt>
                <dd className="text-bone-100/85">{active.location}</dd>
              </div>
              <div className="flex items-start gap-3">
                <CalendarIcon className="mt-0.5 h-4 w-4 shrink-0 text-ink-400" aria-hidden="true" />
                <dt className="sr-only">Programme</dt>
                <dd className="text-bone-100/85">
                  {active.duration} · {active.year}
                </dd>
              </div>
              <div className="flex items-start gap-3">
                <RulerIcon className="mt-0.5 h-4 w-4 shrink-0 text-ink-400" aria-hidden="true" />
                <dt className="sr-only">Scope</dt>
                <dd className="text-bone-100/85">{active.scope}</dd>
              </div>
            </dl>

            <ul className="mt-5 space-y-3 border-t border-white/10 pt-5 lg:mt-6 lg:pt-6">
              {active.highlights.map((item) =>
              <li key={item} className="flex gap-3 text-sm leading-relaxed text-bone-100/70">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-signal" aria-hidden="true" />
                  {item}
                </li>
              )}
            </ul>

            {(active.id === 'seasoning-store' || active.id === 'warehouse-120') && (
              <div className="mt-6 border-t border-white/10 pt-5">
                <a
                  href={active.id === 'seasoning-store' ? '#site-seasoning-store' : '#site-warehouse'}
                  className="inline-flex items-center gap-2 rounded-full bg-signal px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-ink-950 transition-colors duration-150 ease-out hover:bg-white">
                  View live build diary & stages →
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Desktop gallery */}
        <div role="tablist" aria-label="Project gallery" className="mt-10 hidden grid-cols-6 gap-4 lg:grid">
          {projects.map((project) => {
            const isActive = project.id === active.id;
            return (
              <button
                key={project.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveId(project.id)}
                className={`group flex flex-col overflow-hidden rounded-sm border text-left transition-colors duration-150 ease-out ${
                isActive ? 'border-signal bg-white/[0.06]' : 'border-white/10 hover:border-white/35'}`
                }>
                
                <img
                  src={project.image}
                  alt=""
                  className="aspect-[4/3] w-full object-cover opacity-80 transition-opacity duration-200 ease-out group-hover:opacity-100" />
                
                <span className="flex flex-1 flex-col p-4">
                  <span className="font-display text-sm font-semibold leading-snug text-white">{project.name}</span>
                  <span className="mt-auto pt-2 text-xs text-ink-400">{project.location}</span>
                </span>
              </button>);

          })}
        </div>
      </div>
    </section>);

}