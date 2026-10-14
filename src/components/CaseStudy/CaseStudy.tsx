import React from 'react';
import { ArrowDownIcon } from 'lucide-react';
import { useSiteContent } from '../../contexts/SiteContentContext';
import { CaseStudyEntry } from './CaseStudyEntry';

export function CaseStudy() {
  const { caseStudies } = useSiteContent().content;
  if (caseStudies.length === 0) return null;

  return (
    <section id="case-study" className="bg-white py-16 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-shell px-5 sm:px-6 lg:px-10">
        {/* Quick index so both site diaries are discoverable up front */}
        <nav aria-label="Site diaries" className="mb-10 flex flex-wrap gap-2 sm:mb-14">
          {caseStudies.map((s) =>
          <a
            key={s.id}
            href={`#site-${s.id}`}
            className="flex items-center gap-2 rounded-full border border-bone-200 bg-white px-4 py-2.5 text-sm font-semibold text-ink-700 transition-colors duration-150 ease-out hover:border-ink-900 hover:text-ink-900">
            
              <span
              className={`h-2 w-2 rounded-full ${s.status === 'In progress' ? 'bg-signal' : 'bg-emerald-500'}`}
              aria-hidden="true" />
            
              {s.tabLabel}
              <ArrowDownIcon className="h-3.5 w-3.5 text-ink-400" aria-hidden="true" />
            </a>
          )}
        </nav>

        <div className="space-y-20 sm:space-y-28">
          {caseStudies.map((study, i) =>
          <div key={study.id} className={i > 0 ? 'border-t-2 border-ink-900 pt-16 sm:pt-20' : ''}>
              <CaseStudyEntry study={study} />
            </div>
          )}
        </div>
      </div>
    </section>);

}