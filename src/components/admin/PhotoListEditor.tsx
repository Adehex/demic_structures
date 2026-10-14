import React, { useId, useRef, useState } from 'react';
import { ArrowLeftIcon, ArrowRightIcon, Loader2Icon, PlusIcon, Trash2Icon, UploadIcon } from 'lucide-react';
import type { StagePhoto } from '../../data/caseStudy';
import { inputClass } from './Field';
import { IconButton } from './IconButton';
import { moveItem, removeAt, replaceAt } from '../../utils/array';
import { resizeImageFile } from '../../utils/image';

type PhotoListEditorProps = {
  photos: StagePhoto[];
  onChange: (photos: StagePhoto[]) => void;
  defaultAlt: string;
};

export function PhotoListEditor({ photos, onChange, defaultAlt }: PhotoListEditorProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [link, setLink] = useState('');
  const linkId = useId();

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setBusy(true);
    setError(null);
    const added: StagePhoto[] = [];
    const failures: string[] = [];
    for (const file of Array.from(files)) {
      try {
        added.push({ src: await resizeImageFile(file), alt: defaultAlt });
      } catch (err) {
        failures.push(err instanceof Error ? err.message : file.name);
      }
    }
    if (added.length) onChange([...photos, ...added]);
    if (failures.length) setError(failures.join(' '));
    setBusy(false);
    if (fileRef.current) fileRef.current.value = '';
  };

  const addLink = () => {
    const src = link.trim();
    if (!src) return;
    onChange([...photos, { src, alt: defaultAlt }]);
    setLink('');
  };

  return (
    <div>
      <p className="mb-2 text-xs font-semibold text-ink-700">
        Photos <span className="font-normal text-ink-400">· first photo shows first on the website</span>
      </p>

      {photos.length > 0 ?
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {photos.map((photo, i) =>
        <li key={`${photo.src.slice(-40)}-${i}`} className="flex flex-col overflow-hidden rounded-md border border-bone-200">
              <img src={photo.src} alt={photo.alt} className="aspect-[4/3] w-full object-cover" />
              <div className="flex flex-1 flex-col gap-2 p-2">
                <label className="sr-only" htmlFor={`alt-${i}-${photo.src.length}`}>
                  Photo {i + 1} description
                </label>
                <input
              id={`alt-${i}-${photo.src.length}`}
              value={photo.alt}
              onChange={(e) => onChange(replaceAt(photos, i, { ...photo, alt: e.target.value }))}
              placeholder="Describe the photo"
              className={`${inputClass} !px-2.5 !py-1.5 !text-xs`} />
            
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex">
                    <IconButton label="Move earlier" onClick={() => onChange(moveItem(photos, i, i - 1))} disabled={i === 0}>
                      <ArrowLeftIcon className="h-4 w-4" />
                    </IconButton>
                    <IconButton
                  label="Move later"
                  onClick={() => onChange(moveItem(photos, i, i + 1))}
                  disabled={i === photos.length - 1}>
                  
                      <ArrowRightIcon className="h-4 w-4" />
                    </IconButton>
                  </div>
                  <IconButton label="Remove photo" tone="danger" onClick={() => onChange(removeAt(photos, i))}>
                    <Trash2Icon className="h-4 w-4" />
                  </IconButton>
                </div>
              </div>
            </li>
        )}
        </ul> :

      <p className="rounded-md border border-dashed border-bone-200 bg-bone-50 px-4 py-6 text-center text-sm text-ink-600">
          No photos yet. The website shows a “Not started yet” card for this stage.
        </p>
      }

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={busy}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-ink-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-150 ease-out hover:bg-ink-700 disabled:opacity-60">
          
          {busy ? <Loader2Icon className="h-4 w-4 animate-spin" /> : <UploadIcon className="h-4 w-4" />}
          {busy ? 'Processing photos…' : 'Upload photos'}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          tabIndex={-1}
          onChange={(e) => handleFiles(e.target.files)} />
        
        <div className="flex flex-1 gap-2">
          <label htmlFor={linkId} className="sr-only">
            Photo link
          </label>
          <input
            id={linkId}
            type="url"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addLink())}
            placeholder="…or paste a photo link"
            className={inputClass} />
          
          <button
            type="button"
            onClick={addLink}
            disabled={!link.trim()}
            aria-label="Add photo from link"
            className="grid h-[42px] w-[42px] shrink-0 place-items-center rounded-md border border-bone-200 text-ink-900 hover:border-ink-900 disabled:opacity-40">
            
            <PlusIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
      {error &&
      <p role="alert" className="mt-2 text-xs font-medium text-red-700">
          {error}
        </p>
      }
    </div>);

}