import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { Plus, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useDepenses } from "@/hooks/useDepenses";
import { STATUS_COLORS, formatAmount } from "@/config/app";

export const Route = createFileRoute("/depenses")({
  component: DepensesPage,
  head: () => ({
    meta: [
      { title: "Dépenses — MWAYE HOUSE" },
      { name: "description", content: "Suivi des dépenses du complexe" },
    ],
  }),
});

function DepensesPage() {
  const { depenses, total } = useDepenses();

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dépenses</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Total : {formatAmount(total)}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-1" /> Filtrer
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" /> Nouvelle dépense
            </Button>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-5 py-3 text-left font-medium text-muted-foreground">Description</th>
                <th className="px-5 py-3 text-left font-medium text-muted-foreground">Catégorie</th>
                <th className="px-5 py-3 text-left font-medium text-muted-foreground">Date</th>
                <th className="px-5 py-3 text-left font-medium text-muted-foreground">Statut</th>
                <th className="px-5 py-3 text-right font-medium text-muted-foreground">Montant</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {depenses.map((d) => (
                <tr key={d.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-card-foreground">{d.label}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{d.category}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{d.date}</td>
                  <td className="px-5 py-3.5">
                    <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-semibold", STATUS_COLORS[d.status])}>
                      {d.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right font-semibold text-destructive tabular-nums">
                    -{formatAmount(d.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
