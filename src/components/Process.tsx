import React from 'react';
import { processSteps } from '../data/services';

export function Process() {
  return (
    <section id="process" className="bg-bone-100 py-20 lg:py-28">
      <div className="mx-auto max-w-shell px-6 lg:px-10">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-signal-dark">How we work</p>
          <h2 className="mt-5 font-display text-3xl font-bold leading-tight tracking-tightest text-ink-900 sm:text-4xl">
            From first site visit to keys, in four stages.
          </h2>
        </div>

        <ol className="mt-14 grid gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {processSteps.map((step) =>
          <li key={step.step} className="relative flex flex-col border-t-2 border-ink-900 pt-6">
              <span className="font-display text-sm font-bold tracking-[0.2em] text-signal-dark">{step.step}</span>
              <h3 className="mt-3 font-display text-xl font-bold leading-snug tracking-tight text-ink-900">
                {step.title}
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-600">{step.body}</p>
            </li>
          )}
        </ol>
      </div>
    </section>);

}