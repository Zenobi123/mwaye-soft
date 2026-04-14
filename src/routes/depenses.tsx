import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { Plus, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/depenses")({
  component: DepensesPage,
  head: () => ({
    meta: [
      { title: "Dépenses — GestiComplex" },
      { name: "description", content: "Suivi des dépenses du complexe" },
    ],
  }),
});

const depenses = [
  { id: 1, label: "Facture électricité", category: "Charges", amount: 12500, date: "13/04/2026", status: "payé" },
  { id: 2, label: "Produits nettoyage", category: "Entretien", amount: 3200, date: "12/04/2026", status: "payé" },
  { id: 3, label: "Salaires employés - Mars", category: "Personnel", amount: 180000, date: "05/04/2026", status: "payé" },
  { id: 4, label: "Réparation climatisation", category: "Maintenance", amount: 15000, date: "03/04/2026", status: "payé" },
  { id: 5, label: "Facture eau", category: "Charges", amount: 8500, date: "01/04/2026", status: "payé" },
  { id: 6, label: "Équipement sport", category: "Investissement", amount: 45000, date: "28/03/2026", status: "en attente" },
  { id: 7, label: "Publicité réseaux sociaux", category: "Marketing", amount: 5000, date: "25/03/2026", status: "payé" },
];

const statusStyles: Record<string, string> = {
  payé: "bg-success/10 text-success",
  "en attente": "bg-warning/10 text-warning",
};

function DepensesPage() {
  const total = depenses.reduce((sum, d) => sum + d.amount, 0);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dépenses</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Total : {total.toLocaleString("fr-FR")} DA
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
                    <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-semibold", statusStyles[d.status])}>
                      {d.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right font-semibold text-destructive tabular-nums">
                    -{d.amount.toLocaleString("fr-FR")} DA
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
