import React from 'react';

type WordmarkProps = {
  tone?: 'light' | 'dark';
};

export function Wordmark({ tone = 'dark' }: WordmarkProps) {
  const primary = tone === 'light' ? 'text-white' : 'text-ink-900';
  const secondary = tone === 'light' ? 'text-ink-400' : 'text-ink-600';

  return (
    <a href="#top" className="group flex items-center gap-3" aria-label="Demic Structures — home">
      <span className="relative grid h-10 w-10 place-items-center">
        <span className="absolute inset-0 rotate-45 rounded-[3px] border-2 border-signal transition-transform duration-200 ease-out group-hover:rotate-[52deg]" />
        <span className={`relative font-display text-lg font-bold leading-none ${primary}`}>D</span>
      </span>
      <span className="flex flex-col leading-none">
        <span className={`font-display text-[15px] font-bold uppercase tracking-[0.18em] ${primary}`}>Demic</span>
        <span className={`mt-1 text-[10px] font-medium uppercase tracking-[0.32em] ${secondary}`}>Structures</span>
      </span>
    </a>);

}