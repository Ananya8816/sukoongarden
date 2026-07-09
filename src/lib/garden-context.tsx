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
    // trees across the meadow
    make("weeping-willow", 200, 20, 30, -2),
    make("cherry-blossom", 190, 34, 26, 2),
    make("maple-tree", 180, 48, 30, -1),
    make("ancient-sequoia", 170, 62, 27, 1.5),
    make("pine-sapling", 160, 72, 33, -2),
    make("cherry-blossom", 150, 8, 34, 3),
    // water plants on the pond
    make("lotus-blossom", 140, 16, 66, -3),
    make("water-lily", 130, 26, 70, 2),
    make("lotus-blossom", 120, 22, 62, 1),
    // flowers scattered on the grass
    make("baby-sunflower", 110, 40, 74, 2),
    make("glowing-tulip", 100, 52, 78, -2),
    make("pink-rose", 95, 64, 74, 1.5),
    make("hibiscus", 90, 34, 82, -1),
    make("lavender-bush", 85, 76, 80, 2),
    make("baby-sunflower", 80, 84, 72, -2),
    make("glowing-tulip", 75, 14, 84, 3),
    make("lucky-clover", 70, 58, 86, -1),
    make("fairy-mushroom", 65, 46, 66, 1),
    // rocky nook
    make("jade-succulent", 60, 70, 70, -1.5),
    make("cactus-bloom", 55, 80, 66, 2),
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
