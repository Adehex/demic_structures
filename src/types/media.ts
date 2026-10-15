export type MediaItem = {
  id: string;
  filename: string;
  originalName: string;
  url: string;
  mimeType: string;
  size: number;
  type: 'image' | 'video';
  uploadedAt: string;
  provider: 'local' | 'cloudinary' | 'supabase';
};

export type MediaConfig = {
  provider: 'local' | 'cloudinary' | 'supabase';
  cloudinary?: {
    cloudName: string;
    uploadPreset: string;
    apiKey?: string;
  };
  supabase?: {
    url: string;
    anonKey: string;
    bucket: string;
  };
};
