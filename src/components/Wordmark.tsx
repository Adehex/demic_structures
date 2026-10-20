import React from 'react';
import { useSiteContent } from '../contexts/SiteContentContext';

type WordmarkProps = {
  tone?: 'light' | 'dark';
};

export function Wordmark({ tone = 'dark' }: WordmarkProps) {
  const { company } = useSiteContent().content;
  const primaryColor = tone === 'light' ? '#FFFFFF' : '#141516';
  const secondaryColor = tone === 'light' ? '#E6E3DB' : '#4A4E52';

  const nameParts = (company.name || 'Demics Homes').trim().split(/\s+/);
  const firstName = nameParts[0] || 'Demics';
  const lastName = nameParts.slice(1).join(' ') || 'Homes';

  return (
    <a
      href="#top"
      className="group flex shrink-0 items-center"
      aria-label={`${company.name || 'Demics Homes'} — home`}
      style={{ display: 'flex', alignItems: 'center', gap: 0, flexShrink: 0 }}
    >
      <span
        aria-hidden="true"
        style={{
          display: 'block',
          width: '54px',
          height: '48px',
          minWidth: '54px',
          maxWidth: '54px',
          flexShrink: 0,
          backgroundImage: `url(${company.logo || '/demic-logo.png'})`,
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'contain',
        }}
      />
      <span className="flex flex-col leading-none" style={{ marginLeft: '-8px' }}>
        <span className="font-display text-[15px] font-bold uppercase tracking-[0.18em]" style={{ color: primaryColor }}>
          {firstName}
        </span>
        <span className="mt-1.5 text-[10px] font-medium uppercase tracking-[0.32em]" style={{ color: secondaryColor }}>
          {lastName}
        </span>
      </span>
    </a>
  );
}
