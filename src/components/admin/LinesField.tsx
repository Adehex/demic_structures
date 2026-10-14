import React, { useState } from 'react';
import { Field } from './Field';

type LinesFieldProps = {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  hint?: string;
  rows?: number;
  className?: string;
};

/** Edits a list of short items as one item per line. Remount (via key) when the underlying record changes. */
export function LinesField({ label, value, onChange, hint = 'One item per line.', rows = 4, className }: LinesFieldProps) {
  const [text, setText] = useState(() => value.join('\n'));

  const handleChange = (next: string) => {
    setText(next);
    onChange(
      next.
      split('\n').
      map((line) => line.trim()).
      filter(Boolean)
    );
  };

  return <Field label={label} value={text} onChange={handleChange} hint={hint} multiline rows={rows} className={className} />;
}