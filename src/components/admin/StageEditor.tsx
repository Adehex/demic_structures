import React, { useState } from 'react';
import { ArrowDownIcon, ArrowUpIcon, ChevronDownIcon, Trash2Icon } from 'lucide-react';
import type { BuildStage, StageStatus } from '../../data/caseStudy';
import { Field } from './Field';
import { LinesField } from './LinesField';
import { PhotoListEditor } from './PhotoListEditor';
import { IconButton } from './IconButton';

type StageEditorProps = {
  stage: BuildStage;
  index: number;
  total: number;
  onChange: (stage: BuildStage) => void;
  onMove: (direction: -1 | 1) => void;
  onDelete: () => void;
};

const statusOptions: {value: StageStatus;label: string;}[] = [
{ value: 'done', label: 'Complete' },
{ value: 'current', label: 'In progress' },
{ value: 'upcoming', label: 'Up next (not started)' }];


const statusChip: Record<StageStatus, string> = {
  done: 'bg-bone-100 text-ink-700',
  current: 'bg-signal-soft text-ink-900',
  upcoming: 'border border-dashed border-bone-200 text-ink-600'
};

export function StageEditor({ stage, index, total, onChange, onMove, onDelete }: StageEditorProps) {
  const [open, setOpen] = useState(stage.status === 'current');
  const update = (patch: Partial<BuildStage>) => onChange({ ...stage, ...patch });

  return (
    <li className="rounded-md border border-bone-200 bg-white">
      <div className="flex items-center gap-2 px-3 py-2.5 sm:px-4">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="flex min-w-0 flex-1 items-center gap-3 text-left">
          
          <ChevronDownIcon
            className={`h-4 w-4 shrink-0 text-ink-400 transition-transform duration-200 ease-out ${open ? 'rotate-180' : ''}`} />
          
          <span className="text-xs font-semibold text-ink-400">{index + 1}</span>
          <span className="truncate font-display text-[15px] font-semibold text-ink-900">{stage.label || 'Untitled stage'}</span>
          <span className={`hidden shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold sm:inline ${statusChip[stage.status]}`}>
            {statusOptions.find((o) => o.value === stage.status)?.label.split(' (')[0]}
          </span>
          <span className="hidden shrink-0 text-xs text-ink-400 md:inline">
            {stage.photos.length} photo{stage.photos.length === 1 ? '' : 's'}
          </span>
        </button>
        <IconButton label="Move stage up" onClick={() => onMove(-1)} disabled={index === 0}>
          <ArrowUpIcon className="h-4 w-4" />
        </IconButton>
        <IconButton label="Move stage down" onClick={() => onMove(1)} disabled={index === total - 1}>
          <ArrowDownIcon className="h-4 w-4" />
        </IconButton>
        <IconButton
          label="Delete stage"
          tone="danger"
          onClick={() => window.confirm(`Delete the “${stage.label}” stage and its photos?`) && onDelete()}>
          
          <Trash2Icon className="h-4 w-4" />
        </IconButton>
      </div>

      {open &&
      <div className="space-y-5 border-t border-bone-200 px-3 py-5 sm:px-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Short label" value={stage.label} onChange={(label) => update({ label })} hint="Shown on the stage buttons." />
            <Field label="Heading" value={stage.title} onChange={(title) => update({ title })} />
            <Field
            label="Status"
            value={stage.status}
            onChange={(status) => update({ status: status as StageStatus })}
            options={statusOptions} />
          
          </div>
          <Field label="What happened" value={stage.summary} onChange={(summary) => update({ summary })} multiline rows={3} />
          <LinesField key={stage.id} label="Work items" value={stage.works} onChange={(works) => update({ works })} rows={4} />
          <PhotoListEditor photos={stage.photos} onChange={(photos) => update({ photos })} defaultAlt={stage.title} />
        </div>
      }
    </li>);

}