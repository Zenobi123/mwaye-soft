import { cn } from "@/lib/utils";

const facilities = [
  { name: "Salle Musculation", status: "active", occupancy: 75 },
  { name: "Salle Cardio", status: "active", occupancy: 45 },
  { name: "Hammam Hommes", status: "active", occupancy: 60 },
  { name: "Hammam Femmes", status: "maintenance", occupancy: 0 },
  { name: "Salle Diamant", status: "réservée", occupancy: 100 },
  { name: "Salle Émeraude", status: "disponible", occupancy: 0 },
  { name: "Salle Saphir", status: "disponible", occupancy: 0 },
];

const statusStyles: Record<string, string> = {
  active: "bg-success/10 text-success",
  disponible: "bg-info/10 text-info",
  réservée: "bg-warning/10 text-warning",
  maintenance: "bg-destructive/10 text-destructive",
};

export function FacilityStatus() {
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className="border-b border-border px-5 py-4">
        <h3 className="text-sm font-semibold text-card-foreground">
          État des installations
        </h3>
      </div>
      <div className="divide-y divide-border">
        {facilities.map((f) => (
          <div key={f.name} className="flex items-center justify-between px-5 py-3">
            <span className="text-sm text-card-foreground">{f.name}</span>
            <div className="flex items-center gap-3">
              {f.status === "active" && (
                <div className="flex items-center gap-1.5">
                  <div className="h-1.5 w-16 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-success transition-all"
                      style={{ width: `${f.occupancy}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground tabular-nums w-8 text-right">
                    {f.occupancy}%
                  </span>
                </div>
              )}
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                  statusStyles[f.status] ?? "bg-muted text-muted-foreground"
                )}
              >
                {f.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
