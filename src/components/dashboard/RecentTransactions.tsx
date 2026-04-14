import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const transactions = [
  { id: 1, label: "Abonnement salle - Ahmed K.", amount: 5000, type: "income" as const, date: "14 Avr 2026" },
  { id: 2, label: "Facture électricité", amount: -12500, type: "expense" as const, date: "13 Avr 2026" },
  { id: 3, label: "Location Appt B3 - Mars", amount: 35000, type: "income" as const, date: "13 Avr 2026" },
  { id: 4, label: "Réservation Salle Fête - Mariage", amount: 80000, type: "income" as const, date: "12 Avr 2026" },
  { id: 5, label: "Produits nettoyage", amount: -3200, type: "expense" as const, date: "12 Avr 2026" },
  { id: 6, label: "Hammam - 15 entrées", amount: 7500, type: "income" as const, date: "11 Avr 2026" },
];

export function RecentTransactions() {
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className="border-b border-border px-5 py-4">
        <h3 className="text-sm font-semibold text-card-foreground">
          Transactions récentes
        </h3>
      </div>
      <div className="divide-y divide-border">
        {transactions.map((t) => (
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
