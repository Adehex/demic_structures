import React from 'react';
import { PlusIcon, Trash2Icon } from 'lucide-react';
import { inputClass } from './Field';
import { IconButton } from './IconButton';
import { removeAt, replaceAt } from '../../utils/array';

type Fact = {label: string;value: string;};

type FactsEditorProps = {
  facts: Fact[];
  onChange: (facts: Fact[]) => void;
};

export function FactsEditor({ facts, onChange }: FactsEditorProps) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold text-ink-700">Key facts</p>
      <ul className="space-y-2">
        {facts.map((fact, i) =>
        <li key={i} className="flex items-center gap-2">
            <label className="sr-only" htmlFor={`fact-label-${i}`}>
              Fact {i + 1} label
            </label>
            <input
            id={`fact-label-${i}`}
            value={fact.label}
            onChange={(e) => onChange(replaceAt(facts, i, { ...fact, label: e.target.value }))}
            placeholder="Label"
            className={`${inputClass} w-2/5`} />
          
            <label className="sr-only" htmlFor={`fact-value-${i}`}>
              Fact {i + 1} value
            </label>
            <input
            id={`fact-value-${i}`}
            value={fact.value}
            onChange={(e) => onChange(replaceAt(facts, i, { ...fact, value: e.target.value }))}
            placeholder="Value"
            className={`${inputClass} flex-1`} />
          
            <IconButton label="Remove fact" tone="danger" onClick={() => onChange(removeAt(facts, i))}>
              <Trash2Icon className="h-4 w-4" />
            </IconButton>
          </li>
        )}
      </ul>
      <button
        type="button"
        onClick={() => onChange([...facts, { label: '', value: '' }])}
        className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-ink-900 hover:text-signal-dark">
        
        <PlusIcon className="h-4 w-4" />
        Add fact
      </button>
    </div>);

}