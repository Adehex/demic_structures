import React, { useEffect, useRef, useState } from 'react';
import {
  CheckIcon,
  CloudIcon,
  CopyIcon,
  ExternalLinkIcon,
  FilmIcon,
  FolderOpenIcon,
  HardDriveIcon,
  ImageIcon,
  Loader2Icon,
  PlayIcon,
  PlusIcon,
  RefreshCwIcon,
  SearchIcon,
  Settings2Icon,
  Trash2Icon,
  UploadCloudIcon,
  XIcon
} from 'lucide-react';
import { format } from 'date-fns';
import { PageHeader } from '../../components/admin/PageHeader';
import type { MediaConfig, MediaItem } from '../../types/media';
import { formatBytes, uploadMediaFile } from '../../utils/mediaUpload';

export function MediaLibrary() {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'image' | 'video'>('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Storage Settings Modal State
  const [showSettings, setShowSettings] = useState(false);
  const [config, setConfig] = useState<MediaConfig>({ provider: 'local' });
  const [savingConfig, setSavingConfig] = useState(false);
  const [configSaved, setConfigSaved] = useState(false);

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
      console.warn('Failed to fetch media database', err);
    } finally {
      setLoading(false);
    }
  };

  const loadConfig = async () => {
    try {
      const res = await fetch('/api/media-config');
      if (res.ok) {
        const data = await res.json();
        setConfig(data);
      }
    } catch {}
  };

  useEffect(() => {
    loadMedia();
    loadConfig();
  }, []);

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    const total = files.length;
    let completed = 0;

    for (const file of Array.from(files)) {
      setUploadProgress(`Uploading ${completed + 1} of ${total}: ${file.name}…`);
      try {
        const newMedia = await uploadMediaFile(file, config);
        setMediaList((prev) => [newMedia, ...prev.filter((m) => m.id !== newMedia.id)]);
      } catch (err: any) {
        alert(`Failed to upload ${file.name}: ${err.message}`);
      }
      completed++;
    }

    setUploading(false);
    setUploadProgress(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete "${name}" from media database?`)) return;
    try {
      const res = await fetch('/api/media', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        setMediaList((prev) => prev.filter((m) => m.id !== id));
        if (previewItem?.id === id) setPreviewItem(null);
      }
    } catch (err) {
      alert('Failed to delete media item.');
    }
  };

  const handleCopyUrl = (item: MediaItem) => {
    const fullUrl = item.url.startsWith('http') ? item.url : window.location.origin + item.url;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingConfig(true);
    try {
      const res = await fetch('/api/media-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      if (res.ok) {
        setConfigSaved(true);
        setTimeout(() => {
          setConfigSaved(false);
          setShowSettings(false);
        }, 1200);
      }
    } catch {
      alert('Failed to save media settings.');
    } finally {
      setSavingConfig(false);
    }
  };

  const filtered = mediaList.filter((m) => {
    const matchesFilter = filter === 'all' ? true : m.type === filter;
    const matchesSearch =
      m.originalName.toLowerCase().includes(search.toLowerCase()) ||
      m.filename.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalSize = mediaList.reduce((acc, m) => acc + (m.size || 0), 0);
  const images = mediaList.filter((m) => m.type === 'image');
  const videos = mediaList.filter((m) => m.type === 'video');

  return (
    <div className="space-y-6">
      <PageHeader
        title="Media Database"
        description="Centralized storage holding all project images, site updates, and construction inspection videos."
        action={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowSettings(true)}
              className="inline-flex items-center gap-1.5 rounded-full border border-bone-200 bg-white px-3.5 py-2 text-xs font-semibold text-ink-800 transition-colors hover:border-ink-900 hover:text-ink-900">
              <Settings2Icon className="h-3.5 w-3.5 text-ink-500" />
              Storage Settings
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-2 rounded-full bg-signal px-4 py-2 text-xs font-semibold text-ink-950 shadow-sm transition-all hover:bg-signal-dark active:scale-95 disabled:opacity-50">
              {uploading ? <Loader2Icon className="h-4 w-4 animate-spin" /> : <UploadCloudIcon className="h-4 w-4" />}
              {uploading ? 'Uploading…' : 'Upload Media'}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*"
              className="sr-only"
              onChange={(e) => handleFileUpload(e.target.files)}
            />
          </div>
        }
      />

      {/* Uploading progress notification */}
      {uploadProgress && (
        <div className="flex items-center gap-3 rounded-lg border border-signal/40 bg-signal/10 p-4 text-xs font-medium text-ink-900 animate-pulse">
          <Loader2Icon className="h-4 w-4 animate-spin text-signal-dark" />
          <span>{uploadProgress}</span>
        </div>
      )}

      {/* Storage Overview Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`rounded-lg border p-4 text-left transition-all ${
            filter === 'all' ? 'border-ink-900 bg-ink-900 text-white' : 'border-bone-200 bg-white text-ink-900 hover:border-ink-400'
          }`}>
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider opacity-70">Total Files</p>
            <HardDriveIcon className="h-4 w-4 opacity-50" />
          </div>
          <p className="mt-1 text-2xl font-bold font-display">{mediaList.length}</p>
          <p className="mt-0.5 text-xs opacity-70">{formatBytes(totalSize)} in storage</p>
        </button>

        <button
          type="button"
          onClick={() => setFilter('image')}
          className={`rounded-lg border p-4 text-left transition-all ${
            filter === 'image' ? 'border-ink-900 bg-ink-900 text-white' : 'border-bone-200 bg-white text-ink-900 hover:border-ink-400'
          }`}>
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider opacity-70">Photos</p>
            <ImageIcon className="h-4 w-4 opacity-50" />
          </div>
          <p className="mt-1 text-2xl font-bold font-display">{images.length}</p>
          <p className="mt-0.5 text-xs opacity-70">{formatBytes(images.reduce((a, b) => a + (b.size || 0), 0))}</p>
        </button>

        <button
          type="button"
          onClick={() => setFilter('video')}
          className={`rounded-lg border p-4 text-left transition-all ${
            filter === 'video' ? 'border-ink-900 bg-ink-900 text-white' : 'border-bone-200 bg-white text-ink-900 hover:border-ink-400'
          }`}>
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider opacity-70">Videos</p>
            <FilmIcon className="h-4 w-4 opacity-50" />
          </div>
          <p className="mt-1 text-2xl font-bold font-display">{videos.length}</p>
          <p className="mt-0.5 text-xs opacity-70">{formatBytes(videos.reduce((a, b) => a + (b.size || 0), 0))}</p>
        </button>

        <div className="rounded-lg border border-bone-200 bg-white p-4 text-left">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">Storage Engine</p>
            <CloudIcon className="h-4 w-4 text-ink-400" />
          </div>
          <p className="mt-1 text-base font-bold font-display text-ink-950 capitalize">
            {config.provider === 'cloudinary' ? 'Cloudinary CDN' : config.provider === 'supabase' ? 'Supabase Storage' : 'Local Disk'}
          </p>
          <button
            type="button"
            onClick={() => setShowSettings(true)}
            className="mt-0.5 text-xs font-semibold text-signal-dark underline hover:text-ink-900">
            Configure Cloud
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by filename or title…"
            className="w-full rounded-md border border-bone-200 bg-white py-2.5 pl-10 pr-4 text-sm text-ink-900 placeholder:text-ink-400 focus:border-ink-900 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          {(['all', 'image', 'video'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setFilter(t)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium capitalize transition-colors ${
                filter === t ? 'bg-ink-900 text-white' : 'bg-bone-100 text-ink-600 hover:bg-bone-200'
              }`}>
              {t === 'all' ? 'All Media' : t === 'image' ? 'Photos' : 'Videos'}
            </button>
          ))}
        </div>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2Icon className="h-8 w-8 animate-spin text-signal" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-bone-300 bg-white p-12 text-center">
          <FolderOpenIcon className="h-10 w-10 text-ink-300" />
          <h3 className="mt-3 font-display text-base font-bold text-ink-900">No media found</h3>
          <p className="mt-1 max-w-sm text-xs text-ink-500">
            {search ? 'No files match your query.' : 'Upload photos and videos to start building your site media database.'}
          </p>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-signal px-4 py-2 text-xs font-semibold text-ink-950">
            <PlusIcon className="h-4 w-4" />
            Upload File
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((item) => {
            let formattedDate = 'Recently';
            try {
              formattedDate = format(new Date(item.uploadedAt), 'MMM d, yyyy');
            } catch {}

            return (
              <div
                key={item.id}
                className="group relative flex flex-col overflow-hidden rounded-xl border border-bone-200 bg-white shadow-sm transition-all hover:border-ink-900 hover:shadow-md">
                {/* Media preview area */}
                <div
                  onClick={() => setPreviewItem(item)}
                  className="relative aspect-video w-full cursor-pointer overflow-hidden bg-ink-950">
                  {item.type === 'video' ? (
                    <div className="relative h-full w-full">
                      <video src={item.url} className="h-full w-full object-cover" preload="metadata" />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-colors">
                        <span className="grid h-10 w-10 place-items-center rounded-full bg-white/90 text-ink-950 shadow-md group-hover:scale-110 transition-transform">
                          <PlayIcon className="h-5 w-5 ml-0.5 fill-current" />
                        </span>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={item.url}
                      alt={item.originalName}
                      className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                    />
                  )}

                  <span className="absolute left-2.5 top-2.5 rounded-full bg-ink-950/80 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur">
                    {item.type}
                  </span>

                  <span className="absolute right-2.5 top-2.5 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-ink-800 shadow-sm">
                    {formatBytes(item.size)}
                  </span>
                </div>

                {/* Info & Actions */}
                <div className="flex flex-1 flex-col justify-between p-3.5">
                  <div>
                    <p className="truncate text-xs font-semibold text-ink-950" title={item.originalName}>
                      {item.originalName}
                    </p>
                    <p className="mt-0.5 text-[11px] text-ink-500">{formattedDate}</p>
                  </div>

                  <div className="mt-3.5 flex items-center justify-between border-t border-bone-100 pt-2.5">
                    <button
                      type="button"
                      onClick={() => handleCopyUrl(item)}
                      className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-ink-700 hover:bg-bone-100 hover:text-ink-950">
                      {copiedId === item.id ? (
                        <>
                          <CheckIcon className="h-3.5 w-3.5 text-emerald-600" />
                          <span className="text-emerald-700 font-semibold">Copied!</span>
                        </>
                      ) : (
                        <>
                          <CopyIcon className="h-3.5 w-3.5" />
                          <span>Copy URL</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(item.id, item.originalName)}
                      aria-label="Delete media"
                      className="grid h-7 w-7 place-items-center rounded-md text-ink-400 hover:bg-red-50 hover:text-red-700 transition-colors">
                      <Trash2Icon className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Full Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/90 p-4 backdrop-blur-md">
          <div className="relative flex max-h-[90vh] w-full max-w-4xl flex-col items-center justify-center overflow-hidden rounded-xl bg-ink-900 p-4">
            <button
              type="button"
              onClick={() => setPreviewItem(null)}
              className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full bg-ink-950/80 text-white hover:bg-ink-950">
              <XIcon className="h-5 w-5" />
            </button>

            <div className="flex max-h-[70vh] w-full items-center justify-center overflow-hidden rounded-lg bg-black">
              {previewItem.type === 'video' ? (
                <video src={previewItem.url} controls autoPlay className="max-h-[70vh] w-full" />
              ) : (
                <img src={previewItem.url} alt={previewItem.originalName} className="max-h-[70vh] w-auto object-contain" />
              )}
            </div>

            <div className="mt-4 flex w-full flex-wrap items-center justify-between gap-3 px-2 text-white">
              <div>
                <p className="font-display text-sm font-semibold">{previewItem.originalName}</p>
                <p className="text-xs text-bone-100/60">
                  {formatBytes(previewItem.size)} · {previewItem.mimeType} · {previewItem.provider} storage
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopyUrl(previewItem)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-white hover:bg-white/20">
                  {copiedId === previewItem.id ? <CheckIcon className="h-3.5 w-3.5 text-signal" /> : <CopyIcon className="h-3.5 w-3.5" />}
                  {copiedId === previewItem.id ? 'URL Copied!' : 'Copy Public URL'}
                </button>
                <a
                  href={previewItem.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-signal px-4 py-2 text-xs font-semibold text-ink-950 hover:bg-white">
                  <ExternalLinkIcon className="h-3.5 w-3.5" />
                  Open Direct File
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cloud Storage Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-xl border border-bone-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-bone-200 pb-4">
              <div>
                <h3 className="font-display text-lg font-bold text-ink-900">Media Storage Engine</h3>
                <p className="text-xs text-ink-500">Configure where your uploaded photos and videos are stored.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowSettings(false)}
                className="grid h-8 w-8 place-items-center rounded-full text-ink-400 hover:bg-bone-100 hover:text-ink-900">
                <XIcon className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveConfig} className="mt-5 space-y-4 text-ink-900">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink-700">
                  Active Storage Provider
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['local', 'cloudinary', 'supabase'] as const).map((prov) => (
                    <button
                      key={prov}
                      type="button"
                      onClick={() => setConfig({ ...config, provider: prov })}
                      className={`rounded-lg border p-3 text-center text-xs font-semibold capitalize transition-all ${
                        config.provider === prov
                          ? 'border-ink-900 bg-ink-900 text-white shadow-sm'
                          : 'border-bone-200 bg-bone-50 text-ink-700 hover:bg-white'
                      }`}>
                      {prov === 'local' ? 'Local Disk' : prov === 'cloudinary' ? 'Cloudinary' : 'Supabase'}
                    </button>
                  ))}
                </div>
              </div>

              {config.provider === 'local' && (
                <div className="rounded-lg bg-bone-50 p-3.5 border border-bone-200 text-xs leading-relaxed text-ink-600">
                  <p className="font-semibold text-ink-900">Local Disk Storage Active</p>
                  <p className="mt-1">
                    Uploaded images and videos are saved directly inside <code className="bg-bone-200 px-1 py-0.5 rounded text-ink-950">public/uploads/</code> and served at fast local URLs. Ideal for development and local testing.
                  </p>
                </div>
              )}

              {config.provider === 'cloudinary' && (
                <div className="space-y-3 rounded-lg bg-bone-50 p-4 border border-bone-200">
                  <p className="text-xs font-semibold text-ink-900">Cloudinary Credentials</p>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-ink-700">Cloud Name</label>
                    <input
                      type="text"
                      value={config.cloudinary?.cloudName || ''}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          cloudinary: { ...config.cloudinary, cloudName: e.target.value, uploadPreset: config.cloudinary?.uploadPreset || '' }
                        })
                      }
                      placeholder="e.g. demic-structures"
                      className="w-full rounded-md border border-bone-200 bg-white px-3 py-2 text-xs focus:border-ink-900 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-ink-700">Upload Preset (Unsigned)</label>
                    <input
                      type="text"
                      value={config.cloudinary?.uploadPreset || ''}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          cloudinary: { ...config.cloudinary, uploadPreset: e.target.value, cloudName: config.cloudinary?.cloudName || '' }
                        })
                      }
                      placeholder="e.g. ml_default"
                      className="w-full rounded-md border border-bone-200 bg-white px-3 py-2 text-xs focus:border-ink-900 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {config.provider === 'supabase' && (
                <div className="space-y-3 rounded-lg bg-bone-50 p-4 border border-bone-200">
                  <p className="text-xs font-semibold text-ink-900">Supabase Storage</p>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-ink-700">Project URL</label>
                    <input
                      type="url"
                      value={config.supabase?.url || ''}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          supabase: { ...config.supabase, url: e.target.value, anonKey: config.supabase?.anonKey || '', bucket: config.supabase?.bucket || 'media' }
                        })
                      }
                      placeholder="https://xyz.supabase.co"
                      className="w-full rounded-md border border-bone-200 bg-white px-3 py-2 text-xs focus:border-ink-900 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-ink-700">Anon Key</label>
                    <input
                      type="text"
                      value={config.supabase?.anonKey || ''}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          supabase: { ...config.supabase, anonKey: e.target.value, url: config.supabase?.url || '', bucket: config.supabase?.bucket || 'media' }
                        })
                      }
                      placeholder="eyJhbGciOi..."
                      className="w-full rounded-md border border-bone-200 bg-white px-3 py-2 text-xs focus:border-ink-900 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSettings(false)}
                  className="rounded-full border border-bone-200 px-4 py-2 text-xs font-semibold text-ink-700 hover:bg-bone-100">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingConfig}
                  className="inline-flex items-center gap-1.5 rounded-full bg-signal px-5 py-2 text-xs font-semibold text-ink-950 hover:bg-signal-dark">
                  {savingConfig ? <Loader2Icon className="h-3.5 w-3.5 animate-spin" /> : configSaved ? <CheckIcon className="h-3.5 w-3.5 text-emerald-800" /> : null}
                  {savingConfig ? 'Saving…' : configSaved ? 'Saved!' : 'Save Settings'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
