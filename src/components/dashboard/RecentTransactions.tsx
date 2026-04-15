import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { recentTransactions } from "@/services/dashboardService";

export function RecentTransactions() {
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className="border-b border-border px-5 py-4">
        <h3 className="text-sm font-semibold text-card-foreground">
          Transactions récentes
        </h3>
      </div>
      <div className="divide-y divide-border">
        {recentTransactions.map((t) => (
          <div key={t.id} className="flex items-center justify-between px-5 py-3.5">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full",
                  t.type === "income"
                    ? "bg-success/10 text-success"
                    : "bg-destructive/10 text-destructive"
                )}
              >
                {t.type === "income" ? (
                  <ArrowDownCircle className="h-4 w-4" />
                ) : (
                  <ArrowUpCircle className="h-4 w-4" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-card-foreground">{t.label}</p>
                <p className="text-xs text-muted-foreground">{t.date}</p>
              </div>
            </div>
            <span
              className={cn(
                "text-sm font-semibold tabular-nums",
                t.type === "income" ? "text-success" : "text-destructive"
              )}
            >
              {t.type === "income" ? "+" : ""}
              {t.amount.toLocaleString("fr-FR")} DA
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
