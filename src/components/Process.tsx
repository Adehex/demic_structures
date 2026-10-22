import React from 'react';
import { useSiteContent } from '../contexts/SiteContentContext';

export function Process() {
  const { processSteps } = useSiteContent().content;
  return (
    <section id="process" className="bg-moss-100 py-16 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-shell px-5 sm:px-6 lg:px-10">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-leaf-dark">How we work</p>
          <h2 className="mt-5 font-display text-3xl font-bold leading-tight tracking-tightest text-ink-900 sm:text-4xl">
            From first site visit to keys, in {processSteps.length} stages.
          </h2>
        </div>

        {/* A continuous green rule ties the steps together like a site programme bar */}
        <ol className="relative mt-10 grid gap-8 sm:mt-14 sm:gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-0">
          {processSteps.map((step, i) =>
          <li
            key={`${step.step}-${i}`}
            className="relative flex flex-col border-t-4 border-leaf pt-6 lg:pr-8 lg:[&:not(:first-child)]:border-l-0">
            
              <span
              className="absolute -top-[10px] left-0 h-4 w-4 rounded-full border-4 border-moss-100 bg-signal"
              aria-hidden="true" />
            
              <span className="font-display text-4xl font-bold tracking-tightest text-leaf/30">{step.step}</span>
              <h3 className="mt-2 font-display text-xl font-bold leading-snug tracking-tight text-ink-900">{step.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-700">{step.body}</p>
            </li>
          )}
        </ol>
      </div>
    </section>);

}