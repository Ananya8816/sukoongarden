import { useState } from "react";
import { Heart, Plus } from "lucide-react";

interface Entry {
  id: string;
  text: string;
  at: number;
}

const SEED: Entry[] = [
  {
    id: "s1",
    text: "Morning light through the window and a quiet, unhurried start.",
    at: Date.now() - 1000 * 60 * 90,
  },
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
    <div className="paper blob-2 flex h-full flex-col p-6 transition-all duration-300">
      <div className="mb-5 flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-full bg-terracotta/15 text-terracotta">
          <Heart className="size-5" />
        </span>
        <div className="min-w-0">
          <h3 className="text-xl font-medium tracking-tight text-foreground">Gratitude Notes</h3>
          <p className="text-xs tracking-wide text-muted-foreground">Tuck away a little joy</p>
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
          className="min-h-0 flex-1 resize-none rounded-2xl bg-oatmeal/50 px-4 py-3 text-sm tracking-wide outline-none transition-all duration-300 placeholder:text-muted-foreground/70 focus:bg-oatmeal/80 focus:ring-2 focus:ring-sage/40"
        />
        <button
          onClick={add}
          aria-label="Add reflection"
          className="grid size-11 shrink-0 place-items-center rounded-full bg-sage text-primary-foreground transition-all duration-300 hover:shadow-md hover:shadow-sage/25 active:scale-90"
        >
          <Plus className="size-5" />
        </button>
      </div>

      <div className="-mr-2 flex-1 space-y-3 overflow-y-auto pr-2">
        {entries.map((e, i) => (
          <div
            key={e.id}
            style={{ transform: `rotate(${i % 2 === 0 ? -0.6 : 0.6}deg)` }}
            className="group animate-fade-in rounded-2xl bg-oatmeal/40 p-4 transition-all duration-300 hover:!rotate-0 hover:bg-oatmeal/70"
          >
            <p className="font-display text-sm italic leading-relaxed text-foreground/90">
              “{e.text}”
            </p>
            <p className="mt-2 text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
              {relative(e.at)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
