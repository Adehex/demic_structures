import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CalendarIcon, MapPinIcon, RulerIcon } from 'lucide-react';
import { projects } from '../data/projects';

const ease = [0.23, 1, 0.32, 1] as const;

export function Projects() {
  const [activeId, setActiveId] = useState(projects[0].id);
  const active = projects.find((p) => p.id === activeId) ?? projects[0];

  return (
    <section id="projects" className="bg-ink-950 py-20 lg:py-28">
      <div className="mx-auto max-w-shell px-6 lg:px-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-signal">Selected projects</p>
            <h2 className="mt-5 font-display text-3xl font-bold leading-tight tracking-tightest text-white sm:text-4xl lg:text-[2.85rem]">
              Buildings we stand behind.
            </h2>
          </div>
          <p className="max-w-sm text-[15px] leading-relaxed text-bone-100/70">
            Five of the last builds handed over or currently on site. Pick one to see the scope, the programme and how it
            was delivered.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.figure
                key={active.id}
                initial={{ opacity: 0, scale: 0.985 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.28, ease }}
                className="relative overflow-hidden rounded-sm">
                
                <img
                  src={active.image}
                  alt={`${active.name} — ${active.type} in ${active.location}`}
                  className="aspect-[16/10] w-full object-cover" />
                
                <figcaption className="absolute left-0 top-0 m-4 flex items-center gap-2 bg-ink-950/85 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white">
                  <span
                    className={`h-2 w-2 rounded-full ${active.status === 'In progress' ? 'bg-signal' : 'bg-emerald-400'}`}
                    aria-hidden="true" />
                  
                  {active.status}
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          <div className="flex flex-col lg:col-span-4">
            <h3 className="font-display text-2xl font-bold leading-tight tracking-tightest text-white lg:text-3xl">
              {active.name}
            </h3>
            <p className="mt-2 text-[15px] text-signal">{active.type}</p>

            <dl className="mt-6 space-y-4 border-t border-white/10 pt-6 text-sm">
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

            <ul className="mt-6 space-y-3 border-t border-white/10 pt-6">
              {active.highlights.map((item) =>
              <li key={item} className="flex gap-3 text-sm leading-relaxed text-bone-100/70">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-signal" aria-hidden="true" />
                  {item}
                </li>
              )}
            </ul>
          </div>
        </div>

        <div
          role="tablist"
          aria-label="Project gallery"
          className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          
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