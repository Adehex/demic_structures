import React from 'react';
import { useSiteContent } from '../contexts/SiteContentContext';

type WordmarkProps = {
  tone?: 'light' | 'dark';
};

export function Wordmark({ tone = 'dark' }: WordmarkProps) {
  const { company } = useSiteContent().content;
  const primary = tone === 'light' ? 'text-white' : 'text-ink-900';
  const secondary = tone === 'light' ? 'text-ink-400' : 'text-ink-600';

  const nameParts = (company.name || 'Demics Homes').trim().split(/\s+/);
  const firstName = nameParts[0] || 'Demics';
  const lastName = nameParts.slice(1).join(' ') || 'Homes';

  return (
    <a
      href="#top"
      className="group flex shrink-0 items-center gap-1.5"
      aria-label={`${company.name || 'Demics Homes'} — home`}
    >
      <img
        src={company.logo || '/demics-homes-logo.png'}
        alt=""
        aria-hidden="true"
        className="h-11 w-11 shrink-0 object-contain"
      />
      <span className="flex flex-col leading-none">
        <span className={`font-display text-[15px] font-bold uppercase tracking-[0.18em] ${primary}`}>
          {firstName}
        </span>
        <span className={`mt-1 text-[10px] font-medium uppercase tracking-[0.32em] ${secondary}`}>
          {lastName}
        </span>
      </span>
    </a>
  );
}
