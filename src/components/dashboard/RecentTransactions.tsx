import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatAmount } from "@/config/app";

interface Transaction {
  id: string;
  libelle: string;
  montant: number;
  categorie: string;
}

interface RecetteItem extends Transaction {
  date_recette: string;
}

interface DepenseItem extends Transaction {
  date_depense: string;
}

interface RecentTransactionsProps {
  recettes: RecetteItem[];
  depenses: DepenseItem[];
}

export function RecentTransactions({ recettes, depenses }: RecentTransactionsProps) {
  // Merge and sort by date descending
  const merged = [
    ...recettes.map((r) => ({ id: r.id, label: r.libelle, amount: Number(r.montant), type: "income" as const, date: r.date_recette })),
    ...depenses.map((d) => ({ id: d.id, label: d.libelle, amount: Number(d.montant), type: "expense" as const, date: d.date_depense })),
  ].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8);

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className="border-b border-border px-5 py-4">
        <h3 className="text-sm font-semibold text-card-foreground">
          Transactions récentes
        </h3>
      </div>
      <div className="divide-y divide-border">
        {merged.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">Aucune transaction</div>
        ) : (
          merged.map((t) => (
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
                  <p className="text-xs text-muted-foreground">
                    {new Date(t.date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                  </p>
                </div>
              </div>
              <span
                className={cn(
                  "text-sm font-semibold tabular-nums",
                  t.type === "income" ? "text-success" : "text-destructive"
                )}
              >
                {t.type === "income" ? "+" : "-"}{formatAmount(t.amount)}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
