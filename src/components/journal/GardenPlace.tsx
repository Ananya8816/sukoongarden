import { useEffect, useState } from "react";
import { Sprout, Flower, Sparkles } from "lucide-react";
import { formatRelativeTime, type GrownPlant } from "@/lib/plants";

interface GardenPlaceProps {
  plants: GrownPlant[];
  onVisit?: () => void;
}

export function GardenPlace({ plants, onVisit }: GardenPlaceProps) {
  const [, setNow] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setNow((n) => n + 1), 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="paper blob-1 relative overflow-hidden p-7 md:p-10">
      <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-full bg-terracotta/15 text-terracotta">
            <Flower className="size-5" />
          </span>
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              The Garden Place
            </h2>
            <p className="text-sm tracking-wide text-muted-foreground">
              A little scrapbook of everything you've grown
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {onVisit && (
            <button
              onClick={onVisit}
              className="inline-flex items-center gap-2 rounded-full bg-sage px-4 py-2 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:shadow-md hover:shadow-sage/25 active:scale-95"
            >
              <Sparkles className="size-4" /> See it in the park
            </button>
          )}
          <span className="rounded-full bg-oatmeal/70 px-3.5 py-1.5 text-sm font-medium text-muted-foreground">
            {plants.length} pressed
          </span>
        </div>
      </div>

      {plants.length === 0 ? (
        <div className="grid place-items-center py-16 text-center">
          <Sprout className="mb-3 size-8 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">
            Finish a focus session to press your first plant into the book.
          </p>
        </div>
      ) : (
        <div className="flex flex-wrap items-end justify-center gap-x-6 gap-y-10 px-2 py-4 sm:gap-x-10">
          {plants.map((p, i) => {
            // gentle vertical scatter for a meadow feel
            const offset = i % 3 === 0 ? "sm:-translate-y-4" : i % 3 === 2 ? "sm:translate-y-3" : "";
            return (
              <figure
                key={p.uid}
                style={{ transform: `rotate(${p.tilt}deg)` }}
                className={`group relative animate-grow-in ${offset} transition-transform duration-300 hover:!rotate-0 hover:-translate-y-1`}
              >
                {/* washi-tape pin */}
                <span className="absolute -top-3 left-1/2 z-10 h-5 w-16 -translate-x-1/2 -rotate-2 rounded-[3px] bg-sage/30 backdrop-blur-sm" />
                {/* polaroid */}
                <div className="w-40 bg-card p-3 pb-5 shadow-[0_14px_30px_-14px_oklch(0.5_0.07_50_/_35%)] sm:w-44">
                  <div className="grid aspect-square place-items-center overflow-hidden rounded-md bg-oatmeal/50">
                    {p.image ? (
                      <img
                        src={p.image}
                        alt={p.name}
                        loading="lazy"
                        width={1024}
                        height={1024}
                        className="size-32 object-contain transition-transform duration-500 group-hover:scale-110 sm:size-36"
                      />
                    ) : (
                      <span className="text-7xl leading-none transition-transform duration-500 group-hover:scale-110 sm:text-8xl">
                        {p.glyph}
                      </span>
                    )}
                  </div>
                  <figcaption className="mt-3 text-center">
                    <p className="font-display text-base font-medium leading-tight text-foreground">
                      {p.name}
                    </p>
                    <p className="mt-0.5 text-[11px] uppercase tracking-[0.15em] text-clay">
                      Cultivated · {p.tierLabel}
                    </p>
                    <p className="mt-1 font-display text-xs italic text-muted-foreground">
                      {formatRelativeTime(p.completedAt)}
                    </p>
                  </figcaption>
                </div>
              </figure>
            );
          })}
        </div>
      )}
    </section>
  );
}
