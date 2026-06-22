import { useEffect, useRef, useState } from "react";
import { Play, Square, Check, Clock, Leaf, Sparkles } from "lucide-react";
import { PLANT_SPECIES, formatMMSS, type PlantSpecies } from "@/lib/plants";

interface FocusGardenProps {
  onComplete: (species: PlantSpecies) => void;
}

type Status = "idle" | "running" | "matured";

export function FocusGarden({ onComplete }: FocusGardenProps) {
  const [selected, setSelected] = useState<PlantSpecies>(PLANT_SPECIES[0]);
  const [status, setStatus] = useState<Status>("idle");
  const [remaining, setRemaining] = useState(PLANT_SPECIES[0].durationSeconds);
  const completedRef = useRef(false);

  useEffect(() => {
    if (status === "idle") setRemaining(selected.durationSeconds);
  }, [selected, status]);

  useEffect(() => {
    if (status !== "running") return;
    const id = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(id);
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [status]);

  useEffect(() => {
    if (status === "running" && remaining === 0 && !completedRef.current) {
      completedRef.current = true;
      setStatus("matured");
      onComplete(selected);
      const t = setTimeout(() => {
        setStatus("idle");
        completedRef.current = false;
        setRemaining(selected.durationSeconds);
      }, 4000);
      return () => clearTimeout(t);
    }
  }, [remaining, status, selected, onComplete]);

  const start = () => {
    completedRef.current = false;
    setRemaining(selected.durationSeconds);
    setStatus("running");
  };

  const terminate = () => {
    setStatus("idle");
    completedRef.current = false;
    setRemaining(selected.durationSeconds);
  };

  const total = selected.durationSeconds;
  const progress = total > 0 ? (total - remaining) / total : 0;

  return (
    <section className="paper-strong blob-2 relative overflow-hidden p-7 md:p-10">
      <div className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-sage/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-16 size-64 rounded-full bg-terracotta/10 blur-3xl" />

      <div className="relative mb-8 flex items-center gap-3">
        <span className="grid size-11 place-items-center rounded-full bg-sage/15 text-sage">
          <Leaf className="size-5" />
        </span>
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Time-Off Focus Garden
          </h2>
          <p className="text-sm tracking-wide text-muted-foreground">
            Pick a seedling, settle in, and let it grow with your focus.
          </p>
        </div>
      </div>

      <div className="relative grid gap-8 lg:grid-cols-[1.05fr_1fr]">
        {/* Plant selection drawer */}
        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            Choose your plant
          </p>
          <div className="space-y-4">
            {PLANT_SPECIES.map((p) => {
              const isSel = selected.id === p.id;
              const locked = status !== "idle";
              return (
                <button
                  key={p.id}
                  disabled={locked}
                  onClick={() => setSelected(p)}
                  className={`flex w-full items-center gap-4 p-3.5 text-left transition-all duration-300 ease-in-out blob-1 disabled:cursor-not-allowed disabled:opacity-50 ${
                    isSel
                      ? "bg-secondary shadow-[0_10px_30px_-14px_oklch(0.5_0.07_50_/_30%)] ring-1 ring-sage/40"
                      : "bg-card/60 hover:bg-secondary/70 hover:shadow-[0_10px_30px_-16px_oklch(0.5_0.07_50_/_25%)]"
                  }`}
                >
                  <span
                    className={`grid size-16 shrink-0 place-items-center rounded-full bg-oatmeal/70 transition-transform duration-300 ${
                      isSel ? "scale-105" : ""
                    }`}
                  >
                    <img
                      src={p.image}
                      alt={p.name}
                      loading="lazy"
                      width={1024}
                      height={1024}
                      className="size-14 object-contain"
                    />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="font-display text-lg font-medium text-foreground">
                        {p.name}
                      </span>
                      <span className="rounded-full bg-clay/10 px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-clay">
                        {p.tierLabel}
                      </span>
                    </span>
                    <span className="mt-0.5 block text-sm text-muted-foreground">
                      {p.description}
                    </span>
                  </span>
                  <span className="flex shrink-0 items-center gap-1.5 text-sm font-semibold text-sage">
                    <Clock className="size-4" />
                    {p.durationLabel}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Visual growth core */}
        <div className="flex flex-col items-center justify-center blob-3 bg-oatmeal/40 p-8">
          <div className="relative grid size-56 place-items-center">
            <svg className="absolute size-56 -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                strokeWidth="2.5"
                className="stroke-border"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="stroke-sage transition-all duration-1000 ease-linear"
                strokeDasharray={2 * Math.PI * 45}
                strokeDashoffset={2 * Math.PI * 45 * (1 - progress)}
              />
            </svg>

            <div
              className={`grid size-44 place-items-center rounded-full bg-card/70 shadow-[inset_0_2px_12px_oklch(0.55_0.05_60_/_10%)] transition-all duration-500 ${
                status === "running"
                  ? "animate-pulse-soft"
                  : status === "matured"
                    ? "animate-grow-in"
                    : "animate-float"
              }`}
            >
              {status === "matured" ? (
                <span className="relative grid place-items-center">
                  <img
                    src={selected.image}
                    alt={selected.name}
                    width={1024}
                    height={1024}
                    className="size-36 object-contain"
                  />
                  <span className="absolute -right-1 -top-1 grid size-9 place-items-center rounded-full bg-sage text-primary-foreground shadow-md">
                    <Check className="size-5" />
                  </span>
                </span>
              ) : (
                <img
                  src={selected.image}
                  alt={selected.name}
                  width={1024}
                  height={1024}
                  className={`object-contain transition-all duration-700 ${
                    status === "running" ? "size-40 saturate-100" : "size-28 opacity-90 saturate-[0.85]"
                  }`}
                />
              )}
            </div>
          </div>

          <div className="mt-6 text-center">
            {status === "matured" ? (
              <div className="animate-fade-in">
                <p className="flex items-center justify-center gap-1.5 font-display text-xl font-medium text-gradient">
                  <Sparkles className="size-5 text-terracotta" /> All grown up!
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {selected.name} was pressed into your scrapbook
                </p>
              </div>
            ) : (
              <>
                <p className="font-display text-5xl font-semibold tabular-nums tracking-tight text-foreground">
                  {formatMMSS(remaining)}
                </p>
                <p className="mt-1.5 text-sm tracking-wide text-muted-foreground">
                  {status === "running"
                    ? `Tending your ${selected.name}…`
                    : `${selected.durationLabel} to grow your ${selected.name}`}
                </p>
              </>
            )}
          </div>

          <button
            onClick={status === "running" ? terminate : start}
            disabled={status === "matured"}
            className={`mt-7 inline-flex items-center gap-2 rounded-full px-9 py-3.5 text-sm font-semibold tracking-wide transition-all duration-300 active:scale-95 disabled:opacity-60 ${
              status === "running"
                ? "bg-clay/90 text-primary-foreground hover:bg-clay hover:shadow-lg hover:shadow-clay/25"
                : "bg-sage text-primary-foreground hover:shadow-lg hover:shadow-sage/30"
            }`}
          >
            {status === "running" ? (
              <>
                <Square className="size-4" /> Stop tending
              </>
            ) : (
              <>
                <Play className="size-4" /> Start focus
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
