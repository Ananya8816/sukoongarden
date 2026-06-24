import { useEffect, useState } from "react";

/* ----------------------------------------------------------------------------
   Ultra-cute, full-bodied minimalist animal doodles.
   Hand-drawn SVG style, muted cottagecore palette — no emoji, no floating heads.
   They appear rarely and wander gently through the garden as delightful visitors.
---------------------------------------------------------------------------- */

const C = {
  cream: "oklch(0.93 0.025 80)",
  fur: "oklch(0.86 0.035 70)",
  pink: "oklch(0.82 0.06 20)",
  ink: "oklch(0.42 0.03 60)",
  frog: "oklch(0.72 0.1 140)",
  frogDark: "oklch(0.64 0.1 142)",
  cat: "oklch(0.72 0.07 50)",
  bird: "oklch(0.7 0.06 230)",
  belly: "oklch(0.95 0.02 88)",
  hedge: "oklch(0.56 0.05 60)",
  hedgeFace: "oklch(0.82 0.035 70)",
  fawn: "oklch(0.72 0.07 55)",
};

function Bunny() {
  return (
    <svg viewBox="0 0 80 56" className="size-full">
      <ellipse cx="62" cy="40" rx="8" ry="6" fill={C.fur} />
      <ellipse cx="40" cy="38" rx="26" ry="15" fill={C.fur} />
      <ellipse cx="22" cy="20" rx="4.5" ry="13" fill={C.fur} transform="rotate(-16 22 20)" />
      <ellipse cx="22" cy="21" rx="2" ry="8.5" fill={C.pink} transform="rotate(-16 22 21)" />
      <ellipse cx="32" cy="16" rx="4.5" ry="13" fill={C.fur} transform="rotate(8 32 16)" />
      <ellipse cx="32" cy="17" rx="2" ry="8.5" fill={C.pink} transform="rotate(8 32 17)" />
      <path d="M28 38 q3.5 3 7 0" stroke={C.ink} strokeWidth="2" strokeLinecap="round" fill="none" />
      <circle cx="20" cy="42" r="3.5" fill={C.pink} opacity="0.6" />
    </svg>
  );
}

function Frog() {
  return (
    <svg viewBox="0 0 64 48" className="size-full">
      <ellipse cx="32" cy="34" rx="22" ry="13" fill={C.frog} />
      <ellipse cx="13" cy="42" rx="7" ry="3.5" fill={C.frogDark} />
      <ellipse cx="51" cy="42" rx="7" ry="3.5" fill={C.frogDark} />
      <circle cx="21" cy="18" r="8" fill={C.frog} />
      <circle cx="43" cy="18" r="8" fill={C.frog} />
      <circle cx="21" cy="17" r="3.4" fill={C.belly} />
      <circle cx="43" cy="17" r="3.4" fill={C.belly} />
      <circle cx="21" cy="18" r="1.7" fill={C.ink} />
      <circle cx="43" cy="18" r="1.7" fill={C.ink} />
      <path d="M22 34 q10 7 20 0" stroke={C.ink} strokeWidth="2" strokeLinecap="round" fill="none" />
      <circle cx="16" cy="33" r="2.6" fill={C.pink} opacity="0.5" />
      <circle cx="48" cy="33" r="2.6" fill={C.pink} opacity="0.5" />
    </svg>
  );
}

function Cat() {
  return (
    <svg viewBox="0 0 80 52" className="size-full">
      <path
        d="M70 40 q10 -10 -2 -16 q-8 -4 -10 4 q-3 8 6 12"
        fill="none"
        stroke={C.cat}
        strokeWidth="6"
        strokeLinecap="round"
      />
      <ellipse cx="36" cy="36" rx="28" ry="14" fill={C.cat} />
      <circle cx="18" cy="26" r="11" fill={C.cat} />
      <path d="M9 19 l-2 -9 l8 4 Z" fill={C.cat} />
      <path d="M27 19 l2 -9 l-8 4 Z" fill={C.cat} />
      <path d="M13 26 q3 2.5 6 0" stroke={C.ink} strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <circle cx="22" cy="29" r="2.4" fill={C.pink} opacity="0.55" />
    </svg>
  );
}

function Bird() {
  return (
    <svg viewBox="0 0 56 48" className="size-full">
      <ellipse cx="26" cy="30" rx="18" ry="13" fill={C.bird} />
      <ellipse cx="30" cy="32" rx="10" ry="8" fill={C.belly} />
      <circle cx="14" cy="18" r="9" fill={C.bird} />
      <path d="M5 18 l-7 2 l6 4 Z" fill="oklch(0.78 0.12 70)" />
      <circle cx="12" cy="17" r="1.8" fill={C.ink} />
      <path d="M30 28 q9 -3 16 4" fill="none" stroke={C.frogDark} strokeWidth="3" strokeLinecap="round" />
      <circle cx="18" cy="22" r="2.4" fill={C.pink} opacity="0.5" />
    </svg>
  );
}

function Hedgehog() {
  return (
    <svg viewBox="0 0 68 48" className="size-full">
      <path
        d="M12 40 q-2 -26 26 -28 q24 -2 18 18 q-2 10 -14 12 Z"
        fill={C.hedge}
      />
      <path
        d="M14 34 l-6 -4 M18 26 l-7 -2 M24 20 l-5 -6 M33 16 l-2 -7 M43 15 l2 -7 M52 18 l6 -5"
        stroke={C.hedge}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <ellipse cx="50" cy="34" rx="13" ry="10" fill={C.hedgeFace} />
      <circle cx="61" cy="34" r="2.4" fill={C.ink} />
      <circle cx="54" cy="31" r="1.7" fill={C.ink} />
      <circle cx="50" cy="38" r="2.6" fill={C.pink} opacity="0.55" />
    </svg>
  );
}

function Fawn() {
  return (
    <svg viewBox="0 0 64 64" className="size-full">
      <path d="M22 42 v14 M30 44 v13 M40 44 v13 M48 42 v14" stroke={C.fawn} strokeWidth="4.5" strokeLinecap="round" />
      <ellipse cx="35" cy="38" rx="18" ry="11" fill={C.fawn} />
      <ellipse cx="49" cy="20" rx="7" ry="9" fill={C.fawn} transform="rotate(18 49 20)" />
      <path d="M48 13 q2 -8 -3 -10 M54 14 q5 -6 2 -11" stroke={C.fawn} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M44 12 l-3 -6 M52 12 l3 -6" stroke={C.fawn} strokeWidth="2" strokeLinecap="round" />
      <circle cx="52" cy="19" r="1.7" fill={C.ink} />
      <circle cx="28" cy="34" r="2.6" fill={C.belly} />
      <circle cx="40" cy="40" r="2.6" fill={C.belly} />
      <circle cx="22" cy="40" r="2.6" fill={C.belly} />
    </svg>
  );
}

interface Critter {
  type: string;
  label: string;
  threshold: number;
  Doodle: () => JSX.Element;
  size: number;
}

const CRITTERS: Critter[] = [
  { type: "bunny", label: "A round little sleeping bunny", threshold: 1, Doodle: Bunny, size: 64 },
  { type: "frog", label: "A tiny frog hopping by", threshold: 2, Doodle: Frog, size: 50 },
  { type: "bird", label: "A little songbird", threshold: 3, Doodle: Bird, size: 48 },
  { type: "cat", label: "A sleepy cat", threshold: 4, Doodle: Cat, size: 68 },
  { type: "hedgehog", label: "A snuffling hedgehog", threshold: 5, Doodle: Hedgehog, size: 56 },
  { type: "fawn", label: "A gentle little fawn", threshold: 7, Doodle: Fawn, size: 72 },
];

interface Sighting {
  id: number;
  critter: Critter;
  x: number;
  y: number;
  flip: boolean;
}

interface GardenAnimalsProps {
  /** number of plants grown — unlocks more visitors over time */
  grown: number;
}

export function GardenAnimals({ grown }: GardenAnimalsProps) {
  const [sightings, setSightings] = useState<Sighting[]>([]);

  useEffect(() => {
    const pool = CRITTERS.filter((c) => grown >= c.threshold);
    if (pool.length === 0) return;

    let nextId = 0;
    let timeoutId: ReturnType<typeof setTimeout>;

    const spawn = () => {
      const critter = pool[Math.floor(Math.random() * pool.length)];
      const id = nextId++;
      const x = 12 + Math.random() * 70;
      const y = 58 + Math.random() * 26;
      const flip = Math.random() > 0.5;
      setSightings((s) => [...s, { id, critter, x, y, flip }]);
      // let it wander a while, then quietly leave
      window.setTimeout(() => {
        setSightings((s) => s.filter((v) => v.id !== id));
      }, 9000 + Math.random() * 5000);
      // rare appearances: wait a good while before the next visitor
      timeoutId = window.setTimeout(spawn, 7000 + Math.random() * 9000);
    };

    // gentle first appearance
    timeoutId = window.setTimeout(spawn, 1800 + Math.random() * 2500);
    return () => window.clearTimeout(timeoutId);
  }, [grown]);

  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      {sightings.map((s) => (
        <div
          key={s.id}
          className="absolute animate-fade-in"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            zIndex: 20 + Math.round(s.y),
            animation: "wander 11s ease-in-out infinite, fade-in 0.6s ease-out",
          }}
          title={s.critter.label}
        >
          <div
            className="animate-bob drop-shadow-[0_4px_5px_oklch(0.4_0.05_60/_30%)]"
            style={{
              width: s.critter.size,
              height: s.critter.size,
              transform: s.flip ? "scaleX(-1)" : undefined,
            }}
          >
            <s.critter.Doodle />
          </div>
          <span
            className="absolute -bottom-1 left-1/2 h-1.5 -translate-x-1/2 rounded-[50%] bg-[oklch(0.3_0.03_60/_22%)] blur-[1.5px]"
            style={{ width: s.critter.size * 0.5 }}
          />
        </div>
      ))}
    </div>
  );
}
