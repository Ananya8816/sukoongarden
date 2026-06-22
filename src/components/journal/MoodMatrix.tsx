import { useState } from "react";
import { Sparkles } from "lucide-react";

const MOODS = [
  { id: "radiant", label: "Radiant", emoji: "🌻" },
  { id: "calm", label: "Calm", emoji: "🍃" },
  { id: "focused", label: "Focused", emoji: "🌱" },
  { id: "tired", label: "Tired", emoji: "🌙" },
  { id: "tender", label: "Tender", emoji: "🤍" },
  { id: "grateful", label: "Grateful", emoji: "🌸" },
];

export function MoodMatrix() {
  const [selected, setSelected] = useState<string | null>("calm");

  return (
    <div className="paper blob-3 p-6 transition-all duration-300">
      <div className="mb-5 flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-full bg-clay/15 text-clay">
          <Sparkles className="size-5" />
        </span>
        <div className="min-w-0">
          <h3 className="text-xl font-medium tracking-tight text-foreground">How You Feel</h3>
          <p className="text-xs tracking-wide text-muted-foreground">A little check-in</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {MOODS.map((m) => {
          const isActive = selected === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setSelected(m.id)}
              className={`group flex flex-col items-center gap-2 p-3 blob-1 transition-all duration-300 ease-in-out active:scale-95 ${
                isActive
                  ? "bg-secondary shadow-[0_8px_22px_-12px_oklch(0.5_0.07_50_/_30%)] ring-1 ring-sage/40"
                  : "bg-oatmeal/40 hover:bg-secondary/70"
              }`}
            >
              <span
                className={`grid size-11 place-items-center rounded-full bg-card/70 text-xl transition-transform duration-300 group-hover:scale-110 ${
                  isActive ? "scale-110" : ""
                }`}
              >
                {m.emoji}
              </span>
              <span className="text-xs font-semibold tracking-wide text-foreground">{m.label}</span>
            </button>
          );
        })}
      </div>

      {selected && (
        <p className="mt-4 animate-fade-in text-center font-display text-sm italic text-muted-foreground">
          Feeling{" "}
          <span className="text-foreground">{MOODS.find((m) => m.id === selected)?.label}</span>{" "}
          today
        </p>
      )}
    </div>
  );
}
