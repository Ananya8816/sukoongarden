import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { Sparkles } from "lucide-react";
import { BreathingRegulator } from "@/components/journal/BreathingRegulator";
import { MoodMatrix } from "@/components/journal/MoodMatrix";
import { GratitudeVault } from "@/components/journal/GratitudeVault";
import { FocusGarden } from "@/components/journal/FocusGarden";
import { GardenPlace } from "@/components/journal/GardenPlace";
import { getSpecies, type GrownPlant, type PlantSpecies } from "@/lib/plants";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MindSpace Journal — Calm, Focus & Grow" },
      {
        name: "description",
        content:
          "A serene daily journal for mindful breathing, mood tracking, gratitude, and a focus garden where deep work grows beautiful plants.",
      },
      { property: "og:title", content: "MindSpace Journal" },
      {
        property: "og:description",
        content: "Breathe, reflect, and cultivate focus in your personal mindfulness sanctuary.",
      },
    ],
  }),
  component: MindSpaceJournal,
});

function seedGarden(): GrownPlant[] {
  const make = (id: string, minsAgo: number): GrownPlant | null => {
    const s = getSpecies(id);
    if (!s) return null;
    return {
      uid: crypto.randomUUID(),
      speciesId: s.id,
      name: s.name,
      tierLabel: s.tierLabel,
      icon: s.icon,
      accent: s.accent,
      completedAt: Date.now() - minsAgo * 60000,
    };
  };
  return [make("lotus-blossom", 125), make("jade-succulent", 20)].filter(
    (x): x is GrownPlant => x !== null,
  );
}

function useLiveDate() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

function MindSpaceJournal() {
  const [garden, setGarden] = useState<GrownPlant[]>(seedGarden);
  const now = useLiveDate();

  const handleComplete = useCallback((species: PlantSpecies) => {
    setGarden((g) => [
      {
        uid: crypto.randomUUID(),
        speciesId: species.id,
        name: species.name,
        tierLabel: species.tierLabel,
        icon: species.icon,
        accent: species.accent,
        completedAt: Date.now(),
      },
      ...g,
    ]);
  }, []);

  const dateStr = now.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  const timeStr = now.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="dark aurora-bg min-h-screen text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-10">
        {/* Command header */}
        <header className="glass mb-8 flex flex-col gap-4 rounded-3xl px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-primary via-lavender to-accent text-primary-foreground shadow-lg shadow-primary/30">
              <Sparkles className="size-6" />
            </span>
            <div className="min-w-0">
              <h1 className="text-xl font-semibold tracking-tight md:text-2xl">
                MindSpace <span className="text-gradient">Journal</span>
              </h1>
              <p className="text-xs text-muted-foreground">Your daily sanctuary for calm & focus</p>
            </div>
          </div>
          <div className="rounded-2xl border border-border/60 bg-secondary/30 px-4 py-2 text-right">
            <p className="text-sm font-medium">{dateStr}</p>
            <p className="font-mono text-xs tabular-nums text-muted-foreground">{timeStr}</p>
          </div>
        </header>

        {/* Mindset tools */}
        <div className="mb-8 grid gap-5 lg:grid-cols-3">
          <BreathingRegulator />
          <MoodMatrix />
          <GratitudeVault />
        </div>

        {/* Focus garden core */}
        <div className="mb-8">
          <FocusGarden onComplete={handleComplete} />
        </div>

        {/* Garden place sanctuary */}
        <GardenPlace plants={garden} />

        <footer className="mt-10 pb-4 text-center text-xs text-muted-foreground">
          Breathe deeply · Focus fully · Grow gently
        </footer>
      </div>
    </div>
  );
}
