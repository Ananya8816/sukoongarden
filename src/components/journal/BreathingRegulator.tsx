import { useEffect, useState } from "react";
import { Wind, Play, Pause } from "lucide-react";

type Phase = "inhale" | "hold" | "exhale";

const PHASES: { key: Phase; label: string; seconds: number }[] = [
  { key: "inhale", label: "Inhale", seconds: 4 },
  { key: "hold", label: "Hold", seconds: 7 },
  { key: "exhale", label: "Exhale", seconds: 8 },
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
        return -1; // signal handled below
      });
    }, 1000);
    return () => clearInterval(id);
  }, [active]);

  // When phase changes, reset its remaining seconds.
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
    <div className="glass rounded-3xl p-6 transition-all duration-300 hover:border-primary/40">
      <div className="mb-5 flex items-center gap-3">
        <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-accent/80 to-primary/80 text-accent-foreground">
          <Wind className="size-5" />
        </span>
        <div className="min-w-0">
          <h3 className="text-sm font-semibold tracking-tight">Somatic Breathing</h3>
          <p className="text-xs text-muted-foreground">4 · 7 · 8 nervous-system reset</p>
        </div>
      </div>

      <div className="relative grid h-48 place-items-center">
        <div className="absolute size-44 rounded-full bg-gradient-to-br from-primary/15 to-accent/15 blur-xl" />
        <div className="relative grid size-44 place-items-center">
          <div
            className={`absolute size-44 rounded-full bg-gradient-to-br from-primary/40 to-accent/40 ${
              active ? scale : "scale-75"
            } transition-transform ${active ? duration : "duration-700"} ease-in-out`}
          />
          <div
            className={`absolute size-32 rounded-full border border-primary/40 bg-gradient-to-br from-primary/60 to-accent/50 ${
              active ? scale : "scale-75"
            } transition-transform ${active ? duration : "duration-700"} ease-in-out`}
          />
          <div className="relative z-10 text-center">
            <div className="text-2xl font-semibold tabular-nums">{Math.max(remaining, 0)}</div>
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              {active ? phase.label : "Ready"}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          Cycles completed: <span className="text-foreground">{cycles}</span>
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setActive((a) => !a)}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary/90 px-4 py-2 text-xs font-medium text-primary-foreground transition-all duration-300 hover:bg-primary hover:shadow-lg hover:shadow-primary/20 active:scale-95"
          >
            {active ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
            {active ? "Pause" : "Begin"}
          </button>
          <button
            onClick={reset}
            className="rounded-full border border-border px-4 py-2 text-xs font-medium transition-all duration-300 hover:bg-secondary active:scale-95"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
