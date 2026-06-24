import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Radio, X, Sparkles, BookHeart } from "lucide-react";
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
  const { garden, mood, gratitude } = useGarden();
  const weather = WEATHER[mood];
  const [showPicnic, setShowPicnic] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const soundRef = useRef<AmbientSound | null>(null);

  useEffect(() => {
    soundRef.current = new AmbientSound();
    return () => {
      soundRef.current?.stop();
    };
  }, []);

  const toggleSound = () => {
    const kind = weather.particle === "rain" ? "rain" : "chimes";
    const now = soundRef.current?.toggle(kind) ?? false;
    setSoundOn(now);
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
    <div className="fixed inset-0 z-50 overflow-hidden">
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

      {/* pond */}
      <svg
        className="pointer-events-none absolute"
        style={{ left: "8%", top: "55%", width: "40%", height: "40%" }}
        viewBox="0 0 200 160"
        preserveAspectRatio="none"
      >
        <defs>
          <radialGradient id="water" cx="40%" cy="35%" r="80%">
            <stop offset="0%" stopColor="oklch(0.82 0.07 220)" />
            <stop offset="100%" stopColor="oklch(0.66 0.1 235)" />
          </radialGradient>
        </defs>
        <path
          d="M30,70 C20,30 90,20 130,38 C180,60 185,110 140,135 C95,160 40,140 28,110 C18,95 35,90 30,70 Z"
          fill="url(#water)"
          opacity="0.92"
        />
        <path
          d="M55,58 C70,52 95,54 110,62"
          fill="none"
          stroke="oklch(0.95 0.03 220 / 60%)"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>

      {/* winding river */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path
          d="M68,30 C60,45 78,55 70,68 C64,80 80,88 76,100"
          fill="none"
          stroke="oklch(0.74 0.08 225 / 75%)"
          strokeWidth="3.4"
          strokeLinecap="round"
        />
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

      {/* planted world */}
      {garden.map((p, i) => (
        <div
          key={p.uid}
          className="group absolute -translate-x-1/2 -translate-y-full cursor-default"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            zIndex: 10 + Math.round(p.y),
            animation: `plant-pop 0.9s cubic-bezier(0.22,1,0.36,1) ${Math.min(i * 0.05, 1)}s both`,
          }}
        >
          <div
            className="origin-bottom animate-sway"
            style={{ animationDelay: `${(i % 5) * 0.6}s` }}
          >
            {p.image ? (
              <img
                src={p.image}
                alt={p.name}
                className="size-16 object-contain drop-shadow-[0_6px_8px_oklch(0.4_0.05_60/_35%)] sm:size-20"
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
          <span className="absolute -bottom-1 left-1/2 h-2 w-8 -translate-x-1/2 rounded-[50%] bg-[oklch(0.3_0.03_60/_25%)] blur-[2px]" />
          {/* name on hover */}
          <span className="pointer-events-none absolute bottom-full left-1/2 mb-1 -translate-x-1/2 whitespace-nowrap rounded-full bg-card/95 px-2.5 py-1 text-[11px] font-semibold text-foreground opacity-0 shadow-md transition-opacity duration-300 group-hover:opacity-100">
            {p.name}
          </span>
        </div>
      ))}

      {/* picnic blanket */}
      <button
        onClick={() => setShowPicnic(true)}
        aria-label="Open the gratitude scrapbook on the picnic blanket"
        className="group absolute z-30 transition-transform duration-300 hover:scale-105 active:scale-95"
        style={{ left: "58%", top: "78%" }}
      >
        <div
          className="relative grid size-24 place-items-center rounded-[1.4rem] shadow-[0_10px_24px_-10px_oklch(0.4_0.06_40/_45%)] sm:size-28"
          style={{
            transform: "rotate(-8deg) skewX(-6deg)",
            backgroundImage:
              "repeating-linear-gradient(45deg, oklch(0.74 0.12 25) 0 14px, oklch(0.96 0.02 90) 14px 28px)",
          }}
        >
          <span className="grid size-11 place-items-center rounded-full bg-card/90 text-clay shadow-md">
            <BookHeart className="size-6" />
          </span>
        </div>
        <span className="pointer-events-none absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-card/90 px-2.5 py-1 text-[11px] font-semibold text-foreground opacity-0 shadow transition-opacity duration-300 group-hover:opacity-100">
          Gratitude picnic
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
        <span className="text-xs font-semibold tracking-wide">{soundOn ? "Playing" : "Sounds"}</span>
      </button>

      {/* picnic scrapbook overlay */}
      {showPicnic && (
        <div
          className="absolute inset-0 z-50 grid place-items-center bg-[oklch(0.3_0.04_60/_45%)] p-4 backdrop-blur-sm"
          onClick={() => setShowPicnic(false)}
        >
          <div
            className="paper-strong blob-2 relative max-h-[80vh] w-full max-w-lg animate-scale-in overflow-hidden p-6 md:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowPicnic(false)}
              aria-label="Close scrapbook"
              className="absolute right-4 top-4 grid size-9 place-items-center rounded-full bg-oatmeal/70 text-muted-foreground transition-all duration-300 hover:bg-oatmeal active:scale-90"
            >
              <X className="size-4" />
            </button>
            <div className="mb-5 flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-full bg-terracotta/15 text-terracotta">
                <BookHeart className="size-5" />
              </span>
              <div>
                <h2 className="font-display text-2xl font-semibold text-foreground">
                  Gratitude Picnic
                </h2>
                <p className="text-sm text-muted-foreground">Little joys, tucked into the grass</p>
              </div>
            </div>
            <div className="-mr-2 max-h-[52vh] space-y-3 overflow-y-auto pr-2">
              {gratitude.length === 0 ? (
                <p className="py-10 text-center text-sm text-muted-foreground">
                  No notes yet — add some gratitude back in the journal.
                </p>
              ) : (
                gratitude.map((e, i) => (
                  <div
                    key={e.id}
                    style={{ transform: `rotate(${i % 2 === 0 ? -0.8 : 0.8}deg)` }}
                    className="rounded-2xl bg-oatmeal/50 p-4 transition-transform duration-300 hover:!rotate-0"
                  >
                    <p className="font-display text-sm italic leading-relaxed text-foreground/90">
                      “{e.text}”
                    </p>
                    <p className="mt-2 text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                      {formatRelativeTime(e.at)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
