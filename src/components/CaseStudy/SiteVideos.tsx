import React from 'react';
import { SiteVideo } from '../../data/caseStudy';

type SiteVideosProps = {
  videos: SiteVideo[];
  note: string;
  projectName: string;
};

export function SiteVideos({ videos: allVideos, note, projectName }: SiteVideosProps) {
  const videos = allVideos.filter((v) => v.src.trim());
  if (videos.length === 0) return null;

  return (
    <div className="mt-16 border-t border-bone-200 pt-10 lg:mt-20 lg:pt-12">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-3">
        <h3 className="font-display text-2xl font-bold tracking-tightest text-ink-900">Straight from site</h3>
        <p className="max-w-md text-sm leading-relaxed text-ink-600">{note}</p>
      </div>
      {/* Swipeable row on phones, grid on desktop */}
      <div className="-mx-5 mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:-mx-6 sm:px-6 lg:mx-0 lg:mt-8 lg:grid lg:grid-cols-5 lg:gap-4 lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden">
        {videos.map((video) =>
        <video
          key={video.src}
          src={encodeURI(video.src)}
          controls
          playsInline
          preload="metadata"
          aria-label={`${video.title} — ${projectName}`}
          className="aspect-[3/4] w-[72%] shrink-0 snap-center rounded-sm bg-ink-950 object-cover sm:w-[45%] lg:w-full" />

        )}
      </div>
    </div>);

}