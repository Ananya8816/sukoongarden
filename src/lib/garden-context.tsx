import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  getSpecies,
  plantFromSpecies,
  type GrownPlant,
  type PlantSpecies,
} from "@/lib/plants";

export interface GratitudeEntry {
  id: string;
  text: string;
  at: number;
}

export type MoodId = "radiant" | "calm" | "focused" | "tired" | "tender" | "grateful";

interface GardenContextValue {
  garden: GrownPlant[];
  plant: (species: PlantSpecies) => void;
  movePlant: (uid: string, x: number, y: number) => void;
  mood: MoodId;
  setMood: (m: MoodId) => void;
  gratitude: GratitudeEntry[];
  addGratitude: (text: string) => void;
}

const GardenContext = createContext<GardenContextValue | null>(null);

function seedGarden(): GrownPlant[] {
  // Deterministic seed (fixed tilt/position) so SSR and client markup match.
  const make = (
    id: string,
    minsAgo: number,
    x: number,
    y: number,
    tilt: number,
  ): GrownPlant | null => {
    const s = getSpecies(id);
    if (!s) return null;
    const p = plantFromSpecies(s);
    return { ...p, uid: `seed-${id}`, completedAt: Date.now() - minsAgo * 60000, x, y, tilt };
  };
  return [
    // TEMP PREVIEW SEED — grouped zones
    make("weeping-willow", 200, 50, 55, -2),
    make("cherry-blossom", 190, 62, 52, 2),
    make("maple-tree", 180, 74, 56, -1),
    make("ancient-sequoia", 170, 84, 53, 1.5),
    make("pine-sapling", 160, 56, 58, -2),
    make("lotus-blossom", 140, 22, 66, -3),
    make("water-lily", 130, 32, 70, 2),
    make("lotus-blossom", 120, 28, 62, 1),
    make("baby-sunflower", 110, 68, 76, 2),
    make("baby-sunflower", 105, 76, 80, -2),
    make("baby-sunflower", 100, 82, 74, 1.5),
    make("fairy-mushroom", 90, 32, 85, -1),
    make("fairy-mushroom", 85, 38, 88, 2),
    make("jade-succulent", 80, 90, 70, -1.5),
    make("cactus-bloom", 75, 93, 82, 2),
    make("glowing-tulip", 70, 50, 86, -2),
    make("pink-rose", 65, 58, 88, 1.5),
    make("hibiscus", 60, 62, 84, -1),
    make("lavender-bush", 55, 54, 90, 2),
    make("lucky-clover", 50, 64, 90, -1),
  ].filter((x): x is GrownPlant => x !== null);
}

const SEED_GRATITUDE: GratitudeEntry[] = [
  {
    id: "s1",
    text: "Morning light through the window and a quiet, unhurried start.",
    at: Date.now() - 1000 * 60 * 90,
  },
  {
    id: "s2",
    text: "A long walk that cleared my head completely.",
    at: Date.now() - 1000 * 60 * 60 * 5,
  },
];

export function GardenProvider({ children }: { children: ReactNode }) {
  const [garden, setGarden] = useState<GrownPlant[]>(seedGarden);
  const [mood, setMood] = useState<MoodId>("calm");
  const [gratitude, setGratitude] = useState<GratitudeEntry[]>(SEED_GRATITUDE);

  const plant = useCallback((species: PlantSpecies) => {
    setGarden((g) => [plantFromSpecies(species), ...g]);
  }, []);

  const movePlant = useCallback((uid: string, x: number, y: number) => {
    setGarden((g) =>
      g.map((p) =>
        p.uid === uid
          ? { ...p, x: Math.max(2, Math.min(98, x)), y: Math.max(34, Math.min(98, y)) }
          : p,
      ),
    );
  }, []);

  const addGratitude = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setGratitude((e) => [{ id: crypto.randomUUID(), text: trimmed, at: Date.now() }, ...e]);
  }, []);

  const value = useMemo<GardenContextValue>(
    () => ({ garden, plant, movePlant, mood, setMood, gratitude, addGratitude }),
    [garden, plant, movePlant, mood, gratitude, addGratitude],
  );

  return <GardenContext.Provider value={value}>{children}</GardenContext.Provider>;
}

export function useGarden(): GardenContextValue {
  const ctx = useContext(GardenContext);
  if (!ctx) throw new Error("useGarden must be used within a GardenProvider");
  return ctx;
}
