import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { ArrowDownCircle, Plus, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/recettes")({
  component: RecettesPage,
  head: () => ({
    meta: [
      { title: "Recettes — GestiComplex" },
      { name: "description", content: "Suivi des recettes du complexe" },
    ],
  }),
});

const recettes = [
  { id: 1, label: "Abonnement salle - Ahmed K.", category: "Sport", amount: 5000, date: "14/04/2026", method: "Espèces" },
  { id: 2, label: "Location Appt B3 - Mars", category: "Appartement", amount: 35000, date: "13/04/2026", method: "Virement" },
  { id: 3, label: "Réservation Salle Diamant - Mariage", category: "Événement", amount: 80000, date: "12/04/2026", method: "Chèque" },
  { id: 4, label: "Hammam - 15 entrées", category: "Hammam", amount: 7500, date: "11/04/2026", method: "Espèces" },
  { id: 5, label: "Abonnement salle - Karim M.", category: "Sport", amount: 5000, date: "11/04/2026", method: "Espèces" },
  { id: 6, label: "Location Appt A1 - Avril", category: "Appartement", amount: 42000, date: "10/04/2026", method: "Virement" },
  { id: 7, label: "Séminaire entreprise", category: "Événement", amount: 45000, date: "09/04/2026", method: "Virement" },
  { id: 8, label: "Abonnement salle - Sara L.", category: "Sport", amount: 4000, date: "09/04/2026", method: "Espèces" },
];

const categoryColors: Record<string, string> = {
  Sport: "bg-primary/10 text-primary",
  Appartement: "bg-info/10 text-info",
  Événement: "bg-warning/10 text-warning",
  Hammam: "bg-accent/10 text-accent",
};

function RecettesPage() {
  const total = recettes.reduce((sum, r) => sum + r.amount, 0);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Recettes</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Total : {total.toLocaleString("fr-FR")} DA
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-1" /> Filtrer
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" /> Nouvelle recette
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
                <th className="px-5 py-3 text-left font-medium text-muted-foreground">Paiement</th>
                <th className="px-5 py-3 text-right font-medium text-muted-foreground">Montant</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recettes.map((r) => (
                <tr key={r.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-card-foreground">{r.label}</td>
                  <td className="px-5 py-3.5">
                    <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-semibold", categoryColors[r.category])}>
                      {r.category}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-muted-foreground">{r.date}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{r.method}</td>
                  <td className="px-5 py-3.5 text-right font-semibold text-success tabular-nums">
                    +{r.amount.toLocaleString("fr-FR")} DA
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
