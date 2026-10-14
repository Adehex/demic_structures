import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, PanInfo } from 'framer-motion';
import { CalendarClockIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { BuildStage, StageStatus } from '../../data/caseStudy';

type StageViewerProps = {
  stages: BuildStage[];
};

const ease = [0.23, 1, 0.32, 1] as const;
const SWIPE_THRESHOLD = 60;

const statusLabel: Record<StageStatus, string> = {
  done: 'Complete',
  current: 'In progress',
  upcoming: 'Up next'
};

export function StageViewer({ stages }: StageViewerProps) {
  const [stageIndex, setStageIndex] = useState(0);
  const [photoIndex, setPhotoIndex] = useState(0);
  const tablistRef = useRef<HTMLDivElement | null>(null);
  const chipRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const isFirstRender = useRef(true);
  const stage = stages[stageIndex];
  const photo = stage.photos[photoIndex] ?? stage.photos[0];
  const multi = stage.photos.length > 1;

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const container = tablistRef.current;
    const chip = chipRefs.current[stageIndex];
    if (container && chip) {
      const containerRect = container.getBoundingClientRect();
      const chipRect = chip.getBoundingClientRect();
      const targetScrollLeft =
        container.scrollLeft +
        (chipRect.left - containerRect.left) -
        (container.clientWidth / 2) +
        (chipRect.width / 2);

      container.scrollTo({
        left: Math.max(0, targetScrollLeft),
        behavior: 'smooth'
      });
    }
  }, [stageIndex]);

  const goToStage = (index: number) => {
    setStageIndex(index);
    setPhotoIndex(0);
  };

  const step = (dir: 1 | -1) => setPhotoIndex((p) => (p + dir + stage.photos.length) % stage.photos.length);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (!multi) return;
    if (info.offset.x < -SWIPE_THRESHOLD) step(1);else
    if (info.offset.x > SWIPE_THRESHOLD) step(-1);
  };

  return (
    <div>
      {/* Stage selector — scrollable chips on phones, progress bar on larger screens */}
      <div
        ref={tablistRef}
        role="tablist"
        aria-label="Construction stages"
        style={{ gridTemplateColumns: `repeat(${stages.length}, minmax(0, 1fr))` }}
        className="-mx-5 flex snap-x gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:-mx-6 sm:px-6 md:mx-0 md:grid md:gap-0 md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden">
        
        {stages.map((s, i) => {
          const isActive = i === stageIndex;
          const isUpcoming = s.status === 'upcoming';
          return (
            <button
              key={s.id}
              ref={(el) => chipRefs.current[i] = el}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls="stage-panel"
              onClick={() => goToStage(i)}
              className={`group shrink-0 snap-start rounded-full border px-4 py-2.5 text-left transition-colors duration-150 ease-out md:flex md:flex-col md:items-start md:rounded-none md:border-0 md:px-0 md:py-0 md:pr-4 ${
              isActive ?
              'border-ink-900 bg-ink-900 text-white md:bg-transparent' :
              isUpcoming ?
              'border-dashed border-bone-200 bg-white' :
              'border-bone-200 bg-white'}`
              }>
              
              <span className="hidden h-1 w-full overflow-hidden bg-bone-200 md:block">
                <span
                  className={`block h-full transition-colors duration-200 ease-out ${
                  s.status === 'done' ?
                  'w-full bg-signal' :
                  s.status === 'current' ?
                  'w-1/2 bg-signal' :
                  'w-0'} ${
                  isActive && isUpcoming ? '!w-full !bg-ink-400' : ''}`} />
                
              </span>
              <span
                className={`flex items-center gap-1.5 text-xs font-semibold md:mt-4 md:tracking-[0.14em] ${
                isActive ? 'text-signal md:text-signal-dark' : 'text-ink-400'}`
                }>
                
                <span className="md:hidden">{i + 1}. </span>
                <span className="hidden md:inline">Stage {i + 1}</span>
                {s.status === 'current' &&
                <span className="h-1.5 w-1.5 rounded-full bg-signal" aria-label="In progress" />
                }
              </span>
              <span
                className={`whitespace-nowrap text-sm font-semibold md:mt-1 md:font-display md:text-[15px] ${
                isActive ?
                'text-white md:text-ink-900' :
                isUpcoming ?
                'text-ink-400' :
                'text-ink-700 md:text-ink-600 md:group-hover:text-ink-900'}`
                }>
                
                {s.label}
              </span>
            </button>);

        })}
      </div>

      {/* Stage panel */}
      <div id="stage-panel" role="tabpanel" className="mt-6 grid gap-6 md:mt-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-6">
          {photo ?
          <>
              <div className="relative overflow-hidden rounded-sm bg-ink-900">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.img
                  key={photo.src}
                  src={photo.src}
                  alt={photo.alt}
                  drag={multi ? 'x' : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.25}
                  onDragEnd={onDragEnd}
                  initial={{ opacity: 0, scale: 0.985 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.24, ease }}
                  draggable={false}
                  className={`aspect-[4/5] max-h-[70svh] w-full select-none object-cover lg:max-h-none ${
                  multi ? 'cursor-grab active:cursor-grabbing' : ''}`
                  } />
                
                </AnimatePresence>

                {multi &&
              <div className="absolute bottom-3 right-3 flex items-center gap-2 sm:bottom-4 sm:right-4">
                    <button
                  type="button"
                  aria-label="Previous photo"
                  onClick={() => step(-1)}
                  className="grid h-11 w-11 place-items-center rounded-full bg-ink-950/80 text-white transition-colors duration-150 ease-out hover:bg-signal hover:text-ink-950">
                  
                      <ChevronLeftIcon className="h-5 w-5" />
                    </button>
                    <span className="min-w-[3.5rem] rounded-full bg-ink-950/80 px-3 py-2 text-center text-xs font-semibold text-white">
                      {photoIndex + 1} / {stage.photos.length}
                    </span>
                    <button
                  type="button"
                  aria-label="Next photo"
                  onClick={() => step(1)}
                  className="grid h-11 w-11 place-items-center rounded-full bg-ink-950/80 text-white transition-colors duration-150 ease-out hover:bg-signal hover:text-ink-950">
                  
                      <ChevronRightIcon className="h-5 w-5" />
                    </button>
                  </div>
              }
              </div>
              {multi && <p className="mt-2 text-center text-xs text-ink-400 lg:hidden">Swipe the photo to see more</p>}
            </> :

          <div className="flex aspect-[4/3] w-full flex-col items-center justify-center rounded-sm border-2 border-dashed border-bone-200 bg-bone-50 p-8 text-center lg:aspect-[4/5]">
              <CalendarClockIcon className="h-8 w-8 text-ink-400" aria-hidden="true" />
              <p className="mt-4 font-display text-lg font-semibold text-ink-900">Not started yet</p>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-ink-600">
                Photos from this stage will be added here as soon as work begins on site.
              </p>
            </div>
          }
        </div>

        <div className="flex flex-col lg:col-span-6">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22, ease }}>
              
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-xs font-semibold tracking-[0.14em] text-signal-dark">
                  Stage {stageIndex + 1} of {stages.length}
                </p>
                <span
                  className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                  stage.status === 'done' ?
                  'bg-bone-100 text-ink-700' :
                  stage.status === 'current' ?
                  'bg-signal-soft text-ink-900' :
                  'border border-dashed border-bone-200 text-ink-600'}`
                  }>
                  
                  {statusLabel[stage.status]}
                </span>
              </div>
              <h3 className="mt-2 font-display text-2xl font-bold leading-tight tracking-tightest text-ink-900 lg:mt-3 lg:text-3xl">
                {stage.title}
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-600 lg:mt-4">{stage.summary}</p>

              <ul className="mt-5 grid gap-x-6 gap-y-3 border-t border-bone-200 pt-5 sm:grid-cols-2 lg:mt-6 lg:pt-6">
                {stage.works.map((work) =>
                <li key={work} className="flex gap-3 text-sm text-ink-800">
                    <span
                    className={`mt-1.5 h-1.5 w-1.5 shrink-0 ${stage.status === 'upcoming' ? 'border border-ink-400' : 'bg-signal'}`}
                    aria-hidden="true" />
                  
                    {work}
                  </li>
                )}
              </ul>

              {multi &&
              <div className="mt-8 hidden grid-cols-5 gap-3 lg:grid">
                  {stage.photos.map((p, i) =>
                <button
                  key={p.src}
                  type="button"
                  aria-label={`Show photo ${i + 1}`}
                  aria-pressed={i === photoIndex}
                  onClick={() => setPhotoIndex(i)}
                  className={`overflow-hidden rounded-sm border-2 transition-colors duration-150 ease-out ${
                  i === photoIndex ? 'border-signal' : 'border-transparent hover:border-bone-200'}`
                  }>
                  
                      <img src={p.src} alt="" className="aspect-square w-full object-cover" />
                    </button>
                )}
                </div>
              }
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 grid grid-cols-2 gap-3 lg:mt-auto lg:flex lg:items-center lg:justify-between lg:gap-4 lg:pt-10">
            <button
              type="button"
              onClick={() => goToStage(Math.max(0, stageIndex - 1))}
              disabled={stageIndex === 0}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-bone-200 py-3 text-sm font-semibold text-ink-900 transition-colors duration-150 ease-out hover:text-signal-dark disabled:cursor-not-allowed disabled:text-ink-400 lg:border-0 lg:py-0">
              
              <ChevronLeftIcon className="h-4 w-4" />
              <span className="lg:hidden">Previous</span>
              <span className="hidden lg:inline">Previous stage</span>
            </button>
            <button
              type="button"
              onClick={() => goToStage(Math.min(stages.length - 1, stageIndex + 1))}
              disabled={stageIndex === stages.length - 1}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-ink-900 px-5 py-3 text-sm font-semibold text-white transition-colors duration-150 ease-out hover:bg-signal hover:text-ink-950 disabled:cursor-not-allowed disabled:bg-bone-200 disabled:text-ink-400 lg:py-2.5">
              
              Next stage
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>);

}