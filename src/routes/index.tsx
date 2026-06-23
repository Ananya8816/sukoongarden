import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Leaf, Sparkles } from "lucide-react";
import { BreathingRegulator } from "@/components/journal/BreathingRegulator";
import { MoodMatrix } from "@/components/journal/MoodMatrix";
import { GratitudeVault } from "@/components/journal/GratitudeVault";
import { FocusGarden } from "@/components/journal/FocusGarden";
import { GardenPlace } from "@/components/journal/GardenPlace";
import { GardenWorld } from "@/components/garden/GardenWorld";
import { GardenProvider, useGarden } from "@/lib/garden-context";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MindSpace Journal — A Cozy Garden for Your Mind" },
      {
        name: "description",
        content:
          "A soft, cottagecore daily journal for mindful breathing, mood tracking, gratitude, and a focus garden you can visit as a scenic little park world.",
      },
      { property: "og:title", content: "MindSpace Journal" },
      {
        property: "og:description",
        content: "Breathe, reflect, and grow a scenic garden park in your personal cozy sanctuary.",
      },
    ],
  }),
  component: MindSpacePage,
});

function MindSpacePage() {
  return (
    <GardenProvider>
      <MindSpaceJournal />
    </GardenProvider>
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
  const { garden, plant } = useGarden();
  const [inGarden, setInGarden] = useState(false);
  const now = useLiveDate();

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
    <>
      <div className="meadow-bg min-h-screen text-foreground">
        <div className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-12">
          {/* Command header */}
          <header className="paper blob-2 mb-8 flex flex-col gap-5 px-7 py-6 sm:flex-row sm:items-center sm:justify-between">
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

          {/* Visit garden toggle */}
          <div className="mb-8 flex justify-center">
            <button
              onClick={() => setInGarden(true)}
              className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-gradient-to-r from-sage to-terracotta px-8 py-4 text-base font-semibold text-primary-foreground shadow-[0_14px_30px_-10px_oklch(0.55_0.09_80/_45%)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_18px_40px_-12px_oklch(0.55_0.09_80/_55%)] active:scale-95"
            >
              <Sparkles className="size-5 transition-transform duration-300 group-hover:rotate-12" />
              Visit Your Garden
              <span className="text-xs font-medium opacity-90">· {garden.length} grown</span>
            </button>
          </div>

          {/* Mindset tools */}
          <div className="mb-10 grid gap-6 lg:grid-cols-3">
            <BreathingRegulator />
            <MoodMatrix />
            <GratitudeVault />
          </div>

          {/* Focus garden core */}
          <div className="mb-10">
            <FocusGarden onComplete={plant} />
          </div>

          {/* Garden place sanctuary */}
          <GardenPlace plants={garden} onVisit={() => setInGarden(true)} />

          <footer className="mt-12 pb-4 text-center font-display text-sm italic tracking-wide text-muted-foreground">
            Breathe deeply · Focus gently · Grow softly
          </footer>
        </div>
      </div>

      {/* Scenic park world — slides over the journal */}
      <div
        className={`transition-all duration-500 ease-in-out ${
          inGarden ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        {inGarden && <GardenWorld onClose={() => setInGarden(false)} />}
      </div>
    </>
  );
}
