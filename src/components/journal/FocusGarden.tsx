import { useEffect, useRef, useState } from "react";
import { Play, Square, Check, Timer, Leaf, Sparkles } from "lucide-react";
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

  // reset timer when plant changes (only while idle)
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

  // detect maturation
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
  const Icon = selected.icon;

  return (
    <section className="glass-strong relative overflow-hidden rounded-[2rem] p-7 md:p-9">
      <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -left-20 size-72 rounded-full bg-accent/20 blur-3xl" />

      <div className="relative mb-7 flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-lg shadow-primary/20">
          <Leaf className="size-5" />
        </span>
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Time-Off Focus Garden</h2>
          <p className="text-xs text-muted-foreground">
            Choose a plant, commit to focus, and watch it grow.
          </p>
        </div>
      </div>

      <div className="relative grid gap-8 lg:grid-cols-[1.1fr_1fr]">
        {/* Plant selection drawer */}
        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Plant Selection Drawer
          </p>
          <div className="space-y-3">
            {PLANT_SPECIES.map((p) => {
              const PIcon = p.icon;
              const isSel = selected.id === p.id;
              const locked = status !== "idle";
              return (
                <button
                  key={p.id}
                  disabled={locked}
                  onClick={() => setSelected(p)}
                  className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all duration-300 ease-in-out disabled:cursor-not-allowed disabled:opacity-50 ${
                    isSel
                      ? "border-primary/60 bg-secondary shadow-lg shadow-primary/10"
                      : "border-border/60 hover:border-primary/40 hover:bg-secondary/50"
                  }`}
                >
                  <span
                    className={`grid size-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${p.accent} text-white transition-transform duration-300 ${
                      isSel ? "scale-105" : ""
                    }`}
                  >
                    <PIcon className="size-6" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="truncate text-sm font-semibold">{p.name}</span>
                      <span className="rounded-full border border-border/60 px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
                        {p.tierLabel}
                      </span>
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                      {p.description}
                    </span>
                  </span>
                  <span className="flex shrink-0 items-center gap-1 text-xs font-medium text-primary">
                    <Timer className="size-3.5" />
                    {p.durationLabel}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Visual growth core */}
        <div className="flex flex-col items-center justify-center rounded-[1.75rem] border border-border/60 bg-secondary/20 p-8">
          <div className="relative grid size-52 place-items-center">
            {/* progress ring */}
            <svg className="absolute size-52 -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="44"
                fill="none"
                strokeWidth="3"
                className="stroke-border/50"
              />
              <circle
                cx="50"
                cy="50"
                r="44"
                fill="none"
                strokeWidth="3"
                strokeLinecap="round"
                className="stroke-primary transition-all duration-1000 ease-linear"
                strokeDasharray={2 * Math.PI * 44}
                strokeDashoffset={2 * Math.PI * 44 * (1 - progress)}
              />
            </svg>

            <div
              className={`grid size-36 place-items-center rounded-full bg-gradient-to-br ${selected.accent} shadow-2xl transition-all duration-500 ${
                status === "running"
                  ? "animate-pulse-soft"
                  : status === "matured"
                    ? "animate-grow-in scale-105"
                    : ""
              }`}
            >
              {status === "matured" ? (
                <Check className="size-16 text-white" />
              ) : (
                <Icon className="size-16 text-white" />
              )}
            </div>
          </div>

          <div className="mt-6 text-center">
            {status === "matured" ? (
              <div className="animate-fade-in">
                <p className="flex items-center justify-center gap-1.5 text-base font-semibold text-gradient">
                  <Sparkles className="size-4 text-primary" /> Maturation complete
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {selected.name} grew into your Garden Place
                </p>
              </div>
            ) : (
              <>
                <p className="font-mono text-4xl font-semibold tabular-nums tracking-tight">
                  {formatMMSS(remaining)}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {status === "running"
                    ? `Cultivating ${selected.name}…`
                    : `${selected.durationLabel} to grow ${selected.name}`}
                </p>
              </>
            )}
          </div>

          <button
            onClick={status === "running" ? terminate : start}
            disabled={status === "matured"}
            className={`mt-6 inline-flex items-center gap-2 rounded-full px-8 py-3 text-sm font-medium transition-all duration-300 active:scale-95 disabled:opacity-60 ${
              status === "running"
                ? "bg-destructive/90 text-destructive-foreground hover:bg-destructive hover:shadow-lg hover:shadow-destructive/20"
                : "bg-primary text-primary-foreground hover:shadow-lg hover:shadow-primary/30"
            }`}
          >
            {status === "running" ? (
              <>
                <Square className="size-4" /> Terminate
              </>
            ) : (
              <>
                <Play className="size-4" /> Start Focus
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
