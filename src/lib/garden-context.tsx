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
  mood: MoodId;
  setMood: (m: MoodId) => void;
  gratitude: GratitudeEntry[];
  addGratitude: (text: string) => void;
}

const GardenContext = createContext<GardenContextValue | null>(null);

function seedGarden(): GrownPlant[] {
  const make = (id: string, minsAgo: number): GrownPlant | null => {
    const s = getSpecies(id);
    if (!s) return null;
    const p = plantFromSpecies(s);
    return { ...p, completedAt: Date.now() - minsAgo * 60000 };
  };
  return [
    make("lotus-blossom", 125),
    make("baby-sunflower", 40),
    make("jade-succulent", 20),
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
