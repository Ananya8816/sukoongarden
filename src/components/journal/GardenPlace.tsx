import { useEffect, useState } from "react";
import { Sparkles, BadgeCheck, Flower } from "lucide-react";
import { formatRelativeTime, type GrownPlant } from "@/lib/plants";

interface GardenPlaceProps {
  plants: GrownPlant[];
}

export function GardenPlace({ plants }: GardenPlaceProps) {
  // re-render relative times periodically
  const [, setNow] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setNow((n) => n + 1), 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="glass rounded-[2rem] p-7 md:p-9">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-2xl bg-gradient-to-br from-sage/80 to-accent/80 text-accent-foreground">
            <Flower className="size-5" />
          </span>
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Garden Place</h2>
            <p className="text-xs text-muted-foreground">Your cultivated sanctuary</p>
          </div>
        </div>
        <span className="rounded-full border border-border/60 bg-secondary/40 px-3 py-1 text-xs text-muted-foreground">
          {plants.length} grown
        </span>
      </div>

      {plants.length === 0 ? (
        <div className="grid place-items-center rounded-2xl border border-dashed border-border/60 py-16 text-center">
          <Sparkles className="mb-3 size-7 text-muted-foreground/60" />
          <p className="text-sm text-muted-foreground">
            Complete a focus session to grow your first plant.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {plants.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.uid}
                className="group animate-grow-in rounded-2xl border border-border/60 bg-secondary/30 p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:bg-secondary/50 hover:shadow-xl hover:shadow-primary/10"
              >
                <div
                  className={`mx-auto grid size-16 place-items-center rounded-2xl bg-gradient-to-br ${p.accent} text-white shadow-lg transition-transform duration-300 group-hover:scale-110`}
                >
                  <Icon className="size-8" />
                </div>
                <h3 className="mt-4 text-sm font-semibold tracking-tight">{p.name}</h3>
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                  {p.tierLabel}
                </p>
                <span className="mt-3 inline-flex items-center gap-1 rounded-full border border-sage/40 bg-sage/10 px-2.5 py-1 text-[10px] font-medium text-sage">
                  <BadgeCheck className="size-3" /> Successfully Cultivated
                </span>
                <p className="mt-2 text-[11px] text-muted-foreground">
                  {formatRelativeTime(p.completedAt)}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
