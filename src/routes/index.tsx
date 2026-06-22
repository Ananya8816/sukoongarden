import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { Leaf } from "lucide-react";
import { BreathingRegulator } from "@/components/journal/BreathingRegulator";
import { MoodMatrix } from "@/components/journal/MoodMatrix";
import { GratitudeVault } from "@/components/journal/GratitudeVault";
import { FocusGarden } from "@/components/journal/FocusGarden";
import { GardenPlace } from "@/components/journal/GardenPlace";
import { getSpecies, type GrownPlant, type PlantSpecies } from "@/lib/plants";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MindSpace Journal — A Cozy Garden for Your Mind" },
      {
        name: "description",
        content:
          "A soft, cottagecore daily journal for mindful breathing, mood tracking, gratitude, and a focus garden where deep work grows into a botanical scrapbook.",
      },
      { property: "og:title", content: "MindSpace Journal" },
      {
        property: "og:description",
        content: "Breathe, reflect, and grow a little garden in your personal cozy sanctuary.",
      },
    ],
  }),
  component: MindSpaceJournal,
});

const TILTS = [-3, 2, -1.5, 3, -2.5, 1.5];

function seedGarden(): GrownPlant[] {
  const make = (id: string, minsAgo: number, tilt: number): GrownPlant | null => {
    const s = getSpecies(id);
    if (!s) return null;
    return {
      uid: crypto.randomUUID(),
      speciesId: s.id,
      name: s.name,
      tierLabel: s.tierLabel,
      image: s.image,
      completedAt: Date.now() - minsAgo * 60000,
      tilt,
    };
  };
  return [make("lotus-blossom", 125, -3), make("jade-succulent", 20, 2.5)].filter(
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
        image: species.image,
        completedAt: Date.now(),
        tilt: TILTS[Math.floor(Math.random() * TILTS.length)],
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
    <div className="meadow-bg min-h-screen text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-12">
        {/* Command header */}
        <header className="paper blob-2 mb-10 flex flex-col gap-5 px-7 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="grid size-14 shrink-0 place-items-center rounded-full bg-sage/15 text-sage shadow-[inset_0_2px_8px_oklch(0.55_0.05_60_/_10%)]">
              <Leaf className="size-7" />
            </span>
            <div className="min-w-0">
              <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                MindSpace <span className="italic text-gradient">Journal</span>
              </h1>
              <p className="text-sm tracking-wide text-muted-foreground">
                A cozy little garden for your mind
              </p>
            </div>
          </div>
          <div className="rounded-3xl bg-oatmeal/60 px-5 py-3 text-right">
            <p className="font-display text-lg font-medium text-foreground">{dateStr}</p>
            <p className="font-display text-sm italic tracking-wide text-muted-foreground">
              {timeStr}
            </p>
          </div>
        </header>

        {/* Mindset tools */}
        <div className="mb-10 grid gap-6 lg:grid-cols-3">
          <BreathingRegulator />
          <MoodMatrix />
          <GratitudeVault />
        </div>

        {/* Focus garden core */}
        <div className="mb-10">
          <FocusGarden onComplete={handleComplete} />
        </div>

        {/* Garden place sanctuary */}
        <GardenPlace plants={garden} />

        <footer className="mt-12 pb-4 text-center font-display text-sm italic tracking-wide text-muted-foreground">
          Breathe deeply · Focus gently · Grow softly
        </footer>
      </div>
    </div>
  );
}
