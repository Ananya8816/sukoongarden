import { useEffect, useState } from "react";
import { Wind, Play, Pause } from "lucide-react";

type Phase = "inhale" | "hold" | "exhale";

const PHASES: { key: Phase; label: string; seconds: number }[] = [
  { key: "inhale", label: "Breathe in", seconds: 4 },
  { key: "hold", label: "Hold", seconds: 7 },
  { key: "exhale", label: "Breathe out", seconds: 8 },
];

export function BreathingRegulator() {
  const [active, setActive] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [remaining, setRemaining] = useState(PHASES[0].seconds);
  const [cycles, setCycles] = useState(0);

  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => {
      setRemaining((r) => {
        if (r > 1) return r - 1;
        setPhaseIndex((pi) => {
          const next = (pi + 1) % PHASES.length;
          if (next === 0) setCycles((c) => c + 1);
          return next;
        });
        return -1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [active]);

  useEffect(() => {
    setRemaining(PHASES[phaseIndex].seconds);
  }, [phaseIndex]);

  const phase = PHASES[phaseIndex];

  const reset = () => {
    setActive(false);
    setPhaseIndex(0);
    setRemaining(PHASES[0].seconds);
  };

  const scale = phase.key === "exhale" ? "scale-50" : "scale-100";
  const duration =
    phase.key === "inhale"
      ? "duration-[4000ms]"
      : phase.key === "exhale"
        ? "duration-[8000ms]"
        : "duration-700";

  return (
    <div className="paper blob-1 p-6 transition-all duration-300">
      <div className="mb-5 flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-full bg-sage/15 text-sage">
          <Wind className="size-5" />
        </span>
        <div className="min-w-0">
          <h3 className="text-xl font-medium tracking-tight text-foreground">Quiet Breath</h3>
          <p className="text-xs tracking-wide text-muted-foreground">4 · 7 · 8 gentle reset</p>
        </div>
      </div>

      <div className="relative grid h-48 place-items-center">
        <div className="absolute size-44 rounded-full bg-sage/10 blur-xl" />
        <div className="relative grid size-44 place-items-center">
          <div
            className={`absolute size-44 rounded-full bg-sage/20 ${
              active ? scale : "scale-75"
            } transition-transform ${active ? duration : "duration-700"} ease-in-out`}
          />
          <div
            className={`absolute size-32 rounded-full bg-gradient-to-br from-sage/40 to-terracotta/30 ${
              active ? scale : "scale-75"
            } transition-transform ${active ? duration : "duration-700"} ease-in-out`}
          />
          <div className="relative z-10 text-center">
            <div className="font-display text-3xl font-semibold tabular-nums text-foreground">
              {Math.max(remaining, 0)}
            </div>
            <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              {active ? phase.label : "Ready"}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <span className="text-xs tracking-wide text-muted-foreground">
          Cycles: <span className="text-foreground">{cycles}</span>
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setActive((a) => !a)}
            className="inline-flex items-center gap-1.5 rounded-full bg-sage px-4 py-2 text-xs font-semibold tracking-wide text-primary-foreground transition-all duration-300 hover:shadow-md hover:shadow-sage/25 active:scale-95"
          >
            {active ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
            {active ? "Pause" : "Begin"}
          </button>
          <button
            onClick={reset}
            className="rounded-full bg-oatmeal/70 px-4 py-2 text-xs font-semibold tracking-wide text-muted-foreground transition-all duration-300 hover:bg-oatmeal active:scale-95"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
