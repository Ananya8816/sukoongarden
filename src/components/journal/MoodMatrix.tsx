import { useState } from "react";
import { Brain } from "lucide-react";

const MOODS = [
  { id: "radiant", label: "Radiant", emoji: "☀️", color: "from-amber-400/80 to-orange-500/80" },
  { id: "calm", label: "Calm", emoji: "🌊", color: "from-sky-400/80 to-cyan-500/80" },
  { id: "focused", label: "Focused", emoji: "🎯", color: "from-violet-400/80 to-purple-500/80" },
  { id: "tired", label: "Tired", emoji: "🌙", color: "from-indigo-400/80 to-blue-600/80" },
  { id: "anxious", label: "Anxious", emoji: "🌫️", color: "from-slate-400/80 to-slate-600/80" },
  { id: "grateful", label: "Grateful", emoji: "🌸", color: "from-rose-400/80 to-pink-500/80" },
];

export function MoodMatrix() {
  const [selected, setSelected] = useState<string | null>("calm");

  return (
    <div className="glass rounded-3xl p-6 transition-all duration-300 hover:border-primary/40">
      <div className="mb-5 flex items-center gap-3">
        <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-primary/80 to-lavender/80 text-primary-foreground">
          <Brain className="size-5" />
        </span>
        <div className="min-w-0">
          <h3 className="text-sm font-semibold tracking-tight">State of Mind Matrix</h3>
          <p className="text-xs text-muted-foreground">How are you arriving today?</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {MOODS.map((m) => {
          const isActive = selected === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setSelected(m.id)}
              className={`group flex flex-col items-center gap-2 rounded-2xl border p-3 transition-all duration-300 ease-in-out active:scale-95 ${
                isActive
                  ? "border-primary/60 bg-secondary shadow-lg shadow-primary/10"
                  : "border-border/60 hover:border-primary/40 hover:bg-secondary/50"
              }`}
            >
              <span
                className={`grid size-11 place-items-center rounded-full bg-gradient-to-br ${m.color} text-lg transition-transform duration-300 group-hover:scale-110 ${
                  isActive ? "scale-110" : ""
                }`}
              >
                {m.emoji}
              </span>
              <span className="text-xs font-medium">{m.label}</span>
            </button>
          );
        })}
      </div>

      {selected && (
        <p className="mt-4 animate-fade-in text-center text-xs text-muted-foreground">
          Logged today as{" "}
          <span className="text-foreground">{MOODS.find((m) => m.id === selected)?.label}</span>
        </p>
      )}
    </div>
  );
}
