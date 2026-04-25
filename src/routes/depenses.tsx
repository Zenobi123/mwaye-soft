import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { Plus, Filter, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { STATUS_COLORS, formatAmount } from "@/config/app";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { DepenseForm } from "@/components/comptabilite/DepenseForm";
import { useDepensesData } from "@/hooks/useDepensesData";
import { BackButton } from "@/components/layout/BackButton";

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
  const queryClient = useQueryClient();
  const { depenses, total, isLoading } = useDepensesData();
  const [showForm, setShowForm] = useState(false);

  return (
    <AppLayout>
      <div className="space-y-6">
        <BackButton />
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
            <Button size="sm" onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-1" /> Nouvelle dépense
            </Button>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : depenses.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground text-sm">
              Aucune dépense enregistrée. Cliquez sur « Nouvelle dépense » pour commencer.
            </div>
          ) : (
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
                    <td className="px-5 py-3.5 font-medium text-card-foreground">{d.libelle}</td>
                    <td className="px-5 py-3.5 text-muted-foreground">{d.categorie}</td>
                    <td className="px-5 py-3.5 text-muted-foreground">
                      {new Date(d.date_depense).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-semibold", STATUS_COLORS[d.statut] || "bg-muted text-muted-foreground")}>
                        {d.statut}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right font-semibold text-destructive tabular-nums">
                      -{formatAmount(Number(d.montant))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showForm && (
        <DepenseForm
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            queryClient.invalidateQueries({ queryKey: ["depenses"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard"] });
          }}
        />
      )}
    </AppLayout>
  );
}
