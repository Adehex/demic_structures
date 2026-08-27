import { company } from '../data/company';

type WordmarkProps = {
  tone?: 'light' | 'dark';
};

export function Wordmark({ tone: _tone = 'dark' }: WordmarkProps) {
  const primaryColor = _tone === 'light' ? '#FFFFFF' : '#141516';
  const secondaryColor = _tone === 'light' ? '#E6E3DB' : '#4A4E52';

  return (
    <a
      href="#top"
      className="group flex shrink-0 items-center"
      aria-label="Demic Structures - home"
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
          backgroundImage: `url(${company.logo})`,
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'contain',
        }}
      />
      <span className="flex flex-col leading-none" style={{ marginLeft: '-8px' }}>
        <span className="font-display text-[15px] font-bold uppercase tracking-[0.18em]" style={{ color: primaryColor }}>
          Demic
        </span>
        <span className="mt-1.5 text-[10px] font-medium uppercase tracking-[0.32em]" style={{ color: secondaryColor }}>
          Structures
        </span>
      </span>
    </a>
  );
}
