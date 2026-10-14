import React from 'react';

type IconButtonProps = {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  tone?: 'default' | 'danger';
};

export function IconButton({ label, onClick, children, disabled, tone = 'default' }: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className={`grid h-9 w-9 shrink-0 place-items-center rounded-md transition-colors duration-150 ease-out disabled:cursor-not-allowed disabled:opacity-30 ${
      tone === 'danger' ? 'text-ink-600 hover:bg-red-50 hover:text-red-700' : 'text-ink-600 hover:bg-bone-100 hover:text-ink-900'}`
      }>
      
      {children}
    </button>);

}