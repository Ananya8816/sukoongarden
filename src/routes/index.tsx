import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Leaf, Sprout } from "lucide-react";
import { BreathingRegulator } from "@/components/journal/BreathingRegulator";
import { MoodMatrix } from "@/components/journal/MoodMatrix";
import { GratitudeVault } from "@/components/journal/GratitudeVault";
import { FocusGarden } from "@/components/journal/FocusGarden";
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

          {/* Visit garden — rustic wooden signpost */}
          <div className="mb-12 flex justify-center">
            <button
              onClick={() => setInGarden(true)}
              aria-label="Visit your garden"
              className="group relative pt-2 transition-transform duration-300 ease-in-out hover:-translate-y-1 active:scale-[0.97]"
            >
              {/* wooden posts */}
              <span className="absolute left-7 top-3 -z-10 h-[118%] w-3 rounded-full bg-gradient-to-b from-[oklch(0.5_0.06_55)] to-[oklch(0.4_0.05_50)] shadow-[inset_-2px_0_3px_oklch(0.3_0.04_45/_40%)]" />
              <span className="absolute right-7 top-3 -z-10 h-[118%] w-3 rounded-full bg-gradient-to-b from-[oklch(0.5_0.06_55)] to-[oklch(0.4_0.05_50)] shadow-[inset_-2px_0_3px_oklch(0.3_0.04_45/_40%)]" />
              {/* the plank */}
              <span
                className="relative flex items-center gap-3 rounded-[1.1rem] px-9 py-4 shadow-[0_14px_28px_-12px_oklch(0.35_0.05_45/_55%)] ring-1 ring-[oklch(0.35_0.05_45/_35%)] transition-all duration-300 group-hover:shadow-[0_18px_36px_-12px_oklch(0.35_0.05_45/_65%)]"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(92deg, oklch(0.56 0.06 55) 0 7px, oklch(0.52 0.06 53) 7px 15px), linear-gradient(180deg, oklch(0.58 0.06 56), oklch(0.48 0.06 50))",
                  backgroundBlendMode: "soft-light, normal",
                }}
              >
                {/* carved screws */}
                <span className="absolute left-2.5 top-2.5 size-1.5 rounded-full bg-[oklch(0.36_0.04_45/_60%)]" />
                <span className="absolute right-2.5 top-2.5 size-1.5 rounded-full bg-[oklch(0.36_0.04_45/_60%)]" />
                <span className="absolute bottom-2.5 left-2.5 size-1.5 rounded-full bg-[oklch(0.36_0.04_45/_60%)]" />
                <span className="absolute bottom-2.5 right-2.5 size-1.5 rounded-full bg-[oklch(0.36_0.04_45/_60%)]" />
                <Sprout className="size-5 text-[oklch(0.94_0.05_120)] drop-shadow-[0_1px_1px_oklch(0.3_0.04_45/_60%)] transition-transform duration-300 group-hover:rotate-6" />
                <span className="font-display text-lg font-semibold tracking-wide text-[oklch(0.96_0.03_85)] [text-shadow:0_1px_1px_oklch(0.3_0.04_45/_70%)]">
                  Visit Your Garden
                </span>
                <span className="rounded-full bg-[oklch(0.4_0.05_48/_45%)] px-2.5 py-0.5 text-xs font-medium text-[oklch(0.94_0.03_85)]">
                  {garden.length} grown
                </span>
              </span>
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
