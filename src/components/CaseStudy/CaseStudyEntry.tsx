import React from 'react';
import { MapPinIcon } from 'lucide-react';
import { CaseStudy } from '../../data/caseStudy';
import { StageViewer } from './StageViewer';
import { SiteVideos } from './SiteVideos';
import { Footprint } from './Footprint';

type CaseStudyEntryProps = {
  study: CaseStudy;
};

export function CaseStudyEntry({ study }: CaseStudyEntryProps) {
  const inProgress = study.status === 'In progress';
  const comparison = study.comparison.filter((img) => img.src);

  return (
    <article id={`site-${study.id}`} className="scroll-mt-20" aria-labelledby={`title-${study.id}`}>
      {/* Header + comparison */}
      <div className="grid gap-8 sm:gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="flex flex-col lg:col-span-5">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-signal-dark">
            {inProgress && <span className="h-2 w-2 animate-pulse rounded-full bg-signal" aria-hidden="true" />}
            {study.eyebrow}
          </p>
          <h2
            id={`title-${study.id}`}
            className="mt-5 font-display text-3xl font-bold leading-tight tracking-tightest text-ink-900 sm:text-4xl lg:text-[2.85rem]">
            
            {study.headline}
          </h2>
          <p className="mt-3 flex items-center gap-2 text-[15px] font-medium text-ink-800">
            <MapPinIcon className="h-4 w-4 text-signal-dark" aria-hidden="true" />
            {study.location}
          </p>
          <p className="mt-6 text-[15px] leading-relaxed text-ink-600">{study.summary}</p>

          <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-bone-200 pt-6">
            {study.facts.map((fact) =>
            <div key={fact.label}>
                <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-400">{fact.label}</dt>
                <dd className="mt-1.5 text-sm font-medium text-ink-900">{fact.value}</dd>
              </div>
            )}
          </dl>

          {study.footprint && study.footprint.length > 0 && study.footprint.width > 0 && <Footprint length={study.footprint.length} width={study.footprint.width} />}
        </div>

        {comparison.length > 0 &&
        <div className="grid grid-cols-2 gap-2 self-start sm:gap-4 lg:col-span-7">
          {comparison.map((img, i) =>
          <figure key={img.src} className="relative">
              <img src={img.src} alt={img.alt} className="aspect-[3/4] w-full rounded-sm object-cover" />
              <figcaption
              className={`absolute left-3 top-3 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] ${
              i === 1 ? 'bg-signal text-ink-950' : 'bg-ink-950/85 text-white'}`
              }>
              
                {img.label}
              </figcaption>
            </figure>
          )}
        </div>
        }
      </div>

      {/* Stage-by-stage */}
      {study.stages.length > 0 &&
      <div className="mt-14 sm:mt-20">
          <h3 className="mb-5 font-display text-2xl font-bold tracking-tightest text-ink-900 sm:mb-8">Stage by stage</h3>
          <StageViewer stages={study.stages} />
        </div>
      }

      <SiteVideos videos={study.videos} note={study.videoNote} projectName={study.name} />
    </article>);

}