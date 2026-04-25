import { cn } from "@/lib/utils";
import { STATUS_COLORS } from "@/config/app";
import type { FacilityStatusItem } from "@/hooks/useDashboardData";

interface FacilityStatusProps {
  facilities: FacilityStatusItem[];
}

export function FacilityStatus({ facilities }: FacilityStatusProps) {
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className="border-b border-border px-5 py-4">
        <h3 className="text-sm font-semibold text-card-foreground">
          État des installations
        </h3>
      </div>
      <div className="divide-y divide-border">
        {facilities.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            Aucune installation enregistrée
          </div>
        ) : (
          facilities.map((f) => (
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
                    STATUS_COLORS[f.status] ?? "bg-muted text-muted-foreground"
                  )}
                >
                  {f.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
