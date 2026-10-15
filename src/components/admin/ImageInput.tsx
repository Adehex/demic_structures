import React, { useId, useRef, useState } from 'react';
import { FolderOpenIcon, ImageIcon, Loader2Icon, UploadIcon, XIcon } from 'lucide-react';
import { inputClass } from './Field';
import { uploadMediaFile } from '../../utils/mediaUpload';
import { MediaPickerModal } from './MediaPickerModal';

type ImageInputProps = {
  label: string;
  value: string;
  onChange: (src: string) => void;
  hint?: string;
};

export function ImageInput({ label, value, onChange, hint }: ImageInputProps) {
  const id = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPicker, setShowPicker] = useState(false);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const media = await uploadMediaFile(file);
      onChange(media.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed.');
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <div>
      <p className="mb-1.5 block text-xs font-semibold text-ink-700">{label}</p>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-md border border-bone-200 bg-bone-100 sm:w-40">
          {value ? (
            <>
              <img src={value} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => onChange('')}
                aria-label="Remove photo"
                className="absolute right-1.5 top-1.5 grid h-7 w-7 place-items-center rounded-full bg-ink-950/80 text-white hover:bg-ink-950">
                <XIcon className="h-4 w-4" />
              </button>
            </>
          ) : (
            <div className="grid h-full place-items-center text-ink-400">
              <ImageIcon className="h-6 w-6" aria-hidden="true" />
            </div>
          )}
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={busy}
              className="inline-flex items-center gap-2 rounded-md border border-bone-200 bg-white px-3.5 py-2 text-xs font-semibold text-ink-900 transition-colors duration-150 ease-out hover:border-ink-900 disabled:opacity-60">
              {busy ? <Loader2Icon className="h-3.5 w-3.5 animate-spin" /> : <UploadIcon className="h-3.5 w-3.5" />}
              {busy ? 'Uploading…' : value ? 'Replace file' : 'Upload file'}
            </button>

            <button
              type="button"
              onClick={() => setShowPicker(true)}
              className="inline-flex items-center gap-1.5 rounded-md border border-bone-200 bg-bone-50 px-3 py-2 text-xs font-semibold text-ink-700 transition-colors hover:border-ink-900 hover:text-ink-900">
              <FolderOpenIcon className="h-3.5 w-3.5 text-ink-500" />
              Choose from Library
            </button>
          </div>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="sr-only"
            tabIndex={-1}
            onChange={(e) => handleFile(e.target.files?.[0])}
          />

          <label htmlFor={id} className="sr-only">
            {label} link
          </label>
          <input
            id={id}
            type="url"
            value={value}
            placeholder="…or paste image URL"
            onChange={(e) => onChange(e.target.value)}
            className={inputClass}
          />

          {error && (
            <p role="alert" className="text-xs font-medium text-red-700">
              {error}
            </p>
          )}
          {hint && !error && <p className="text-xs text-ink-400">{hint}</p>}
        </div>
      </div>

      <MediaPickerModal
        isOpen={showPicker}
        onClose={() => setShowPicker(false)}
        typeFilter="image"
        onSelect={(url) => onChange(url)}
        title={`Select Photo for ${label}`}
      />
    </div>
  );
}