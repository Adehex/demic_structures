import React from 'react';
import { services } from '../data/services';

export function Services() {
  return (
    <section id="services" className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-shell px-6 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-signal-dark">What we do</p>
              <h2 className="mt-5 font-display text-3xl font-bold leading-tight tracking-tightest text-ink-900 sm:text-4xl">
                Six packages. One team accountable for all of them.
              </h2>
              <p className="mt-5 text-[15px] leading-relaxed text-ink-600">
                Take the whole build or a single stage. Either way the same supervisor, the same records and the same
                programme apply.
              </p>
              <a
                href="#contact"
                className="mt-7 inline-flex text-sm font-semibold text-ink-900 underline decoration-signal decoration-2 underline-offset-[6px] transition-colors duration-150 ease-out hover:text-signal-dark">
                
                Tell us what you're building
              </a>
            </div>
          </div>

          <ul className="lg:col-span-8">
            {services.map((service) =>
            <li key={service.id} className="border-t border-bone-200 py-8 last:border-b">
                <div className="grid gap-4 md:grid-cols-12 md:gap-8">
                  <h3 className="font-display text-xl font-bold leading-snug tracking-tight text-ink-900 md:col-span-4">
                    {service.title}
                  </h3>
                  <div className="md:col-span-8">
                    <p className="text-[15px] leading-relaxed text-ink-600">{service.summary}</p>
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {service.includes.map((item) =>
                    <li
                      key={item}
                      className="rounded-full bg-bone-100 px-3 py-1.5 text-xs font-medium text-ink-700">
                      
                          {item}
                        </li>
                    )}
                    </ul>
                  </div>
                </div>
              </li>
            )}
          </ul>
        </div>
      </div>
    </section>);

}