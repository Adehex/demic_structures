import React from 'react';
import { PlusIcon, Trash2Icon } from 'lucide-react';
import type { SiteVideo } from '../../data/caseStudy';
import { inputClass } from './Field';
import { IconButton } from './IconButton';
import { removeAt, replaceAt } from '../../utils/array';

type VideoListEditorProps = {
  videos: SiteVideo[];
  onChange: (videos: SiteVideo[]) => void;
};

export function VideoListEditor({ videos, onChange }: VideoListEditorProps) {
  return (
    <div>
      {videos.length > 0 ?
      <ul className="divide-y divide-bone-200 rounded-md border border-bone-200">
          {videos.map((video, i) =>
        <li key={i} className="flex flex-col gap-2 p-3 sm:flex-row sm:items-center">
              <label className="sr-only" htmlFor={`video-title-${i}`}>
                Video {i + 1} title
              </label>
              <input
            id={`video-title-${i}`}
            value={video.title}
            onChange={(e) => onChange(replaceAt(videos, i, { ...video, title: e.target.value }))}
            placeholder="Title"
            className={`${inputClass} sm:w-40`} />
          
              <label className="sr-only" htmlFor={`video-src-${i}`}>
                Video {i + 1} link
              </label>
              <input
            id={`video-src-${i}`}
            type="url"
            value={video.src}
            onChange={(e) => onChange(replaceAt(videos, i, { ...video, src: e.target.value }))}
            placeholder="https://…/clip.mp4"
            className={`${inputClass} flex-1`} />
          
              <div className="self-end sm:self-auto">
                <IconButton label="Remove video" tone="danger" onClick={() => onChange(removeAt(videos, i))}>
                  <Trash2Icon className="h-4 w-4" />
                </IconButton>
              </div>
            </li>
        )}
        </ul> :

      <p className="rounded-md border border-dashed border-bone-200 bg-bone-50 px-4 py-6 text-center text-sm text-ink-600">
          No videos. The “Straight from site” strip is hidden until you add one.
        </p>
      }
      <button
        type="button"
        onClick={() => onChange([...videos, { title: `Site clip ${videos.length + 1}`, src: '' }])}
        className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-ink-900 hover:text-signal-dark">
        
        <PlusIcon className="h-4 w-4" />
        Add video link
      </button>
      <p className="mt-1 text-xs text-ink-400">Use a direct link to an .mp4 file. Videos are too large to upload here.</p>
    </div>);

}