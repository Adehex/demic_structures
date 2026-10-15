import type { MediaConfig, MediaItem } from '../types/media';

/**
 * Reads a File object into a base64 string
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error(`Failed to read file ${file.name}`));
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1] || result;
      resolve(base64);
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Uploads a file using the configured provider (Local server or Cloudinary/Supabase)
 */
export async function uploadMediaFile(file: File, config?: MediaConfig): Promise<MediaItem> {
  // 1. Cloudinary upload if configured
  if (config?.provider === 'cloudinary' && config.cloudinary?.cloudName && config.cloudinary?.uploadPreset) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', config.cloudinary.uploadPreset);

    const isVideo = file.type.startsWith('video/');
    const endpoint = `https://api.cloudinary.com/v1_1/${config.cloudinary.cloudName}/${isVideo ? 'video' : 'image'}/upload`;

    const res = await fetch(endpoint, {
      method: 'POST',
      body: formData
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || 'Cloudinary upload failed');
    }

    const data = await res.json();
    const mediaItem: MediaItem = {
      id: 'med_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      filename: data.public_id + '.' + data.format,
      originalName: file.name,
      url: data.secure_url || data.url,
      mimeType: file.type,
      size: data.bytes || file.size,
      type: isVideo ? 'video' : 'image',
      uploadedAt: new Date().toISOString(),
      provider: 'cloudinary'
    };

    // Register with local database
    await fetch('/api/media', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mediaItem)
    });

    return mediaItem;
  }

  // 2. Default: Local Server Upload (/api/upload)
  const base64 = await fileToBase64(file);
  const payload = {
    originalName: file.name,
    mimeType: file.type,
    base64
  };

  const res = await fetch('/api/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Server upload failed');
  }

  const result = await res.json();
  return result.media as MediaItem;
}

export function formatBytes(bytes: number, decimals = 1): string {
  if (!+bytes) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
