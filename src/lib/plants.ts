import { Sprout, Flower2, TreePine, type LucideIcon } from "lucide-react";

export type PlantTier = "small" | "flower" | "tree";

export interface PlantSpecies {
  id: string;
  name: string;
  tier: PlantTier;
  tierLabel: string;
  /** Required focus duration in seconds */
  durationSeconds: number;
  durationLabel: string;
  icon: LucideIcon;
  description: string;
  /** tailwind gradient classes for the badge / icon glow */
  accent: string;
}

export interface GrownPlant {
  uid: string;
  speciesId: string;
  name: string;
  tierLabel: string;
  icon: LucideIcon;
  accent: string;
  completedAt: number;
}

export const PLANT_SPECIES: PlantSpecies[] = [
  {
    id: "jade-succulent",
    name: "Jade Succulent",
    tier: "small",
    tierLabel: "Small Plant",
    durationSeconds: 30 * 60,
    durationLabel: "30 min",
    icon: Sprout,
    description: "A resilient little grower for a short, grounding session.",
    accent: "from-emerald-400/80 to-teal-500/80",
  },
  {
    id: "lotus-blossom",
    name: "Lotus Blossom",
    tier: "flower",
    tierLabel: "Flower",
    durationSeconds: 60 * 60,
    durationLabel: "1 hour",
    icon: Flower2,
    description: "Unfolds gracefully across an hour of mindful focus.",
    accent: "from-fuchsia-400/80 to-rose-500/80",
  },
  {
    id: "ancient-sequoia",
    name: "Ancient Sequoia",
    tier: "tree",
    tierLabel: "Tree",
    durationSeconds: 120 * 60,
    durationLabel: "2 hours",
    icon: TreePine,
    description: "A monumental commitment — two hours of deep, intense flow.",
    accent: "from-amber-400/80 to-orange-600/80",
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
