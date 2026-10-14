import React, { useId } from 'react';

type Option = {value: string;label: string;};

type FieldProps = {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  hint?: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'tel' | 'number' | 'url';
  multiline?: boolean;
  rows?: number;
  options?: Option[];
  className?: string;
};

export const inputClass =
'w-full rounded-md border border-bone-200 bg-white px-3.5 py-2.5 text-base text-ink-900 placeholder:text-ink-400 transition-colors duration-150 ease-out hover:border-ink-400 focus:border-ink-900 focus:outline-none sm:text-sm';

export function Field({
  label,
  value,
  onChange,
  hint,
  placeholder,
  type = 'text',
  multiline,
  rows = 4,
  options,
  className
}: FieldProps) {
  const id = useId();

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-xs font-semibold text-ink-700">
        {label}
      </label>
      {options ?
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className={inputClass}>
          {options.map((opt) =>
        <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
        )}
        </select> :
      multiline ?
      <textarea
        id={id}
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputClass} resize-y leading-relaxed`} /> :


      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass} />

      }
      {hint && <p className="mt-1.5 text-xs leading-relaxed text-ink-400">{hint}</p>}
    </div>);

}