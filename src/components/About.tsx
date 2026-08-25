import React from 'react';
import { CheckIcon } from 'lucide-react';
import { stats } from '../data/company';

const teamImage = "/462115f5-4cb8-4680-8901-f0b4acc325e3.jpg";

const commitments = [
'A measured bill of quantities before a single block is laid',
'One site supervisor who stays with your build to handover',
'Concrete and blockwork tested at each stage, records kept',
'Weekly written and photographic progress reports'];


export function About() {
  return (
    <section id="about" className="bg-bone-50 py-20 lg:py-28">
      <div className="mx-auto max-w-shell px-6 lg:px-10">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="relative">
              <img
                src={teamImage}
                alt="A Demic Structures site engineer reviewing drawings on an active build"
                className="aspect-[4/5] w-full rounded-sm object-cover" />
              
              <div className="absolute -bottom-6 -right-4 hidden w-56 bg-ink-950 p-6 sm:block lg:-right-8">
                <p className="font-display text-3xl font-bold text-signal">2013</p>
                <p className="mt-2 text-sm leading-snug text-bone-100/80">
                  First foundation poured. Same crew leads on site today.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-signal-dark">Who we are</p>
            <h2 className="mt-5 font-display text-3xl font-bold leading-tight tracking-tightest text-ink-900 sm:text-4xl lg:text-[2.85rem]">
              A contractor that answers for the whole building, not just its own trade.
            </h2>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-ink-600">
              <p>
                Most builds in Nigeria go wrong in the gaps — between the engineer and the mason, between the mason and
                the finisher. We closed those gaps by keeping design review, structural works and finishing under one
                team, with one person accountable to you.
              </p>
              <p>
                That means you get a single programme of works, a single cost plan, and no stage starting before the one
                beneath it has been signed off.
              </p>
            </div>

            <ul className="mt-8 space-y-3">
              {commitments.map((item) =>
              <li key={item} className="flex gap-3 text-[15px] text-ink-800">
                  <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-signal-dark" aria-hidden="true" />
                  {item}
                </li>
              )}
            </ul>
          </div>
        </div>

        <dl className="mt-20 grid grid-cols-1 gap-y-10 border-t border-bone-200 pt-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-10">
          {stats.map((stat) =>
          <div key={stat.label} className="lg:border-l lg:border-bone-200 lg:pl-8 lg:first:border-0 lg:first:pl-0">
              <dt className="font-display text-4xl font-bold tracking-tightest text-ink-900 lg:text-5xl">
                {stat.value}
              </dt>
              <dd className="mt-3">
                <span className="block text-sm font-semibold uppercase tracking-[0.14em] text-ink-900">
                  {stat.label}
                </span>
                <span className="mt-2 block max-w-xs text-sm leading-relaxed text-ink-600">{stat.detail}</span>
              </dd>
            </div>
          )}
        </dl>
      </div>
    </section>);

}