import jadeImg from "@/assets/plant-jade.png";
import lotusImg from "@/assets/plant-lotus.png";
import sequoiaImg from "@/assets/plant-sequoia.png";
import sunflowerImg from "@/assets/plant-sunflower.png";
import cloverImg from "@/assets/plant-clover.png";
import mushroomImg from "@/assets/plant-mushroom.png";
import tulipImg from "@/assets/plant-tulip.png";
import roseImg from "@/assets/plant-rose.png";
import waterlilyImg from "@/assets/plant-waterlily.png";
import hibiscusImg from "@/assets/plant-hibiscus.png";
import cactusImg from "@/assets/plant-cactus.png";
import lavenderImg from "@/assets/plant-lavender.png";
import pineImg from "@/assets/plant-pine.png";
import cherryImg from "@/assets/plant-cherry.png";
import mapleImg from "@/assets/plant-maple.png";
import willowImg from "@/assets/plant-willow.png";

export type PlantTier = "small" | "flower" | "tree" | "water" | "mushroom";
export type Habitat = "water" | "rock" | "meadow" | "grass";

export interface PlantSpecies {
  id: string;
  name: string;
  tier: PlantTier;
  tierLabel: string;
  /** Required focus duration in seconds */
  durationSeconds: number;
  durationLabel: string;
  /** Optional hand-painted botanical illustration (only the hero trio) */
  image?: string;
  /** Emoji glyph used everywhere an illustration is absent */
  glyph: string;
  /** where this plant takes root on the world map */
  habitat: Habitat;
  description: string;
}

export interface GrownPlant {
  uid: string;
  speciesId: string;
  name: string;
  tierLabel: string;
  tier: PlantTier;
  habitat: Habitat;
  image?: string;
  glyph: string;
  completedAt: number;
  /** slight random tilt for scrapbook feel */
  tilt: number;
  /** position on the world map, in % */
  x: number;
  y: number;
}

export const PLANT_SPECIES: PlantSpecies[] = [
  {
    id: "baby-sunflower",
    name: "Baby Sunflower",
    tier: "flower",
    tierLabel: "Sprout",
    durationSeconds: 5 * 60,
    durationLabel: "5 min",
    image: sunflowerImg,
    glyph: "🌻",
    habitat: "grass",
    description: "A cheerful little face that follows every sunbeam.",
  },
  {
    id: "lucky-clover",
    name: "Lucky Clover",
    tier: "small",
    tierLabel: "Wee One",
    durationSeconds: 10 * 60,
    durationLabel: "10 min",
    image: cloverImg,
    glyph: "🍀",
    habitat: "grass",
    description: "A soft patch of green for a tiny grounding pause.",
  },
  {
    id: "fairy-mushroom",
    name: "Fairy Mushroom",
    tier: "mushroom",
    tierLabel: "Wee Cap",
    durationSeconds: 10 * 60,
    durationLabel: "10 min",
    image: mushroomImg,
    glyph: "🍄",
    habitat: "grass",
    description: "A storybook toadstool that loves the shade of trees.",
  },
  {
    id: "glowing-tulip",
    name: "Glowing Tulip",
    tier: "flower",
    tierLabel: "Blossom",
    durationSeconds: 15 * 60,
    durationLabel: "15 min",
    image: tulipImg,
    glyph: "🌷",
    habitat: "grass",
    description: "Petals that seem to hold a little candlelight inside.",
  },
  {
    id: "pink-rose",
    name: "Pink Rose",
    tier: "flower",
    tierLabel: "Blossom",
    durationSeconds: 20 * 60,
    durationLabel: "20 min",
    image: roseImg,
    glyph: "🌹",
    habitat: "grass",
    description: "A tender bloom for a soft, romantic stretch of focus.",
  },
  {
    id: "water-lily",
    name: "Water Lily",
    tier: "water",
    tierLabel: "Floating",
    durationSeconds: 20 * 60,
    durationLabel: "20 min",
    image: waterlilyImg,
    glyph: "🪷",
    habitat: "water",
    description: "Drifts on the pond, a perfect perch for a passing frog.",
  },
  {
    id: "hibiscus",
    name: "Sunset Hibiscus",
    tier: "flower",
    tierLabel: "Blossom",
    durationSeconds: 25 * 60,
    durationLabel: "25 min",
    image: hibiscusImg,
    glyph: "🌺",
    habitat: "grass",
    description: "Big, warm petals the colour of a summer evening.",
  },
  {
    id: "jade-succulent",
    name: "Jade Succulent",
    tier: "small",
    tierLabel: "Little One",
    durationSeconds: 30 * 60,
    durationLabel: "30 min",
    image: jadeImg,
    glyph: "🪴",
    habitat: "rock",
    description: "A gentle little grower for a short, grounding session.",
  },
  {
    id: "cactus-bloom",
    name: "Cactus Bloom",
    tier: "small",
    tierLabel: "Little One",
    durationSeconds: 35 * 60,
    durationLabel: "35 min",
    image: cactusImg,
    glyph: "🌵",
    habitat: "rock",
    description: "Tough, calm, and crowned with a surprise flower.",
  },
  {
    id: "lavender-bush",
    name: "Lavender Bush",
    tier: "flower",
    tierLabel: "Blossom",
    durationSeconds: 30 * 60,
    durationLabel: "30 min",
    image: lavenderImg,
    glyph: "🪻",
    habitat: "grass",
    description: "A fragrant haze of purple that hums with sleepy bees.",
  },
  {
    id: "pine-sapling",
    name: "Pine Sapling",
    tier: "tree",
    tierLabel: "Young Tree",
    durationSeconds: 40 * 60,
    durationLabel: "40 min",
    image: pineImg,
    glyph: "🌲",
    habitat: "meadow",
    description: "A crisp little evergreen for clear, steady work.",
  },
  {
    id: "cherry-blossom",
    name: "Pink Cherry Blossom",
    tier: "tree",
    tierLabel: "Canopy",
    durationSeconds: 45 * 60,
    durationLabel: "45 min",
    image: cherryImg,
    glyph: "🌸",
    habitat: "meadow",
    description: "Drifts petals across the meadow as you settle in.",
  },
  {
    id: "lotus-blossom",
    name: "Lotus Blossom",
    tier: "water",
    tierLabel: "Floating",
    durationSeconds: 60 * 60,
    durationLabel: "1 hour",
    image: lotusImg,
    glyph: "🪷",
    habitat: "water",
    description: "Unfolds gracefully across an hour of mindful focus.",
  },
  {
    id: "maple-tree",
    name: "Amber Maple",
    tier: "tree",
    tierLabel: "Canopy",
    durationSeconds: 60 * 60,
    durationLabel: "1 hour",
    image: mapleImg,
    glyph: "🍁",
    habitat: "meadow",
    description: "Turns the meadow gold for a full hour of flow.",
  },
  {
    id: "weeping-willow",
    name: "Weeping Willow",
    tier: "tree",
    tierLabel: "Old Soul",
    durationSeconds: 90 * 60,
    durationLabel: "90 min",
    glyph: "🌳",
    habitat: "meadow",
    description: "Long, trailing branches that sway beside the water.",
  },
  {
    id: "ancient-sequoia",
    name: "Ancient Sequoia",
    tier: "tree",
    tierLabel: "Old Soul",
    durationSeconds: 120 * 60,
    durationLabel: "2 hours",
    image: sequoiaImg,
    glyph: "🌲",
    habitat: "meadow",
    description: "A grand commitment — two hours of deep, rooted flow.",
  },
];

const HABITAT_REGIONS: Record<Habitat, { x: [number, number]; y: [number, number] }> = {
  // pond sits lower-left
  water: { x: [15, 37], y: [60, 73] },
  // rocky nook lower-right
  rock: { x: [63, 85], y: [62, 78] },
  // open meadow up top for trees
  meadow: { x: [26, 74], y: [24, 48] },
  // grassy expanse for flowers & small ones
  grass: { x: [10, 88], y: [46, 86] },
};

function rand(min: number, max: number): number {
  return Math.round((min + Math.random() * (max - min)) * 10) / 10;
}

/** Pick a random plot on the world map appropriate to the plant's habitat. */
export function randomPlot(habitat: Habitat): { x: number; y: number } {
  const r = HABITAT_REGIONS[habitat];
  return { x: rand(r.x[0], r.x[1]), y: rand(r.y[0], r.y[1]) };
}

export function plantFromSpecies(s: PlantSpecies): GrownPlant {
  const plot = randomPlot(s.habitat);
  return {
    uid: crypto.randomUUID(),
    speciesId: s.id,
    name: s.name,
    tierLabel: s.tierLabel,
    tier: s.tier,
    habitat: s.habitat,
    image: s.image,
    glyph: s.glyph,
    completedAt: Date.now(),
    tilt: rand(-4, 4),
    x: plot.x,
    y: plot.y,
  };
}

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
