import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Radio, X, Sparkles } from "lucide-react";
import { useGarden, type MoodId } from "@/lib/garden-context";
import { AmbientSound } from "@/lib/ambient-sound";
import { formatRelativeTime, type GrownPlant } from "@/lib/plants";
import { GardenAnimals } from "@/components/garden/GardenAnimals";

interface GardenWorldProps {
  onClose: () => void;
}

type Particle = "rain" | "fireflies" | "petals" | "sparkles" | "butterflies" | "none";

interface Weather {
  label: string;
  sky: string;
  tint: string;
  particle: Particle;
  sun: boolean;
}

const WEATHER: Record<MoodId, Weather> = {
  radiant: {
    label: "Sunny & bright",
    sky: "linear-gradient(180deg, oklch(0.9 0.08 220) 0%, oklch(0.93 0.07 200) 45%, oklch(0.92 0.06 120) 100%)",
    tint: "oklch(0.95 0.09 90 / 18%)",
    particle: "sparkles",
    sun: true,
  },
  focused: {
    label: "Clear skies",
    sky: "linear-gradient(180deg, oklch(0.89 0.06 215) 0%, oklch(0.93 0.05 200) 50%, oklch(0.92 0.05 140) 100%)",
    tint: "transparent",
    particle: "none",
    sun: true,
  },
  calm: {
    label: "Gentle rain",
    sky: "linear-gradient(180deg, oklch(0.78 0.03 250) 0%, oklch(0.82 0.025 230) 50%, oklch(0.84 0.03 180) 100%)",
    tint: "oklch(0.6 0.04 250 / 22%)",
    particle: "rain",
    sun: false,
  },
  tired: {
    label: "Cozy twilight",
    sky: "linear-gradient(180deg, oklch(0.36 0.07 285) 0%, oklch(0.46 0.09 320) 48%, oklch(0.55 0.08 40) 100%)",
    tint: "oklch(0.3 0.06 290 / 38%)",
    particle: "fireflies",
    sun: false,
  },
  tender: {
    label: "Soft dawn",
    sky: "linear-gradient(180deg, oklch(0.9 0.05 20) 0%, oklch(0.92 0.05 60) 50%, oklch(0.91 0.05 120) 100%)",
    tint: "oklch(0.9 0.07 15 / 20%)",
    particle: "petals",
    sun: true,
  },
  grateful: {
    label: "Golden hour",
    sky: "linear-gradient(180deg, oklch(0.84 0.08 70) 0%, oklch(0.88 0.09 55) 48%, oklch(0.88 0.07 110) 100%)",
    tint: "oklch(0.85 0.1 65 / 24%)",
    particle: "butterflies",
    sun: true,
  },
};




function plantSize(tier: GrownPlant["tier"]): string {
  switch (tier) {
    case "tree":
      return "text-6xl sm:text-7xl";
    case "flower":
      return "text-4xl sm:text-5xl";
    case "water":
      return "text-3xl sm:text-4xl";
    default:
      return "text-3xl sm:text-4xl";
  }
}

export function GardenWorld({ onClose }: GardenWorldProps) {
  const { garden, mood, gratitude, movePlant } = useGarden();
  const weather = WEATHER[mood];
  const [showPicnic, setShowPicnic] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const [draggingUid, setDraggingUid] = useState<string | null>(null);
  const soundRef = useRef<AmbientSound | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const dragMoved = useRef(false);

  useEffect(() => {
    soundRef.current = new AmbientSound();
    return () => {
      soundRef.current?.stop();
    };
  }, []);

  const toggleSound = () => {
    // always gentle rain — cozy, misty cottagecore mood
    const now = soundRef.current?.toggle("rain") ?? false;
    setSoundOn(now);
  };

  // --- drag a grown plant anywhere on the map ---
  const handlePlantPointerDown = (uid: string) => (e: React.PointerEvent) => {
    e.preventDefault();
    dragMoved.current = false;
    setDraggingUid(uid);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePlantPointerMove = (uid: string) => (e: React.PointerEvent) => {
    if (draggingUid !== uid) return;
    const rect = rootRef.current?.getBoundingClientRect();
    if (!rect) return;
    dragMoved.current = true;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    movePlant(uid, x, y);
  };

  const handlePlantPointerUp = (uid: string) => (e: React.PointerEvent) => {
    if (draggingUid !== uid) return;
    setDraggingUid(null);
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      /* pointer already released */
    }
  };






  // stable particle seeds
  const particles = useMemo(
    () =>
      Array.from({ length: 26 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 8,
        dur: 6 + Math.random() * 8,
      })),
    [],
  );

  return (
    <div ref={rootRef} className="fixed inset-0 z-50 touch-none overflow-hidden">
      {/* sky */}
      <div
        className="absolute inset-0 transition-all duration-700 ease-in-out"
        style={{ background: weather.sky }}
      />

      {/* sun / moon glow */}
      {weather.sun ? (
        <div className="pointer-events-none absolute -right-10 -top-10 size-64">
          <div className="absolute inset-0 animate-spin-slow rounded-full bg-[radial-gradient(circle,oklch(0.96_0.12_90/_70%)_0%,transparent_60%)]" />
          <div className="absolute left-1/2 top-1/2 size-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,oklch(0.98_0.1_92)_0%,oklch(0.92_0.12_80)_70%)] shadow-[0_0_60px_20px_oklch(0.95_0.12_88/_50%)]" />
        </div>
      ) : (
        <div className="pointer-events-none absolute right-12 top-10 size-20 rounded-full bg-[radial-gradient(circle,oklch(0.96_0.02_90)_0%,oklch(0.86_0.03_80)_75%)] shadow-[0_0_50px_14px_oklch(0.9_0.04_90/_35%)]" />
      )}

      {/* rolling hills */}
      <div className="absolute inset-x-0 bottom-0 top-[28%]">
        <div
          className="absolute inset-x-0 top-0 h-[40%]"
          style={{
            background:
              "radial-gradient(120% 100% at 30% 100%, oklch(0.78 0.09 140) 0%, oklch(0.72 0.1 145) 60%, transparent 100%)",
            borderRadius: "0 0 50% 50% / 0 0 100% 100%",
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 top-[20%]"
          style={{
            background: "linear-gradient(180deg, oklch(0.74 0.1 140) 0%, oklch(0.68 0.11 142) 100%)",
          }}
        />
      </div>

      {/* darkening tint for mood */}
      <div
        className="pointer-events-none absolute inset-0 transition-all duration-700"
        style={{ background: weather.tint }}
      />

      {/* scenic pond — soft organic shores, layered water, ripples & lily pads */}
      <svg
        className="pointer-events-none absolute"
        style={{ left: "-6%", top: "40%", width: "70%", height: "62%" }}
        viewBox="0 0 220 170"
        preserveAspectRatio="none"
      >
        <defs>
          <radialGradient id="water" cx="42%" cy="34%" r="85%">
            <stop offset="0%" stopColor="oklch(0.88 0.05 210)" />
            <stop offset="55%" stopColor="oklch(0.8 0.07 220)" />
            <stop offset="100%" stopColor="oklch(0.66 0.09 235)" />
          </radialGradient>
          <radialGradient id="shore" cx="42%" cy="34%" r="85%">
            <stop offset="0%" stopColor="oklch(0.82 0.09 135)" />
            <stop offset="100%" stopColor="oklch(0.72 0.11 142)" />
          </radialGradient>
          <filter id="pondBlur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.4" />
          </filter>
        </defs>

        {/* grassy shore halo */}
        <path
          d="M34,78 C20,34 96,18 142,40 C198,66 204,118 152,146 C100,172 40,150 28,116 C16,96 40,98 34,78 Z"
          fill="url(#shore)"
          opacity="0.55"
          filter="url(#pondBlur)"
        />
        {/* sandy rim */}
        <path
          d="M40,76 C28,38 98,24 140,44 C190,66 196,114 148,140 C100,164 46,144 36,112 C26,94 44,94 40,76 Z"
          fill="oklch(0.88 0.05 90)"
          opacity="0.5"
        />
        {/* water body */}
        <path
          d="M46,74 C36,42 98,30 136,48 C182,68 186,110 144,134 C100,156 52,138 44,108 C36,92 50,90 46,74 Z"
          fill="url(#water)"
          opacity="0.95"
        />
        {/* glossy highlight */}
        <path
          d="M64,62 C82,52 110,52 128,60"
          fill="none"
          stroke="oklch(0.97 0.02 210 / 55%)"
          strokeWidth="4"
          strokeLinecap="round"
        />
        {/* soft ripples */}
        <ellipse cx="108" cy="98" rx="30" ry="11" fill="none" stroke="oklch(0.95 0.02 215 / 35%)" strokeWidth="1.6">
          <animate attributeName="rx" values="14;36;14" dur="6s" repeatCount="indefinite" />
          <animate attributeName="ry" values="5;13;5" dur="6s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.5;0;0.5" dur="6s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="80" cy="118" rx="18" ry="7" fill="none" stroke="oklch(0.95 0.02 215 / 30%)" strokeWidth="1.4">
          <animate attributeName="rx" values="8;24;8" dur="7s" begin="1.5s" repeatCount="indefinite" />
          <animate attributeName="ry" values="3;9;3" dur="7s" begin="1.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.45;0;0.45" dur="7s" begin="1.5s" repeatCount="indefinite" />
        </ellipse>

        {/* lily pads */}
        {[
          [78, 86, 13],
          [128, 112, 11],
          [104, 76, 9],
        ].map(([cx, cy, r], i) => (
          <g key={i}>
            <ellipse cx={cx} cy={cy + 2} rx={r + 1} ry={(r + 1) * 0.45} fill="oklch(0.3 0.04 150 / 18%)" />
            <path
              d={`M${cx},${cy} m -${r},0 a ${r},${r * 0.55} 0 1,0 ${2 * r},0 a ${r},${r * 0.55} 0 1,0 -${2 * r},0`}
              fill="oklch(0.66 0.13 145)"
            />
            <path d={`M${cx},${cy} L${cx + r * 0.7},${cy - r * 0.3}`} stroke="oklch(0.5 0.1 145)" strokeWidth="1" />
            {i === 1 && (
              <circle cx={cx} cy={cy - 1} r="2.6" fill="oklch(0.92 0.07 350)" />
            )}
          </g>
        ))}
      </svg>


      {/* stone pathway */}
      <div className="pointer-events-none absolute inset-0">
        {Array.from({ length: 9 }).map((_, i) => (
          <span
            key={i}
            className="absolute block rounded-[50%] bg-[oklch(0.8_0.02_70)] shadow-[inset_0_-2px_4px_oklch(0.5_0.03_60/_30%)]"
            style={{
              left: `${30 + i * 5.5 + (i % 2 ? 2 : -1)}%`,
              top: `${52 + i * 4.5}%`,
              width: `${44 - i}px`,
              height: `${20 - i * 0.4}px`,
              opacity: 0.85,
            }}
          />
        ))}
      </div>

      {/* soft grass patches */}
      <div className="pointer-events-none absolute inset-0">
        {[
          [12, 56],
          [46, 60],
          [82, 52],
          [60, 80],
          [22, 84],
          [88, 78],
        ].map(([x, y], i) => (
          <span
            key={i}
            className="absolute rounded-[50%] bg-[oklch(0.7_0.12_140/_55%)] blur-[2px]"
            style={{ left: `${x}%`, top: `${y}%`, width: 90, height: 34 }}
          />
        ))}
      </div>

      {/* planted world — drag any grown plant anywhere on the map */}
      {garden.map((p, i) => {
        const isDragging = draggingUid === p.uid;
        return (
          <div
            key={p.uid}
            onPointerDown={handlePlantPointerDown(p.uid)}
            onPointerMove={handlePlantPointerMove(p.uid)}
            onPointerUp={handlePlantPointerUp(p.uid)}
            onPointerCancel={handlePlantPointerUp(p.uid)}
            className={`group absolute -translate-x-1/2 -translate-y-full touch-none select-none ${
              isDragging ? "z-[60] cursor-grabbing" : "cursor-grab"
            }`}
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              zIndex: isDragging ? 60 : 10 + Math.round(p.y),
              animation: isDragging
                ? undefined
                : `plant-pop 0.9s cubic-bezier(0.22,1,0.36,1) ${Math.min(i * 0.05, 1)}s both`,
              transition: isDragging ? "none" : "filter 0.3s ease",
            }}
          >
            <div
              className={isDragging ? "origin-bottom" : "origin-bottom animate-sway"}
              style={{
                animationDelay: `${(i % 5) * 0.6}s`,
                transform: isDragging ? "scale(1.12)" : undefined,
                transition: "transform 0.2s ease-out",
              }}
            >
              {p.image ? (
                <img
                  src={p.image}
                  alt={p.name}
                  draggable={false}
                  className={`size-16 object-contain drop-shadow-[0_6px_8px_oklch(0.4_0.05_60/_35%)] sm:size-20 ${
                    isDragging ? "drop-shadow-[0_16px_18px_oklch(0.35_0.05_60/_45%)]" : ""
                  }`}
                  style={{ transform: `rotate(${p.tilt}deg)` }}
                />
              ) : (
                <span
                  className={`block leading-none drop-shadow-[0_5px_6px_oklch(0.4_0.05_60/_35%)] ${plantSize(p.tier)}`}
                  style={{ transform: `rotate(${p.tilt}deg)` }}
                >
                  {p.glyph}
                </span>
              )}
            </div>
            {/* shadow */}
            <span
              className={`absolute -bottom-1 left-1/2 h-2 -translate-x-1/2 rounded-[50%] bg-[oklch(0.3_0.03_60/_25%)] blur-[2px] transition-all duration-200 ${
                isDragging ? "w-10 opacity-40" : "w-8"
              }`}
            />
            {/* name on hover */}
            <span className="pointer-events-none absolute bottom-full left-1/2 mb-1 -translate-x-1/2 whitespace-nowrap rounded-full bg-card/95 px-2.5 py-1 text-[11px] font-semibold text-foreground opacity-0 shadow-md transition-opacity duration-300 group-hover:opacity-100">
              {p.name}
            </span>
          </div>
        );
      })}


      {/* love letter envelope — tucked discreetly near the top corner */}
      <button
        onClick={() => setShowPicnic(true)}
        aria-label="Open your gratitude love letter"
        className="group absolute right-4 top-[5.5rem] z-40 transition-transform duration-300 hover:-translate-y-0.5 hover:rotate-[-3deg] active:scale-95 md:right-6 md:top-24"
      >
        <span className="relative grid size-12 place-items-center rounded-2xl bg-[oklch(0.96_0.03_85)] shadow-[0_8px_20px_-8px_oklch(0.4_0.06_40/_55%)] ring-1 ring-[oklch(0.7_0.05_60/_40%)] sm:size-14">
          <svg viewBox="0 0 40 30" className="size-7 sm:size-8">
            <rect x="1.5" y="3" width="37" height="24" rx="4" fill="oklch(0.93 0.04 80)" stroke="oklch(0.66 0.06 55)" strokeWidth="1.4" />
            <path d="M2,5 L20,18 L38,5" fill="none" stroke="oklch(0.66 0.06 55)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M20 22 c-2.2 -2.6 -6 -1.4 -6 1.4 c0 2.4 3.4 4 6 6 c2.6 -2 6 -3.6 6 -6 c0 -2.8 -3.8 -4 -6 -1.4 Z" fill="oklch(0.72 0.14 25)" />
          </svg>
        </span>
        <span className="pointer-events-none absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-card/90 px-2.5 py-1 text-[11px] font-semibold text-foreground opacity-0 shadow transition-opacity duration-300 group-hover:opacity-100">
          A little love letter
        </span>
      </button>


      {/* rare wandering visitors — full-bodied cute doodles */}
      <GardenAnimals grown={garden.length} />


      {/* weather particles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {weather.particle === "rain" &&
          particles.map((p) => (
            <span
              key={p.id}
              className="absolute block h-8 w-px animate-rain-fall bg-[oklch(0.92_0.03_220/_55%)]"
              style={{ left: `${p.left}%`, top: `-10%`, animationDelay: `${p.delay * 0.2}s`, animationDuration: `${0.7 + (p.id % 5) * 0.08}s` }}
            />
          ))}
        {weather.particle === "fireflies" &&
          particles.slice(0, 18).map((p) => (
            <span
              key={p.id}
              className="absolute size-1.5 animate-firefly rounded-full bg-[oklch(0.93_0.14_95)] shadow-[0_0_8px_3px_oklch(0.9_0.14_95/_70%)]"
              style={{ left: `${p.left}%`, top: `${40 + (p.top % 50)}%`, animationDelay: `${p.delay}s`, animationDuration: `${p.dur}s` }}
            />
          ))}
        {weather.particle === "petals" &&
          particles.slice(0, 16).map((p) => (
            <span
              key={p.id}
              className="absolute animate-petal text-lg"
              style={{ left: `${p.left}%`, top: `-8%`, animationDelay: `${p.delay}s`, animationDuration: `${8 + (p.id % 6)}s` }}
            >
              🌸
            </span>
          ))}
        {weather.particle === "sparkles" &&
          particles.slice(0, 20).map((p) => (
            <span
              key={p.id}
              className="absolute size-1.5 animate-twinkle rounded-full bg-[oklch(0.98_0.08_95)] shadow-[0_0_6px_2px_oklch(0.96_0.1_92/_60%)]"
              style={{ left: `${p.left}%`, top: `${p.top % 70}%`, animationDelay: `${p.delay}s` }}
            />
          ))}
        {weather.particle === "butterflies" &&
          particles.slice(0, 7).map((p) => (
            <span
              key={p.id}
              className="absolute animate-drift"
              style={{ left: `${p.left}%`, top: `${30 + (p.top % 45)}%`, animationDelay: `${p.delay}s`, animationDuration: `${16 + (p.id % 8)}s` }}
            >
              <svg viewBox="0 0 32 28" className="size-6 drop-shadow-[0_2px_3px_oklch(0.4_0.05_60/_25%)]">
                <ellipse cx="9" cy="9" rx="8" ry="7" fill="oklch(0.74 0.1 35)" />
                <ellipse cx="23" cy="9" rx="8" ry="7" fill="oklch(0.74 0.1 35)" />
                <ellipse cx="10" cy="20" rx="6" ry="6" fill="oklch(0.8 0.09 45)" />
                <ellipse cx="22" cy="20" rx="6" ry="6" fill="oklch(0.8 0.09 45)" />
                <rect x="15" y="6" width="2" height="17" rx="1" fill="oklch(0.42 0.03 60)" />
                <path d="M16 6 q-3 -5 -6 -4 M16 6 q3 -5 6 -4" stroke="oklch(0.42 0.03 60)" strokeWidth="1" fill="none" strokeLinecap="round" />
              </svg>
            </span>
          ))}

      </div>

      {/* top bar */}
      <div className="absolute inset-x-0 top-0 z-40 flex items-center justify-between gap-3 p-4 md:p-6">
        <button
          onClick={onClose}
          className="inline-flex items-center gap-2 rounded-full bg-card/85 px-4 py-2.5 text-sm font-semibold text-foreground shadow-md backdrop-blur-sm transition-all duration-300 hover:bg-card hover:shadow-lg active:scale-95"
        >
          <ArrowLeft className="size-4" /> Back to Journal
        </button>

        <div className="flex items-center gap-2.5 rounded-full bg-card/85 px-4 py-2.5 text-sm font-semibold text-foreground shadow-md backdrop-blur-sm">
          <Sparkles className="size-4 text-terracotta" />
          <span className="hidden sm:inline">{weather.label}</span>
          <span className="text-muted-foreground">· {garden.length} grown</span>
        </div>
      </div>

      {/* title */}
      <div className="pointer-events-none absolute left-1/2 top-16 z-30 -translate-x-1/2 text-center md:top-20">
        <h1 className="font-display text-3xl font-semibold text-foreground drop-shadow-[0_2px_6px_oklch(0.98_0.01_90/_60%)] md:text-4xl">
          Your Little Garden
        </h1>
      </div>

      {/* vintage radio */}
      <button
        onClick={toggleSound}
        aria-pressed={soundOn}
        aria-label={soundOn ? "Turn off ambient sounds" : "Turn on ambient sounds"}
        className="absolute bottom-5 right-5 z-40 flex items-center gap-2.5 rounded-2xl bg-[oklch(0.4_0.06_45)] px-4 py-3 text-primary-foreground shadow-[0_10px_24px_-8px_oklch(0.3_0.05_40/_55%)] transition-all duration-300 hover:scale-105 active:scale-95"
      >
        <Radio className={`size-5 ${soundOn ? "text-[oklch(0.85_0.12_85)]" : "opacity-80"}`} />
        <span className="flex h-4 items-end gap-0.5">
          {[0, 1, 2, 3].map((b) => (
            <span
              key={b}
              className={`w-1 rounded-full bg-[oklch(0.85_0.12_85)] transition-all duration-300 ${
                soundOn ? "animate-pulse-soft" : ""
              }`}
              style={{ height: soundOn ? `${6 + ((b * 5) % 12)}px` : "3px", animationDelay: `${b * 0.15}s` }}
            />
          ))}
        </span>
        <span className="text-xs font-semibold tracking-wide">{soundOn ? "Raining" : "Rain"}</span>
      </button>

      {/* gratitude love letter overlay — unfolded handwritten parchment */}
      {showPicnic && (
        <div
          className="absolute inset-0 z-50 grid place-items-center bg-[oklch(0.3_0.04_60/_45%)] p-4 backdrop-blur-sm"
          onClick={() => setShowPicnic(false)}
        >
          <div
            className="relative max-h-[82vh] w-full max-w-lg animate-scale-in overflow-hidden rounded-[1.6rem] p-7 shadow-[0_30px_70px_-25px_oklch(0.3_0.05_45/_65%)] md:p-9"
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "oklch(0.96 0.03 88)",
              backgroundImage:
                "radial-gradient(circle at 18% 12%, oklch(0.92 0.05 80 / 60%) 0%, transparent 45%), radial-gradient(circle at 85% 90%, oklch(0.9 0.05 70 / 55%) 0%, transparent 50%), repeating-linear-gradient(0deg, oklch(0.66 0.04 55 / 7%) 0 1px, transparent 1px 30px)",
              border: "1px solid oklch(0.78 0.05 65 / 60%)",
            }}
          >
            {/* torn-paper top edge accents */}
            <span className="pointer-events-none absolute inset-x-0 top-0 h-2 bg-[repeating-linear-gradient(90deg,oklch(0.88_0.05_75)_0_10px,transparent_10px_20px)] opacity-40" />
            <button
              onClick={() => setShowPicnic(false)}
              aria-label="Close love letter"
              className="absolute right-4 top-4 grid size-9 place-items-center rounded-full bg-[oklch(0.88_0.05_70/_70%)] text-muted-foreground transition-all duration-300 hover:bg-[oklch(0.85_0.05_65)] active:scale-90"
            >
              <X className="size-4" />
            </button>

            <div className="mb-5 text-center">
              <p className="font-display text-xs uppercase tracking-[0.35em] text-clay">My dearest you,</p>
              <h2 className="mt-2 font-display text-3xl font-semibold italic text-foreground">
                A Letter of Gratitude
              </h2>
              <div className="mx-auto mt-3 h-px w-24 bg-[oklch(0.7_0.06_55/_50%)]" />
            </div>

            <div className="-mr-2 max-h-[52vh] space-y-4 overflow-y-auto pr-2">
              {gratitude.length === 0 ? (
                <p className="py-10 text-center font-display text-sm italic text-muted-foreground">
                  The page is still blank — write some gratitude back in the journal,
                  and your words will be tucked here like pressed flowers.
                </p>
              ) : (
                gratitude.map((e, i) => (
                  <div
                    key={e.id}
                    className="border-b border-dashed border-[oklch(0.72_0.05_55/_40%)] pb-4 last:border-0"
                  >
                    <p className="font-display text-base italic leading-relaxed text-foreground/90">
                      <span className="mr-1 text-clay">{i % 2 === 0 ? "♡" : "✿"}</span>
                      {e.text}
                    </p>
                    <p className="mt-1.5 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                      {formatRelativeTime(e.at)}
                    </p>
                  </div>
                ))
              )}
            </div>

            <p className="mt-6 text-right font-display text-lg italic text-clay">
              with love, always ♡
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
