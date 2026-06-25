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
    make("lotus-blossom", 125, 26, 65, -3),
    make("baby-sunflower", 40, 42, 72, 2),
    make("jade-succulent", 20, 74, 70, -1.5),
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

  const addGratitude = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setGratitude((e) => [{ id: crypto.randomUUID(), text: trimmed, at: Date.now() }, ...e]);
  }, []);

  const value = useMemo<GardenContextValue>(
    () => ({ garden, plant, mood, setMood, gratitude, addGratitude }),
    [garden, plant, mood, gratitude, addGratitude],
  );

  return <GardenContext.Provider value={value}>{children}</GardenContext.Provider>;
}

export function useGarden(): GardenContextValue {
  const ctx = useContext(GardenContext);
  if (!ctx) throw new Error("useGarden must be used within a GardenProvider");
  return ctx;
}
