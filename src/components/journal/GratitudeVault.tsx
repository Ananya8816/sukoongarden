import { useState } from "react";
import { Heart, Plus, Quote } from "lucide-react";

interface Entry {
  id: string;
  text: string;
  at: number;
}

const SEED: Entry[] = [
  { id: "s1", text: "Morning light through the window and a quiet, unhurried start.", at: Date.now() - 1000 * 60 * 90 },
  { id: "s2", text: "A long walk that cleared my head completely.", at: Date.now() - 1000 * 60 * 60 * 5 },
];

function relative(at: number) {
  const m = Math.floor((Date.now() - at) / 60000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export function GratitudeVault() {
  const [entries, setEntries] = useState<Entry[]>(SEED);
  const [draft, setDraft] = useState("");

  const add = () => {
    const text = draft.trim();
    if (!text) return;
    setEntries((e) => [{ id: crypto.randomUUID(), text, at: Date.now() }, ...e]);
    setDraft("");
  };

  return (
    <div className="glass flex h-full flex-col rounded-3xl p-6 transition-all duration-300 hover:border-primary/40">
      <div className="mb-5 flex items-center gap-3">
        <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-rose-400/80 to-fuchsia-500/80 text-white">
          <Heart className="size-5" />
        </span>
        <div className="min-w-0">
          <h3 className="text-sm font-semibold tracking-tight">Gratitude Vault</h3>
          <p className="text-xs text-muted-foreground">Log a daily reflection</p>
        </div>
      </div>

      <div className="mb-4 flex items-end gap-2">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) add();
          }}
          rows={2}
          placeholder="Today I'm grateful for…"
          className="min-h-0 flex-1 resize-none rounded-2xl border border-input bg-secondary/40 px-4 py-3 text-sm outline-none transition-all duration-300 placeholder:text-muted-foreground/70 focus:border-primary/60 focus:bg-secondary/70 focus:ring-2 focus:ring-primary/20"
        />
        <button
          onClick={add}
          aria-label="Add reflection"
          className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary/90 text-primary-foreground transition-all duration-300 hover:bg-primary hover:shadow-lg hover:shadow-primary/20 active:scale-90"
        >
          <Plus className="size-5" />
        </button>
      </div>

      <div className="-mr-2 flex-1 space-y-3 overflow-y-auto pr-2">
        {entries.map((e) => (
          <div
            key={e.id}
            className="group animate-fade-in rounded-2xl border border-border/60 bg-secondary/30 p-4 transition-all duration-300 hover:border-primary/40 hover:bg-secondary/50"
          >
            <Quote className="mb-2 size-4 text-primary/70" />
            <p className="text-sm leading-relaxed text-foreground/90">{e.text}</p>
            <p className="mt-2 text-[11px] uppercase tracking-wider text-muted-foreground">
              {relative(e.at)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
