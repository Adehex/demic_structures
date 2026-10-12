
type FootprintProps = {
  length: number;
  width: number;
};

/** To-scale plan outline of the building footprint. */
export function Footprint({ length, width }: FootprintProps) {
  const area = (length * width).toLocaleString();

  return (
    <figure className="mt-8 border-t border-bone-200 pt-6">
      <figcaption className="flex items-baseline justify-between gap-4">
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-400">Footprint to scale</span>
        <span className="font-display text-sm font-semibold text-ink-900">{area} m²</span>
      </figcaption>
      <div className="mt-4 flex items-center gap-3">
        <div className="flex-1">
          <div
            role="img"
            aria-label={`Warehouse footprint, ${length} metres long by ${width} metres wide`}
            style={{ aspectRatio: `${length} / ${width}` }}
            className="relative w-full border-2 border-ink-900 bg-signal-soft">
            
            {/* Bay lines every 6m for a sense of scale */}
            <div className="absolute inset-0 flex">
              {Array.from({ length: length / 6 }).map((_, i) =>
              <span key={i} className="h-full flex-1 border-r border-ink-900/10 last:border-0" />
              )}
            </div>
          </div>
          <p className="mt-2 text-center text-xs font-semibold text-ink-700">{length}m</p>
        </div>
        <p className="-mt-6 text-xs font-semibold text-ink-700">{width}m</p>
      </div>
    </figure>);

}