import React, { useEffect, useRef, useState } from 'react';
import {
  CheckIcon,
  FilmIcon,
  ImageIcon,
  Loader2Icon,
  PlayIcon,
  SearchIcon,
  UploadIcon,
  XIcon
} from 'lucide-react';
import type { MediaItem } from '../../types/media';
import { formatBytes, uploadMediaFile } from '../../utils/mediaUpload';

type MediaPickerModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string, originalName?: string) => void;
  typeFilter?: 'all' | 'image' | 'video';
  title?: string;
};

export function MediaPickerModal({
  isOpen,
  onClose,
  onSelect,
  typeFilter = 'all',
  title = 'Select Media from Library'
}: MediaPickerModalProps) {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadMedia = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/media');
      if (res.ok) {
        const data = await res.json();
        setMediaList(data);
      }
    } catch (err) {
      console.warn('Failed to load media list', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadMedia();
    }
  }, [isOpen]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const item = await uploadMediaFile(file);
        setMediaList((prev) => [item, ...prev]);
        // Auto select the first uploaded file
        onSelect(item.url, item.originalName);
        onClose();
        break;
      }
    } catch (err: any) {
      alert(err.message || 'Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  if (!isOpen) return null;

  const filtered = mediaList.filter((m) => {
    const matchesType = typeFilter === 'all' ? true : m.type === typeFilter;
    const matchesSearch =
      m.originalName.toLowerCase().includes(search.toLowerCase()) ||
      m.filename.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/80 p-4 backdrop-blur-sm">
      <div className="flex h-[85vh] w-full max-w-4xl flex-col rounded-xl border border-white/15 bg-ink-900 text-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div>
            <h2 className="font-display text-lg font-bold text-white">{title}</h2>
            <p className="text-xs text-bone-100/60">Choose an existing media file or upload a new one directly to the database.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-full text-bone-100/70 hover:bg-white/10 hover:text-white">
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col gap-3 border-b border-white/10 px-6 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search media by filename..."
              className="w-full rounded-md border border-white/15 bg-white/5 py-2 pl-9 pr-4 text-xs text-white placeholder:text-ink-400 focus:border-signal focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-full bg-signal px-4 py-2 text-xs font-semibold text-ink-950 transition-colors hover:bg-white disabled:opacity-60">
              {uploading ? <Loader2Icon className="h-3.5 w-3.5 animate-spin" /> : <UploadIcon className="h-3.5 w-3.5" />}
              {uploading ? 'Uploading…' : 'Upload File'}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept={typeFilter === 'video' ? 'video/*' : typeFilter === 'image' ? 'image/*' : 'image/*,video/*'}
              className="sr-only"
              onChange={handleUpload}
            />
          </div>
        </div>

        {/* Media Grid */}
        <div className="flex-1 overflow-y-auto p-6 [scrollbar-width:thin]">
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2Icon className="h-8 w-8 animate-spin text-signal" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center text-center">
              <ImageIcon className="h-10 w-10 text-ink-500" />
              <p className="mt-2 text-sm text-bone-100/70">No media items found.</p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-3 text-xs font-semibold text-signal underline hover:text-white">
                Upload your first file
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {filtered.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelect(item.url, item.originalName);
                    onClose();
                  }}
                  className="group relative flex flex-col overflow-hidden rounded-lg border border-white/10 bg-white/5 text-left transition-all hover:border-signal hover:ring-2 hover:ring-signal/40">
                  <div className="relative aspect-video w-full bg-ink-950">
                    {item.type === 'video' ? (
                      <div className="relative h-full w-full">
                        <video src={item.url} className="h-full w-full object-cover" preload="metadata" />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                          <PlayIcon className="h-7 w-7 text-white opacity-80 group-hover:scale-110 transition-transform" />
                        </div>
                      </div>
                    ) : (
                      <img src={item.url} alt={item.originalName} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                    )}
                    <span className="absolute left-2 top-2 rounded bg-ink-950/80 px-1.5 py-0.5 text-[10px] font-medium text-bone-100 uppercase tracking-wider">
                      {item.type}
                    </span>
                  </div>
                  <div className="p-2.5">
                    <p className="truncate text-xs font-medium text-white group-hover:text-signal">{item.originalName}</p>
                    <p className="mt-0.5 text-[10px] text-bone-100/50">{formatBytes(item.size)}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
