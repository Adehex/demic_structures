import React, { useRef, useState } from 'react';
import { FolderOpenIcon, Loader2Icon, PlusIcon, Trash2Icon, UploadIcon, VideoIcon } from 'lucide-react';
import type { SiteVideo } from '../../data/caseStudy';
import { inputClass } from './Field';
import { IconButton } from './IconButton';
import { removeAt, replaceAt } from '../../utils/array';
import { uploadMediaFile } from '../../utils/mediaUpload';
import { MediaPickerModal } from './MediaPickerModal';
import type { MediaItem } from '../../types/media';

type VideoListEditorProps = {
  videos: SiteVideo[];
  onChange: (videos: SiteVideo[]) => void;
};

export function VideoListEditor({ videos, onChange }: VideoListEditorProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [targetIndex, setTargetIndex] = useState<number | null>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setBusy(true);
    setError(null);
    const added: SiteVideo[] = [];
    const failures: string[] = [];

    for (const file of Array.from(files)) {
      try {
        const item = await uploadMediaFile(file);
        const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
        added.push({ title: nameWithoutExt, src: item.url });
      } catch (err) {
        failures.push(err instanceof Error ? err.message : file.name);
      }
    }

    if (added.length) onChange([...videos, ...added]);
    if (failures.length) setError(failures.join(' '));
    setBusy(false);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleSelectFromLibrary = (item: MediaItem) => {
    if (targetIndex !== null && targetIndex >= 0 && targetIndex < videos.length) {
      onChange(replaceAt(videos, targetIndex, {
        ...videos[targetIndex],
        src: item.url,
        title: videos[targetIndex].title || item.originalName.replace(/\.[^/.]+$/, ''),
      }));
    } else {
      onChange([...videos, {
        title: item.originalName.replace(/\.[^/.]+$/, ''),
        src: item.url,
      }]);
    }
    setPickerOpen(false);
    setTargetIndex(null);
  };

  const openLibraryForNew = () => {
    setTargetIndex(null);
    setPickerOpen(true);
  };

  const openLibraryForIndex = (index: number) => {
    setTargetIndex(index);
    setPickerOpen(true);
  };

  return (
    <div>
      {videos.length > 0 ? (
        <ul className="divide-y divide-bone-200 rounded-md border border-bone-200 bg-white">
          {videos.map((video, i) => (
            <li key={i} className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center">
              {video.src ? (
                <div className="relative h-12 w-20 shrink-0 overflow-hidden rounded bg-ink-900 border border-bone-200">
                  <video
                    src={video.src}
                    className="h-full w-full object-cover"
                    preload="metadata"
                    muted
                  />
                </div>
              ) : (
                <div className="flex h-12 w-20 shrink-0 items-center justify-center rounded border border-dashed border-bone-300 bg-bone-50 text-ink-400">
                  <VideoIcon className="h-5 w-5" />
                </div>
              )}

              <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
                <div className="sm:w-44">
                  <label className="sr-only" htmlFor={`video-title-${i}`}>
                    Video {i + 1} title
                  </label>
                  <input
                    id={`video-title-${i}`}
                    value={video.title}
                    onChange={(e) => onChange(replaceAt(videos, i, { ...video, title: e.target.value }))}
                    placeholder="Clip title"
                    className={`${inputClass} !text-xs`}
                  />
                </div>

                <div className="flex flex-1 items-center gap-1.5">
                  <label className="sr-only" htmlFor={`video-src-${i}`}>
                    Video {i + 1} URL
                  </label>
                  <input
                    id={`video-src-${i}`}
                    type="text"
                    value={video.src}
                    onChange={(e) => onChange(replaceAt(videos, i, { ...video, src: e.target.value }))}
                    placeholder="/uploads/... or https://.../video.mp4"
                    className={`${inputClass} !text-xs flex-1`}
                  />
                  <button
                    type="button"
                    onClick={() => openLibraryForIndex(i)}
                    title="Choose from media library"
                    className="shrink-0 rounded-md border border-bone-200 px-2.5 py-2 text-xs font-medium text-ink-700 hover:border-ink-900 hover:text-ink-900"
                  >
                    Library
                  </button>
                </div>
              </div>

              <div className="self-end sm:self-auto">
                <IconButton label="Remove video" tone="danger" onClick={() => onChange(removeAt(videos, i))}>
                  <Trash2Icon className="h-4 w-4" />
                </IconButton>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-md border border-dashed border-bone-200 bg-bone-50 px-4 py-6 text-center text-sm text-ink-600">
          No site videos added yet. Add clips below to showcase construction progress.
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={busy}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-ink-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-ink-700 disabled:opacity-60"
        >
          {busy ? <Loader2Icon className="h-4 w-4 animate-spin" /> : <UploadIcon className="h-4 w-4" />}
          {busy ? 'Uploading video…' : 'Upload video'}
        </button>

        <button
          type="button"
          onClick={openLibraryForNew}
          className="inline-flex items-center justify-center gap-2 rounded-md border border-bone-300 bg-white px-3.5 py-2.5 text-sm font-semibold text-ink-900 shadow-sm transition hover:bg-bone-50 hover:border-ink-900"
        >
          <FolderOpenIcon className="h-4 w-4 text-ink-600" />
          Choose from Library
        </button>

        <button
          type="button"
          onClick={() => onChange([...videos, { title: `Site clip ${videos.length + 1}`, src: '' }])}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-ink-800 hover:text-signal-dark"
        >
          <PlusIcon className="h-4 w-4" />
          Add URL manually
        </button>

        <input
          ref={fileRef}
          type="file"
          accept="video/*"
          multiple
          className="sr-only"
          tabIndex={-1}
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {error && (
        <p role="alert" className="mt-2 text-xs font-medium text-red-700">
          {error}
        </p>
      )}

      <p className="mt-2 text-xs text-ink-400">
        Videos uploaded here are stored in your media database and can be reused anytime across projects and site stages.
      </p>

      <MediaPickerModal
        isOpen={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={handleSelectFromLibrary}
        typeFilter="video"
        title="Select Video from Media Library"
      />
    </div>
  );
}