import jadeImg from "@/assets/plant-jade.png";
import lotusImg from "@/assets/plant-lotus.png";
import sequoiaImg from "@/assets/plant-sequoia.png";

export type PlantTier = "small" | "flower" | "tree";

export interface PlantSpecies {
  id: string;
  name: string;
  tier: PlantTier;
  tierLabel: string;
  /** Required focus duration in seconds */
  durationSeconds: number;
  durationLabel: string;
  /** botanical illustration */
  image: string;
  description: string;
}

export interface GrownPlant {
  uid: string;
  speciesId: string;
  name: string;
  tierLabel: string;
  image: string;
  completedAt: number;
  /** slight random tilt for scrapbook feel */
  tilt: number;
}

export const PLANT_SPECIES: PlantSpecies[] = [
  {
    id: "jade-succulent",
    name: "Jade Succulent",
    tier: "small",
    tierLabel: "Little One",
    durationSeconds: 30 * 60,
    durationLabel: "30 min",
    image: jadeImg,
    description: "A gentle little grower for a short, grounding session.",
  },
  {
    id: "lotus-blossom",
    name: "Lotus Blossom",
    tier: "flower",
    tierLabel: "Blossom",
    durationSeconds: 60 * 60,
    durationLabel: "1 hour",
    image: lotusImg,
    description: "Unfolds gracefully across an hour of mindful focus.",
  },
  {
    id: "ancient-sequoia",
    name: "Ancient Sequoia",
    tier: "tree",
    tierLabel: "Old Soul",
    durationSeconds: 120 * 60,
    durationLabel: "2 hours",
    image: sequoiaImg,
    description: "A grand commitment — two hours of deep, rooted flow.",
  },
];

export function getSpecies(id: string): PlantSpecies | undefined {
  return PLANT_SPECIES.find((p) => p.id === id);
}

export function formatRelativeTime(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min${mins === 1 ? "" : "s"} ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

export function formatMMSS(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (totalSeconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}
