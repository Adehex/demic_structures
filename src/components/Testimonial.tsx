import React from 'react';
import { QuoteIcon } from 'lucide-react';

const siteImage = "/75798f36-6e46-4044-9e78-e106b6482e8e.jpg";

export function Testimonial() {
  return (
    <section aria-label="Client feedback" className="bg-bone-50 py-16 lg:py-20">
      <div className="mx-auto max-w-shell px-6 lg:px-10">
        <div className="grid items-stretch gap-0 overflow-hidden rounded-sm lg:grid-cols-12">
          <img
            src={siteImage}
            alt="Demic Structures crew laying blockwork on an active residential site"
            className="h-64 w-full object-cover lg:col-span-5 lg:h-full" />
          
          <blockquote className="flex flex-col justify-center bg-ink-950 p-8 lg:col-span-7 lg:p-14">
            <QuoteIcon className="h-8 w-8 text-signal" aria-hidden="true" />
            <p className="mt-6 font-display text-xl font-semibold leading-snug tracking-tight text-white lg:text-2xl">
              “I was in London for the whole build. Every Friday I got photos, what was bought and what came next. I
              came home to a house that matched the drawings and the budget.”
            </p>
            <footer className="mt-7 text-sm text-bone-100/70">
              <span className="font-semibold text-white">Mrs. A. Eze</span> — Ridgeview Duplex, Guzape, Abuja
            </footer>
          </blockquote>
        </div>
      </div>
    </section>);

}